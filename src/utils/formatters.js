/**
 * Format a numeric value as currency with 2 decimal places.
 * Returns an em-dash for null/undefined/NaN values.
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return '\u2014';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a property value for display.
 * Handles null, undefined, objects, and primitives.
 */
export function formatValue(value) {
  if (value === null || value === undefined) return '\u2014';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
