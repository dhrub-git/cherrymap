import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Location } from "@/types/location";

type Props = { locations: Location[]; selectedId: string | null; onSelect: (id: string) => void };

const colorByGroup: Record<Location["group"], string> = { "Flowering cherry": "#d95680", "Flowering plum": "#db914f", "Mixed ornamental Prunus": "#6d568b", "Unknown flowering Prunus": "#71816d" };

export function BlossomMap({ locations, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!container.current || map.current) return;
    const instance = new maplibregl.Map({ container: container.current, style: "https://tiles.openfreemap.org/styles/liberty", center: [151.11, -33.85], zoom: 10.2 });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.current = instance;
    return () => { instance.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = locations.map((location) => {
      const element = document.createElement("button");
      element.type = "button"; element.ariaLabel = `Open ${location.name}`; element.className = "map-marker"; element.style.background = colorByGroup[location.group];
      element.onclick = () => onSelect(location.id);
      return new maplibregl.Marker({ element, anchor: "bottom" }).setLngLat(location.coordinates).addTo(map.current!);
    });
  }, [locations, onSelect]);

  useEffect(() => {
    const selected = locations.find((location) => location.id === selectedId);
    if (selected && map.current) map.current.flyTo({ center: selected.coordinates, zoom: 13, essential: true, duration: 700 });
  }, [locations, selectedId]);

  return <div ref={container} className="h-full min-h-[520px] w-full" aria-label="Interactive blossom location map" />;
}
