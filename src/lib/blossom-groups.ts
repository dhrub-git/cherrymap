import { BLOSSOM_GROUP_LABELS } from "@/lib/reviewed-location-contract.mjs";

export type BlossomGroup = (typeof BLOSSOM_GROUP_LABELS)[number];

const blossomColors: Record<BlossomGroup, string> = {
  "Flowering cherry": "#d95680",
  "Flowering plum": "#db914f",
  "Flowering peach": "#e9a56e",
  "Mixed ornamental Prunus": "#6d568b",
  "Unknown flowering Prunus": "#71816d",
};

export const blossomGroups = BLOSSOM_GROUP_LABELS.map((label) => ({ label, color: blossomColors[label] }));

export const blossomColor = blossomColors;
