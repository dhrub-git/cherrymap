import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocationDetails } from "./LocationDetails";
import type { Location } from "@/types/location";

const location: Location = {
  id: "city:tree-1",
  name: "Park blossom tree",
  suburb: "Sydney",
  councilArea: "City of Sydney",
  group: "Flowering cherry",
  locationType: "tree",
  access: "Public access",
  lastChecked: "2026-08-20",
  source: "Council inventory",
  scientificName: "Prunus serrulata",
  locationConfidence: "Official",
  evidenceSummary: "Official public tree record.",
  provenance: {
    provider: "City of Sydney",
    sourceUrl: "https://example.test",
    sourceRecordId: "tree-1",
    licence: "CC BY 4.0",
    importedAt: "2026-08-20T00:00:00.000Z",
    reviewedAt: "2026-08-20T01:00:00.000Z",
  },
  geometry: { type: "Point", coordinates: [151, -33] },
  coordinates: [151, -33],
};

describe("LocationDetails", () => {
  it("moves focus into the sheet, closes with Escape, and restores focus", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const onClose = vi.fn();

    const { unmount } = render(<LocationDetails location={location} onClose={onClose} />);

    expect(screen.getByRole("dialog", { name: location.name })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close location details" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });
});
