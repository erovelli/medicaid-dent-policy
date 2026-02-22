import { useMemo, useState, useCallback, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { MAP_CONFIG } from '../config/mapConfig';
import { useAppState } from '../App';
import { useMapInteraction } from '../hooks/useMapInteraction';

const INTERACTIVE_LAYERS = ['states-layer', 'zipcode-layer'];
const EMPTY_FILTER = ['in', ['get', 'zip3'], ['literal', []]];

export function MapView() {
  const { state, stateZipCodes } = useAppState();
  const mapRef = useRef(null);
  const { handleLayerClick } = useMapInteraction(mapRef);
  const [cursor, setCursor] = useState('');

  const zipcodeFilter = useMemo(() => {
    if (!state.selectedState || !stateZipCodes) return EMPTY_FILTER;
    const zips = stateZipCodes[state.selectedState] || [];
    const zip3s = zips.map((z) => z.substring(0, 3));
    return zip3s.length > 0
      ? ['in', ['get', 'zip3'], ['literal', zip3s]]
      : EMPTY_FILTER;
  }, [state.selectedState, stateZipCodes]);

  const highlightFilter = useMemo(
    () =>
      state.highlightedZip3
        ? ['==', ['get', 'zip3'], state.highlightedZip3]
        : EMPTY_FILTER,
    [state.highlightedZip3],
  );

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor(''), []);

  return (
    <Map
      ref={mapRef}
      id="main-map"
      initialViewState={{
        longitude: MAP_CONFIG.center[0],
        latitude: MAP_CONFIG.center[1],
        zoom: MAP_CONFIG.zoom,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_CONFIG.style}
      maxZoom={18}
      minZoom={2}
      dragRotate={false}
      interactiveLayerIds={INTERACTIVE_LAYERS}
      onClick={handleLayerClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      cursor={cursor}
    >
      <Source id="states" type="geojson" data={MAP_CONFIG.sources.states.data}>
        <Layer {...MAP_CONFIG.layers.states} source="states" />
      </Source>

      <Source id="zipcodes" type="geojson" data={MAP_CONFIG.sources.zipcodes.data}>
        <Layer {...MAP_CONFIG.layers.zipcodes} source="zipcodes" filter={zipcodeFilter} />
        <Layer
          {...MAP_CONFIG.layers.zipcodeHighlight}
          source="zipcodes"
          filter={highlightFilter}
          beforeId="zipcode-labels"
        />
        <Layer {...MAP_CONFIG.layers.zipcodesLabels} source="zipcodes" filter={zipcodeFilter} />
      </Source>
    </Map>
  );
}
