# CherryMap V1 public venue audit, round 2

**Reviewed at:** `2026-08-21T10:17:06+10:00` (Australia/Sydney)

**Bounds:** longitude `150.4` to `151.5`, latitude `-34.25` to `-33.35`

**Scope:** Additional public or ticketed Greater Sydney venues not already present in `data/locations.geojson`. This audit uses official first-party pages only and does not copy source datasets, text, or media.

## Decision

Four venue-level records pass the publication gates:

1. Wistaria Gardens flowering peaches, Westmead;
2. Rouse Hill Estate purple cherry plum, Rouse Hill;
3. Swain Gardens cherry blossoms, Killara; and
4. Chinese Garden of Friendship pink plum blossom, Darling Harbour.

These are venue or garden pins, not individual-tree records. Each record should use the official venue point below, retain a direct source link, and tell visitors to stay on public paths. Do not attach source photos.

Richmond Park is a useful lead but its only species inventory located in this audit relies on a 1994 survey. Hold it until Council or a curator confirms that a qualifying tree remains. Planned 2026 City of Parramatta street trees also remain on hold until planting is confirmed complete.

## Gate summary

| Candidate | Qualifying tree evidence | Current visitor access | Location evidence | Decision |
| --- | --- | --- | --- | --- |
| Wistaria Gardens, Westmead | Current official garden page names flowering peach; official tree plan maps numerous flowering peach trees | Open to pedestrians 24 hours, 7 days; free entry | Official NSW venue address and map point | Publish |
| Rouse Hill Estate, Rouse Hill | Heritage NSW names purple cherry plum from a 2019 site record | Free entry; open Sundays 10am–4pm | Heritage NSW supplies an estate coordinate; the venue supplies its visitor address | Publish, venue-level point |
| Swain Gardens, Killara | Council annual report captions a white cherry blossom at Swain Gardens; Council master plan also records cherry trees near the gazebo | Council page lists daily 8am–6pm public hours | Council page supplies exact coordinates and address | Publish, common-name taxonomy only |
| Chinese Garden of Friendship, Darling Harbour | Official precinct article names Chinese plum blossoms and a pink plum blossom hybrid | Ticketed daily 10am–5pm, except Good Friday and Christmas Day | Official visitor page supplies address and map point | Publish, hybrid taxon not confirmed |
| Richmond Park, Richmond | Heritage NSW lists peach and red cherry plum in the park | Current NSW visitor page confirms public park use | Heritage NSW supplies exact park coordinate and boundary address | Hold: botanical evidence rests on a 1994 survey |
| City of Parramatta 2026 black cherry plum sites | Council planting program names black cherry plum at exact street addresses | Street verges would be public-facing | Council lists addresses | Hold: planting program is not completion evidence |
| Breenhold Gardens, Mount Wilson | Official venue pages name Japanese cherry, Prunus and weeping cherry | Official closure notice says closed until further notice | `29 The Avenue, Mount Wilson` | Reject now: closed and west of the longitude bound |
| Everglades House & Gardens and Leura town centre | Official sources name cherry blossoms and cherry trees | Public or ticketed access is documented | Official map point for Everglades is longitude `150.3371944` | Reject: west of the `150.4` bound |
| Chatswood Chase “Cherry Blossom Garden” | Council mentions it only as part of a 2018 event | No current garden or tree access evidence | Chatswood Chase only | Reject: temporary event, not established trees |
| Chang Lai Yuan Chinese Gardens, Doonside | Official pages describe the garden but do not name cherry, plum, peach, or Prunus plantings | Current public access is documented | Exact Council coordinate is available | Reject: no qualifying botanical evidence |

## Publish: Wistaria Gardens flowering peaches

**Recommended identity**

- Name: `Wistaria Gardens Flowering Peaches`
- Suburb: `Westmead`
- Group: `Flowering peach`
- Scientific name: `Prunus persica cv.`
- Taxon confidence: species confirmed by the venue manager
- Location type: `venue`
- Access: `Public access; pedestrian entry 24 hours a day, 7 days a week`
- Street address: `1 Hainsworth Street, Westmead NSW 2145`
- Venue point: longitude `150.9951386`, latitude `-33.8037627`

**Evidence**

