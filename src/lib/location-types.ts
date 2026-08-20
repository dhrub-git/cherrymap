export const locationTypes = [
  { value: "tree", label: "Tree", symbol: "●", markerStyle: { borderRadius: "52% 48% 55% 45%" } },
  { value: "row", label: "Row", symbol: "◆", markerStyle: { borderRadius: "999px 35% 999px 35%" } },
  { value: "cluster", label: "Cluster", symbol: "▲", markerStyle: { clipPath: "polygon(50% 2%, 98% 88%, 12% 100%)" } },
  { value: "venue", label: "Venue", symbol: "■", markerStyle: { borderRadius: ".45rem" } },
] as const;

export type LocationType = (typeof locationTypes)[number]["value"];

export const locationTypeValues = new Set<LocationType>(locationTypes.map((type) => type.value));
export const locationTypeByValue = Object.fromEntries(locationTypes.map((type) => [type.value, type])) as Record<LocationType, (typeof locationTypes)[number]>;
