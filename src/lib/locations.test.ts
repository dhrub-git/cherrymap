import { describe, expect, it } from "vitest";
import { filterLocations, formatReviewedDate, parseLocations } from "./locations";
import type { Location } from "@/types/location";

const locations: Location[] = [{ id: "1", name: "Riverside row", suburb: "Parramatta", group: "Flowering cherry", access: "Public access", lastChecked: "2026-08-20", source: "test", coordinates: [151, -33] }];
describe("filterLocations", () => { it("matches a suburb without hiding it behind a group filter", () => { expect(filterLocations(locations, "parra", "All blossoms")).toEqual(locations); }); it("limits results to a selected group", () => { expect(filterLocations(locations, "", "Flowering plum")).toEqual([]); }); });

describe("parseLocations", () => { it("drops malformed features before they reach filters", () => { expect(parseLocations({ features: [{ geometry: { type: "Point", coordinates: [151, -33] }, properties: { id: "bad" } }] })).toEqual([]); }); it("formats reviewed dates in Sydney time", () => { expect(formatReviewedDate("2026-08-20", { day: "numeric", month: "short" })).toBe("20 Aug"); }); });
