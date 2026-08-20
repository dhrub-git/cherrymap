# CherryMap context

## Releases

### Version 1

A curated, static public blossom map. It contains only reviewed, publicly accessible locations and is published from source-controlled data. It does not accept in-product submissions or provide live bloom reporting.

### Version 2

The moderated community extension of CherryMap. It accepts public location suggestions, corrections, photographs, and time-limited bloom reports, while keeping every submission private until moderation.

## Core concepts

### Location

A publicly publishable place containing one or more ornamental blossom trees. A Location may represent a tree, row, cluster, or venue.

### Bloom report

A dated observation of a Location's flowering stage. It is temporary information and must cease to be presented as current after its validity period.

### Curator

A person who researches and publishes Version 1 Location data.

### Moderator

A trusted person who decides whether a Version 2 community submission can become public.

### Anonymous submission

A Version 2 location suggestion, correction, photo, or bloom report made without an account. It is private by default and cannot become public without a Moderator's approval.

### Private residential tree

A tree located on, or whose publication would identify, a private home. Private residential trees are out of scope for both releases and must not be collected or published.

### Greater Sydney

The sole geographic scope for the initial Version 1 launch. Day-trip destinations are a later collection, not part of the launch map.

### Blossom group

The visitor-facing classification for a Location: flowering cherry, flowering plum, flowering peach, mixed ornamental *Prunus*, or uncertain blossom. Version 1 shows all Blossom groups by default and makes the group explicit rather than calling every pink flower cherry blossom.

### Seed data

The initial reviewed Location dataset. Version 1 seeds it as broadly as permitted from structured public sources, beginning with City of Parramatta and City of Sydney inventories, then adds manually verified public venues.

### Source import

A curator-run build step that reads permitted council APIs and produces reviewed static Location data. Source import is not a public CherryMap API and does not make the public site database-backed.

### Curated import

A Source import manually triggered by a Curator. It is reviewed before its output is deployed to the public map; Version 1 does not schedule automatic refreshes.

### Displayable photo

Media that CherryMap created or has an explicit licence or permission to display. Publicly accessible media is not automatically Displayable photo.

### Map-first finder

The selected Version 1 visitor experience. The map is the primary surface, with immediate search, lightweight filters, and a compact results sheet that lets visitors compare nearby Locations without leaving the map.

### Candidate record

A Location record produced by a Source import but not yet eligible for the public map. A Curator must explicitly promote it after taxonomy, access, privacy, and attribution review.

### Reviewed dataset

The source-controlled `data/locations.geojson` file. It is the sole public Location source of truth for Version 1 and supports every public geometry type. Public CSV is generated from this dataset.

### Source refresh

A manually triggered import that produces Candidate records and a change report. It must not automatically update the Reviewed dataset; a Curator explicitly accepts every public change.

### Provenance

The source URL, provider-scoped source record ID, licence, import date, and curator review date retained with every published Location. Provenance is required for Version 1 publication.

### Curator promotion

The act of accepting a Candidate record or correction into the Reviewed dataset through a GitHub pull request with at least one review before it is merged into `main`.

### Publication path

The only Version 1 path from source data to public information: Source refresh, Candidate record, Curator promotion through reviewed pull request, merge to `main`, then Cloudflare Pages automatically rebuilds and deploys the static site.
