import { blossomColor } from "@/lib/blossom-groups";
import type { Location } from "@/types/location";

const knownGroups = new Set(Object.keys(blossomColor));

export async function loadLocations(): Promise<Location[]> {
  const response = await fetch("/data/locations.geojson");
  if (!response.ok) throw new Error("The map data could not be loaded.");
  return parseLocations(await response.json());
}

export function parseLocations(value: unknown): Location[] {
  if (!isRecord(value) || !Array.isArray(value.features)) return [];
  return value.features.flatMap((feature) => {
    if (!isRecord(feature) || !isRecord(feature.properties) || !isRecord(feature.geometry) || feature.geometry.type !== "Point") return [];
    const { properties, geometry } = feature;
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2) return [];
    const [longitude, latitude] = geometry.coordinates;
    if (typeof longitude !== "number" || !Number.isFinite(longitude) || typeof latitude !== "number" || !Number.isFinite(latitude)) return [];
    if (typeof properties.id !== "string" || typeof properties.name !== "string" || typeof properties.suburb !== "string" || typeof properties.group !== "string" || !knownGroups.has(properties.group)) return [];
    if (properties.access !== "Public access" && properties.access !== "Ticketed venue") return [];
    if (typeof properties.lastChecked !== "string" || typeof properties.source !== "string") return [];
    return [{ id: properties.id, name: properties.name, suburb: properties.suburb, group: properties.group as Location["group"], access: properties.access, lastChecked: properties.lastChecked, source: properties.source, coordinates: [longitude, latitude] }];
  });
}

export function formatReviewedDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-AU", { ...options, timeZone: "Australia/Sydney" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function filterLocations(locations: Location[], query: string, group: "All blossoms" | Location["group"]) {
  const normalized = query.trim().toLowerCase();
  return locations.filter((location) => {
    const matchQuery = !normalized || [location.name, location.suburb, location.group].some((value) => value.toLowerCase().includes(normalized));
    return matchQuery && (group === "All blossoms" || location.group === group);
  });
}
