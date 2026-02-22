import { useCallback } from 'react';

export function YearMonthSlider({ yms, currentIndex, onChange }) {
  const handleKeyDown = useCallback((ev) => {
    const keysToStop = [
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'PageUp', 'PageDown', 'Home', 'End',
    ];
    if (keysToStop.includes(ev.key)) ev.stopPropagation();
  }, []);

  return (
    <div className="ym-slider-container">
      <div className="ym-slider-label">{yms[currentIndex] || ''}</div>
      <input
        type="range"
        className="ym-slider-input"
        min={0}
        max={Math.max(0, yms.length - 1)}
        value={currentIndex}
        step={1}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
