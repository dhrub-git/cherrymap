import { Download, Info, Leaf, List, Map as MapIcon, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BlossomMap } from "@/components/BlossomMap";
import { InfoPanel } from "@/components/InfoPanel";
import { LocationDetails } from "@/components/LocationDetails";
import { LocationList } from "@/components/LocationList";
import { Button } from "@/components/ui/button";
import { blossomGroups } from "@/lib/blossom-groups";
import { buildExplorerSearch, defaultExplorerState, readExplorerState, type ExplorerState } from "@/lib/explorer-state";
import { suggestionUrl } from "@/lib/links";
import { locationTypes } from "@/lib/location-types";
import { filterLocations, loadLocations } from "@/lib/locations";
import type { Location, LocationFilters } from "@/types/location";

const groups: LocationFilters["group"][] = ["All blossoms", ...blossomGroups.map((group) => group.label)];
const locationTypeOptions: LocationFilters["locationType"][] = ["All types", ...locationTypes.map((type) => type.value)];
const accessOptions: LocationFilters["access"][] = ["All access", "Public access", "Ticketed venue"];

function initialState() {
  return typeof window === "undefined" ? defaultExplorerState : readExplorerState(window.location.search);
}

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [state, setState] = useState<ExplorerState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations().then(setLocations).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "The reviewed map data could not be loaded.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateFromHistory = () => setState(readExplorerState(window.location.search));
    window.addEventListener("popstate", updateFromHistory);
    return () => window.removeEventListener("popstate", updateFromHistory);
  }, []);

  useEffect(() => {
    const search = buildExplorerSearch(state);
    window.history.replaceState(null, "", `${window.location.pathname}${search}${window.location.hash}`);
  }, [state]);

  const visible = useMemo(() => filterLocations(locations, state), [locations, state]);
  const selected = locations.find((location) => location.id === state.selectedId) ?? null;
  const years = useMemo(() => [...new Set(locations.map((location) => location.lastChecked.slice(0, 4)))].sort().reverse(), [locations]);
  const activeFilterCount = [state.group !== "All blossoms", state.locationType !== "All types", state.access !== "All access", state.photo !== "All photos", state.year !== "All years"].filter(Boolean).length;
  const update = (changes: Partial<ExplorerState>) => setState((current) => ({ ...current, ...changes }));
  const selectLocation = (id: string) => update({ selectedId: id });

  return <main className="relative h-svh overflow-hidden bg-harbour text-ink">
    <BlossomMap locations={visible} selectedId={state.selectedId} onSelect={selectLocation} />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,241,.92)_0,rgba(255,250,241,.18)_22%,transparent_40%)]" aria-hidden="true" />

    <header className="absolute inset-x-0 top-0 z-20 flex h-[4.25rem] items-center justify-between px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2"><a className="flex shrink-0 items-center gap-2 font-display text-[1.45rem] font-bold tracking-tight" href="/" aria-label="CherryMap home"><span className="grid size-9 place-items-center rounded-[46%_54%_58%_42%] bg-blossom text-white shadow-sm"><Leaf className="size-4" /></span>CherryMap</a><p className="max-w-[6.5rem] border-l border-ink/15 pl-2 text-[8px] font-semibold leading-tight text-ink/65 sm:max-w-[15rem] sm:pl-3 sm:text-[10px]">Find reviewed, publicly accessible blossom trees across Greater Sydney.</p></div>
      <nav className="flex items-center gap-2" aria-label="Map actions">
        <a className="header-action hidden sm:inline-flex" href="/data/locations.geojson" download><Download className="size-4" />GeoJSON</a>
        <a className="header-action hidden md:inline-flex" href="/data/locations.csv" download><Download className="size-4" />CSV</a>
        <a className="header-action inline-flex" href={suggestionUrl} target="_blank" rel="noreferrer"><Plus className="size-4" /><span className="hidden sm:inline">Suggest</span></a>
        <Button variant="surface" className="header-action" onClick={() => update({ info: "methodology" })}><Info className="size-4" /><span className="sr-only sm:not-sr-only">About</span></Button>
      </nav>
    </header>

    <section aria-label="Search and filters" className="absolute inset-x-3 top-[4.25rem] z-20 mx-auto max-w-3xl md:left-6 md:right-auto md:mx-0 md:w-[390px]">
      <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/80 bg-white/96 px-4 shadow-[0_12px_38px_rgba(23,59,45,.16)] backdrop-blur">
        <Search className="size-5 shrink-0 text-eucalypt" />
        <input aria-label="Search locations" value={state.query} onChange={(event) => update({ query: event.target.value, selectedId: null })} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Suburb, council or tree name" />
        {state.query && <button onClick={() => update({ query: "" })} className="grid size-8 place-items-center rounded-full hover:bg-stone-100" aria-label="Clear search"><X className="size-4" /></button>}
      </label>

      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">{groups.map((item) => <button key={item} onClick={() => update({ group: item, selectedId: null })} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold shadow-sm transition ${state.group === item ? "border-ink bg-ink text-white" : "border-white/80 bg-white/95 text-ink hover:bg-peach"}`}>{item}</button>)}</div>

      <details className="group mt-1 rounded-2xl border border-white/70 bg-paper/94 shadow-sm backdrop-blur">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between px-3 text-xs font-bold"><span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-4" />Filters {activeFilterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-berry text-[10px] text-white">{activeFilterCount}</span>}</span><span className="text-slate-500 group-open:hidden">Type, access, year</span></summary>
        <div className="grid grid-cols-2 gap-2 border-t border-stone-200 p-3">
          <FilterSelect label="Location type" value={state.locationType} options={locationTypeOptions} onChange={(locationType) => update({ locationType: locationType as LocationFilters["locationType"], selectedId: null })} />
          <FilterSelect label="Access" value={state.access} options={accessOptions} onChange={(access) => update({ access: access as LocationFilters["access"], selectedId: null })} />
          <FilterSelect label="Last checked" value={state.year} options={["All years", ...years]} onChange={(year) => update({ year, selectedId: null })} />
          <FilterSelect label="Photos" value={state.photo} options={["All photos", "Has photo"]} onChange={(photo) => update({ photo: photo as LocationFilters["photo"], selectedId: null })} />
          {activeFilterCount > 0 && <Button variant="outline" size="sm" className="col-span-2 rounded-xl" onClick={() => update({ group: "All blossoms", locationType: "All types", access: "All access", photo: "All photos", year: "All years", selectedId: null })}>Clear filters</Button>}
        </div>
      </details>
    </section>

    <aside className="absolute bottom-6 left-6 top-[15.7rem] z-10 hidden w-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-paper/94 shadow-[0_20px_65px_rgba(23,59,45,.22)] backdrop-blur md:flex">
      <div className="flex items-end justify-between border-b border-stone-200 px-4 py-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-berry">Reviewed public locations</p><p className="font-display text-xl font-bold"><span aria-live="polite">{visible.length}</span> places</p></div><span className="rounded-full bg-eucalypt/10 px-2 py-1 text-[11px] font-bold text-eucalypt">Curated beta</span></div>
      <ResultsContent loading={loading} error={error} locations={visible} selectedId={state.selectedId} onSelect={selectLocation} className="flex-1 overflow-auto p-2" />
    </aside>

    {state.view === "list" && <section className="absolute inset-x-3 bottom-[4.75rem] top-[15.7rem] z-10 overflow-hidden rounded-[1.75rem] border border-white/80 bg-paper/97 shadow-xl backdrop-blur md:hidden">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3"><p className="font-display text-xl font-bold"><span aria-live="polite">{visible.length}</span> reviewed places</p><span className="text-xs font-bold text-eucalypt">List view</span></div>
      <ResultsContent loading={loading} error={error} locations={visible} selectedId={state.selectedId} onSelect={selectLocation} className="h-full overflow-auto p-2 pb-20" />
    </section>}

    {state.view === "map" && (loading || error || visible.length === 0) && <div className="absolute inset-x-3 bottom-[4.75rem] z-20 md:hidden">{loading ? <LoadingResults /> : error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : <EmptyResults />}</div>}

    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 rounded-full border border-white/80 bg-paper/96 p-1 shadow-[0_12px_36px_rgba(23,59,45,.24)] md:hidden" aria-label="View switcher">
      <button onClick={() => update({ view: "map" })} className={`view-switch ${state.view === "map" ? "active" : ""}`} aria-pressed={state.view === "map"}><MapIcon className="size-4" />Map</button>
      <button onClick={() => update({ view: "list" })} className={`view-switch ${state.view === "list" ? "active" : ""}`} aria-pressed={state.view === "list"}><List className="size-4" />List <span className="text-[10px] opacity-70">{visible.length}</span></button>
    </div>

    <Button variant="surface" size="sm" className="absolute bottom-3 left-3 z-20 hidden text-[11px] md:inline-flex" onClick={() => update({ info: "methodology" })}>How this map works</Button>
    {selected && <LocationDetails location={selected} onClose={() => update({ selectedId: null })} />}
    {state.info && <InfoPanel page={state.info} onClose={() => update({ info: null })} onChange={(info) => update({ info })} />}
  </main>;
}

