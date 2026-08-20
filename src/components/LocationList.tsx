import { CalendarDays, MapPin } from "lucide-react";
import { blossomColor } from "@/lib/blossom-groups";
import { locationTypeByValue } from "@/lib/location-types";
import { formatReviewedDate } from "@/lib/locations";
import type { Location } from "@/types/location";

type Props = {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

export function LocationList({ locations, selectedId, onSelect, className = "" }: Props) {
  return <div className={className} role="list" aria-label="Blossom locations">
    {locations.map((location) => <div key={location.id} role="listitem"><button
      onClick={() => onSelect(location.id)}
      aria-current={selectedId === location.id ? "true" : undefined}
      className={`group grid w-full grid-cols-[44px_1fr] gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-eucalypt ${selectedId === location.id ? "border-eucalypt bg-eucalypt/8" : "border-transparent hover:border-stone-200 hover:bg-white/75"}`}
    >
      <span className="grid size-11 place-items-center text-white shadow-sm" style={{ background: blossomColor[location.group], ...locationTypeByValue[location.locationType].markerStyle }}>
        <MapPin className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <strong className="block font-display text-[1.03rem] leading-tight text-ink">{location.name}</strong>
        <span className="mt-1 block text-xs leading-relaxed text-slate-600">{location.suburb} · {location.group}</span>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blossom/10 px-2 py-1 text-[11px] font-bold text-berry">
          <CalendarDays className="size-3" aria-hidden="true" />
          Checked {formatReviewedDate(location.lastChecked, { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </span>
    </button></div>)}
  </div>;
}
