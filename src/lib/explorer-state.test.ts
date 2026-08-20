import { describe, expect, it } from "vitest";
import { buildExplorerSearch, defaultExplorerState, readExplorerState } from "./explorer-state";

describe("explorer URL state", () => {
  it("round-trips active search, filters, view, and selected location", () => {
    const state = {
      ...defaultExplorerState,
      query: "plum",
      group: "Flowering plum" as const,
      locationType: "tree" as const,
      access: "Public access" as const,
      photo: "Has photo" as const,
      year: "2026",
      view: "list" as const,
      selectedId: "city:7",
    };

    expect(readExplorerState(buildExplorerSearch(state))).toEqual(state);
  });

  it("ignores invalid URL values", () => {
    expect(readExplorerState("?group=Anything&type=forest&view=grid&year=soon")).toEqual(defaultExplorerState);
  });
});
