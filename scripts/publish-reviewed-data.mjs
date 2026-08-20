import { cp, mkdir } from "node:fs/promises";

await mkdir("public/data", { recursive: true });
await cp("data/locations.geojson", "public/data/locations.geojson");
