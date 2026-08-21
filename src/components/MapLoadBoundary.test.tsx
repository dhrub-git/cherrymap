import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapLoadBoundary } from "./MapLoadBoundary";

function BrokenMap(): ReactElement {
  throw new Error("Map chunk unavailable");
}

afterEach(() => vi.restoreAllMocks());

describe("MapLoadBoundary", () => {
  it("keeps sibling list controls usable when the map cannot render", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<><MapLoadBoundary><BrokenMap /></MapLoadBoundary><button>Reviewed location list</button></>);

    expect(screen.getByRole("region", { name: "Interactive blossom location map" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("The map is temporarily unavailable. Use List view to browse every reviewed location.");
    expect(screen.getByRole("button", { name: "Reviewed location list" })).toBeEnabled();
  });
});
