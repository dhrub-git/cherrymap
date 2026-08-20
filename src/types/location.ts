import type { BlossomGroup } from "@/lib/blossom-groups";
import type { LocationType } from "@/lib/location-types";
import type { Geometry } from "geojson";

export type { BlossomGroup } from "@/lib/blossom-groups";

export type { LocationType } from "@/lib/location-types";
export type AccessStatus = "Public access" | "Ticketed venue";
export type LocationConfidence = "Official" | "Verified" | "Probable" | "Unknown";

export type LocationProvenance = {
  provider: string;
  dataset?: string;
  sourceRecordId?: string;
  sourceUrl: string;
  licence?: string;
  importedAt?: string;
  reviewedAt?: string;
};

export type Location = {
  id: string;
  name: string;
  suburb: string;
  councilArea: string;
  group: BlossomGroup;
  locationType: LocationType;
  access: AccessStatus;
  lastChecked: string;
  source: string;
  scientificName?: string;
  commonName?: string;
  locationConfidence: LocationConfidence;
  taxonConfidence?: string;
  evidenceSummary: string;
  visitorNotes?: string;
  photoUrl?: string;
  photoCredit?: string;
  provenance: LocationProvenance;
  geometry: Geometry;
  coordinates: [number, number];
};

export type LocationFilters = {
  query: string;
  group: "All blossoms" | BlossomGroup;
  locationType: "All types" | LocationType;
  access: "All access" | AccessStatus;
  photo: "All photos" | "Has photo";
  year: "All years" | string;
};
