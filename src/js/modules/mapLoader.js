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
    // Callback invoked when a zipcode polygon is clicked.
    this.zipcodeClickCallback = null;
    // Mapbox GL map instance – created in init().
    this.map = null;
    // Mapping state name → array of ZIP codes (loaded from JSON).
    this.stateZipCodes = {};
    // Currently selected state (used for filtering).
    this.selectedState = null;
    // Currently highlighted zipcode (zip3 string)
    this.highlightedZip3 = null;
    // Flag once map and layers are fully loaded.
    this.isInitialized = false;
    // Store listeners so we can clean them up in destroy().
    this.eventListeners = [];
  }

  // Register a function that receives the clicked zipcode feature.
  setZipcodeClickHandler(fn) {
    this.zipcodeClickCallback = fn;
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
        // Add highlight layer above the zipcode layer to show selected zip
        // Start with an empty filter so nothing is highlighted.
        if (!this.map.getLayer('zipcode-highlight')) {
          this.map.addLayer({
            id: 'zipcode-highlight',
            type: 'fill',
            source: 'zipcodes',
            paint: {
              'fill-color': 'rgba(255, 213, 79, 0.85)',
              'fill-outline-color': 'rgba(255, 193, 7, 0.9)'
            },
            filter: ['in', ['get', 'zip3'], ['literal', []]]
          }, MAP_CONFIG.layers.zipcodesLabels.id || 'zipcode-labels');
        }
        // Initial filters: hide all ZIP code polygons/labels.
        this.map.setFilter('zipcode-layer', ['in', ['get', 'zip3'], ['literal', []]]);
        this.map.setFilter('zipcode-labels', ['in', ['get', 'zip3'], ['literal', []]]);
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
    // Clear any previously highlighted zipcode when changing states
    if (this.highlightedZip3) {
      this.setHighlightedZip(null);
    }
    if (this.stateClickCallback) {
      this.stateClickCallback(stateName);
    }
  }

  /**
   * Show a popup with the ZIP code when a user clicks on a ZIP area.
   */
  handleZipcodeClick(e) {
    // If an external handler is registered, call it with the clicked feature.
    if (this.zipcodeClickCallback) {
      try {
        this.zipcodeClickCallback(e.features[0]);
      } catch (err) {
        console.error('Error in zipcodeClickCallback:', err);
      }
    }
    // Highlight the clicked zipcode and remove previous highlight.
    const clickedZip = e.features[0].properties && e.features[0].properties.zip3;
    if (clickedZip) this.setHighlightedZip(clickedZip);
  }

  /**
   * Highlight a zipcode polygon by its zip3 value.
   * Clears previous highlight automatically.
   * @param {string|null} zip3
   */
  setHighlightedZip(zip3) {
    if (!this.map || !this.map.getLayer) return;
    // Toggle off if the same zip is selected
    if (this.highlightedZip3 === zip3) {
      this.highlightedZip3 = null;
      this.map.setFilter('zipcode-highlight', ['in', ['get', 'zip3'], ['literal', []]]);
      return;
    }
    this.highlightedZip3 = zip3;
    try {
      // Prefer equality expression if supported
      this.map.setFilter('zipcode-highlight', ['==', ['get', 'zip3'], zip3]);
    } catch (err) {
      this.map.setFilter('zipcode-highlight', ['in', ['get', 'zip3'], ['literal', [zip3]]]);
    }
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
      this.map.setFilter('zipcode-layer', ['in', ['get', 'zip3'], ['literal', zip3s]]);
      this.map.setFilter('zipcode-labels', ['in', ['get', 'zip3'], ['literal', zip3s]]);
    } else {
      console.log('state is empty ' + stateName.replace(/\s/g, ''));
      this.map.setFilter('zipcode-layer', ['in', ['get', 'zip3'], ['literal', []]]);
      this.map.setFilter('zipcode-labels', ['in', ['get', 'zip3'], ['literal', []]]);
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
