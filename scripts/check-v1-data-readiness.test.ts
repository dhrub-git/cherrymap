import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { assessV1DataReadiness, V1_MINIMUM_REVIEWED_LOCATIONS } from "./check-v1-data-readiness.mjs";
import { csvForCollection } from "./publish-reviewed-data.mjs";

function collection(count: number) {
  return {
    type: "FeatureCollection",
    features: Array.from({ length: count }, (_, index) => ({
      type: "Feature",
      properties: {
        id: `location:${index}`,
        name: "Reviewed public blossom location",
        suburb: "Sydney",
        group: "Flowering cherry",
        locationType: "tree",
        access: "Public access",
        locationConfidence: "Official",
        lastChecked: "2026-08-21",
        source: "Official source",
        evidenceSummary: "Official public record.",
        provenance: {
          provider: "City of Sydney",
          sourceUrl: "https://example.test",
          sourceRecordId: `record:${index}`,
          licence: "CC BY 4.0",
          importedAt: "2026-08-21T00:00:00.000Z",
          reviewedAt: "2026-08-21T00:00:00.000Z",
        },
      },
      geometry: { type: "Point", coordinates: [151, -33.8] },
    })),
  };
}

describe("V1 data readiness", () => {
  it("requires 100 unique reviewed locations with matching public exports", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    const csv = csvForCollection(data);

    expect(assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csv)).toEqual({ ready: true, locationCount: 100, reasons: [] });
  });

  it("reports the current dataset's outstanding content threshold", () => {
    const data = JSON.parse(fs.readFileSync("data/locations.geojson", "utf8"));
    const publicGeojson = fs.readFileSync("public/data/locations.geojson", "utf8");
    const csv = fs.readFileSync("public/data/locations.csv", "utf8");
    const result = assessV1DataReadiness(data, publicGeojson, csv);

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(data.features.length);
    expect(result.locationCount).toBeLessThan(V1_MINIMUM_REVIEWED_LOCATIONS);
    expect(result.reasons).toContain(`Requires at least ${V1_MINIMUM_REVIEWED_LOCATIONS} reviewed public locations; found ${data.features.length}.`);
  });

  it("detects mismatched or duplicate public records", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[99].properties.id = data.features[0].properties.id;
    const result = assessV1DataReadiness(data, "{}\n", "id\n");

    expect(result.ready).toBe(false);
    expect(result.reasons).toContain("Every published location must have a unique stable ID.");
    expect(result.reasons).toContain("Public GeoJSON does not match the canonical reviewed dataset.");
    expect(result.reasons).toContain("Public CSV does not match the canonical reviewed dataset.");
  });

  it("does not count duplicate stable IDs toward the launch threshold", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[99].properties.id = data.features[0].properties.id;
    const result = assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csvForCollection(data));

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(98);
    expect(result.reasons).toContain(`Requires at least ${V1_MINIMUM_REVIEWED_LOCATIONS} reviewed public locations; found 98.`);
  });

  it("does not count malformed, unsafe, or out-of-bounds records toward the threshold", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[0].properties.provenance = {};
    data.features[1].geometry.coordinates = [149, -33.8];
    const result = assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csvForCollection(data));

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(98);
    expect(result.reasons).toContain("2 locations fail reviewed-public validation.");
    expect(result.reasons).toContain(`Requires at least ${V1_MINIMUM_REVIEWED_LOCATIONS} reviewed public locations; found 98.`);
  });

  it("does not count records with impossible last-checked dates", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[0].properties.lastChecked = "2026-99-99";
    const result = assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csvForCollection(data));

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(99);
    expect(result.reasons).toContain("1 locations fail reviewed-public validation.");
  });

  it("requires individual trees to use point geometry", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[0].geometry = { type: "LineString", coordinates: [[151, -33.8], [151.01, -33.81]] };
    const result = assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csvForCollection(data));

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(99);
    expect(result.reasons).toContain("1 locations fail reviewed-public validation.");
  });

  it("requires credit and an explicit licence or permission for every displayed photo", () => {
    const data = collection(V1_MINIMUM_REVIEWED_LOCATIONS);
    data.features[0].properties.photoUrl = "https://example.test/blossoms.jpg";
    delete data.features[0].properties.provenance.licence;
    data.features[0].properties.provenance.reuseBasis = "Manually curated factual venue record";
    const result = assessV1DataReadiness(data, `${JSON.stringify(data, null, 2)}\n`, csvForCollection(data));

    expect(result.ready).toBe(false);
    expect(result.locationCount).toBe(99);
    expect(result.reasons).toContain("1 locations fail reviewed-public validation.");
  });
});
