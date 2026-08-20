import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Feature, FeatureCollection, Point } from "geojson";
import { blossomGroups } from "@/lib/blossom-groups";
import { locationTypes } from "@/lib/location-types";
import type { Location } from "@/types/location";

type Props = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type MapProperties = {
  id: string;
  name: string;
  group: Location["group"];
  locationType: Location["locationType"];
};

const POINT_SOURCE = "blossom-points";
const CLUSTER_LAYER = "blossom-clusters";
const LOCATION_LAYER = "blossom-locations";

const blossomColorExpression = [
  "match",
  ["get", "group"],
  ...blossomGroups.flatMap((group) => [group.label, group.color]),
  blossomGroups.at(-1)?.color ?? "#71816d",
] as unknown as maplibregl.ExpressionSpecification;

const locationTypeSymbolExpression = [
  "match",
  ["get", "locationType"],
  ...locationTypes.flatMap((type) => [type.value, type.symbol]),
  locationTypes[0].symbol,
] as unknown as maplibregl.ExpressionSpecification;

function toFeatureCollection(locations: Location[]): FeatureCollection<Point, MapProperties> {
  return {
    type: "FeatureCollection",
    features: locations.map((location): Feature<Point, MapProperties> => ({
      type: "Feature",
      id: location.id,
      geometry: { type: "Point", coordinates: location.coordinates },
      properties: {
        id: location.id,
        name: location.name,
        group: location.group,
        locationType: location.locationType,
      },
    })),
  };
}

export function BlossomMap({ locations, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const locationsRef = useRef(locations);
  const onSelectRef = useRef(onSelect);
  const previousSelectedId = useRef<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  locationsRef.current = locations;
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new maplibregl.Map({
      container: container.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [151.11, -33.85],
      zoom: 10.2,
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    const loadTimeout = window.setTimeout(() => setStatus("error"), 12_000);

    instance.on("load", () => {
      window.clearTimeout(loadTimeout);
      setStatus("ready");
      instance.addSource(POINT_SOURCE, {
        type: "geojson",
        data: toFeatureCollection(locationsRef.current),
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 48,
      });
      instance.addLayer({
        id: CLUSTER_LAYER,
        type: "circle",
        source: POINT_SOURCE,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#173b2d",
          "circle-radius": ["step", ["get", "point_count"], 20, 25, 24, 75, 29],
          "circle-stroke-color": "#fffaf1",
          "circle-stroke-width": 3,
          "circle-opacity": 0.94,
        },
      });
      instance.addLayer({
        id: "blossom-cluster-count",
        type: "symbol",
        source: POINT_SOURCE,
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
        paint: { "text-color": "#fffaf1" },
      });
      instance.addLayer({
        id: LOCATION_LAYER,
        type: "circle",
        source: POINT_SOURCE,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": blossomColorExpression,
          "circle-radius": ["case", ["boolean", ["feature-state", "selected"], false], 13, 10],
          "circle-stroke-color": "#fffaf1",
          "circle-stroke-width": ["case", ["boolean", ["feature-state", "selected"], false], 4, 3],
          "circle-opacity": 0.96,
        },
      });
      instance.addLayer({
        id: "blossom-location-shape",
        type: "symbol",
        source: POINT_SOURCE,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": locationTypeSymbolExpression,
          "text-size": 8,
          "text-allow-overlap": true,
        },
        paint: { "text-color": "#fffaf1" },
      });

      instance.on("click", CLUSTER_LAYER, async (event) => {
        const feature = event.features?.[0];
        const clusterId = feature?.properties?.cluster_id;
        if (!feature || typeof clusterId !== "number") return;
        const source = instance.getSource(POINT_SOURCE) as maplibregl.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        if (feature.geometry.type === "Point") {
          instance.easeTo({ center: feature.geometry.coordinates as [number, number], zoom });
        }
      });
      instance.on("click", LOCATION_LAYER, (event) => {
        const id = event.features?.[0]?.properties?.id;
        if (typeof id === "string") onSelectRef.current(id);
      });
      for (const layer of [CLUSTER_LAYER, LOCATION_LAYER]) {
        instance.on("mouseenter", layer, () => { instance.getCanvas().style.cursor = "pointer"; });
        instance.on("mouseleave", layer, () => { instance.getCanvas().style.cursor = ""; });
      }
    });

    map.current = instance;
    return () => {
      window.clearTimeout(loadTimeout);
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    const update = () => {
      const source = instance.getSource(POINT_SOURCE) as maplibregl.GeoJSONSource | undefined;
      source?.setData(toFeatureCollection(locations));
    };
    if (instance.isStyleLoaded()) update();
    else instance.once("load", update);
  }, [locations]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !instance.isStyleLoaded()) return;
    if (previousSelectedId.current) {
      instance.setFeatureState({ source: POINT_SOURCE, id: previousSelectedId.current }, { selected: false });
    }
    if (selectedId) {
      instance.setFeatureState({ source: POINT_SOURCE, id: selectedId }, { selected: true });
      const selected = locations.find((location) => location.id === selectedId);
      if (selected) instance.flyTo({ center: selected.coordinates, zoom: Math.max(instance.getZoom(), 13), essential: true, duration: 650 });
    }
    previousSelectedId.current = selectedId;
  }, [locations, selectedId]);

  return <div className="absolute inset-0" role="region" aria-label="Interactive blossom location map">
    <div ref={container} className="h-full w-full" />
    <span className="sr-only" role="status">{status === "ready" ? `Map loaded with ${locations.length} locations` : status === "loading" ? "Loading map" : "Basemap unavailable; use the list view"}</span>
    {status === "error" && <p className="absolute left-1/2 top-1/2 max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-paper p-4 text-center text-sm font-semibold shadow-lg">The basemap is temporarily unavailable. Use List view to browse every reviewed location.</p>}
  </div>;
}
