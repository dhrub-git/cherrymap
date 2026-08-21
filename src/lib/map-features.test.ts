import { describe, expect, it } from "vitest";
import { footprintFeatures, markerFeatures } from "./map-features";
import type { Location } from "@/types/location";

const base: Omit<Location, "id" | "geometry" | "coordinates"> = {
  name: "Public blossom place",
  suburb: "Sydney",
  councilArea: "City of Sydney",
  group: "Flowering cherry",
  locationType: "row",
  access: "Public access",
  lastChecked: "2026-08-21",
  source: "Official source",
  locationConfidence: "Official",
  evidenceSummary: "Official public record.",
  provenance: {
    provider: "City of Sydney",
    sourceUrl: "https://example.test",
    sourceRecordId: "record",
    licence: "CC BY 4.0",
    importedAt: "2026-08-21T00:00:00.000Z",
    reviewedAt: "2026-08-21T00:00:00.000Z",
  },
};

describe("map feature collections", () => {
  it("keeps one representative marker for every supported geometry", () => {
    const locations: Location[] = [
      { ...base, id: "point", geometry: { type: "Point", coordinates: [151, -33] }, coordinates: [151, -33] },
      { ...base, id: "line", geometry: { type: "LineString", coordinates: [[151, -33], [151.01, -33.01]] }, coordinates: [151.01, -33.01] },
      { ...base, id: "polygon", geometry: { type: "Polygon", coordinates: [[[151, -33], [151.01, -33], [151, -33.01], [151, -33]]] }, coordinates: [151, -33] },
    ];

    expect(markerFeatures(locations).features.map((feature) => feature.geometry.type)).toEqual(["Point", "Point", "Point"]);
    expect(markerFeatures(locations).features.map((feature) => feature.properties.id)).toEqual(["point", "line", "polygon"]);
  });

  it("preserves line and polygon footprints and excludes points", () => {
    const locations: Location[] = [
      { ...base, id: "point", geometry: { type: "Point", coordinates: [151, -33] }, coordinates: [151, -33] },
      { ...base, id: "line", geometry: { type: "LineString", coordinates: [[151, -33], [151.01, -33.01]] }, coordinates: [151.01, -33.01] },
      { ...base, id: "polygon", geometry: { type: "Polygon", coordinates: [[[151, -33], [151.01, -33], [151, -33.01], [151, -33]]] }, coordinates: [151, -33] },
    ];

    expect(footprintFeatures(locations).features.map((feature) => feature.geometry.type)).toEqual(["LineString", "Polygon"]);
    expect(footprintFeatures(locations).features.map((feature) => feature.properties.id)).toEqual(["line", "polygon"]);
  });
});
