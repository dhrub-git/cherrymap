function coordinatePair(value) {
  return Array.isArray(value) && value.length >= 2 && value.slice(0, 2).every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate)) ? value.slice(0, 2) : null;
}

function positionsEqual(first, last) {
  return first[0] === last[0] && first[1] === last[1];
}

function lineMidpoint(line) {
  const segmentLengths = line.slice(1).map((pair, index) => Math.hypot(pair[0] - line[index][0], pair[1] - line[index][1]));
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);
  if (totalLength === 0) return line[0];
  let remaining = totalLength / 2;
  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];
    if (remaining <= length) {
      const start = line[index];
      const end = line[index + 1];
      const ratio = remaining / length;
      return [start[0] + (end[0] - start[0]) * ratio, start[1] + (end[1] - start[1]) * ratio].map((coordinate) => Number(coordinate.toFixed(7)));
    }
    remaining -= length;
  }
  return line.at(-1);
}

export function representativeCoordinates(geometry) {
  if (geometry?.type === "Point") return coordinatePair(geometry.coordinates);
  if (geometry?.type === "LineString" && Array.isArray(geometry.coordinates)) {
    if (geometry.coordinates.length < 2) return null;
    const line = geometry.coordinates.map(coordinatePair);
    if (line.some((pair) => !pair)) return null;
    return lineMidpoint(line);
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
