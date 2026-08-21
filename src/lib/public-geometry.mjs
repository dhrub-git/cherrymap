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
