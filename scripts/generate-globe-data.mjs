import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../public/data/globe-points.json');

async function generateGlobeData() {
  console.log('Fetching Natural Earth land GeoJSON...');
  const res = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson');
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const geojson = await res.json();

  function pointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function isLand(lon, lat) {
    const pt = [lon, lat];
    for (const feat of geojson.features) {
      if (feat.geometry.type === 'Polygon') {
        if (pointInPoly(pt, feat.geometry.coordinates[0])) return true;
      } else if (feat.geometry.type === 'MultiPolygon') {
        for (const poly of feat.geometry.coordinates) {
          if (pointInPoly(pt, poly[0])) return true;
        }
      }
    }
    return false;
  }

  console.log('Generating Fibonacci sphere samples...');
  const TOTAL_SAMPLES = 28000;
  const offset = 2 / TOTAL_SAMPLES;
  const increment = Math.PI * (3 - Math.sqrt(5));

  const landPoints = [];
  const oceanPoints = [];

  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const y = ((i * offset) - 1) + (offset / 2);
    const r = Math.sqrt(1 - Math.pow(y, 2));
    const phi = ((i + 1.0) % TOTAL_SAMPLES) * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    // Convert x, y, z to lat, lon
    const lat = Math.asin(y) * (180 / Math.PI);
    const lon = Math.atan2(x, z) * (180 / Math.PI);

    const land = isLand(lon, lat);

    if (land) {
      landPoints.push([+x.toFixed(4), +y.toFixed(4), +z.toFixed(4)]);
    } else {
      // Keep ~1 in every 7 ocean points for a delicate faint sphere outline
      if (i % 7 === 0) {
        oceanPoints.push([+x.toFixed(4), +y.toFixed(4), +z.toFixed(4)]);
      }
    }
  }

  console.log(`Generated: ${landPoints.length} land points, ${oceanPoints.length} ocean points.`);

  const data = {
    land: landPoints,
    ocean: oceanPoints,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(data));
  console.log(`Wrote globe data to ${OUTPUT_FILE}`);
}

generateGlobeData().catch(console.error);
