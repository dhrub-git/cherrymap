import { mkdir, readFile, writeFile } from "node:fs/promises";
import { representativeCoordinates } from "../src/lib/public-geometry.mjs";
import { assessReviewedCollection } from "./reviewed-location-validation.mjs";

const columns = [
  "id", "name", "suburb", "streetAddress", "councilArea", "locationType", "group",
  "scientificName", "commonName", "locationConfidence", "taxonConfidence",
  "access", "visitorNotes", "visitorInfoUrl", "evidenceSummary", "lastChecked", "source",
  "sourceUrl", "licence", "reuseBasis", "photoUrl", "photoCredit", "longitude", "latitude",
];

export function escapeCsv(value) {
  const text = String(value ?? "");
  const safeText = typeof value === "string" && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export { representativeCoordinates } from "../src/lib/public-geometry.mjs";

export function toCsvRow(feature) {
  const properties = feature.properties ?? {};
  const provenance = properties.provenance ?? {};
  const [longitude = "", latitude = ""] = representativeCoordinates(feature.geometry) ?? [];
  const values = {
    ...properties,
    councilArea: properties.councilArea ?? provenance.provider ?? "",
    sourceUrl: provenance.sourceUrl ?? "",
    licence: provenance.licence ?? "",
    reuseBasis: provenance.reuseBasis ?? "",
    longitude,
    latitude,
  };
  return columns.map((column) => escapeCsv(values[column])).join(",");
}

export function csvForCollection(collection) {
  const rows = Array.isArray(collection?.features) ? collection.features.map(toCsvRow) : [];
  return `${columns.join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

export function assertPublishableReviewedData(collection) {
  const { reasons } = assessReviewedCollection(collection);
  if (reasons.length) throw new Error(`Cannot publish reviewed dataset:\n${reasons.map((reason) => `- ${reason}`).join("\n")}`);
}

export async function publishReviewedData() {
  await mkdir("public/data", { recursive: true });
  const collection = JSON.parse(await readFile("data/locations.geojson", "utf8"));
  assertPublishableReviewedData(collection);
  await writeFile("public/data/locations.geojson", `${JSON.stringify(collection, null, 2)}\n`);
  await writeFile("public/data/locations.csv", csvForCollection(collection));
}

if (import.meta.url === `file://${process.argv[1]}`) publishReviewedData();
