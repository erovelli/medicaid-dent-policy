import { useEffect, useRef } from 'react';
import { useAppState } from '../../App';
import { useDragResize } from '../../hooks/useDragResize';
import { PropertiesTable } from './PropertiesTable';
import { SpendingSection } from './SpendingSection';

export function Sidebar() {
  const { state, dispatch } = useAppState();
  const { containerRef, handleRef, height, resetHeight } = useDragResize();
  const sliderRef = useRef(null);

  // Reset drag height when sidebar closes
  useEffect(() => {
    if (!state.sidebarOpen) resetHeight();
  }, [state.sidebarOpen, resetHeight]);

  // Auto-focus the YM slider after the sidebar open transition
  useEffect(() => {
    if (!state.sidebarOpen || !state.selectedFeature) return;
    const timer = setTimeout(() => {
      const el = sliderRef.current?.querySelector('.ym-slider-input');
      if (el) {
        try {
          el.focus({ preventScroll: true });
        } catch {
          el.focus();
        }
      }
    }, 360);
    return () => clearTimeout(timer);
  }, [state.sidebarOpen, state.selectedFeature]);

  return (
    <div
      ref={containerRef}
      className={`sidebar-container${state.sidebarOpen ? ' sidebar-open' : ''}`}
      style={height ? { height: `${height}px` } : undefined}
    >
      <div ref={handleRef} className="sidebar-handle" />
      <button
        className="sidebar-close-btn"
        onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
      >
        Close
      </button>
      <div className="sidebar-inner" ref={sliderRef}>
        {state.sidebarTitle && <h2>{state.sidebarTitle}</h2>}
        {state.selectedFeature && (
          <>
            <PropertiesTable properties={state.selectedFeature.properties} />
            <SpendingSection properties={state.selectedFeature.properties} />
          </>
        )}
      </div>
    </div>
  );
}
