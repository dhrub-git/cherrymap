import { describe, expect, it } from "vitest";
import { representativeCoordinates as mapRepresentativeCoordinates } from "../src/lib/locations";
import { escapeCsv, representativeCoordinates, toCsvRow } from "./publish-reviewed-data.mjs";

describe("escapeCsv", () => {
  it("prevents spreadsheet formula evaluation while retaining CSV escaping", () => {
    expect(escapeCsv("=SUM(A1:A2)")).toBe("\"'=SUM(A1:A2)\"");
    expect(escapeCsv('Rose "walk"')).toBe('"Rose ""walk"""');
  });

  it("includes public detail and nested source provenance in each row", () => {
    const row = toCsvRow({
      geometry: { type: "Point", coordinates: [151.2, -33.8] },
      properties: {
        id: "city:1",
        name: "Park tree",
        councilArea: "City of Sydney",
        locationType: "tree",
        locationConfidence: "Official",
        evidenceSummary: "Official record",
        provenance: { sourceUrl: "https://example.test", licence: "CC BY 4.0" },
      },
    });

    expect(row).toContain('"tree"');
    expect(row).toContain('"Official record"');
    expect(row).toContain('"https://example.test"');
  });

  it("exports a public representative position for rows", () => {
    const row = toCsvRow({ geometry: { type: "LineString", coordinates: [[151.1, -33.9], [151.2, -33.8], [151.3, -33.7]] }, properties: { id: "row:1" } });
    expect(row).toContain('"151.2","-33.8"');
  });

  it("keeps map and CSV representative positions in parity", () => {
    const geometries = [
      { type: "Point", coordinates: [151.1, -33.9] },
      { type: "LineString", coordinates: [[151.1, -33.9], [151.2, -33.8], [151.3, -33.7]] },
      { type: "Polygon", coordinates: [[[151.1, -33.9], [151.3, -33.9], [151.3, -33.7], [151.1, -33.7], [151.1, -33.9]]] },
    ];
    for (const geometry of geometries) {
      expect(representativeCoordinates(geometry)).toEqual(mapRepresentativeCoordinates(geometry as Record<string, unknown>));
    }
  });

  it("rejects incomplete lines and open polygon rings in both consumers", () => {
    const malformed = [
      { type: "LineString", coordinates: [[151.1, -33.9]] },
      { type: "Polygon", coordinates: [[[151.1, -33.9], [151.3, -33.9], [151.3, -33.7], [151.1, -33.7]]] },
    ];
    for (const geometry of malformed) {
      expect(representativeCoordinates(geometry)).toBeNull();
      expect(mapRepresentativeCoordinates(geometry as Record<string, unknown>)).toBeNull();
    }
  });
});
