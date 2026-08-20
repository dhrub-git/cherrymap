import { describe, expect, it } from "vitest";
import {
  mergeReviewedLocations,
  toReviewedLocation,
  validateCandidates,
} from "./seed-city-sydney-reviewed.mjs";

const candidate = (overrides = {}) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [151.2, -33.8] },
  properties: {
    candidateId: "city-of-sydney:asset-7",
    rawTaxonomy: { scientificName: "Prunus sp.", commonName: "Plum" },
    source: {
      provider: "City of Sydney",
      dataset: "Trees",
      sourceRecordId: "asset-7",
      serviceRowId: "7",
      sourceUrl: "https://example.test/trees",
      licence: "CC BY 4.0",
      importedAt: "2026-08-20T21:18:33.633Z",
    },
    ...overrides,
  },
});

describe("City of Sydney reviewed seed", () => {
  it("classifies from the scientific name and removes source placeholders", () => {
    const genusOnly = toReviewedLocation(candidate(), "2026-08-21T01:00:00.000Z");
    const confirmedPlum = toReviewedLocation(
      candidate({
        rawTaxonomy: {
          scientificName: "Prunus cerasifera",
          commonName: "Not Applicable",
        },
      }),
      "2026-08-21T01:00:00.000Z",
    );

    expect(genusOnly.properties).toMatchObject({
      group: "Mixed ornamental Prunus",
      commonName: "Plum",
    });
    expect(confirmedPlum.properties).toMatchObject({
      group: "Flowering plum",
      commonName: null,
    });
  });

  it("upserts seeded locations without removing unrelated reviewed data", () => {
    const unrelated = { type: "Feature", properties: { id: "other:1" } };
    const stale = {
      type: "Feature",
      properties: { id: "city-of-sydney:asset-7", name: "stale" },
    };
    const seeded = toReviewedLocation(candidate(), "2026-08-21T01:00:00.000Z");

    expect(mergeReviewedLocations([unrelated, stale], [seeded])).toEqual([
      unrelated,
      seeded,
    ]);
  });

  it("rejects malformed candidates with the record index", () => {
    expect(() => validateCandidates({ features: [candidate(), { type: "Feature" }] })).toThrow(
      "Candidate 2 has an invalid candidateId",
    );
    expect(() =>
      validateCandidates({
        features: [candidate({ candidateId: "city-of-sydney:bad", source: { importedAt: "yesterday" } })],
      }),
    ).toThrow(
      "city-of-sydney:bad has an invalid source.importedAt",
    );
    expect(() => validateCandidates({ features: [candidate(), candidate()] })).toThrow(
      "Candidate 2 has a duplicate candidateId",
    );
  });
});
