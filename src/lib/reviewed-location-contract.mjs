export const BLOSSOM_GROUP_LABELS = [
  "Flowering cherry",
  "Flowering plum",
  "Flowering peach",
  "Mixed ornamental Prunus",
  "Unknown flowering Prunus",
];
export const LOCATION_TYPE_VALUES = ["tree", "row", "cluster", "venue"];
export const ACCESS_STATUS_VALUES = ["Public access", "Ticketed venue"];
export const CONFIDENCE_VALUES = ["Official", "Verified", "Probable", "Unknown"];

export function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isIsoTimestamp(value) {
  if (!nonEmptyString(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}

export function isHttpsUrl(value) {
  if (!nonEmptyString(value)) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
