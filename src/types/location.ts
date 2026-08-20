export type BlossomGroup = "Flowering cherry" | "Flowering plum" | "Mixed ornamental Prunus" | "Unknown flowering Prunus";

export type Location = {
  id: string;
  name: string;
  suburb: string;
  group: BlossomGroup;
  access: "Public access" | "Ticketed venue";
  lastChecked: string;
  source: string;
  coordinates: [number, number];
};
