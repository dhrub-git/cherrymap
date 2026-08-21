import { LOCATION_TYPE_VALUES } from "@/lib/reviewed-location-contract.mjs";

export type LocationType = (typeof LOCATION_TYPE_VALUES)[number];

const locationTypePresentation: Record<LocationType, { label: string; symbol: string; markerStyle: Record<string, string> }> = {
  tree: { label: "Tree", symbol: "●", markerStyle: { borderRadius: "52% 48% 55% 45%" } },
  row: { label: "Row", symbol: "◆", markerStyle: { borderRadius: "999px 35% 999px 35%" } },
  cluster: { label: "Cluster", symbol: "▲", markerStyle: { clipPath: "polygon(50% 2%, 98% 88%, 12% 100%)" } },
  venue: { label: "Venue", symbol: "■", markerStyle: { borderRadius: ".45rem" } },
};

export const locationTypes = LOCATION_TYPE_VALUES.map((value) => ({ value, ...locationTypePresentation[value] }));

export const locationTypeValues = new Set<LocationType>(LOCATION_TYPE_VALUES);
export const locationTypeByValue = Object.fromEntries(locationTypes.map((type) => [type.value, type])) as Record<LocationType, (typeof locationTypes)[number]>;
