import { describe, expect, it } from "vitest";
import { CITY_OF_SYDNEY_TREES_URL, fetchCitySydneyCandidates, toCandidate } from "./import-city-sydney.mjs";

const feature = { type: "Feature", geometry: { type: "Point", coordinates: [151.2, -33.8] }, properties: { OBJECTID: 7, asset_id: "asset-7", SpeciesName: "Prunus serrulata", CommonName: "Japanese cherry", TreeType: "Park Tree", Tree_Status: "Active" } };

describe("City of Sydney candidate import", () => {
  it("preserves source lineage and never marks a candidate as published", () => {
    const candidate = toCandidate(feature);
    expect(candidate?.properties).toMatchObject({ candidateId: "city-of-sydney:asset-7", reviewStatus: "candidate", suggestedGroup: "Mixed ornamental Prunus", source: { provider: "City of Sydney", licence: "CC BY 4.0" } });
  });

  it("uses an ordered, paginated Prunus query", async () => {
    const calls = [];
    const fetchStub = async (url) => { calls.push(url); return new Response(JSON.stringify({ type: "FeatureCollection", features: [feature] }), { status: 200 }); };
    await expect(fetchCitySydneyCandidates(fetchStub)).resolves.toHaveLength(1);
    expect(calls[0]).toContain(CITY_OF_SYDNEY_TREES_URL);
    expect(calls[0]).toContain("resultOffset=0");
    expect(calls[0]).toContain("orderByFields=OBJECTID");
  });
});
