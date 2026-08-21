import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

afterEach(cleanup);

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

  it("leaves Escape to an open modal dialog", () => {
    const onClose = vi.fn();
    render(<LocationDetails location={location} onClose={onClose} />);
    const modal = document.createElement("dialog");
    modal.setAttribute("open", "");
    document.body.append(modal);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();

    modal.remove();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("restores focus to the result that opened the current location", () => {
    const firstOpener = document.createElement("button");
    const secondOpener = document.createElement("button");
    document.body.append(firstOpener, secondOpener);
    firstOpener.focus();
    const { rerender, unmount } = render(<LocationDetails location={location} onClose={vi.fn()} />);

    secondOpener.focus();
    rerender(<LocationDetails location={{ ...location, id: "city:tree-2", name: "Second park tree" }} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Close location details" })).toHaveFocus();

    unmount();
    expect(secondOpener).toHaveFocus();
    firstOpener.remove();
    secondOpener.remove();
  });
});
