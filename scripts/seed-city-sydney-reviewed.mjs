import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const PLACEHOLDER_COMMON_NAMES = new Set(["unknown", "not applicable"]);
const FLOWERING_PLUM_TAXA = /\b(cerasifera|domestica|salicina|blireana)\b/i;

function defaultOutputPath() {
  return fileURLToPath(new URL("../data/locations.geojson", import.meta.url));
}

function normalizeCommonName(value) {
  if (typeof value !== "string") return value ?? null;
  return PLACEHOLDER_COMMON_NAMES.has(value.trim().toLowerCase()) ? null : value;
}

function requireFeatures(collection, label) {
  if (!Array.isArray(collection?.features)) {
    throw new Error(`${label}: expected a FeatureCollection with a features array.`);
  }
  return collection.features;
}

function isIsoTimestamp(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = new Date(value);
  return !Number.isNaN(timestamp.valueOf()) && timestamp.toISOString() === value;
}

export function validateCandidates(candidates) {
  const features = requireFeatures(candidates, "Candidate input");
  const candidateIds = new Set();

  features.forEach((feature, index) => {
    const candidate = feature?.properties;
    if (typeof candidate?.candidateId !== "string" || !candidate.candidateId.trim()) {
      throw new Error(`Candidate ${index + 1} has an invalid candidateId.`);
    }
    const candidateId = candidate.candidateId.trim();
    if (candidateIds.has(candidateId)) {
      throw new Error(`Candidate ${index + 1} has a duplicate candidateId.`);
    }
    candidateIds.add(candidateId);
    if (!isIsoTimestamp(candidate.source?.importedAt)) {
      throw new Error(`${candidate.candidateId} has an invalid source.importedAt.`);
    }
  });

  return features;
}

export function toReviewedLocation(feature, reviewedAt) {
  const candidate = feature.properties;
  const taxonomy = candidate.rawTaxonomy ?? {};
  const scientificName = taxonomy.scientificName ?? null;
  const commonName = normalizeCommonName(taxonomy.commonName);
  const group = FLOWERING_PLUM_TAXA.test(scientificName ?? "")
    ? "Flowering plum"
    : "Mixed ornamental Prunus";

  return {
    type: "Feature",
    geometry: feature.geometry,
    properties: {
      id: candidate.candidateId.trim(),
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
}

export function mergeReviewedLocations(existingFeatures, seededFeatures) {
  const seededIds = new Set(seededFeatures.map((feature) => feature.properties.id));
  return [
    ...existingFeatures.filter((feature) => !seededIds.has(feature.properties?.id)),
    ...seededFeatures,
  ];
}

export function runSeed(
  candidatePath,
  outputPath = defaultOutputPath(),
  reviewedAt = new Date().toISOString(),
) {
  if (!candidatePath) {
    throw new Error(
      "Usage: node scripts/seed-city-sydney-reviewed.mjs <candidate-geojson> [output-geojson] [reviewed-at]",
    );
  }

  const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
  const candidateFeatures = validateCandidates(candidates);
  const existing = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  const existingFeatures = requireFeatures(existing, outputPath);
  if (!isIsoTimestamp(reviewedAt)) {
    throw new Error("reviewedAt must be an ISO timestamp.");
  }

  const seededFeatures = candidateFeatures.map((feature) =>
    toReviewedLocation(feature, reviewedAt),
  );
  const features = mergeReviewedLocations(existingFeatures, seededFeatures);
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify({ type: "FeatureCollection", features }, null, 2)}\n`,
  );
  console.log(`Upserted ${seededFeatures.length} reviewed locations.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSeed(process.argv[2], process.argv[3], process.argv[4]);
}
