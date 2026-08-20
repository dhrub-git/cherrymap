import type { BlossomGroup } from "@/lib/blossom-groups";

export type { BlossomGroup } from "@/lib/blossom-groups";

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
