import { describe, expect, it } from "vitest";
import { CITY_OF_SYDNEY_TREES_URL, fetchCitySydneyCandidates, toCandidate } from "./import-city-sydney.mjs";

const feature = { type: "Feature", geometry: { type: "Point", coordinates: [151.2, -33.8] }, properties: { OBJECTID: 7, asset_id: "asset-7", SpeciesName: "Prunus serrulata", CommonName: "Japanese cherry", TreeType: "Park Tree", Tree_Status: "Active" } };

describe("City of Sydney candidate import", () => {
  it("preserves source lineage and never marks a candidate as published", () => {
    const candidate = toCandidate(feature);
    expect(candidate?.properties).toMatchObject({ candidateId: "city-of-sydney:asset-7", reviewStatus: "candidate", suggestedGroup: "Mixed ornamental Prunus", source: { provider: "City of Sydney", sourceRecordId: "asset-7", serviceRowId: "7", licence: "CC BY 4.0" } });
  });

  it("uses an ordered, paginated Prunus query", async () => {
    const calls = [];
    const fullPage = Array.from({ length: 1_000 }, (_, index) => ({ ...feature, properties: { ...feature.properties, OBJECTID: index + 1, asset_id: `asset-${index + 1}` } }));
    const fetchStub = async (url) => { calls.push(url); if (url.includes("?f=json")) return new Response(JSON.stringify({ name: "Trees", fields: ["OBJECTID", "asset_id", "SpeciesName", "CommonName", "TreeType", "Tree_Status"].map((name) => ({ name })) }), { status: 200 }); if (url.includes("data.cityofsydney")) return new Response(JSON.stringify({ properties: { licenseInfo: "<a href='https://creativecommons.org/licenses/by/4.0/'>Creative Commons</a>" } }), { status: 200 }); const page = url.includes("resultOffset=1000") ? [feature] : fullPage; return new Response(JSON.stringify({ type: "FeatureCollection", features: page }), { status: 200 }); };
    await expect(fetchCitySydneyCandidates(fetchStub)).resolves.toHaveLength(1_001);
    const queryCalls = calls.filter((url) => url.includes(CITY_OF_SYDNEY_TREES_URL));
    expect(queryCalls[0]).toContain("resultOffset=0");
    expect(queryCalls[1]).toContain("resultOffset=1000");
    expect(queryCalls[0]).toContain("resultRecordCount=1000");
  });
});
