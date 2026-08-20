# Version 1 static hosting and map tiles

**Context:** [Choose the Version 1 static host and map-tile provider](https://github.com/dhrub-git/cherrymap/issues/3)

**Research date:** 2026-08-20  
**Scope:** a public, database-free V1: Vite/React application, MapLibre GL JS,
curated static GeoJSON, and manual source-import runs. This is a decision note,
not a deployment change.

## Decision recommendation

Use **Cloudflare Pages deployed from GitHub** for V1, and use
**OpenFreeMap's `liberty` MapLibre style** for the initial basemap.

Cloudflare Pages adds one account/integration but is still static hosting (no
server or database), has free/unlimited static-asset requests on its documented
plans, and does not carry GitHub Pages' stated business/SaaS restriction.
OpenFreeMap supplies a MapLibre-ready style without registration or an API key.
Keep the tile style URL in one configuration constant and preserve the visible
attribution control. Before any commercial launch with an availability
commitment, revisit the tile-provider choice and move to a paid provider
(Stadia Maps Starter or MapTiler Flex are documented fallbacks).

## Static host comparison

| Option | Verified fit | Costs / limits relevant to V1 | Decision |
| --- | --- | --- | --- |
| **Cloudflare Pages** | Supports static sites and GitHub integration, with preview deployments. Static asset requests are free and unlimited on its documented plans. | Free plan: 500 builds/month, 20,000 files/site, 25 MiB maximum per asset, one concurrent build. Git integration auto-deploys on pushes by default, though automatic branch deployments can be disabled. A Git-integrated Pages project cannot later be switched to Direct Upload. | **Choose for V1.** One small setup step and a Vite build command/output directory; no runtime, database, or paid hosting is required. Connect only this repository. Trigger a deployment only after the curator manually runs and reviews an import. |
| **GitHub Pages** | Available to public repositories on GitHub Free. GitHub Actions supports a custom build/deploy workflow, so Vite's `dist/` can be published rather than committing built files. | Recommended repository/site size is 1 GB; published sites have a 1 GB limit; soft bandwidth limit is 100 GB/month; deployments have a 10-minute timeout. It is not permitted as free hosting for a site primarily facilitating commercial transactions or SaaS. | **Viable low-setup alternative.** Use if avoiding a Cloudflare account matters more than the documented business restriction and smaller delivery envelope. |
| **Netlify Free / Vercel Hobby** | Both can host a Vite static build. | Netlify's current Free plan uses a hard monthly credit allowance and pauses at its limit; Vercel Hobby is for personal/non-commercial use and can pause when included usage is exceeded. | **Do not choose for V1.** Neither is simpler or a clearer public-product path than Cloudflare Pages. |

### Hosting sources

- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages pricing for static assets](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)

## Map-tile comparison

| Option | Verified fit | Terms, attribution, and budget | Decision |
| --- | --- | --- | --- |
| **OpenFreeMap public instance** | Provides public, MapLibre-compatible styles; its quick start gives `https://tiles.openfreemap.org/styles/liberty`. Its source repository says the public instance is free, has no request/view limits, registration, API keys, cookies, or user database. | OpenFreeMap states that MapLibre automatically adds attribution. Its stated attribution is `OpenFreeMap © OpenMapTiles Data from OpenStreetMap`; OpenStreetMap independently requires visible credit and clear ODbL availability. The service is donation-funded, and its published status describes two web hosts with round-robin DNS, not an SLA. | **Choose for V1.** No key, no account, no billing, and a suitable simple basemap. Treat it as a launch convenience, not a guaranteed dependency; retain the configurable style URL and a visible attribution control. |
| **Stadia Maps** | Provides MapLibre integration instructions and domain/key authentication. | The documented free allocation is $0/200,000 credits per month for non-commercial use; ordinary basemap tiles cost one credit. Its documented paid Starter plan is US$20/month for 1 million credits and commercial use. The provider documents a 429 response at the monthly free limit and specific attribution. | **Preferred paid fallback.** Use if OpenFreeMap has persistent availability problems, a commercial plan is needed, or support/budget control becomes necessary. Use domain authentication and keep the key out of source control. |
| **MapTiler Cloud** | Supports vector and XYZ raster tiles, including use with third-party SDKs such as MapLibre. | Free plan is for non-commercial use/research and development only. Its pricing page describes a limited request quota and the terms say service beyond plan limits may be suspended; its pricing FAQ says Free service pauses until the next month when quota is exhausted. The currently displayed Flex entry is US$30/month and permits commercial use; Flex overages are billed monthly. MapTiler branding is required on Free. | **Alternative paid fallback.** Use when CherryMap needs MapTiler-specific services. Do not rely on the free tier for a commercial public launch. |
| **OpenStreetMap standard tile service** | MapLibre can technically display raster tiles, but this is not a recommended general-purpose basemap provider choice for a public product. | OSM's data attribution rules still apply. This research did not select it because V1 needs vector tiles/styles for MapLibre and the project does not need to create a separate policy exception or capacity assessment. | **Do not use for V1.** OpenFreeMap is the simpler MapLibre-ready choice. |

### Tile sources

- [OpenFreeMap quick start](https://openfreemap.org/quick_start/)
- [OpenFreeMap source README and attribution](https://github.com/hyperknot/openfreemap/blob/main/README.md)
- [OpenFreeMap terms](https://openfreemap.org/tos/)
- [Stadia Maps pricing](https://stadiamaps.com/pricing)
- [Stadia Maps limits](https://docs.stadiamaps.com/limits/)
- [Stadia Maps MapLibre guide](https://docs.stadiamaps.com/tutorials/vector-maps-with-maplibre-gl-js/)
- [Stadia Maps attribution](https://docs.stadiamaps.com/attribution/)
- [MapTiler Cloud pricing](https://www.maptiler.com/cloud/pricing/)
- [MapTiler Cloud terms](https://www.maptiler.com/terms/cloud/)
- [OpenStreetMap copyright and attribution requirements](https://www.openstreetmap.org/copyright/)

## Implementation guardrails for the eventual build

1. Use the OpenFreeMap style URL only as a basemap configuration value; do not
   bake provider URLs throughout UI components.
2. Leave MapLibre attribution enabled and do not cover it with controls. Add an
   accessible attribution/credits link in the site footer that includes the
   provider and OpenStreetMap copyright link.
3. Do not add geocoding, routing, satellite imagery, or static-map APIs in V1.
   They are not necessary for curated-point discovery and each changes provider
   cost/terms.
4. Track two metrics after launch: GitHub Pages bandwidth and tile-provider
   availability/errors. There is no evidence here of expected CherryMap traffic,
   so neither free-tier capacity nor ongoing zero cost is guaranteed.
5. Re-open this decision before commercialisation, a sponsorship/advertising
   model, an uptime promise, or persistent tile failures. The likely next choice
   is Stadia Maps Starter (or MapTiler Flex) for paid tiles.

## Uncertainties

- Provider pricing, quotas, and terms are changeable. The figures above are
  provider-published pages checked on 2026-08-20, not a price guarantee.
- No traffic forecast, custom-domain requirement, or commercial model has been
  decided. Those facts can change the appropriate host/tile provider.
- OpenFreeMap publishes its free/no-limit public-instance position, but does
  not publish a service-level agreement in the sources reviewed. The absence of
  an SLA is an inference from the reviewed material, not a guarantee that no
  separate commitment exists.
