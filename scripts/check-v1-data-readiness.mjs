import { readFile } from "node:fs/promises";
import { csvForCollection } from "./publish-reviewed-data.mjs";
import { assessReviewedCollection } from "./reviewed-location-validation.mjs";

export const V1_MINIMUM_REVIEWED_LOCATIONS = 100;

export function assessV1DataReadiness(collection, publicGeojson, csv, minimumLocations = V1_MINIMUM_REVIEWED_LOCATIONS) {
  const { locationCount: reviewedLocations, reasons: collectionReasons } = assessReviewedCollection(collection);
  const reasons = [...collectionReasons];

  if (reviewedLocations < minimumLocations) reasons.push(`Requires at least ${minimumLocations} reviewed public locations; found ${reviewedLocations}.`);
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
