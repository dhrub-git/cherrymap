# CherryMap V1 additional source audit

**Reviewed:** 21 August 2026  
**Scope:** Official Greater Sydney public-tree inventories beyond the approved City of Sydney Trees dataset. City of Parramatta remains excluded because no explicit reuse licence was found.

## Decision

No additional source reviewed here currently satisfies all CherryMap V1 gates:

1. individual tree locations;
2. usable Prunus taxonomy;
3. evidence that the tree is on public land or publicly accessible;
4. a supported download or query method; and
5. explicit permission to republish the records in CherryMap.

The current reviewed dataset therefore remains at 21 City of Sydney records. The 100-location target cannot be reached safely from the additional official sources identified in this audit without first obtaining written reuse permission or changing the launch target.

Ku-ring-gai's public dashboard has 64 Prunus records, but its published copyright terms prohibit republication without permission. Even if permission were obtained, 21 + 64 would produce only 85 records. North Sydney is the strongest candidate for closing the remaining gap: its official material indicates that Flowering Plum represented 1.6% of its street-tree inventory in 2013, while Council now reports more than 17,000 street trees. That suggests hundreds of candidate trees, but it is an inference from an old proportion—not a verified current query—and the mapping terms do not permit republication.

## Gate summary

| Source | Geographic and public-land fit | Taxonomy and count evidence | API or download | Reuse permission | V1 decision |
|---|---|---|---|---|---|
| City of Ryde Public Trees 2013 | Ryde LGA; tree locations | 24,100 records, but only a `Height` attribute; no species or genus | Data.NSW SHP/DBF download | Creative Commons Attribution | Reject: impossible to identify Prunus |
| Ku-ring-gai public tree dashboard | Streets, parks and other public spaces in Ku-ring-gai | 61,755 trees; 64 Prunus records observed | Public GeoJSON | Council terms require express written permission to republish | Permission-gated |
| North Sydney street-tree database | More than 17,000 street trees on public land | GIS database includes species; 2013 strategy reported Flowering Plum at 1.6% | Public web map, but no supported export found | Map terms allow viewing/printing only and reserve other rights | Permission-gated; highest likely yield |
| Lane Cove TreePlotter | Council street-tree inventory | Species, age, health and condition are exposed in the explorer; no verified Prunus count | Public TreePlotter interface; no supported export/API documented | No explicit open-data licence; third-party platform rights also apply | Permission-gated |
| CBCity Public Tree Explorer | Street and park trees in Canterbury-Bankstown | Explorer supports species filtering; no verified Prunus count | Power BI interface; no reusable API/export documented | No explicit republication licence found | Permission-gated |
| Royal Botanic Garden Sydney Garden Explorer | Public garden, but some collection locations may not be visitor-accessible | Accession-level taxonomy and locations, including Prunus | Public explorer; no supported bulk API identified | Living-collection data access requires an agreement | Permission-gated |
| Centennial Parklands Plant Explorer | Public park collection | 9,229 plants and 243 taxa shown; no Prunus genus in the current selector | Public explorer; no supported bulk API identified | Government site CC BY terms exclude third-party material such as the explorer | Reject |
| Hornsby remnant trees | Hornsby LGA vegetation stands, not an ornamental street-tree inventory | 1,435 mapped native remnant-tree stands; no useful Prunus inventory | Data.NSW download | Creative Commons Attribution | Reject: wrong feature type and taxonomy |
| City of Sydney Significant Trees register | Sydney LGA; fields distinguish public, private and access status | Strong species/access schema; query found no Prunus/cherry/peach and two common-name matches for “plum” | ArcGIS FeatureServer | ArcGIS item has no licence or attribution statement | Reject |
| Auburn Botanic Gardens | Public garden with cherry blossom groves | No individual-tree inventory found | No machine-readable inventory found | No explicit dataset licence found | Reject for inventory seeding; possible venue-level manual entry only |
| City of Canada Bay tree programs | Greater Sydney public planting programs | Plans and planting information, not a current individual-tree inventory | No suitable current inventory/API found | No explicit dataset licence found | Reject |

## Source findings

### City of Ryde Public Trees 2013 — licensed but unusable