- Greater Sydney Parklands' current [Wistaria Gardens page](https://www.greatersydneyparklands.nsw.gov.au/explore/wistaria-gardens) says the garden is open to pedestrians 24 hours a day, 7 days a week, and lists `Flowering peach (Prunus persica cv.)` among its plant species.
- The official [Wistaria Gardens Tree Management Plan, part 2](https://www.greatersydneyparklands.nsw.gov.au/sites/default/files/2026-06/Wistaria%20Gardens%20Tree%20Management%20Plan%20%20-%20Part%202.pdf) includes a diagram of the current location of numerous small flowering peach trees. The plan is dated 23 April 2023.
- The NSW Government [visitor listing](https://www.nsw.gov.au/visiting-and-exploring-nsw/locations-and-attractions/wistaria-gardens) gives the address, free-entry status, and map point. The official event guidance says pedestrian entry is from Byrnes Avenue near The Picnic Ground, not through the former hospital site.

**Curation note:** Use one area-level pin. The tree plan demonstrates a group, but CherryMap should not convert its diagram into individual coordinates. Visitor directions should link to the current venue page because restoration work may affect routes.

**Reuse basis:** `Manually curated factual venue record; no source text, dataset or media reproduced`.

## Publish: Rouse Hill Estate purple cherry plum

**Recommended identity**

- Name: `Rouse Hill Estate Purple Cherry Plum`
- Suburb: `Rouse Hill`
- Group: `Flowering plum`
- Scientific name: `Prunus cerasifera 'Nigra'`
- Taxon confidence: cultivar confirmed by Heritage NSW
- Location type: `venue`
- Access: `Free ticketed access; Sundays 10am–4pm, closed Christmas Day`
- Street address: `356 Annangrove Road, Rouse Hill NSW 2155`
- Venue point: longitude `150.9076283130`, latitude `-33.6758158602`

**Evidence**

- The current Heritage NSW [Rouse Hill House and Farm record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5044989) names purple cherry plum (`Prunus cerasifera 'Nigra'`) among the garden's notable plantings. The entry cites a 29 April 2019 site visit. It also supplies the official estate-level coordinate.
- Museums of History NSW's current [plan-your-visit page](https://mhnsw.au/visit-us/rouse-hill-estate/plan-your-visit/) confirms free museum entry, Sunday opening from 10am to 4pm, the visitor address, garden and grounds access, and the need to keep to well-trodden paths. It warns that extreme heat or weather can close parts of the property.

**Curation note:** The Heritage NSW point locates the estate, not the tree. Publish one venue-level pin and describe the cultivar as being in the historic garden. Do not invent a tree position or promise that every part of the grounds is open. Link current visitor details because conservation work and weather can change access.

**Reuse basis:** `Manually curated factual venue record; no source text, dataset or media reproduced`.

## Publish: Swain Gardens cherry blossoms

**Recommended identity**

- Name: `Swain Gardens Cherry Blossoms`
- Suburb: `Killara`
- Group: `Flowering cherry`
- Scientific name: `Prunus sp.`
- Taxon confidence: common name and genus only; species and cultivar not confirmed
- Location type: `venue`
- Access: `Public access; Monday–Sunday, 8am–6pm`
- Street address: `77 Stanhope Road, Killara NSW 2071`
- Venue point: longitude `151.168191`, latitude `-33.7671812`

**Evidence**

- Ku-ring-gai Council's current [Swain Gardens page](https://www.krg.nsw.gov.au/Things-to-do/Parks-playgrounds-and-sportsfields/Swain-Gardens) lists the daily hours, public garden uses, address, and exact coordinate. It also warns that access includes narrow paths, steep inclines, and steps.
- Council's [2021–2022 annual report](https://www.krg.nsw.gov.au/files/assets/public/v/2/hptrim/information-management-publications-public-website-ku-ring-gai-council-website-council/annual-report-2021-2022.pdf) captions an official image `White Cherry Blossom, Swain Gardens, Killara`.
- Council's adopted [Swain Gardens Landscape Master Plan](https://www.krg.nsw.gov.au/files/assets/public/hptrim/information-management-publications-public-website-ku-ring-gai-council-website-planning-and-development/swain_gardens_landscape_masterplan_part_1-1.pdf) records cherry trees near the gazebo and describes the garden as being at its best when its Prunus species flower.

**Curation note:** The sources do not establish a species or cultivar. Keep `Prunus sp.` and do not infer Japanese flowering cherry. Use the venue point rather than a guessed tree position.

**Reuse basis:** `Manually curated factual venue record; no Council text, dataset or media reproduced`.

## Publish: Chinese Garden of Friendship pink plum blossom

**Recommended identity**

- Name: `Chinese Garden of Friendship Pink Plum Blossom`
- Suburb: `Darling Harbour`
- Group: `Flowering plum`
- Scientific name: `Prunus hybrid, exact taxon not confirmed`
- Taxon confidence: official common name and hybrid parent description only
- Location type: `venue`
- Access: `Ticketed access; daily 10am–5pm, closed Good Friday and Christmas Day`
- Street address: `Pier Street, corner Harbour Street, Darling Harbour NSW 2000`
- Venue point: longitude `151.201773542328`, latitude `-33.8763133956536`

**Evidence**

- The official Darling Harbour article [See what's blooming in the Chinese Garden this Spring](https://www.darlingharbour.com/editorials/whats-blooming-this-spring) names Chinese plum blossoms and a `Pink Plum Blossom`. It describes the pink blossom as a cross between Chinese plum blossom and purple-leaved plum.
- The current [Chinese Garden of Friendship visitor page](https://www.darlingharbour.com/precincts/chinese-garden) gives daily opening hours, admission prices, entrance location, address, accessibility notes, path restrictions, and a directions link containing the venue point.

**Curation note:** Do not promote the parent description to a botanical hybrid name without a source that states the accepted taxon. The visitor page restricts patrons to stone or paved paths and prohibits entering garden beds, so the detail panel should repeat the stay-on-path instruction.

**Reuse basis:** `Manually curated factual venue record; no source text, dataset or media reproduced`.

## Hold: Richmond Park peach and red cherry plum

Heritage NSW's current [Richmond Park record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5050509) lists peach (`Prunus persica cv.`) and red cherry plum (`Prunus cerasifera 'Nigra'`) among the park's trees. It supplies the official park point at longitude `150.7514584310`, latitude `-33.5979857202`, and the boundary address `East Market, Windsor and March Streets, Richmond NSW 2753`.

The current NSW Government [visitor page](https://www.nsw.gov.au/visiting-and-exploring-nsw/locations-and-attractions/richmond-park) confirms that the site remains an open public park with picnic facilities, toilets, parking, playground use, and a weekly market.

Do not publish yet. The species list cites a 1994 survey. The access evidence is current, but the official sources reviewed here do not confirm that either qualifying tree survives in 2026. A current Council tree record, official image, or curator site check would clear this hold.

## Hold and reject notes

### Planned Parramatta street trees

The City of Parramatta [2026 street-tree planting page](https://www.cityofparramatta.nsw.gov.au/environment/trees/tree-planting-program/2026-street-tree-planting-program/plants-and-location) names black cherry plum at exact addresses. It is a planting program, not evidence that work has finished. Recheck after Council publishes completion evidence. Do not map planned trees as established.

### Out-of-bounds Blue Mountains leads

The National Trust's [Everglades visitor page](https://www.nationaltrust.org.au/places/everglades-house-gardens-2/) has strong cherry blossom, current access, and address evidence, but the NSW Government map point is longitude `150.3371944`, outside this audit's lower longitude bound. The official [Leura destination page](https://www.visitnsw.com/destinations/blue-mountains/katoomba-area/leura) also identifies cherry trees in the town centre, which is in the same out-of-bounds area.

[Breenhold Gardens](https://www.breenhold.com.au/breenhold-gardens/the-gardens/) names Japanese cherry trees and Prunus, but the official [closure notice](https://www.breenhold.com.au/temporary-closure/) says the garden has been closed since 3 April 2026 until further notice. It is also west of the longitude bound. Do not publish it in this source round.

### Temporary and unsupported garden leads

- Willoughby City Council's [2018 Emerge StreetFair page](https://www.willoughby.nsw.gov.au/Council/News-and-media/Emerge-StreetFair-%E2%80%93-the-North-Shore%E2%80%99s-biggest-street-party) refers to a `Chatswood Chase – Cherry Blossom Garden` as an event attraction. It does not establish a permanent planting.
- Blacktown City's current [Nurragingy Reserve page](https://www.blacktown.nsw.gov.au/Sport-recreation/Parks-and-recreation-directory/Nurragingy-Reserve) confirms access to Chang Lai Yuan Chinese Gardens, but neither it nor the NSW Government [garden listing](https://www.nsw.gov.au/visiting-and-exploring-nsw/locations-and-attractions/chang-lai-yuan-chinese-gardens) names a qualifying blossom tree. Chinese garden styling alone is not botanical evidence.

## Publication rules for this source round

- Add no more than one feature for each garden.
- Use venue points only. Do not infer individual tree positions or counts.
- Preserve the official visitor URL, evidence URL, provider, reviewed date, and reuse basis in provenance.
- Do not copy source photographs, maps, tree-plan diagrams, or descriptive prose.
- Keep taxonomy conservative. In particular, do not assign a species to Swain Gardens or an accepted hybrid name to the Chinese Garden of Friendship.
- Link visitors to current operating details and repeat path or terrain cautions where the venue publishes them.
- Recheck access and source pages during each scheduled curation refresh.
