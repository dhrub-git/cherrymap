import { describe, expect, it } from "vitest";
import { escapeCsv } from "./publish-reviewed-data.mjs";

describe("escapeCsv", () => {
  it("prevents spreadsheet formula evaluation while retaining CSV escaping", () => {
    expect(escapeCsv("=SUM(A1:A2)")).toBe("\"'=SUM(A1:A2)\"");
    expect(escapeCsv('Rose "walk"')).toBe('"Rose ""walk"""');
  });
});