The official [Data.NSW dataset page](https://data.nsw.gov.au/data/dataset/public-trees-2013) identifies City of Ryde as the publisher and applies a Creative Commons Attribution licence. The [CKAN package metadata](https://data.nsw.gov.au/data/api/3/action/package_show?id=public-trees-2013) exposes the downloadable shapefile components.

The DBF contains 24,100 records, but its only data field is `Height`. There is no genus, scientific name, common name or stable tree identifier. Coordinates can locate trees, but the data cannot distinguish Prunus from any other genus. It must not be used to seed CherryMap.

If reused for a different purpose, attribution would need to identify City of Ryde, link to the source, and link to the stated Creative Commons Attribution licence.

### Ku-ring-gai public tree dashboard — 64 candidates, permission required

Ku-ring-gai Council links its [public tree dashboard](https://trees.krg.nsw.gov.au/) from the official [Trees page](https://www.krg.nsw.gov.au/Environment/Your-local-environment/Trees). The dashboard describes trees in streets, parks and other public spaces. Its public GeoJSON is available at:

`https://trees.krg.nsw.gov.au/storage/data/kuringai/kuringai_trees.geojson`

The file contained 61,755 features when checked. Its fields include geometry, an asset identifier, genus (`g`) and species (`sp`). A case-insensitive query across taxonomy values found 64 Prunus/cherry/plum/peach candidates; the matched records were represented as genus `Prunus` with species values.

This is technically suitable source data, but not legally reusable under the currently published terms. Council's [Copyright page](https://www.krg.nsw.gov.au/Council/Information-pages/Copyright) limits material to personal use and says it must not be copied, reproduced or republished without express written permission. CherryMap must not ingest or publish these records unless Council grants permission. Required attribution should be agreed with Council rather than inferred.

The dashboard's collection scope is public space, but the data does not provide a plainly decoded per-tree visitor-access field. Curators should still exclude any record found to be inaccessible, behind a boundary, or otherwise unsuitable for public visitation.

### North Sydney street-tree database — strongest quantity candidate, permission required

North Sydney Council's [Trees on public land page](https://www.northsydney.nsw.gov.au/trees/trees-public-land) reports more than 17,000 street trees, in addition to trees in parks and reserves. Its official [Street Tree Strategy](https://www.northsydney.nsw.gov.au/downloads/file/139/street-tree-strategy) describes a GIS database with individual location, species, size, age, health and condition. The strategy reported Flowering Plum (`Prunus cerasifera 'Nigra'`) as 1.6% of street trees in 2013.

Applying that historical percentage to the currently reported total would suggest approximately 272 trees. This is useful for prioritising a permission request, but it is not a verified current count and must not be presented as inventory data.

Council provides an [online map](https://webmaps.northsydney.nsw.gov.au/SISWebMap9/map.aspx?mapname=NSCMAPS), but no supported dataset export or public query API was identified. The map terms grant viewing and printing only and reserve other rights. Council's [general copyright terms](https://www.northsydney.nsw.gov.au/council/copyright/print) also do not grant the retransmission and public distribution CherryMap needs. Written permission and a supported data extract are required.

### Lane Cove TreePlotter — useful schema, permission required

Lane Cove Council's [Tree Plotter page](https://www.lanecove.nsw.gov.au/Environment-Sustainability/Tree-Management/Trees-on-Council-Land/Tree-Plotter) describes a comprehensive street-tree inventory containing species, age, health, condition and mapped distribution. It links to the public [Lane Cove TreePlotter](https://au.pg-cloud.com/LaneCoveNSW/).

The explorer exposes species-oriented fields, but no documented public bulk API or export suitable for a repeatable import was found. CherryMap should not treat reverse-engineered TreePlotter requests as a supported API.

Council's [Disclaimer and Copyright page](https://www.lanecove.nsw.gov.au/Site-Footer/Sub-Footer-Links/Disclaimer-Copyright/Disclaimer-Copyright) does not provide an open licence for modifying and publicly republishing the inventory, and the TreePlotter platform may contain third-party rights. A supported extract and explicit written permission are required.

### CBCity Public Tree Explorer — strong public-tree scope, no reuse grant

Canterbury-Bankstown's official [Urban forest page](https://www.cbcity.nsw.gov.au/residents/trees-garden-and-home/urban-forest) says the CBCity Public Tree Explorer includes street and park trees, supports filtering by species, is refreshed daily from Council's Tree Management System, and is still being populated.

The explorer is delivered through Power BI. No documented reusable API, bulk export, explicit dataset licence, or republication permission was identified. CherryMap should not scrape the Power BI report. Council permission should include a supported extract or API and the exact attribution wording.

### Royal Botanic Garden Sydney Garden Explorer — access agreement required

The official [Garden Explorer page](https://www.botanicgardens.org.au/royal-botanic-garden-sydney/garden-highlights/garden-explorer) links to the [Royal Botanic Garden Sydney Garden Explorer](https://rbgsydney.gardenexplorer.org/). It provides accession-level taxonomy and mapped collection locations; for example, it lists [Prunus persica 'Atropurpurea'](https://rbgsydney.gardenexplorer.org/taxon-80673.aspx).

The organisation's [Living Collection enquiry page](https://www.botanicgardens.org.au/living-collection-enquiry-form) says access to living-collection data and images requires a Plant Sharing Agreement. No explicit open reuse licence for the Garden Explorer inventory was found. The Creative Commons terms applied to other Botanic Gardens datasets, such as PlantNET, must not be assumed to cover this living collection.

Even if permission is granted, mapped accessions require a visitor-access review. A plant inside a public garden is not automatically accessible during all hours or from public paths.

### Centennial Parklands Plant Explorer — third-party rights and no Prunus result

The [Centennial Parklands Plant Explorer](https://centennialparklands.gardenexplorer.org/default.aspx) displayed 9,229 plants and 243 taxa when reviewed. Its current genus selector did not include Prunus.

Greater Sydney Parklands' [Copyright page](https://www.greatersydneyparklands.nsw.gov.au/copyright) generally licenses its own website material under CC BY 4.0 but expressly excludes third-party intellectual property. The Plant Explorer is hosted on the third-party `gardenexplorer.org` domain, and no inventory-specific licence was found. It therefore cannot be treated as CC BY source data.

### Hornsby remnant trees — licensed, wrong dataset type

The official [Data.NSW Hornsby remnant trees dataset](https://data.nsw.gov.au/data/dataset/hornsby-local-government-area-remnant-trees-2008-vis_id-4472) is openly licensed, but it maps native remnant-tree stands rather than individual ornamental street or park trees. It lacks the feature-level taxonomy and visitor-access evidence needed for CherryMap and provides no useful Prunus candidates.

### City of Sydney Significant Trees register — good access schema, no licence or useful count

The official [Register of Significant Trees map](https://map-prod2.cityofsydney.nsw.gov.au/agol_html/RegisterOfSignificantTrees2025/index.html) uses an [ArcGIS view item](https://www.arcgis.com/home/item.html?id=33ac8e933ce34b22b8d77aa1f49beeda) and [FeatureServer layer](https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Register_of_Significant_Trees_view/FeatureServer/0).

The layer has useful fields for species, common name, land use, accessibility, asset ID and status. Its access values distinguish public access, visible from the street and no public access. However, the ArcGIS item contains no `licenseInfo` or `accessInformation`. A query found no Prunus, cherry or peach records and only two common-name matches for “plum”. This source neither solves the quantity gap nor has explicit republication permission.

### Venue and planting-plan sources — not individual inventories

[Auburn Botanic Gardens](https://www.cumberland.nsw.gov.au/auburn-botanic-gardens) is a public venue with known cherry blossom groves, but no official machine-readable individual-tree inventory or dataset licence was found. It may support one manually curated venue-level location, subject to the existing CherryMap location rules, but it cannot justify creating one record per tree.

The [City of Canada Bay tree program](https://collaborate.canadabay.nsw.gov.au/trees) publishes planting plans and community information rather than a current, licensed individual-tree inventory. Planned plantings must not be represented as confirmed current trees.

## Privacy and access exclusions

Permission to reuse a dataset would not remove CherryMap's curation obligations. Any future import from these sources should:

- include only trees confirmed as street trees, park trees, public-garden accessions or other publicly accessible assets;
- exclude private-property records, residential inventory fields, “no public access” records and sensitive operational notes;
- treat “visible from street” as insufficient unless the V1 policy explicitly permits viewing-only locations;
- avoid publishing owner, resident, inspection-note or contact fields even if present in a source extract;
- avoid reusing photographs unless the image itself has an explicit compatible licence;
- preserve source organisation, source URL, source record ID, licence/permission reference and retrieval date for every imported record; and
- run a curator review before publication because public-land classification does not guarantee safe pedestrian access.

## Recommended path to 100

1. **Request North Sydney data and permission first.** Ask for a current extract or supported query method containing coordinates, scientific/common name, asset ID, public-land class and access status. Its published inventory size and historical species share make it the source most likely to contribute more than 79 eligible records by itself.
2. **Request Ku-ring-gai permission in parallel.** Its 64 Prunus records are already technically queryable and could bring the reviewed total from 21 to 85, subject to access review.
3. **Request CBCity and Lane Cove extracts if North Sydney cannot license the data.** Both have relevant public-tree systems, but neither currently exposes a licensed supported import path.
4. **Use Royal Botanic Garden Sydney only as a curated supplement.** Seek the required agreement and confirm visitor access for each accession.
5. **If permission is not available before launch, retain the 21 verified records or revise the target.** Do not replace exact licensed records with unverified venue estimates or prohibited scraped data.

Each permission request should explicitly ask whether CherryMap may:

- download and transform the supplied records;
- publish a derived static GeoJSON/JSON/CSV file in a public GitHub repository and public website;
- retain stable source identifiers and coordinates;
- use the data in a service that may later have commercial support; and
- refresh the dataset periodically.

The response should also specify required attribution, licence or permission wording, permitted fields, update frequency, endpoint/export method, and any records or locations that must be excluded. Permission evidence should be retained in the repository before an importer is approved.
