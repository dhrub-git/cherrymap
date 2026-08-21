# Sydney Blossom Map — Version 1 PRD

**Status:** Ready to build  
**Product:** Sydney Blossom Map  
**Release:** Version 1 — curated public map  
**Date:** 20 August 2026

## 1. Goal

Create a fast, beautiful public website where people can find verified, publicly accessible flowering cherry and related ornamental blossom trees in Greater Sydney.

The first version is deliberately curated and database-free. It publishes a trusted set of locations; it does not attempt to be a live, crowdsourced tree registry.

## 2. Product principles

- Prefer correct, dated information over a large number of uncertain pins.
- Publish only locations that are publicly accessible or safely visible from public land.
- Clearly distinguish cherry, plum, peach, mixed, and unknown flowering trees.
- Never show private household locations.
- Keep the product simple to maintain: source-controlled data, static hosting, and no user accounts.

## 3. Target users

### Visitors

Residents, tourists, families, and photographers who want to find publicly accessible blossom locations and understand what to expect before visiting.

### Curators

The small project team that researches, verifies, updates, and publishes the map data.

## 4. Version 1 scope

Version 1 includes:

- A responsive interactive map covering Greater Sydney.
- At least 100 reviewed public locations.
- Search by suburb, council area, venue, street, and tree name.
- Filters for blossom group, location type, access, photo availability, and last-checked year.
- Map clustering and a keyboard-accessible list view.
- Location detail pages or panels with access, evidence, source attribution, photos where licensed, and last-checked date.
- Clear labels for flowering cherry, flowering plum, flowering peach, mixed ornamental *Prunus*, and uncertain blossom trees.
- Downloadable GeoJSON and CSV files containing the public data.
- A link to an external suggestion form for corrections or new public locations.
- Methodology, privacy, attribution, safety, and correction/removal pages.

## 5. Out of scope

Do not build these in Version 1:

- User accounts, moderator accounts, or an administration console.
- Direct public photo uploads, live bloom reports, or user-generated map edits.
- Private-location storage or blurred household pins.
- A database, backend API, worker queue, or vector-tile server.
- Automated imports, automatic duplicate matching, image recognition, or social-media ingestion.
- Native mobile applications, route planning, saved places, and notifications.

## 6. Location eligibility and privacy

A location can be published only when all of these are true:

1. It is on public land, in a managed venue open to visitors, or safely visible from public land.
2. The location has a reliable source or a curator field check.
3. Its publication does not reveal a private household or encourage unsafe access.
4. Its published photo and source attribution are permitted.

Private homes, rail corridors, operational land, and locations with unclear access are excluded from Version 1.

## 7. Data model

Store the canonical public dataset as `data/locations.geojson`. A CSV export is generated from the same reviewed source data at build time or maintained alongside it.

Each location must include:

- Stable ID
- Public name
- Latitude and longitude for a public location
- Suburb and council area where known
- Location type: `tree`, `row`, `cluster`, or `venue`
- Blossom group
- Scientific name when known
- Identification confidence: `official`, `verified`, `probable`, or `unknown`
- Access status and visitor notes
- Last-checked date
- Source name, URL, and required attribution
- Optional licensed photo URL and credit

Rows, clusters, and venues may use GeoJSON line or polygon geometries. Individual trees use points.

## 8. Public experience

### Home/map

The landing view explains the map in one sentence and opens directly to the map.

Visitors can:

- Search an area or location name.
- Browse the current map area.
- Filter results.
- Switch between map and list views.
- Open a location’s details.
- Download the data.
- Suggest a correction or public location using an external form.

### Location detail

Each location must show:

- Name, location type, suburb, and public position.
- Blossom group and scientific name when known.
- Confidence and plain-language evidence summary.
- Access and safety guidance.
- Last-checked date.
- Source and photo attribution.
- External navigation link.
- A correction/removal link.

Use exact language such as “Last checked 19 August 2026” and “Probably flowering plum.” Do not promise bloom status or call every pink flower “cherry blossom.”

## 9. Content and curation workflow

1. A curator gathers official public inventories and permitted evidence.
2. The curator verifies taxonomy, access, public-safety suitability, and either the source licence/permission or a documented factual reuse basis when no protected source material is republished.
3. The curator updates the checked-in GeoJSON data.
4. A pull request or review records the change.
5. The site is rebuilt and deployed.
6. Suggestions arrive through the external form and are manually reviewed before they enter the dataset.

The first sources are City of Parramatta and City of Sydney public tree inventories. Every published record must retain its source attribution.

## 10. Technical requirements

Use:

- React, TypeScript, and Vite.
- Tailwind CSS and shadcn/ui for the interface.
- MapLibre GL JS for map rendering.
- Static GeoJSON/CSV files as the product dataset.
- Static hosting on Vercel.

Do not use Next.js, a database, Supabase, server-side API routes, or background jobs in Version 1.

The application must:

- Work on current mobile and desktop browsers.
- Load data from local static files.
- Cluster markers at low zoom.
- Preserve search and filter state in the URL.
- Offer keyboard-accessible controls and a list alternative to the map.
- Meet WCAG 2.2 AA for the public interface.
- Never include private coordinates or unpublished material in deployed assets.

## 11. Visual direction

The interface should feel calm, editorial, and botanical rather than like a generic GIS dashboard.

- Use a soft warm-neutral background with restrained blossom accents.
- Use shadcn/ui components for consistent controls, drawers, dialogs, cards, badges, and accessible form elements.
- Use map-marker shapes as well as colour to distinguish trees, rows, clusters, and venues.
- Do not use pink alone to communicate bloom or taxonomy.
- Keep the map primary and the interface uncluttered.

## 12. Acceptance criteria

Version 1 is ready when:

- The public site is deployed on a custom or temporary public domain.
- It contains at least 100 reviewed, public locations.
- Visitors can search, filter, cluster, and inspect locations on mobile and desktop.
- Every published location displays source attribution, confidence, access information, and a last-checked date.
- The map clearly differentiates cherry, plum, peach, mixed, and unknown blossom groups.
- Public GeoJSON and CSV downloads match the visible published dataset.
- No private residential coordinates or unlicensed photos are included.
- The suggestion and removal/correction paths are visible and work.
- Keyboard users can access equivalent location information in list view.

## 13. Future trigger for a database

Introduce a database only when manual curation becomes a bottleneck—for example, when the team needs public uploads, private submission review, live bloom reports, multiple moderators, or automated recurring imports. Those features require secure private storage and a durable moderation workflow.
