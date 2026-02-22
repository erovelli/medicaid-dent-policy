import { useRef, useState, useEffect, useCallback } from 'react';

export function useDragResize({ minHeight = 120, maxHeightFraction = 0.96 } = {}) {
  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const [height, setHeight] = useState(null);

  const resetHeight = useCallback(() => setHeight(null), []);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    let dragging = false;
    let startY = 0;
    let startHeight = 0;

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startY = e.clientY;
      startHeight = containerRef.current.getBoundingClientRect().height;
      document.body.style.userSelect = 'none';
      handle.setPointerCapture(e.pointerId);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const maxH = Math.floor(window.innerHeight * maxHeightFraction);
      const delta = startY - e.clientY;
      const newH = Math.max(minHeight, Math.min(maxH, startHeight + delta));
      setHeight(newH);
    };

    const onPointerUp = (e) => {
      dragging = false;
      document.body.style.userSelect = '';
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    handle.addEventListener('pointerdown', onPointerDown);
    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [minHeight, maxHeightFraction]);

  return { containerRef, handleRef, height, resetHeight };
}
