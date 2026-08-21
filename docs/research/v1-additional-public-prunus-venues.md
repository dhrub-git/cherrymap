# CherryMap V1 additional public *Prunus* venue audit

**Reviewed:** 21 August 2026 (Australia/Sydney)
**Scope:** Further Greater Sydney venues, outside the existing `data/locations.geojson` records. Sources below are first-party operator, council, or NSW Government pages. This is a venue-level curation note: it neither republishes source data/media nor derives individual-tree locations.

## Decision

This pass identifies two **public-access leads**, but does not clear either for a data pull request yet:

1. Glenalvon House, Campbelltown — public on scheduled open days and by booked tour; and
2. Linnwood, Guildford — public on scheduled open days.

Both are within the Greater Sydney launch bounds in `CONTEXT.md`, have a current visitor-access source, an official botanical/heritage source that identifies ornamental *Prunus* at the venue, and an authoritative venue coordinate. However, the botanical inventories are historic heritage descriptions rather than a current tree survey. That is insufficient to satisfy the V1 rule excluding stale evidence. Retain these as structured curation leads only until an operator, Council or curator provides current confirmation that the qualifying planting survives. If confirmed, each must be a single venue pin with conservative taxonomy and no current-bloom claim.

## Structured leads pending current botanical confirmation

### Glenalvon House heritage-garden *Prunus*

| Field | Recommended value |
| --- | --- |
| Name | `Glenalvon House Heritage Garden Prunus` |
| Suburb | Campbelltown |
| Blossom group | Mixed ornamental *Prunus* |
| Scientific name | `Prunus sp.` |
| Taxonomy confidence | **Genus only.** Heritage NSW identifies spring `prunus` in the heritage garden, but does not publish species or cultivar. Do not call it cherry, plum, or peach. |
| Location type | Venue |
| Public venue coordinate | longitude `150.8148812860`, latitude `-34.0675188292` |
| Coordinate source | [Heritage NSW's Glenalvon record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5045750) gives the estate-level latitude/longitude and `8 Lithgow Street, Campbelltown`. Use this point only for the venue—not a tree. |
| Current visitor access | Campbelltown City Council says Glenalvon is open to the general public on the first and third Sunday, February to early December, 10am–1pm; tours can be booked separately. |
| Access/safety copy | `Historic garden access is limited to advertised open days or a booked tour. Check current opening details before travelling and follow venue directions.` |

**Evidence and rationale**

- Heritage NSW's [Glenalvon record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5045750) describes the surviving garden's seasonal displays as including `prunus` in spring, supplies the estate point above, and identifies the location/address. It is botanical evidence for the genus only.
- The current [Campbelltown City Council Glenalvon page](https://www.campbelltown.nsw.gov.au/Services-and-Facilities/Facilities-for-Hire/Glenalvon-House) states that the heritage garden and venue are open to the general public on the specified schedule, gives the address and an accessible-access feature, and explains booked tours. It also makes clear that the site has conditions for use.

**Publication/reuse basis if later confirmed:** manually curated factual venue record. Retain direct links to both sources and review date; do not copy the Heritage NSW description, Council photographs, site maps, or any tree-position data. Heritage NSW’s botanical material is a heritage-record observation, not a current flowering assertion. Obtain current botanical confirmation and reconfirm the operator schedule before publication.

### Linnwood purple-plum heritage landscape

| Field | Recommended value |
| --- | --- |
| Name | `Linnwood Heritage Landscape Purple Plums` |
| Suburb | Guildford |
| Blossom group | Flowering plum |
| Scientific name | `Prunus cerasifera cv.` |
| Taxonomy confidence | **Species confirmed; cultivar not confirmed.** The Heritage NSW description identifies plums as `Prunus cerasifera cv.s`; it does not establish a named cultivar or that every listed tree persists. |
| Location type | Venue |
| Public venue coordinate | longitude `150.9754265130`, latitude `-33.8546296069` |
| Coordinate source | [Heritage NSW's Linnwood record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5052822) gives the estate-level latitude/longitude and the `11–35 Byron Road, Guildford` address. Use the venue point only. |
| Current visitor access | The [Friends of Linnwood 2026 calendar](https://www.linnwood.org.au/open-days-and-public-meetings.php) lists public open days in March, July, September and November, normally 11am–3pm, plus special events; dates may change. |
| Access/safety copy | `Historic landscape access is limited to advertised open days or special events. Check the current calendar before travelling and remain on visitor routes.` |

**Evidence and rationale**

- Heritage NSW's [Linnwood record](https://apps.environment.nsw.gov.au/dpcheritageapp/ViewHeritageItemDetails.aspx?ID=5052822) identifies plums as `Prunus cerasifera cv.s` among the landscape's plantings, identifies its former/ongoing heritage-landscape context, and provides the estate coordinate.
- The venue operator's [2026 open-day calendar](https://www.linnwood.org.au/open-days-and-public-meetings.php) provides current scheduled public access, current dates, address, and the warning that events may change. [Cumberland City Council's local-history-societies page](https://www.cumberland.nsw.gov.au/local-history-societies) independently lists the recurring Linnwood open-house pattern and address.

**Publication/reuse basis if later confirmed:** manually curated factual venue record. Keep the Heritage NSW record, operator calendar, Council corroboration and review date in provenance. Do not reproduce source photos, maps, historical prose, plant-list text, or a coordinate for any individual tree. The botanical record cites an earlier observed landscape; it supports a research lead, not a live bloom claim. Obtain a current botanical confirmation and refresh access before publishing any visitor-facing hours.

## Exclusions and holds

| Candidate | Why it is not a V1 addition in this pass |
| --- | --- |
| Tulkiyan House, Gordon | Heritage NSW has strong *Prunus* evidence, including cherry plum, but Ku-ring-gai Council material says the house has been closed for safety/compliance and access works. Do not publish until the operator confirms current public visitor access. |
| The Hermitage, Denistone | Heritage NSW identifies a flowering apricot (*Prunus mume*), but no current primary-source visitor-access page was located. Do not infer public garden access from the heritage listing. |
| Richmond Park, Richmond | Already documented as a hold in [round 2](./v1-public-venues-round2.md#hold-richmond-park-peach-and-red-cherry-plum): the botanical list is based on a 1994 survey and lacks current survival confirmation. |
| Blue Mountains, Cowra and other day-trip leads | Outside the Greater Sydney V1 boundary or explicitly deferred by `CONTEXT.md`; retain in the separate day-trip research record only. |

## Curation rules for any data PR

1. Add at most one feature per venue; both recommendations are estate-level pins.
2. Do not manufacture a tree coordinate, count, bloom time, cultivar, or accessibility claim beyond the sources above.
3. State restricted/scheduled entry in the location detail and link visitors to the current operator page.
4. Keep `sourceUrl`, provider, review date, coordinate source, taxonomy confidence, visitor-access source, and factual-reuse basis in provenance.
5. Recheck the current access page immediately before a promotion PR and at each source-refresh cycle. Exclude the record if an operator closes the venue or public access becomes unclear.
