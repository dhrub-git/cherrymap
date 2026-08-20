import { describe, expect, it } from "vitest";
import { blossomColor, blossomGroups } from "./blossom-groups";

describe("blossomGroups", () => {
  it("keeps every public filter group mapped to a marker colour", () => {
    expect(blossomGroups.every((group) => blossomColor[group.label])).toBe(true);
  });
});
