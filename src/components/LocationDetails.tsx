import { Compass, ExternalLink, Flag, ShieldCheck, X } from "lucide-react";
import { correctionUrl } from "@/lib/links";
import { formatReviewedDate } from "@/lib/locations";
import type { Location } from "@/types/location";

type Props = { location: Location; onClose: () => void };

const confidenceCopy = {
  Official: "Official source",
  Verified: "Curator verified",
  Probable: "Probable identification",
  Unknown: "Identification uncertain",
} as const;

export function LocationDetails({ location, onClose }: Props) {
  return <aside aria-labelledby="location-title" className="detail-sheet absolute inset-x-3 bottom-[4.75rem] z-30 mx-auto max-h-[68svh] overflow-auto rounded-[1.75rem] bg-ink p-5 text-white shadow-[0_24px_80px_rgba(12,38,28,.42)] md:inset-x-auto md:bottom-6 md:right-6 md:w-[410px] md:max-h-[calc(100svh-3rem)]">
    <button onClick={onClose} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close location details"><X className="size-5" /></button>
    <p className="pr-12 text-xs font-bold uppercase tracking-[.17em] text-pollen">{location.group}</p>
    <h2 id="location-title" className="mt-2 pr-10 font-display text-3xl leading-[.98]">{location.name}</h2>
    <p className="mt-3 text-sm text-white/72">{location.suburb}{location.councilArea !== location.suburb && <> · {location.councilArea}</>}</p>
    {location.streetAddress && <p className="mt-1 text-sm text-white/62">{location.streetAddress}</p>}

    {location.photoUrl && <figure className="mt-5 overflow-hidden rounded-2xl bg-white/8"><img src={location.photoUrl} alt={`Blossoms at ${location.name}`} className="aspect-[16/9] w-full object-cover" loading="lazy" />{location.photoCredit && <figcaption className="px-3 py-2 text-[11px] text-white/55">Photo: {location.photoCredit}</figcaption>}</figure>}

    <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
      <span className="field-tag"><strong>Type</strong>{location.locationType}</span>
      <span className="field-tag"><strong>Confidence</strong>{confidenceCopy[location.locationConfidence]}</span>
      <span className="field-tag"><strong>Access</strong>{location.access}</span>
      <span className="field-tag"><strong>Last checked</strong>{formatReviewedDate(location.lastChecked, { day: "numeric", month: "long", year: "numeric" })}</span>
    </div>

    {location.scientificName && <p className="mt-5 text-sm"><span className="block text-xs font-bold uppercase tracking-wider text-white/50">Scientific name</span><i className="font-display text-lg">{location.scientificName}</i>{location.commonName && <span className="ml-2 text-white/60">({location.commonName})</span>}</p>}
    <p className="mt-4 text-sm leading-relaxed text-white/78">{location.evidenceSummary}</p>
    <p className="mt-3 flex gap-2 text-sm leading-relaxed text-white/70"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-pollen" />{location.visitorNotes ?? "Stay on public paths, respect signs and closures, and do not enter private or operational land."}</p>
    {location.visitorInfoUrl && <a href={location.visitorInfoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-peach underline underline-offset-4">Current visitor information<ExternalLink className="size-3" /></a>}

    <div className="mt-5 border-t border-white/12 pt-4 text-xs text-white/62">
      <p className="font-bold uppercase tracking-wider text-white/42">Source & attribution</p>
      <a href={location.provenance.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-peach underline underline-offset-4">{location.source}<ExternalLink className="size-3" /></a>
      {location.provenance.licence && <p className="mt-1">Licence: {location.provenance.licence}</p>}
      {location.provenance.reuseBasis && <p className="mt-1">Reuse basis: {location.provenance.reuseBasis}</p>}
      <p className="mt-1 font-mono">Public position {location.coordinates[1].toFixed(5)}, {location.coordinates[0].toFixed(5)}</p>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-2">
      <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-pollen px-3 text-sm font-bold text-ink hover:bg-peach" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates[1]},${location.coordinates[0]}`}>Directions <Compass className="size-4" /></a>
      <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-3 text-sm font-bold text-white hover:bg-white/10" target="_blank" rel="noreferrer" href={correctionUrl(location)}>Correct <Flag className="size-4" /></a>
    </div>
  </aside>;
}
