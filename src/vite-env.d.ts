/// <reference types="vite/client" />

declare module "@/lib/public-geometry.mjs" {
  export function representativeCoordinates(geometry: Record<string, unknown> | undefined): [number, number] | null;
}

declare module "@/lib/reviewed-location-contract.mjs" {
  export const BLOSSOM_GROUP_LABELS: readonly ["Flowering cherry", "Flowering plum", "Flowering peach", "Mixed ornamental Prunus", "Unknown flowering Prunus"];
  export const LOCATION_TYPE_VALUES: readonly ["tree", "row", "cluster", "venue"];
  export const ACCESS_STATUS_VALUES: readonly ["Public access", "Ticketed venue"];
  export const CONFIDENCE_VALUES: readonly ["Official", "Verified", "Probable", "Unknown"];
  export function nonEmptyString(value: unknown): value is string;
  export function isIsoTimestamp(value: unknown): boolean;
  export function isHttpsUrl(value: unknown): boolean;
}
