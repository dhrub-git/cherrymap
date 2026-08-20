# Reviewed static-data workflow

`data/locations.geojson` is CherryMap's canonical reviewed dataset. The build copies it into `public/data/locations.geojson`; nobody edits the public output directly.

Run `npm run import:city-sydney` to create a dated local candidate file and report under `data/candidates/`. Candidate files are ignored by Git so an import cannot accidentally become a public deployment.

A curator must inspect each candidate's taxonomy, access, privacy, attribution, and evidence before adding a separately reviewed Location to `data/locations.geojson` through a pull request.
