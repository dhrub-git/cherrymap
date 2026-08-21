import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { assessReviewedCollection } from "./reviewed-location-validation.mjs";

const collection = JSON.parse(fs.readFileSync("data/locations.geojson", "utf8"));
describe("reviewed public dataset", () => {
  it("contains unique reviewed locations that satisfy the public publication contract", () => {
    expect(assessReviewedCollection(collection).reasons).toEqual([]);
  });
});
