export const MAP_CONFIG = {
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [-100.04, 38.907],
  zoom: 3,
  sources: {
    states: {
      type: 'geojson',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
    },
    zipcodes: {
      type: 'geojson',
      data: '/data/zip3_spending.geojson',
    },
  },
  layers: {
    states: {
      id: 'states-layer',
      type: 'fill',
      paint: {
        'fill-color': 'rgba(20, 184, 166, 0.25)',
        'fill-outline-color': 'rgba(94, 234, 212, 0.6)',
      },
    },
    zipcodes: {
      id: 'zipcode-layer',
      type: 'fill',
      paint: {
        'fill-color': 'rgba(45, 212, 191, 0.6)',
        'fill-outline-color': 'rgba(255, 255, 255, 0.85)',
      },
    },
    zipcodesLabels: {
      id: 'zipcode-labels',
      type: 'symbol',
      layout: {
        'text-field': ['get', 'zip3'],
        'text-size': 14,
      },
      paint: {
        'text-color': '#000',
        'text-halo-color': '#fff',
        'text-halo-width': 1,
      },
    },
    zipcodeHighlight: {
      id: 'zipcode-highlight',
      type: 'fill',
      paint: {
        'fill-color': 'rgba(255, 213, 79, 0.85)',
        'fill-outline-color': 'rgba(255, 193, 7, 0.9)',
      },
    },
  },
};
