import { ExternalLink, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { repositoryUrl, suggestionUrl } from "@/lib/links";
import type { ExplorerState } from "@/lib/explorer-state";

type InfoKey = NonNullable<ExplorerState["info"]>;
type Props = { page: InfoKey; onClose: () => void; onChange: (page: InfoKey) => void };

const content: Record<InfoKey, { title: string; body: React.ReactNode }> = {
  methodology: { title: "How the map is curated", body: <><p>CherryMap V1 publishes a static, reviewed dataset. Official inventories create candidates; a curator checks taxonomy, public access, privacy, licence and attribution before a pull request can publish a location.</p><p>These pins identify places—not current bloom status. Species and confidence are kept explicit so a plum is not casually presented as a cherry.</p></> },
  privacy: { title: "Privacy", body: <><p>Only public-land locations, managed visitor venues, or trees safely visible from public land are eligible. Private homes, rail corridors, operational land and unclear-access sites are excluded.</p><p>CherryMap V1 has no accounts, database, tracking form or public uploads. Requests to remove a sensitive location are reviewed through the public correction path.</p></> },
  attribution: { title: "Attribution", body: <><p>Tree records currently come from City of Sydney’s Trees dataset under CC BY 4.0. Every location retains its source URL, source record identity, import date and review date.</p><p>The basemap is provided by OpenFreeMap using OpenMapTiles and OpenStreetMap data. Map attribution remains visible on the map.</p></> },
  safety: { title: "Visit safely", body: <><p>Stay on public paths, obey signs and temporary closures, supervise children near roads and waterways, and never enter private, rail or operational land to reach a pin.</p><p>Conditions, access and blossoms change. Check venue hours and local alerts before travelling, and treat each location’s last-checked date as historical evidence—not a live promise.</p></> },
  corrections: { title: "Suggest or correct a location", body: <><p>Suggestions and corrections are reviewed manually before they affect the public dataset. Include a public location, identification evidence, source and access notes. Never submit a private residential location.</p><div className="mt-5 flex flex-wrap gap-2"><a className="info-action" href={suggestionUrl} target="_blank" rel="noreferrer">Suggest a public location <ExternalLink className="size-4" /></a><a className="info-action secondary" href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">View requests <ExternalLink className="size-4" /></a></div></> },
};

export function InfoPanel({ page, onClose, onChange }: Props) {
  const active = content[page];
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    return () => { if (dialog.current?.open) dialog.current.close(); };
  }, []);

  return <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-labelledby="info-title" className="fixed inset-3 z-40 m-auto h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-paper p-0 shadow-[0_30px_100px_rgba(23,59,45,.32)] open:flex md:h-[calc(100%-5rem)]">
    <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4"><span className="font-display text-xl font-bold text-ink">CherryMap field notes</span><button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-stone-100" aria-label="Close information"><X className="size-5" /></button></div>
    <div className="flex gap-2 overflow-x-auto border-b border-stone-200 px-4 py-3" aria-label="Information pages">{(Object.keys(content) as InfoKey[]).map((key) => <button key={key} onClick={() => onChange(key)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${key === page ? "bg-ink text-white" : "bg-white text-ink hover:bg-peach/60"}`}>{content[key].title}</button>)}</div>
    <article className="info-copy flex-1 overflow-auto px-6 py-7 md:px-10 md:py-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-berry">Public map notes</p><h1 id="info-title" className="mt-2 font-display text-4xl leading-none text-ink">{active.title}</h1><div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-700">{active.body}</div></article>
  </dialog>;
}
