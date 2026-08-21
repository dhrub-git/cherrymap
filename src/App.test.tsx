import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Location } from "@/types/location";

const location = vi.hoisted(() => ({
  id: "parks:wistaria",
  name: "Wistaria Gardens Flowering Peaches",
  suburb: "Westmead",
  councilArea: "City of Parramatta",
  group: "Flowering peach",
  locationType: "venue",
  access: "Public access",
  lastChecked: "2026-08-21",
  source: "Official venue page",
  locationConfidence: "Official",
  evidenceSummary: "Official public garden record.",
  provenance: {
    provider: "Greater Sydney Parklands",
    sourceUrl: "https://example.test",
    sourceRecordId: "wistaria",
    reuseBasis: "Manually curated facts",
    importedAt: "2026-08-21T00:00:00.000Z",
    reviewedAt: "2026-08-21T01:00:00.000Z",
  },
  geometry: { type: "Point", coordinates: [151, -33] },
  coordinates: [151, -33],
} satisfies Location));

vi.mock("@/components/BlossomMap", () => ({ BlossomMap: () => <div aria-label="Map" /> }));
vi.mock("@/lib/locations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/locations")>();
  return { ...actual, loadLocations: vi.fn().mockResolvedValue([location]) };
});

import App from "./App";

beforeEach(() => window.history.replaceState(null, "", "/?view=list"));
afterEach(cleanup);

describe("App filters", () => {
  it("keeps results out of the filter overlay and restores them on request", async () => {
    render(<App />);
    expect(await screen.findAllByRole("button", { name: /Wistaria Gardens Flowering Peaches/ })).not.toHaveLength(0);

    const summary = screen.getByText("Filters", { exact: true }).closest("summary");
    expect(summary).not.toBeNull();
    fireEvent.click(summary!);

    await waitFor(() => expect(screen.queryAllByRole("button", { name: /Wistaria Gardens Flowering Peaches/ })).toHaveLength(0));
    fireEvent.click(screen.getByRole("button", { name: "Show 1 result" }));

    await waitFor(() => expect(screen.getAllByRole("button", { name: /Wistaria Gardens Flowering Peaches/ })).not.toHaveLength(0));
    await waitFor(() => expect(summary?.parentElement).not.toHaveAttribute("open"));
    await waitFor(() => expect(summary).toHaveFocus());
  });
});
