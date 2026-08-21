import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { validateReviewedLocation } from "./reviewed-location-validation.mjs";

const collection = JSON.parse(fs.readFileSync("data/locations.geojson", "utf8"));
const features = collection.features as Array<{ properties: Record<string, unknown> }>;

describe("reviewed public dataset", () => {
  it("contains unique reviewed locations that satisfy the public publication contract", () => {
    expect(collection.type).toBe("FeatureCollection");
    expect(features.length).toBeGreaterThan(0);

    const ids = features.map((feature) => feature.properties.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const feature of features) expect(validateReviewedLocation(feature)).toEqual([]);
  });
});
