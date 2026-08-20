import { Compass, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BlossomMap } from "@/components/BlossomMap";
import { Button } from "@/components/ui/button";
import { blossomGroups } from "@/lib/blossom-groups";
import { filterLocations, loadLocations } from "@/lib/locations";
import type { Location } from "@/types/location";

const groups: Array<"All blossoms" | Location["group"]> = ["All blossoms", ...blossomGroups.map((group) => group.label)];

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]>("All blossoms");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadLocations().then(setLocations).catch((reason: Error) => setError(reason.message)); }, []);
  const visible = useMemo(() => filterLocations(locations, query, group), [locations, query, group]);
  const selected = visible.find((location) => location.id === selectedId) ?? null;

  return <main className="min-h-svh bg-paper text-ink"><section className="relative min-h-svh overflow-hidden bg-harbour">
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 md:px-9"><a className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight" href="/"><span className="grid size-8 place-items-center rounded-[42%_58%_55%_45%] bg-blossom text-sm text-white">✦</span>CherryMap</a><Button className="bg-white text-ink hover:bg-peach">Suggest a public spot</Button></header>
    <div className="absolute inset-x-0 top-20 z-10 mx-auto flex w-[min(720px,calc(100%-32px))] flex-col gap-3"><label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-4 shadow-[0_14px_40px_rgba(23,59,45,.16)]"><Search className="size-5 text-eucalypt"/><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-500" placeholder="Search a suburb or blossom type"/><span className="hidden text-xs font-medium text-slate-500 sm:block">Greater Sydney</span></label><div className="flex gap-2 overflow-x-auto pb-1">{groups.map((item) => <button key={item} onClick={() => setGroup(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${group === item ? "bg-ink text-white" : "bg-white/95 text-ink hover:bg-peach"}`}>{item}</button>)}</div></div>
    <BlossomMap locations={visible} selectedId={selectedId} onSelect={setSelectedId} />
    <aside className="absolute inset-x-3 bottom-4 z-10 mx-auto max-h-[42svh] w-auto overflow-auto rounded-3xl border border-white/80 bg-paper/95 p-3 shadow-[0_18px_52px_rgba(23,59,45,.24)] backdrop-blur md:inset-x-auto md:right-7 md:bottom-7 md:w-[370px]"><div className="flex items-center justify-between px-2 pb-2"><p className="font-display text-lg">{visible.length} places nearby</p><button className="inline-flex items-center gap-1 text-sm font-semibold text-eucalypt"><SlidersHorizontal className="size-4"/>Filters</button></div>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{visible.map((location) => <button key={location.id} onClick={() => setSelectedId(location.id)} className="grid w-full grid-cols-[42px_1fr] gap-3 rounded-2xl p-3 text-left transition hover:bg-peach/45 focus-visible:outline-2 focus-visible:outline-eucalypt"><span className="grid size-10 place-items-center rounded-xl bg-eucalypt/10 text-eucalypt"><MapPin className="size-5"/></span><span><strong className="font-display text-base">{location.name}</strong><span className="mt-0.5 block text-xs text-slate-600">{location.suburb} · {location.group}</span><span className="mt-1 inline-flex rounded-full bg-blossom/10 px-2 py-0.5 text-[11px] font-semibold text-[#9b254b]">Checked {new Date(location.lastChecked).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span></span></button>)}{!error && visible.length === 0 && <p className="p-4 text-sm text-slate-600">No places match those filters. Try a wider search.</p>}</aside>
    {selected && <section className="absolute inset-x-3 bottom-4 z-20 mx-auto rounded-3xl bg-ink p-5 text-white shadow-2xl md:inset-x-auto md:bottom-7 md:right-[400px] md:w-[330px]"><button onClick={() => setSelectedId(null)} className="absolute right-4 top-4 rounded-full p-1 hover:bg-white/10" aria-label="Close location details"><X className="size-5"/></button><span className="text-xs font-bold uppercase tracking-[.16em] text-peach">{selected.group}</span><h1 className="mt-2 font-display text-3xl leading-none">{selected.name}</h1><p className="mt-3 text-sm text-white/75">{selected.access} · Last reviewed {new Date(selected.lastChecked).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-peach underline underline-offset-4" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${selected.coordinates[1]},${selected.coordinates[0]}`}>Open directions <Compass className="size-4"/></a></section>}
    <p className="absolute bottom-1 left-3 z-10 text-[10px] text-ink/65 md:left-7">Development preview only — records are not yet reviewed public locations.</p>
  </section></main>;
}

export default App;
