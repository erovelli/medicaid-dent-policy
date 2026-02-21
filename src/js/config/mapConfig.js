// -------------
// Map configuration constants
// -----------------
// This module exports a MAP_CONFIG object that defines
//   * The style and appearance of the map
//   * The initial view (center & zoom)
//   * The data sources for state and zipcode polygons
//   * Layer definitions for rendering those sources
// The values are used by the map initializer in `mapLoader.js`.

// Map configuration constants
// The top‑level configuration object for Mapbox GL.
//  It includes style, initial camera state, and source/
// layer definitions that will be added to the map.
//  The format closely follows the Mapbox GL JS API
//  https://docs.mapbox.com/mapbox-gl-js/api/map/#map

export const MAP_CONFIG = {
  // Map style URL – the dark‑matter basemap from CARTO
  // (See https://carto.com/ for details)
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  // Default center of the map in lon/lat (center of US)
  center: [-100.04, 38.907],
  // Default zoom level – 3 gives a continental view
  zoom: 3,
  // -----------------------------------------------------------------
  // Source definitions – URLs or local files that provide GeoJSON data
  // Full‑state boundaries in GeoJSON fetched from Natural Earth
  sources: {
    states: {
      type: 'geojson',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
    },
    // 3‑digit ZIP code polygons bundled with the repo
    zipcodes: {
      type: 'geojson',
      data: 'src/assets/data/zip3codes.geojson'
    }
  },
  // -----------------------------------------------------------------
  // Layer definitions – tell Mapbox GL how to render each source
  // Render the state polygons with a semi‑transparent teal overlay
  layers: {
    states: {
      id: 'states-layer',
      type: 'fill',
      source: 'states',
      paint: {
        'fill-color': 'rgba(20, 184, 166, 0.25)',
        'fill-outline-color': 'rgba(94, 234, 212, 0.6)'
      }
    },
    // Render the 3‑digit ZIP code polygons in a slightly lighter shade
    zipcodes: {
      id: 'zipcode-layer',
      type: 'fill',
      source: 'zipcodes',
      paint: {
        'fill-color': 'rgba(45, 212, 191, 0.6)',
        'fill-outline-color': 'rgba(255, 255, 255, 0.85)'
      }
    },
    // Add text labels (the ZIP code) on top of the polygons
    zipcodesLabels: {
      id: 'zipcode-labels',
      type: 'symbol',
      source: 'zipcodes',
      layout: {
        // Use the "3dig_zip" property from the GeoJSON
        'text-field': ['get', '3dig_zip'],
        'text-size': 14
      },
      paint: {
        'text-color': '#000',
        'text-halo-color': '#fff',
        'text-halo-width': 1
      }
    }
  }
};