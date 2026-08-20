import type { Location } from "@/types/location";

export const repositoryUrl = "https://github.com/dhrub-git/cherrymap";

function issueUrl(title: string, body: string, labels: string) {
  const params = new URLSearchParams({ title, body, labels });
  return `${repositoryUrl}/issues/new?${params}`;
}

export const suggestionUrl = issueUrl(
  "Location suggestion: ",
  "Tell us the public location, what blossoms you saw, the evidence or source, and any access notes. Do not include private residential locations.\n\nPublic location:\nBlossom identification:\nEvidence/source:\nAccess notes:\n",
  "location-suggestion",
);

export function correctionUrl(location: Location) {
  return issueUrl(
    `Correction or removal: ${location.name}`,
    `Location ID: ${location.id}\nCurrent source: ${location.provenance.sourceUrl}\n\nWhat should be corrected or removed, and why?\n`,
    "correction",
  );
}
