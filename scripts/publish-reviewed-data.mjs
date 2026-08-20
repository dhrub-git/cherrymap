import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

const columns = [
  "id", "name", "suburb", "streetAddress", "councilArea", "locationType", "group",
  "scientificName", "commonName", "locationConfidence", "taxonConfidence",
  "access", "visitorNotes", "visitorInfoUrl", "evidenceSummary", "lastChecked", "source",
  "sourceUrl", "licence", "reuseBasis", "photoUrl", "photoCredit", "longitude", "latitude",
];

export function escapeCsv(value) {
  const text = String(value ?? "");
  const safeText = typeof value === "string" && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

function coordinatePair(value) {
  return Array.isArray(value) && value.length >= 2 && value.slice(0, 2).every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate)) ? value.slice(0, 2) : null;
}

function positionsEqual(first, last) {
  return first[0] === last[0] && first[1] === last[1];
}

export function representativeCoordinates(geometry) {
  if (geometry?.type === "Point") return coordinatePair(geometry.coordinates);
  if (geometry?.type === "LineString" && Array.isArray(geometry.coordinates)) {
    if (geometry.coordinates.length < 2) return null;
    const line = geometry.coordinates.map(coordinatePair);
    if (line.some((pair) => !pair)) return null;
    return line[Math.floor(line.length / 2)];
  }
  if (geometry?.type === "Polygon" && Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
    const rings = geometry.coordinates.map((coordinates) => Array.isArray(coordinates) ? coordinates.map(coordinatePair) : []);
    const valid = rings.every((ring) => ring.length >= 4 && ring.every(Boolean) && positionsEqual(ring[0], ring.at(-1)));
    if (!valid) return null;
    const outerRing = rings[0].slice(0, -1);
    return outerRing.reduce((sum, pair) => [sum[0] + pair[0] / outerRing.length, sum[1] + pair[1] / outerRing.length], [0, 0]);
  }
  return null;
}

export function toCsvRow(feature) {
  const properties = feature.properties ?? {};
  const provenance = properties.provenance ?? {};
  const [longitude = "", latitude = ""] = representativeCoordinates(feature.geometry) ?? [];
  const values = {
    ...properties,
    councilArea: properties.councilArea ?? provenance.provider ?? "",
    sourceUrl: provenance.sourceUrl ?? "",
    licence: provenance.licence ?? "",
    reuseBasis: provenance.reuseBasis ?? "",
    longitude,
    latitude,
  };
  return columns.map((column) => escapeCsv(values[column])).join(",");
}

export async function publishReviewedData() {
  await mkdir("public/data", { recursive: true });
  await cp("data/locations.geojson", "public/data/locations.geojson");
  const collection = JSON.parse(await readFile("data/locations.geojson", "utf8"));
  const rows = Array.isArray(collection.features) ? collection.features.map(toCsvRow) : [];
  await writeFile("public/data/locations.csv", `${columns.join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`);
}

if (import.meta.url === `file://${process.argv[1]}`) publishReviewedData();
