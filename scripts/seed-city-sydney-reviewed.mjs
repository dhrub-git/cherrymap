import fs from "node:fs";

const candidatePath = process.argv[2];

if (!candidatePath) {
  throw new Error("Usage: node scripts/seed-city-sydney-reviewed.mjs <candidate-geojson>");
}

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const reviewedAt = "2026-08-21T00:00:00.000Z";

const features = candidates.features.map((feature) => {
  const candidate = feature.properties;
  const taxonomy = candidate.rawTaxonomy ?? {};
  const scientificName = taxonomy.scientificName ?? null;
  const commonName = taxonomy.commonName ?? null;
  const botanicalTerms = [scientificName, commonName].filter(Boolean).join(" ");
  const group = /cerasifera|plum/i.test(botanicalTerms)
    ? "Flowering plum"
    : "Mixed ornamental Prunus";

  return {
    type: "Feature",
    geometry: feature.geometry,
    properties: {
      id: candidate.candidateId,
      name: scientificName
        ? `${scientificName} — City of Sydney`
        : "Ornamental Prunus — City of Sydney",
      suburb: "City of Sydney",
      group,
      access: "Public access",
      lastChecked: candidate.source.importedAt.slice(0, 10),
      source: "Tree data: City of Sydney, CC BY 4.0",
      locationType: "tree",
      scientificName,
      commonName,
      locationConfidence: "Official",
      taxonConfidence:
        scientificName && scientificName !== "Prunus sp."
          ? "Species confirmed"
          : "Genus confirmed",
      evidenceSummary:
        "Official City of Sydney public tree asset; curator-reviewed for public access and conservatively classified from the source taxonomy.",
      provenance: {
        provider: candidate.source.provider,
        dataset: candidate.source.dataset,
        sourceRecordId: candidate.source.sourceRecordId,
        serviceRowId: candidate.source.serviceRowId,
        sourceUrl: candidate.source.sourceUrl,
        licence: candidate.source.licence,
        importedAt: candidate.source.importedAt,
        reviewedAt,
      },
    },
  };
});

fs.writeFileSync(
  "data/locations.geojson",
  `${JSON.stringify({ type: "FeatureCollection", features }, null, 2)}\n`,
);

console.log(`Wrote ${features.length} reviewed locations.`);
