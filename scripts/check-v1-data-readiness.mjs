import { readFile } from "node:fs/promises";
import { csvForCollection } from "./publish-reviewed-data.mjs";
import { validateReviewedLocation } from "./reviewed-location-validation.mjs";

export const V1_MINIMUM_REVIEWED_LOCATIONS = 100;

function featureId(feature) {
  return typeof feature?.properties?.id === "string" && feature.properties.id.trim() ? feature.properties.id : null;
}

export function assessV1DataReadiness(collection, publicGeojson, csv, minimumLocations = V1_MINIMUM_REVIEWED_LOCATIONS) {
  const features = Array.isArray(collection?.features) ? collection.features : [];
  const ids = features.map(featureId).filter(Boolean);
  const invalidFeatureCount = features.filter((feature) => validateReviewedLocation(feature).length > 0).length;
  const reviewedLocations = features.length - invalidFeatureCount;
  const reasons = [];

  if (collection?.type !== "FeatureCollection") reasons.push("Canonical data is not a GeoJSON FeatureCollection.");
  if (invalidFeatureCount) reasons.push(`${invalidFeatureCount} locations fail reviewed-public validation.`);
  if (reviewedLocations < minimumLocations) reasons.push(`Requires at least ${minimumLocations} reviewed public locations; found ${reviewedLocations}.`);
  if (ids.length !== features.length || new Set(ids).size !== features.length) reasons.push("Every published location must have a unique stable ID.");
  if (publicGeojson !== JSON.stringify(collection, null, 2).concat("\n")) reasons.push("Public GeoJSON does not match the canonical reviewed dataset.");
  if (csv !== csvForCollection(collection)) reasons.push("Public CSV does not match the canonical reviewed dataset.");

  return { ready: reasons.length === 0, locationCount: reviewedLocations, reasons };
}

export async function checkV1DataReadiness() {
  const [canonicalText, publicGeojson, csv] = await Promise.all([
    readFile("data/locations.geojson", "utf8"),
    readFile("public/data/locations.geojson", "utf8"),
    readFile("public/data/locations.csv", "utf8"),
  ]);
  const result = assessV1DataReadiness(JSON.parse(canonicalText), publicGeojson, csv);
  if (result.ready) {
    console.log(`V1 data readiness passed: ${result.locationCount} reviewed public locations.`);
    return result;
  }
  console.error(`V1 data readiness failed: ${result.locationCount} reviewed public locations.`);
  for (const reason of result.reasons) console.error(`- ${reason}`);
  process.exitCode = 1;
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) await checkV1DataReadiness();
