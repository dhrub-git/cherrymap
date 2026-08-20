# Version 1 council-source import findings

**Wayfinder context:** [Establish the approved Version 1 source set and import facts (issue #2)](https://github.com/dhrub-git/cherrymap/issues/2)  
**Researched:** 20 August 2026  
**Scope:** Official City of Sydney and City of Parramatta sources only. This document establishes source suitability for a curator-run import that produces reviewed static data; it does not authorise automatic publishing.

## Decision

- **Approved for Version 1 candidate import: City of Sydney `Trees`.** Its official data-hub record identifies the data as City of Sydney tree locations, declares a [CC BY 4.0 licence](https://creativecommons.org/licenses/by/4.0/), and names City of Sydney as the source. CherryMap may use it subject to the licence and the attribution below.
- **Not approved for public republishing yet: City of Parramatta `OpenSpace_PLR_Trees_Data`.** It is a technically suitable public query source, but the service item has no licence or attribution statement. Parramatta's [Terms and Conditions](https://www.cityofparramatta.nsw.gov.au/terms-and-conditions) limit reproduction to personal, in-house, or non-commercial use unless the Council gives written approval; its [Privacy Policy](https://www.cityofparramatta.nsw.gov.au/information/privacy-policy) says commercial reuse is not permitted. Obtain written permission or an explicit open licence before committing derived Parramatta records to the public dataset.

Neither source is a blossom map. Both are candidate inventories; curator taxonomy, public-access, privacy, and data-quality review remain mandatory before a feature is published.

## City of Sydney — approved source

### Source, coverage, licence, and attribution

The official [City of Sydney `Trees` data-hub record](https://data.cityofsydney.nsw.gov.au/api/search/v1/collections/dataset/items/15c4713a688a48fcb604fc343118af05_0) describes tree locations in the local area and identifies the fields as tree type, species, common name, height, canopy, status, age, and DBH. It is a public, authoritative City record with an explicit **CC BY 4.0** licence and `City of Sydney` access information. The Council's [open-data guidance](https://www.cityofsydney.nsw.gov.au/library-information-services/access-open-data) also says its data hub supports downloading data and programmatic access, and that data is normally published under Creative Commons licences unless otherwise stated.

The actual [FeatureServer](https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer) says it contains only **park and street trees** in the City asset register. Its current source description calls it a live (not static) service. A 20 August 2026 read-only count query returned 49,556 trees; this is an observed snapshot, not a City-published total.

**Required public attribution:** `Tree data: City of Sydney, CC BY 4.0` linked to the City data-hub record and the CC BY 4.0 licence. Retain the original source URL in every imported location. Do not imply City endorsement.

### Access and import interface

- **Layer:** [`Trees/FeatureServer/0`](https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer/0), point geometry, GDA2020 / MGA zone 56 (`WKID 7856`).
- **Capabilities:** anonymous read-only `Query, Extract`; supports query output as JSON, GeoJSON, or PBF and service export as CSV, GeoJSON, GeoPackage, Shapefile, FileGDB, KML, SQLite, or Excel, per the [service metadata](https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer?f=pjson).
- **Pagination:** the layer advertises pagination and has a `maxRecordCount` of **2,000**. Import with a stable sort by `OBJECTID` and `resultOffset` / `resultRecordCount`; do not assume one response contains the inventory.
- **Stable source key:** use `asset_id` when supplied, scoped to `city-of-sydney`; retain `OBJECTID` as the service row identifier but do not treat it as a cross-provider identifier.

The practical broad taxonomy filter is `SpeciesName LIKE 'Prunus%'`. A read-only count on 20 August 2026 returned 21 rows. It returned `Prunus cerasifera`, `Prunus cerasifera Nigra`, `Prunus x blireana`, and unspecified `Prunus sp.` rows, so this is explicitly a *mixed ornamental Prunus candidate set*, not evidence that every row is a flowering cherry.

### Fields to retain and fields to derive

The [layer schema](https://services1.arcgis.com/cNVyNtjGVZybOQWZ/arcgis/rest/services/Trees/FeatureServer/0?f=pjson) provides these import-relevant fields:

| CherryMap purpose | Official field |
| --- | --- |
| Source identifiers | `asset_id`, `OBJECTID` |
| Taxonomy/display | `SpeciesName`, `CommonName` |
| Public-land context | `TreeType` (`Street Tree` or `Park Tree`) |
| Candidate quality | `Tree_Status`, `Tree_Age`, `TreeHeight`, `TreeCanopyNS`, `DBH_in_cm` |
| Position | Point geometry (reproject from WKID 7856 to WGS84 for public GeoJSON) |

Do not invent a blossom group from common name alone. Map the scientific name to a controlled CherryMap blossom group only after curator review; otherwise use `mixed ornamental Prunus` or `uncertain blossom`. The source does not supply access instructions, visitor-safe names, bloom timing, photo rights, or an address/suburb field, so those must be separately curated.

## City of Parramatta — technically viable, publication gated

### Source and scope

The populated Council service is [`OpenSpace_PLR_Trees_Data/FeatureServer/0`](https://services6.arcgis.com/NrOjMi9LSYL3MUze/ArcGIS/rest/services/OpenSpace_PLR_Trees_Data/FeatureServer/0), linked to its [ArcGIS item](https://www.arcgis.com/home/item.html?id=f04183ba1d524d04aa20ee6655bb083c). It is a public point layer in WGS84. The Council says it manages about 52,000 public trees across parks, reserves, bushland, streets, and nature strips in its [public-tree maintenance guidance](https://www.cityofparramatta.nsw.gov.au/environment/trees/trees-on-public-land/public-tree-maintenance). The service is a broad inventory, not a blossom-only source.

The layer's data-last-edited timestamp is 21 August 2024. A read-only count query on 20 August 2026 returned 66,195 rows, including 1,375 with `Genus='Prunus'` and 1,194 with `Genus='Prunus' AND Status='Current' AND Site_Type<>'Private'`. These are observed endpoint snapshots, not Council-published counts; the 2024 edit date means freshness must be recorded as a source limitation.

### Access and import facts

- **Capabilities:** anonymous `Query`, with GeoJSON query output and service exports such as CSV, GeoJSON, GeoPackage, Shapefile, and FileGDB; the [service metadata](https://services6.arcgis.com/NrOjMi9LSYL3MUze/ArcGIS/rest/services/OpenSpace_PLR_Trees_Data/FeatureServer?f=pjson) sets a **2,000-record** maximum response size.
- **Pagination:** request `f=geojson`, sort by `OBJECTID_1`, and page using `resultOffset` / `resultRecordCount`. The layer advertises pagination; importers must continue until the result page is empty rather than relying on a count snapshot.
- **Candidate filter:** start with `Genus='Prunus' AND Status='Current' AND Site_Type<>'Private'`; then apply a strict allowlist of known public site types and curator access review. The inequality alone is insufficient, because `Site_Type` also includes non-visitor contexts.
- **Keys and fields:** retain provider-scoped `GlobalID` and `TreeID` / `OBJECTID_1`; taxonomic fields include `Genus`, `Species`, `Cultivar`, `Botanic_N`, `Common_N`, `CommonName`, and `Family`. Useful review fields are `Status`, `Site_Type`, `Street`, `Suburb`, `ParkName`, `Program`, `Condition`, `Plant_Year`, and `Date_Planted`. Coordinates are available in the geometry and `Latitude` / `Longitude`.

Do not copy raw `Nominal_Address`, notes, maintenance, cost, or other nonessential fields into CherryMap. Exclude `Private`, non-current, removed, historical, vacant, operational, or otherwise unclear-access records. `Prunus` candidates include plum and peach entries and unspecified taxa, so taxonomy and the visitor-facing blossom group still need manual review.

### Reuse gate and reliability constraint

The service item has blank `licenseInfo`, `accessInformation`, description, and attribution fields. Public access alone is not an explicit licence to republish a derived public dataset. Seek a written confirmation that CherryMap may publish the selected data, including a required attribution statement, before enabling this importer in a release.

The Council's [disclaimer](https://www.cityofparramatta.nsw.gov.au/information-pages/disclaimer) says its material may be incomplete or inaccurate and disclaims reliability. Treat all imported geometry and attributes as leads to review, not proof of safe public access or botanical identity.

## Common Version 1 importer rules

1. Run only from a curator-triggered workflow. Fetch source metadata first; fail the run if the service, fields, licence, or expected layer changes.
2. Query selected fields only, page below the provider limit, retain source ID + fetch date + source URL, and keep the untouched raw extract out of the deployed site.
3. Use `Prunus` as candidate selection, not final classification. Only publish records whose identity, current status, public access, and safe public geometry are reviewed.
4. Publish the smallest approved set of fields in `data/locations.geojson`; every record must retain the provider name, direct source URL, attribution, last checked date, and confidence.
5. Never deploy raw addresses, private-site rows, maintenance data, unlicensed source photos, or unreviewed source extracts. The static site must contain public data only.
6. Write the import result to a reviewable pull request. Since neither service promises a stable schema or freshness cadence, a curator must inspect the diff before deployment.

## Recommendation for the initial source set

1. Implement a **City of Sydney candidate importer** first, filtered to `Prunus` and reviewed before merge. It is legally usable under CC BY 4.0 and demonstrates the curator/import/static-publication flow.
2. Keep a **City of Parramatta importer in research-only mode**. It may create a local review report but must not generate or publish derivative public GeoJSON until written reuse permission or an explicit open licence is recorded in the repository.
3. Supplement both with manually verified public venues where a structured source does not establish visitor-safe access or location naming. This is necessary to reach the Version 1 quality bar; neither inventory supplies a complete visitor experience.

