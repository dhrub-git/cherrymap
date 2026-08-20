import { blossomColor } from "@/lib/blossom-groups";
import { locationTypeValues } from "@/lib/location-types";
import type { Geometry } from "geojson";
import type {
  AccessStatus,
  Location,
  LocationConfidence,
  LocationFilters,
  LocationProvenance,
  LocationType,
} from "@/types/location";

const knownGroups = new Set(Object.keys(blossomColor));
const accessStatuses = new Set<AccessStatus>(["Public access", "Ticketed venue"]);
const confidenceValues = new Set<LocationConfidence>(["Official", "Verified", "Probable", "Unknown"]);

export async function loadLocations(): Promise<Location[]> {
  const response = await fetch("/data/locations.geojson");
  if (!response.ok) throw new Error("The map data could not be loaded.");
  const value = await response.json();
  const locations = parseLocations(value);
  if (isRecord(value) && Array.isArray(value.features) && locations.length !== value.features.length) {
    throw new Error("The reviewed map data is invalid.");
  }
  return locations;
}

export function parseLocations(value: unknown): Location[] {
  if (!isRecord(value) || !Array.isArray(value.features)) return [];
  const locations = value.features.flatMap((feature) => {
    if (!isRecord(feature) || !isRecord(feature.properties) || !isRecord(feature.geometry)) return [];
    const { properties, geometry } = feature;
    const coordinates = representativeCoordinates(geometry);
    if (!coordinates) return [];
    if (typeof properties.id !== "string" || typeof properties.name !== "string" || typeof properties.suburb !== "string" || typeof properties.group !== "string" || !knownGroups.has(properties.group)) return [];
    if (!locationTypeValues.has(properties.locationType as LocationType) || !accessStatuses.has(properties.access as AccessStatus)) return [];
    if (!confidenceValues.has(properties.locationConfidence as LocationConfidence)) return [];
    if (typeof properties.lastChecked !== "string" || typeof properties.source !== "string" || typeof properties.evidenceSummary !== "string") return [];
    const provenance = parseProvenance(properties.provenance);
    if (!provenance) return [];
    return [{
      id: properties.id,
      name: properties.name,
      suburb: properties.suburb,
      councilArea: stringValue(properties.councilArea) ?? provenance.provider,
      group: properties.group as Location["group"],
      locationType: properties.locationType as LocationType,
      access: properties.access as AccessStatus,
      lastChecked: properties.lastChecked,
      source: properties.source,
      scientificName: stringValue(properties.scientificName),
      commonName: stringValue(properties.commonName),
      locationConfidence: properties.locationConfidence as LocationConfidence,
      taxonConfidence: stringValue(properties.taxonConfidence),
      evidenceSummary: properties.evidenceSummary,
      visitorNotes: stringValue(properties.visitorNotes),
      photoUrl: httpsUrl(properties.photoUrl),
      photoCredit: stringValue(properties.photoCredit),
      provenance,
      geometry: geometry as unknown as Geometry,
      coordinates,
    }];
  });
  return locations.length === value.features.length ? locations : [];
}

export function formatReviewedDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-AU", { ...options, timeZone: "Australia/Sydney" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function httpsUrl(value: unknown) {
  const text = stringValue(value);
  if (!text) return undefined;
  try { return new URL(text).protocol === "https:" ? text : undefined; } catch { return undefined; }
}

function parseProvenance(value: unknown): LocationProvenance | null {
  if (!isRecord(value) || typeof value.provider !== "string" || typeof value.sourceUrl !== "string") return null;
  return {
    provider: value.provider,
    sourceUrl: value.sourceUrl,
    dataset: stringValue(value.dataset),
    sourceRecordId: stringValue(value.sourceRecordId),
    licence: stringValue(value.licence),
    importedAt: stringValue(value.importedAt),
    reviewedAt: stringValue(value.reviewedAt),
  };
}

function coordinatePair(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const [longitude, latitude] = value;
  return typeof longitude === "number" && Number.isFinite(longitude) && typeof latitude === "number" && Number.isFinite(latitude)
    ? [longitude, latitude]
    : null;
}

export function representativeCoordinates(geometry: Record<string, unknown>): [number, number] | null {
  if (geometry.type === "Point") return coordinatePair(geometry.coordinates);
  if (geometry.type === "LineString" && Array.isArray(geometry.coordinates)) {
    return coordinatePair(geometry.coordinates[Math.floor(geometry.coordinates.length / 2)]);
  }
  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
    const ring = geometry.coordinates[0].map(coordinatePair).filter((pair): pair is [number, number] => Boolean(pair));
    if (!ring.length) return null;
    return ring.reduce<[number, number]>((sum, pair) => [sum[0] + pair[0] / ring.length, sum[1] + pair[1] / ring.length], [0, 0]);
  }
  return null;
}

export function filterLocations(locations: Location[], filters: LocationFilters) {
  const normalized = filters.query.trim().toLowerCase();
  return locations.filter((location) => {
    const searchable = [
      location.name,
      location.suburb,
      location.councilArea,
      location.group,
      location.scientificName,
      location.commonName,
      location.source,
      location.provenance.sourceRecordId,
    ].filter((value): value is string => Boolean(value));
    return (!normalized || searchable.some((value) => value.toLowerCase().includes(normalized)))
      && (filters.group === "All blossoms" || location.group === filters.group)
      && (filters.locationType === "All types" || location.locationType === filters.locationType)
      && (filters.access === "All access" || location.access === filters.access)
      && (filters.photo === "All photos" || Boolean(location.photoUrl))
      && (filters.year === "All years" || location.lastChecked.startsWith(filters.year));
  });
}
