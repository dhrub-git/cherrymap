import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("public/data", { recursive: true });
await cp("data/locations.geojson", "public/data/locations.geojson");

const collection = JSON.parse(await readFile("data/locations.geojson", "utf8"));
const columns = ["id", "name", "suburb", "group", "access", "lastChecked", "source", "longitude", "latitude"];
const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const rows = Array.isArray(collection.features) ? collection.features.map((feature) => {
  const properties = feature.properties ?? {};
  const [longitude = "", latitude = ""] = feature.geometry?.type === "Point" ? feature.geometry.coordinates ?? [] : [];
  return columns.map((column) => escape({ ...properties, longitude, latitude }[column])).join(",");
}) : [];
await writeFile("public/data/locations.csv", `${columns.join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`);
