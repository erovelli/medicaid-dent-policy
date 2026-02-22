import { formatValue } from '../../utils/formatters';

const EXCLUDED_KEYS = new Set(['spending', 'zip3']);

export function PropertiesTable({ properties }) {
  if (!properties || typeof properties !== 'object') {
    return (
      <div className="sidebar-properties">
        <table className="properties-table">
          <tbody>
            <tr>
              <td colSpan={2}>No properties available</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const keys = Object.keys(properties)
    .filter((k) => !EXCLUDED_KEYS.has(k))
    .sort();

  return (
    <div className="sidebar-properties">
      <table className="properties-table">
        <tbody>
          {keys.map((key) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{formatValue(properties[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
