import { locationTypeValues } from "@/lib/location-types";
import { representativeCoordinates } from "@/lib/public-geometry.mjs";
import {
  ACCESS_STATUS_VALUES,
  BLOSSOM_GROUP_LABELS,
  CONFIDENCE_VALUES,
  isHttpsUrl,
  isIsoTimestamp,
  nonEmptyString,
} from "@/lib/reviewed-location-contract.mjs";
import type { Geometry } from "geojson";
import type {
  AccessStatus,
  Location,
  LocationConfidence,
  LocationFilters,
  LocationProvenance,
  LocationType,
} from "@/types/location";

const knownGroups = new Set<string>(BLOSSOM_GROUP_LABELS);
const accessStatuses = new Set<AccessStatus>(ACCESS_STATUS_VALUES as readonly AccessStatus[]);
const confidenceValues = new Set<LocationConfidence>(CONFIDENCE_VALUES as readonly LocationConfidence[]);

export async function loadLocations(): Promise<Location[]> {
  const response = await fetch("/data/locations.geojson");
  if (!response.ok) throw new Error("The map data could not be loaded.");
  const value = await response.json();
  const locations = parseLocations(value);
  if (isRecord(value) && Array.isArray(value.features) && locations.length !== value.features.length) {
    throw new Error("The reviewed map data is invalid.");
  }
  return locations;
}

export function parseLocations(value: unknown): Location[] {
  if (!isRecord(value) || !Array.isArray(value.features)) return [];
  const locations = value.features.flatMap((feature) => {
    if (!isRecord(feature) || !isRecord(feature.properties) || !isRecord(feature.geometry)) return [];
    const { properties, geometry } = feature;
    const coordinates = representativeCoordinates(geometry);
    if (!coordinates) return [];
    if (typeof properties.id !== "string" || typeof properties.name !== "string" || typeof properties.suburb !== "string" || typeof properties.group !== "string" || !knownGroups.has(properties.group)) return [];
    if (!locationTypeValues.has(properties.locationType as LocationType) || !accessStatuses.has(properties.access as AccessStatus)) return [];
    if (!confidenceValues.has(properties.locationConfidence as LocationConfidence)) return [];
    if (typeof properties.lastChecked !== "string" || typeof properties.source !== "string" || typeof properties.evidenceSummary !== "string") return [];
    const provenance = parseProvenance(properties.provenance);
    if (!provenance) return [];
    return [{
      id: properties.id,
      name: properties.name,
      suburb: properties.suburb,
      streetAddress: stringValue(properties.streetAddress),
      councilArea: stringValue(properties.councilArea) ?? provenance.provider,
      group: properties.group as Location["group"],
      locationType: properties.locationType as LocationType,
      access: properties.access as AccessStatus,
      lastChecked: properties.lastChecked,
      source: properties.source,
      scientificName: stringValue(properties.scientificName),
      commonName: stringValue(properties.commonName),
      locationConfidence: properties.locationConfidence as LocationConfidence,
      taxonConfidence: stringValue(properties.taxonConfidence),
      evidenceSummary: properties.evidenceSummary,
      visitorNotes: stringValue(properties.visitorNotes),
      visitorInfoUrl: httpsUrl(properties.visitorInfoUrl),
      photoUrl: httpsUrl(properties.photoUrl),
      photoCredit: stringValue(properties.photoCredit),
      provenance,
      geometry: geometry as unknown as Geometry,
      coordinates,
    }];
  });
  return locations.length === value.features.length ? locations : [];
}

export function formatReviewedDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-AU", { ...options, timeZone: "Australia/Sydney" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return nonEmptyString(value) ? value : undefined;
}

function httpsUrl(value: unknown) {
  const text = stringValue(value);
  return text && isHttpsUrl(text) ? text : undefined;
}

function isoTimestamp(value: unknown) {
  const text = stringValue(value);
  return text && isIsoTimestamp(text) ? text : undefined;
}

function parseProvenance(value: unknown): LocationProvenance | null {
  if (!isRecord(value)) return null;
  const provider = stringValue(value.provider);
  const sourceUrl = httpsUrl(value.sourceUrl);
  const sourceRecordId = stringValue(value.sourceRecordId);
  const importedAt = isoTimestamp(value.importedAt);
  const reviewedAt = isoTimestamp(value.reviewedAt);
  const licence = stringValue(value.licence);
  const reuseBasis = stringValue(value.reuseBasis);
  if (!provider || !sourceUrl || !sourceRecordId || !importedAt || !reviewedAt || (!licence && !reuseBasis)) return null;
  const basis: LocationProvenance = licence
    ? { provider, sourceUrl, sourceRecordId, importedAt, reviewedAt, licence, ...(reuseBasis ? { reuseBasis } : {}) }
    : { provider, sourceUrl, sourceRecordId, importedAt, reviewedAt, reuseBasis: reuseBasis as string };
  return {
    ...basis,
    dataset: stringValue(value.dataset),
  };
}

export { representativeCoordinates } from "@/lib/public-geometry.mjs";

export function filterLocations(locations: Location[], filters: LocationFilters) {
  const normalized = filters.query.trim().toLowerCase();
  return locations.filter((location) => {
    const searchable = [
      location.name,
      location.suburb,
      location.streetAddress,
      location.councilArea,
      location.group,
      location.scientificName,
      location.commonName,
      location.source,
      location.provenance.sourceRecordId,
    ].filter((value): value is string => Boolean(value));
    return (!normalized || searchable.some((value) => value.toLowerCase().includes(normalized)))
      && (filters.group === "All blossoms" || location.group === filters.group)
      && (filters.locationType === "All types" || location.locationType === filters.locationType)
      && (filters.access === "All access" || location.access === filters.access)
      && (filters.photo === "All photos" || Boolean(location.photoUrl))
      && (filters.year === "All years" || location.lastChecked.startsWith(filters.year));
  });
}
