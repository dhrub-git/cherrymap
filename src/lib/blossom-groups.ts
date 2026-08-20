export const blossomGroups = [
  { label: "Flowering cherry", color: "#d95680" },
  { label: "Flowering plum", color: "#db914f" },
  { label: "Flowering peach", color: "#e9a56e" },
  { label: "Mixed ornamental Prunus", color: "#6d568b" },
  { label: "Unknown flowering Prunus", color: "#71816d" },
] as const;

export type BlossomGroup = (typeof blossomGroups)[number]["label"];

export const blossomColor = Object.fromEntries(blossomGroups.map((group) => [group.label, group.color])) as Record<BlossomGroup, string>;
