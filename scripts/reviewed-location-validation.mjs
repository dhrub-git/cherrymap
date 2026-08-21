import { representativeCoordinates } from "../src/lib/public-geometry.mjs";
import {
  ACCESS_STATUS_VALUES,
  BLOSSOM_GROUP_LABELS,
  CONFIDENCE_VALUES,
  isHttpsUrl,
  isIsoTimestamp,
  LOCATION_TYPE_VALUES,
  nonEmptyString,
} from "../src/lib/reviewed-location-contract.mjs";

const BLOSSOM_GROUPS = new Set(BLOSSOM_GROUP_LABELS);
const LOCATION_TYPES = new Set(LOCATION_TYPE_VALUES);
const ACCESS_STATUSES = new Set(ACCESS_STATUS_VALUES);
const CONFIDENCE = new Set(CONFIDENCE_VALUES);

function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function geometryPositions(geometry) {
  if (geometry?.type === "Point" && Array.isArray(geometry.coordinates)) return [geometry.coordinates];
  if (geometry?.type === "LineString" && Array.isArray(geometry.coordinates)) return geometry.coordinates;
  if (geometry?.type === "Polygon" && Array.isArray(geometry.coordinates)) return geometry.coordinates.flat();
  return [];
}

export function validateReviewedLocation(feature) {
  const reasons = [];
  const properties = feature?.properties;
  const provenance = properties?.provenance;
  const geometry = feature?.geometry;

  if (feature?.type !== "Feature") reasons.push("not a GeoJSON Feature");
  if (!nonEmptyString(properties?.id)) reasons.push("missing stable ID");
  if (!nonEmptyString(properties?.name)) reasons.push("missing public name");
  if (!nonEmptyString(properties?.suburb)) reasons.push("missing suburb");
  if (!BLOSSOM_GROUPS.has(properties?.group)) reasons.push("invalid blossom group");
  if (!LOCATION_TYPES.has(properties?.locationType)) reasons.push("invalid location type");
  if (!ACCESS_STATUSES.has(properties?.access)) reasons.push("invalid public access status");
  if (!CONFIDENCE.has(properties?.locationConfidence)) reasons.push("invalid identification confidence");
  if (!isCalendarDate(properties?.lastChecked)) reasons.push("invalid last-checked date");
  if (!nonEmptyString(properties?.source)) reasons.push("missing source attribution");
  if (!nonEmptyString(properties?.evidenceSummary)) reasons.push("missing evidence summary");
  if (!nonEmptyString(provenance?.provider)) reasons.push("missing provenance provider");
  if (!isHttpsUrl(provenance?.sourceUrl)) reasons.push("invalid provenance source URL");
  if (!nonEmptyString(provenance?.sourceRecordId)) reasons.push("missing provenance source record ID");
  if (!isIsoTimestamp(provenance?.importedAt)) reasons.push("invalid provenance import timestamp");
  if (!isIsoTimestamp(provenance?.reviewedAt)) reasons.push("invalid provenance review timestamp");
  if (![provenance?.licence, provenance?.reuseBasis].some(nonEmptyString)) reasons.push("missing provenance reuse basis");
  if (properties?.photoUrl !== undefined) {
    if (!isHttpsUrl(properties.photoUrl)) reasons.push("invalid displayable photo URL");
    if (!nonEmptyString(properties.photoCredit)) reasons.push("missing displayable photo credit");
    if (!nonEmptyString(provenance?.licence)) reasons.push("missing displayable photo licence or permission");
  }
  if (JSON.stringify(properties ?? {}).toLowerCase().includes("private residential")) reasons.push("references private residential material");

  const representative = representativeCoordinates(geometry);
  const positions = geometryPositions(geometry);
  if (!representative || !["Point", "LineString", "Polygon"].includes(geometry?.type) || positions.length === 0) {
    reasons.push("invalid supported public geometry");
  } else {
    if (properties?.locationType === "tree" && geometry.type !== "Point") reasons.push("individual trees must use point geometry");
    for (const position of positions) {
      const [longitude, latitude] = Array.isArray(position) ? position : [];
      if (typeof longitude !== "number" || typeof latitude !== "number" || longitude < 150.4 || longitude > 151.5 || latitude < -34.25 || latitude > -33.35) {
        reasons.push("geometry outside Greater Sydney launch bounds");
        break;
      }
    }
  }
  return reasons;
}

export function assessReviewedCollection(collection) {
  if (collection?.type !== "FeatureCollection" || !Array.isArray(collection.features)) {
    return { locationCount: 0, reasons: ["Canonical data is not a GeoJSON FeatureCollection."] };
  }
  if (collection.features.length === 0) return { locationCount: 0, reasons: ["Canonical data has no reviewed public locations."] };

  const ids = collection.features.map((feature) => feature?.properties?.id);
  const idCounts = new Map();
  for (const id of ids) if (typeof id === "string" && id.trim()) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  const invalidFeatureCount = collection.features.filter((feature) => {
    const id = feature?.properties?.id;
    return validateReviewedLocation(feature).length > 0 || idCounts.get(id) !== 1;
  }).length;
  const reasons = [];
  if (invalidFeatureCount) reasons.push(`${invalidFeatureCount} locations fail reviewed-public validation.`);
  if (ids.some((id) => typeof id !== "string" || !id.trim()) || new Set(ids).size !== ids.length) reasons.push("Every published location must have a unique stable ID.");
  return { locationCount: collection.features.length - invalidFeatureCount, reasons };
}
