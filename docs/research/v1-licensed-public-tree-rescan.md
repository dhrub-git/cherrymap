# CherryMap V1 explicitly licensed public-tree source rescan

**Reviewed:** 21 August 2026 (Australia/Sydney)  
**Scope:** Fresh, primary-source-only check for an already openly licensed Greater Sydney public-tree or *Prunus* dataset that can add reviewed public CherryMap locations without a new reuse agreement. No source data, text, or media was republished in this audit.

## Decision

**No new importable source was found.** The only explicitly reusable local-government point inventory returned by the official catalogue is City of Ryde's 2013 public-tree data, but its downloadable attribute table contains only `Height`; it has no taxonomy, public-access status, safe visitor context, or stable tree identifier. It cannot distinguish *Prunus* from other trees.

The other Greater Sydney individual-tree product found is either access-controlled or under a licence that does not permit CherryMap's derived public map. City of Sydney remains the already-approved CC BY 4.0 source documented in [the prior import audit](./v1-source-imports.md#source-coverage-licence-and-attribution); this rescan found no additional source to expand it.

| Official source | Licence / access result | Taxonomy and public-access evidence | V1 result |
| --- | --- | --- | --- |
| [City of Ryde Public Trees 2013](https://data.nsw.gov.au/data/dataset/public-trees-2013) | Catalogue metadata says Creative Commons Attribution and supplies SHP/DBF resources. | The downloaded DBF header has exactly one field: `Height` (numeric). The geometry gives positions but no taxon, site type, access status, or asset identifier. | **Reject.** A coordinate-only tree cannot be classified as blossom-bearing or verified as a safe public location. |
| [Greater Sydney Region Tree Canopy 2022](https://data.nsw.gov.au/data/dataset/greater-sydney-region-tree-canopy-2022) | The official catalogue says access to individual-tree data is limited to Greater Sydney councils, NSW Government staff, and approved contractors; users must request access and sign a Digital Data Deed Poll. The publicly available version is mesh-block summary data. | The product describes aerially derived canopy/vegetation, not botanical species or public visitor access. | **Reject.** It is not an openly reusable individual-tree source and cannot establish *Prunus* or visitor suitability. |
| [Greater Sydney Region Tree Canopy 2024/25](https://www.planningportal.nsw.gov.au/opendata/dataset/greater-sydney-region-tree-canopy-202425) | Official metadata lists CC BY-NC-ND 4.0. Its individual-tree data remains access-controlled; the public canopy files are not a botanical inventory. | It classifies vegetation greater than 3m from imagery; no *Prunus* taxonomy or public-access field is provided. | **Reject.** CC BY-NC-ND does not permit a public derived CherryMap dataset, and the fields are insufficient. |

## Reproduced catalogue and schema evidence

The official [Data.NSW CKAN API](https://data.nsw.gov.au/data/api/3/action/package_search?q=trees&rows=100) returned 233 results for `trees` on the review date. Targeted searches returned zero results for `prunus`, seven for `cherry`, and two for `blossom`; none was a Greater Sydney public *Prunus* inventory. Catalogue search is a discovery check, not proof that no source exists outside the catalogue.

For the Ryde dataset, the official DBF resource was downloaded read-only from the Data.NSW record. Its dBase header reports a 65-byte header and one 20-byte numeric field named `Height`; no other field descriptors occur before the `0x0d` terminator. This independently reproduces the limitation recorded in the earlier source audit. No candidate count is stated because the dataset has no botanical attribute to filter.

## Import rule reaffirmed

Do not use imagery/canopy points, raw coordinates without botanical identity, unlicensed dashboards, or access-controlled extracts to increase the V1 count. A future source is eligible only if its official terms permit public derivative reuse and it supplies enough evidence to review each record for taxonomy, current public access, safe geometry, and source provenance. It must still pass CherryMap's reviewed-data validation before publication.

## Sources

- [Data.NSW Public Trees 2013 metadata and resources](https://data.nsw.gov.au/data/dataset/public-trees-2013)
- [Data.NSW public-tree DBF resource](https://data.nsw.gov.au/data/dataset/f7cd2071-642e-4cac-9d28-d7ddf5635c39/resource/47843888-f9b6-4ae3-ba80-9318ff60a120/download/public-trees-2013.dbf)
- [Data.NSW Greater Sydney Region Tree Canopy 2022 catalogue record](https://data.nsw.gov.au/data/dataset/greater-sydney-region-tree-canopy-2022)
- [NSW Planning Portal Greater Sydney Region Tree Canopy 2024/25 record](https://www.planningportal.nsw.gov.au/opendata/dataset/greater-sydney-region-tree-canopy-202425)
- [City of Sydney CC BY 4.0 source and field audit](./v1-source-imports.md#source-coverage-licence-and-attribution)
