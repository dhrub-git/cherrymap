import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

const columns = ["id", "name", "suburb", "group", "access", "lastChecked", "source", "longitude", "latitude"];

export function escapeCsv(value) {
  const text = String(value ?? "");
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export async function publishReviewedData() {
  await mkdir("public/data", { recursive: true });
  await cp("data/locations.geojson", "public/data/locations.geojson");
  const collection = JSON.parse(await readFile("data/locations.geojson", "utf8"));
  const rows = Array.isArray(collection.features) ? collection.features.map((feature) => {
    const properties = feature.properties ?? {};
    const [longitude = "", latitude = ""] = feature.geometry?.type === "Point" ? feature.geometry.coordinates ?? [] : [];
    return columns.map((column) => escapeCsv({ ...properties, longitude, latitude }[column])).join(",");
  }) : [];
  await writeFile("public/data/locations.csv", `${columns.join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`);
}

if (import.meta.url === `file://${process.argv[1]}`) publishReviewedData();