type FilterSelectProps = { label: string; value: string; options: readonly string[]; onChange: (value: string) => void };

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return <label className="text-[11px] font-bold text-slate-600">{label}<select className="mt-1 min-h-9 w-full rounded-xl border border-stone-300 bg-white px-2 text-xs text-ink outline-none focus:border-eucalypt" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function EmptyResults() {
  return <div className="m-3 rounded-2xl border border-dashed border-stone-300 bg-white/55 p-5 text-center"><p className="font-display text-lg font-bold">No matching places</p><p className="mt-1 text-sm leading-relaxed text-slate-600">Clear a filter or try a broader Sydney-area search.</p></div>;
}

function LoadingResults() {
  return <p className="m-4 rounded-2xl bg-white/60 p-4 text-sm text-slate-600" role="status">Loading reviewed locations…</p>;
}

type ResultsContentProps = { loading: boolean; error: string | null; locations: Location[]; selectedId: string | null; onSelect: (id: string) => void; className: string };

function ResultsContent({ loading, error, locations, selectedId, onSelect, className }: ResultsContentProps) {
  if (loading) return <LoadingResults />;
  if (error) return <p className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!locations.length) return <EmptyResults />;
  return <LocationList locations={locations} selectedId={selectedId} onSelect={onSelect} className={className} />;
}

export default App;
