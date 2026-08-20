import { blossomGroups } from "@/lib/blossom-groups";
import { locationTypeValues, type LocationType } from "@/lib/location-types";
import type { LocationFilters } from "@/types/location";

export type ExplorerState = LocationFilters & {
  view: "map" | "list";
  selectedId: string | null;
  info: "methodology" | "privacy" | "attribution" | "safety" | "corrections" | null;
};

export const defaultExplorerState: ExplorerState = {
  query: "",
  group: "All blossoms",
  locationType: "All types",
  access: "All access",
  photo: "All photos",
  year: "All years",
  view: "map",
  selectedId: null,
  info: null,
};

const groups = new Set(blossomGroups.map((group) => group.label));
const accessValues = new Set(["Public access", "Ticketed venue"]);
const infoValues = new Set(["methodology", "privacy", "attribution", "safety", "corrections"]);

export function readExplorerState(search: string): ExplorerState {
  const params = new URLSearchParams(search);
  const group = params.get("group");
  const locationType = params.get("type");
  const access = params.get("access");
  const photo = params.get("photo");
  const year = params.get("year");
  const view = params.get("view");
  const info = params.get("info");

  return {
    query: params.get("q") ?? "",
    group: group && groups.has(group as never) ? group as ExplorerState["group"] : "All blossoms",
    locationType: locationType && locationTypeValues.has(locationType as LocationType) ? locationType as ExplorerState["locationType"] : "All types",
    access: access && accessValues.has(access) ? access as ExplorerState["access"] : "All access",
    photo: photo === "yes" ? "Has photo" : "All photos",
    year: year && /^\d{4}$/.test(year) ? year : "All years",
    view: view === "list" ? "list" : "map",
    selectedId: params.get("location"),
    info: info && infoValues.has(info) ? info as ExplorerState["info"] : null,
  };
}

export function buildExplorerSearch(state: ExplorerState) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.group !== "All blossoms") params.set("group", state.group);
  if (state.locationType !== "All types") params.set("type", state.locationType);
  if (state.access !== "All access") params.set("access", state.access);
  if (state.photo === "Has photo") params.set("photo", "yes");
  if (state.year !== "All years") params.set("year", state.year);
  if (state.view === "list") params.set("view", "list");
  if (state.selectedId) params.set("location", state.selectedId);
  if (state.info) params.set("info", state.info);
  const query = params.toString();
  return query ? `?${query}` : "";
}
