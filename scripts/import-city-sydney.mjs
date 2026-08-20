import { mkdir, writeFile } from "node:fs/promises";

export const CITY_OF_SYDNEY_TREES_URL = "https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer/0/query";
const CITY_OF_SYDNEY_LAYER_URL = "https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer/0";
const PAGE_SIZE = 1_000;
const SOURCE_URL = "https://data.cityofsydney.nsw.gov.au/api/search/v1/collections/dataset/items/15c4713a688a48fcb604fc343118af05_0";
const REQUIRED_FIELDS = ["OBJECTID", "asset_id", "SpeciesName", "CommonName", "TreeType", "Tree_Status"];

export function toCandidate(feature) {
  const properties = feature.properties ?? {};
  const assetId = properties.asset_id;
  const objectId = properties.OBJECTID;
  if (!assetId || !objectId || feature.geometry?.type !== "Point" || !Array.isArray(feature.geometry.coordinates)) return null;
  return {
    type: "Feature",
    geometry: feature.geometry,
    properties: {
      candidateId: `city-of-sydney:${assetId}`,
      reviewStatus: "candidate",
      source: {
        provider: "City of Sydney",
        dataset: "Trees",
        sourceRecordId: String(assetId),
        serviceRowId: String(objectId),
        sourceUrl: SOURCE_URL,
        licence: "CC BY 4.0",
        importedAt: new Date().toISOString(),
      },
      rawTaxonomy: { scientificName: properties.SpeciesName ?? null, commonName: properties.CommonName ?? null },
      suggestedGroup: "Mixed ornamental Prunus",
      rawAccessContext: properties.TreeType ?? null,
      rawStatus: properties.Tree_Status ?? null,
      notes: "Candidate only. Curator review is required before publication.",
    },
  };
}

export async function fetchCitySydneyCandidates(fetchImpl = fetch) {
  await verifySourceMetadata(fetchImpl);
  const candidates = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const params = new URLSearchParams({
      where: "SpeciesName LIKE 'Prunus%'",
      outFields: "OBJECTID,asset_id,SpeciesName,CommonName,TreeType,Tree_Status",
      returnGeometry: "true",
      f: "geojson",
      resultOffset: String(offset),
      resultRecordCount: String(PAGE_SIZE),
      orderByFields: "OBJECTID",
      outSR: "4326",
    });
    const response = await fetchImpl(`${CITY_OF_SYDNEY_TREES_URL}?${params}`);
    if (!response.ok) throw new Error(`City of Sydney import failed: ${response.status} ${response.statusText}`);
    const page = await response.json();
    if (!Array.isArray(page.features)) throw new Error("City of Sydney import returned an invalid GeoJSON response.");
    candidates.push(...page.features.map(toCandidate).filter(Boolean));
    if (page.features.length < PAGE_SIZE) break;
  }
  return candidates;
}

export async function verifySourceMetadata(fetchImpl = fetch) {
  const [layerResponse, sourceResponse] = await Promise.all([
    fetchImpl(`${CITY_OF_SYDNEY_LAYER_URL}?f=json`),
    fetchImpl(SOURCE_URL),
  ]);
  if (!layerResponse.ok || !sourceResponse.ok) throw new Error("City of Sydney source metadata could not be verified.");
  const [layer, source] = await Promise.all([layerResponse.json(), sourceResponse.json()]);
  const fields = new Set(Array.isArray(layer.fields) ? layer.fields.map((field) => field.name) : []);
  if (layer.name !== "Trees" || REQUIRED_FIELDS.some((field) => !fields.has(field))) throw new Error("City of Sydney source schema changed; candidate import stopped.");
  const licenceInfo = source?.properties?.licenseInfo;
  if (typeof licenceInfo !== "string" || !licenceInfo.includes("https://creativecommons.org/licenses/by/4.0/")) throw new Error("City of Sydney source licence could not be verified; candidate import stopped.");
}

export async function runImport() {
  const candidates = await fetchCitySydneyCandidates();
  const runId = new Date().toISOString().replaceAll(":", "-").replace(".", "-");
  await mkdir("data/candidates", { recursive: true });
  await writeFile(`data/candidates/city-sydney-${runId}.geojson`, `${JSON.stringify({ type: "FeatureCollection", features: candidates }, null, 2)}\n`);
  await writeFile(`data/candidates/city-sydney-${runId}.report.json`, `${JSON.stringify({ provider: "City of Sydney", dataset: "Trees", importedAt: new Date().toISOString(), candidates: candidates.length, reviewRequired: true }, null, 2)}\n`);
  console.log(`Wrote ${candidates.length} City of Sydney candidates. No public data was changed.`);
}

if (import.meta.url === `file://${process.argv[1]}`) runImport().catch((error) => { console.error(error); process.exitCode = 1; });
