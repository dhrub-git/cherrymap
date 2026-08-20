import type { FeatureCollection, Point } from "geojson";
import type { Location } from "@/types/location";

type GeoProperties = Omit<Location, "coordinates">;

export async function loadLocations(): Promise<Location[]> {
  const response = await fetch("/data/locations.geojson");
  if (!response.ok) throw new Error("The map data could not be loaded.");
  const collection = (await response.json()) as FeatureCollection<Point, GeoProperties>;
  return collection.features.map((feature) => ({ ...feature.properties, coordinates: feature.geometry.coordinates as [number, number] }));
}

export function filterLocations(locations: Location[], query: string, group: "All blossoms" | Location["group"]) {
  const normalized = query.trim().toLowerCase();
  return locations.filter((location) => {
    const matchQuery = !normalized || [location.name, location.suburb, location.group].some((value) => value.toLowerCase().includes(normalized));
    return matchQuery && (group === "All blossoms" || location.group === group);
  });
}
