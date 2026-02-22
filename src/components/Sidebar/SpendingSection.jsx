import { useMemo, useState, useEffect } from 'react';
import { YearMonthSlider } from './YearMonthSlider';
import { formatCurrency } from '../../utils/formatters';

const COLUMN_MAPPING = {
  C: 'category',
  YM: 'year_month',
  TBS: 'total_beneficiaries_served',
  TC: 'total_claims',
  TAP: 'total_amount_paid',
};

const COLUMN_KEYS = Object.keys(COLUMN_MAPPING);

function parseSpendingData(properties) {
  const value = properties?.spending;
  if (!value) return null;

  let parsed = value;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
}

function formatCell(key, value) {
  if (value === null || value === undefined) return '\u2014';
  if (key === 'TAP') return formatCurrency(value);
  return String(value);
}

export function SpendingSection({ properties }) {
  const spendingArray = useMemo(() => parseSpendingData(properties), [properties]);

  const yms = useMemo(
    () => (spendingArray ? [...new Set(spendingArray.map((r) => r.YM))].sort() : []),
    [spendingArray],
  );

  const [currentIndex, setCurrentIndex] = useState(() => Math.max(0, yms.length - 1));

  useEffect(() => {
    setCurrentIndex(Math.max(0, yms.length - 1));
  }, [yms]);

  if (!spendingArray || yms.length === 0) return null;

  const currentYM = yms[currentIndex];
  const rows = spendingArray.filter((r) => r.YM === currentYM);

  return (
    <div className="spending-section">
      <table className="spending-table">
        <thead>
          <tr>
            {COLUMN_KEYS.map((k) => (
              <th key={k}>{COLUMN_MAPPING[k]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {COLUMN_KEYS.map((k) => (
                <td key={k}>{formatCell(k, row[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <YearMonthSlider yms={yms} currentIndex={currentIndex} onChange={setCurrentIndex} />
    </div>
  );
}
