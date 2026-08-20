import { describe, expect, it } from "vitest";
import { filterLocations, formatReviewedDate, parseLocations } from "./locations";
import type { Location } from "@/types/location";

const locations: Location[] = [{
  id: "1",
  name: "Riverside row",
  suburb: "Parramatta",
  councilArea: "City of Parramatta",
  group: "Flowering cherry",
  locationType: "row",
  access: "Public access",
  lastChecked: "2026-08-20",
  source: "Council inventory",
  scientificName: "Prunus serrulata",
  locationConfidence: "Official",
  evidenceSummary: "Official public tree record.",
  provenance: { provider: "City of Parramatta", sourceUrl: "https://example.test" },
  geometry: { type: "Point", coordinates: [151, -33] },
  coordinates: [151, -33],
}];

describe("filterLocations", () => {
  const allFilters = {
    query: "",
    group: "All blossoms",
    locationType: "All types",
    access: "All access",
    photo: "All photos",
    year: "All years",
  } as const;

  it("searches council, suburb, and scientific names", () => {
    expect(filterLocations(locations, { ...allFilters, query: "parramatta" })).toEqual(locations);
    expect(filterLocations(locations, { ...allFilters, query: "serrulata" })).toEqual(locations);
  });

  it("applies all structured filters", () => {
    expect(filterLocations(locations, { ...allFilters, locationType: "tree" })).toEqual([]);
    expect(filterLocations(locations, { ...allFilters, year: "2026" })).toEqual(locations);
    expect(filterLocations(locations, { ...allFilters, photo: "Has photo" })).toEqual([]);
  });
});

describe("parseLocations", () => {
  it("retains public detail and source provenance", () => {
    const [location] = parseLocations({ features: [{
      geometry: { type: "Point", coordinates: [151, -33] },
      properties: {
        id: "city:1",
        name: "Park tree",
        suburb: "Sydney",
        group: "Flowering plum",
        locationType: "tree",
        access: "Public access",
        lastChecked: "2026-08-20",
        source: "Council inventory",
        locationConfidence: "Official",
        evidenceSummary: "Official record.",
        provenance: { provider: "City of Sydney", sourceUrl: "https://example.test", licence: "CC BY 4.0" },
      },
    }] });

    expect(location).toMatchObject({
      councilArea: "City of Sydney",
      locationType: "tree",
      locationConfidence: "Official",
      evidenceSummary: "Official record.",
      provenance: { sourceUrl: "https://example.test", licence: "CC BY 4.0" },
    });
  });

  it("drops malformed features before they reach filters", () => {
    expect(parseLocations({ features: [{ geometry: { type: "Point", coordinates: [151, -33] }, properties: { id: "bad" } }] })).toEqual([]);
  });

  it("rejects the whole dataset when a supported geometry is malformed", () => {
    const properties = {
      id: "city:1", name: "Park tree", suburb: "Sydney", group: "Flowering plum", locationType: "tree",
      access: "Public access", lastChecked: "2026-08-20", source: "Council inventory",
      locationConfidence: "Official", evidenceSummary: "Official record.",
      provenance: { provider: "City of Sydney", sourceUrl: "https://example.test" },
    };
    const valid = { geometry: { type: "Point", coordinates: [151, -33] }, properties };
    for (const geometry of [
      { type: "LineString", coordinates: [[151, -33]] },
      { type: "Polygon", coordinates: [[[151, -33], [151.1, -33], [151.1, -33.1], [151, -33.1]]] },
    ]) {
      expect(parseLocations({ features: [valid, { geometry, properties: { ...properties, id: "bad-geometry" } }] })).toEqual([]);
    }
  });

  it("formats reviewed dates in Sydney time", () => {
    expect(formatReviewedDate("2026-08-20", { day: "numeric", month: "short" })).toBe("20 Aug");
  });

});
