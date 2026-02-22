/**
 * Calculate bounding box of a set of coordinates.
 * Handles both Polygon and MultiPolygon coordinate structures.
 * @param {Array} coords
 * @returns {{ minLon: number, minLat: number, maxLon: number, maxLat: number }}
 */
export function getBbox(coords) {
  let minLon = Infinity, minLat = Infinity;
  let maxLon = -Infinity, maxLat = -Infinity;

  const process = (array) => {
    for (const element of array) {
      if (Array.isArray(element[0])) {
        process(element);
      } else {
        const [lon, lat] = element;
        if (lon < minLon) minLon = lon;
        if (lat < minLat) minLat = lat;
        if (lon > maxLon) maxLon = lon;
        if (lat > maxLat) maxLat = lat;
      }
    }
  };

  process(coords);
  return { minLon, minLat, maxLon, maxLat };
}

/**
 * Calculate appropriate zoom level to fit a bounding box.
 * @param {{ minLon: number, minLat: number, maxLon: number, maxLat: number }} bbox
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {number} fill
 * @returns {number}
 */
export function getZoomForBBox(bbox, viewportWidth, viewportHeight, fill = 0.5) {
  const WORLD_SIZE = 256;
  function latToY(lat) {
    const rad = (lat * Math.PI) / 180;
    return Math.log(Math.tan(rad) + 1 / Math.cos(rad));
  }
  const x1 = (bbox.minLon + 180) / 360;
  const x2 = (bbox.maxLon + 180) / 360;
  const y1 = (1 - latToY(bbox.minLat) / Math.PI) / 2;
  const y2 = (1 - latToY(bbox.maxLat) / Math.PI) / 2;
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const zoomX = Math.log2((viewportWidth * fill) / (dx * WORLD_SIZE));
  const zoomY = Math.log2((viewportHeight * fill) / (dy * WORLD_SIZE));
  return Math.min(zoomX, zoomY);
}
