// MapLoader – thin wrapper around Mapbox GL.
// Handles map instantiation, data loading, and user interaction.
// Uses configuration from config/mapConfig.js and geometry utilities.
// Public API:
//   - init() - asynchronously sets up the map and resolves with the instance.
//   - setStateClickHandler(fn) - register a callback for state click events.
//   - destroy() - clean up map and listeners.

import { MAP_CONFIG } from '../config/mapConfig.js';
import { getBbox as getBounds, getZoomForBBox as calculateZoomForBBox } from '../utils/geometryUtils.js';

export class MapLoader {
  constructor(mapContainer) {
    // Reference to the DOM element id where the map will be mounted.
    this.mapContainer = mapContainer;
    // Callback invoked when a state is clicked – set via setStateClickHandler.
    this.stateClickCallback = null;
    // Mapbox GL map instance – created in init().
    this.map = null;
    // Mapping state name → array of ZIP codes (loaded from JSON).
    this.stateZipCodes = {};
    // Currently selected state (used for filtering).
    this.selectedState = null;
    // Flag once map and layers are fully loaded.
    this.isInitialized = false;
    // Store listeners so we can clean them up in destroy().
    this.eventListeners = [];
  }

  // Register a function that receives the state name when a state polygon is clicked.
  setStateClickHandler(fn) {
    this.stateClickCallback = fn;
  }

  /**
   * Asynchronously create the Mapbox GL map, load layers, and set up listeners.
   * @returns {Promise<maplibregl.Map>} The initialized map instance.
   */
  async init() {
    try {
      await this.loadZipCodeData();
      this.map = new maplibregl.Map({
        container: this.mapContainer,
        style: MAP_CONFIG.style,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        maxZoom: 18,
        minZoom: 2,
        hash: false,
        attributionControl: true,
        touchZoomRotate: true,
        dragRotate: false
      });
      this.setupMapListeners();
      await this.addMapLayers();
      this.isInitialized = true;
      return this.map;
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  }

  /**
   * Fetch geographic data mapping states to ZIP codes from local JSON.
   */
  async loadZipCodeData() {
    try {
      const response = await fetch('src/assets/data/state-zipcode-map.json');
      this.stateZipCodes = await response.json();
      console.log('Loaded stateZipCodes:', this.stateZipCodes);
    } catch (error) {
      console.error('Error loading zip code data:', error);
    }
  }

  /**
   * Once Mapbox GL has finished loading, add custom sources and layers.
   * Returns a promise that resolves when the map is idle.
   */
  async addMapLayers() {
    return new Promise((resolve) => {
      this.map.on('load', () => {
        // Attach GeoJSON sources.
        this.map.addSource('states', MAP_CONFIG.sources.states);
        this.map.addSource('zipcodes', MAP_CONFIG.sources.zipcodes);
        // Add visual layers.
        this.map.addLayer(MAP_CONFIG.layers.states);
        this.map.addLayer(MAP_CONFIG.layers.zipcodes);
        this.map.addLayer(MAP_CONFIG.layers.zipcodesLabels);
        // Initial filters: hide all ZIP code polygons/labels.
        this.map.setFilter('zipcode-layer', ['in', ['get', '3dig_zip'], ['literal', []]]);
        this.map.setFilter('zipcode-labels', ['in', ['get', '3dig_zip'], ['literal', []]]);
        // Resolve when map has finished drawing.
        this.map.once('idle', () => resolve(this.map));
      });
    });
  }

  /**
   * Attach mouse and click handlers to interactive layers.
   */
  setupMapListeners() {
    const throttle = (func, limit) => {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };
    const throttledStateClick = throttle((e) => this.handleStateClick(e), 200);
    this.map.on('click', 'states-layer', throttledStateClick);
    this.map.on('mouseenter', 'states-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'states-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });
    this.map.on('click', 'zipcode-layer', (e) => this.handleZipcodeClick(e));
    this.map.on('mouseenter', 'zipcode-layer', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'zipcode-layer', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  /**
   * Called when a user clicks on a state polygon.
   */
  handleStateClick(e) {
    const stateName = e.features[0].properties.name;
    this.selectedState = stateName;
    console.log(stateName + ' clicked');
    const bbox = this.getBbox(e.features[0].geometry.coordinates);
    this.map.fitBounds(
      [
        [bbox.minLon, bbox.minLat],
        [bbox.maxLon, bbox.maxLat]
      ], {
      padding: window.innerWidth * 0.15,
      duration: 700,
      easing: (t) => t * (2 - t)
    }
    );
    this.filterZipcodesForState(stateName);
    if (this.stateClickCallback) {
      this.stateClickCallback(stateName);
    }
  }

  /**
   * Show a popup with the ZIP code when a user clicks on a ZIP area.
   */
  handleZipcodeClick(e) {
    new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 15
    })
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Zip Code:</strong> ${e.features[0].properties['3dig_zip']}`)
      .addTo(this.map);
  }

  /**
   * Proxy to geometryUtils for bounding box calculation.
   */
  getBbox(coords) {
    return getBounds(coords);
  }

  /**
   * Proxy to geometryUtils for zoom calculation.
   */
  getZoomForBBox(bbox, viewportWidth, viewportHeight, fill = 0.5) {
    return calculateZoomForBBox(bbox, viewportWidth, viewportHeight, fill);
  }

  /**
   * Filter the ZIP code layers to display only those belonging to the selected state.
   */
  filterZipcodesForState(stateName) {
    const zips = this.stateZipCodes[stateName] || [];
    const zip3s = zips.map((z) => z.substring(0, 3));
    if (zips.length > 0) {
      this.map.setFilter('zipcode-layer', ['in', ['get', '3dig_zip'], ['literal', zip3s]]);
      this.map.setFilter('zipcode-labels', ['in', ['get', '3dig_zip'], ['literal', zip3s]]);
    } else {
      console.log('state is empty ' + stateName.replace(/\s/g, ''));
      this.map.setFilter('zipcode-layer', ['in', ['get', '3dig_zip'], ['literal', []]]);
      this.map.setFilter('zipcode-labels', ['in', ['get', '3dig_zip'], ['literal', []]]);
    }
  }

  /**
   * Clean up map instance and event listeners.
   */
  destroy() {
    if (this.map) {
      this.eventListeners.forEach(([event, layer, handler]) => {
        this.map.off(event, layer, handler);
      });
      this.map.remove();
    }
  }
}
