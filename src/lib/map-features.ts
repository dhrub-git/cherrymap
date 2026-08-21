import type { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson";
import type { Location } from "@/types/location";

export type MapFeatureProperties = Pick<Location, "id" | "name" | "group" | "locationType">;

function propertiesFor(location: Location): MapFeatureProperties {
  return {
    id: location.id,
    name: location.name,
    group: location.group,
    locationType: location.locationType,
  };
}

export function markerFeatures(locations: Location[]): FeatureCollection<Point, MapFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: locations.map((location): Feature<Point, MapFeatureProperties> => ({
      type: "Feature",
      id: location.id,
      geometry: { type: "Point", coordinates: location.coordinates },
      properties: propertiesFor(location),
    })),
  };
}

export function footprintFeatures(locations: Location[]): FeatureCollection<LineString | Polygon, MapFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: locations.flatMap((location): Feature<LineString | Polygon, MapFeatureProperties>[] => {
      if (location.geometry.type !== "LineString" && location.geometry.type !== "Polygon") return [];
      return [{
        type: "Feature",
        id: location.id,
        geometry: location.geometry,
        properties: propertiesFor(location),
      }];
    }),
  };
}
