import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { representativeCoordinates } from "./publish-reviewed-data.mjs";

const collection = JSON.parse(fs.readFileSync("data/locations.geojson", "utf8"));
const features = collection.features as Array<{ geometry: { type: string; coordinates: unknown }; properties: Record<string, unknown> }>;

describe("reviewed public dataset", () => {
  it("contains unique, source-attributed public locations", () => {
    expect(features.length).toBeGreaterThan(0);
    const ids = features.map((feature) => feature.properties.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const feature of features) {
      expect(feature.properties).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        suburb: expect.any(String),
        group: expect.any(String),
        locationType: expect.stringMatching(/^(tree|row|cluster|venue)$/),
        access: expect.stringMatching(/^(Public access|Ticketed venue)$/),
        lastChecked: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        evidenceSummary: expect.any(String),
        provenance: {
          provider: expect.any(String),
          sourceUrl: expect.stringMatching(/^https:\/\//),
          licence: expect.any(String),
          reviewedAt: expect.any(String),
        },
      });
      expect(JSON.stringify(feature.properties).toLowerCase()).not.toContain("private residential");
    }
  });

  it("keeps valid public geometry inside the Greater Sydney launch bounds", () => {
    for (const feature of features) {
      expect(["Point", "LineString", "Polygon"]).toContain(feature.geometry.type);
      if (feature.geometry.type === "LineString") {
        expect(Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length >= 2).toBe(true);
      }
      if (feature.geometry.type === "Polygon") {
        expect(Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length > 0).toBe(true);
        for (const ring of feature.geometry.coordinates as unknown[][]) {
          expect(ring.length).toBeGreaterThanOrEqual(4);
          expect(ring[0]).toEqual(ring.at(-1));
        }
      }
      const position = representativeCoordinates(feature.geometry);
      expect(position).not.toBeNull();
      const positions = feature.geometry.type === "Point"
        ? [feature.geometry.coordinates]
        : feature.geometry.type === "LineString"
          ? feature.geometry.coordinates as unknown[]
          : (feature.geometry.coordinates as unknown[][]).flat();
      for (const coordinates of positions) {
        expect(Array.isArray(coordinates)).toBe(true);
        const [longitude, latitude] = coordinates as number[];
        expect(longitude).toBeGreaterThanOrEqual(150.4);
        expect(longitude).toBeLessThanOrEqual(151.5);
        expect(latitude).toBeGreaterThanOrEqual(-34.25);
        expect(latitude).toBeLessThanOrEqual(-33.35);
      }
    }
  });
});
