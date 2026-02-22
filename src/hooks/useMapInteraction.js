import { useCallback, useRef } from 'react';
import { useAppState } from '../App';
import { getBbox } from '../utils/geometryUtils';

export function useMapInteraction(mapRef) {
  const { dispatch } = useAppState();
  const lastClickTime = useRef(0);

  const handleStateClick = useCallback(
    (feature) => {
      // Throttle: ignore clicks within 200ms of the last one
      const now = Date.now();
      if (now - lastClickTime.current < 200) return;
      lastClickTime.current = now;

      const stateName = feature.properties.name;
      dispatch({ type: 'SELECT_STATE', payload: stateName });

      const map = mapRef.current;
      if (map) {
        const bbox = getBbox(feature.geometry.coordinates);
        map.fitBounds(
          [
            [bbox.minLon, bbox.minLat],
            [bbox.maxLon, bbox.maxLat],
          ],
          {
            padding: window.innerWidth * 0.15,
            duration: 700,
            easing: (t) => t * (2 - t),
          },
        );
      }
    },
    [mapRef, dispatch], // mapRef is a stable ref object
  );

  const handleZipcodeClick = useCallback(
    (feature) => {
      dispatch({ type: 'SELECT_ZIPCODE', payload: feature });
    },
    [dispatch],
  );

  const handleLayerClick = useCallback(
    (e) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const layerId = feature.layer.id;
      if (layerId === 'states-layer') handleStateClick(feature);
      else if (layerId === 'zipcode-layer') handleZipcodeClick(feature);
    },
    [handleStateClick, handleZipcodeClick],
  );

  return { handleLayerClick };
}
