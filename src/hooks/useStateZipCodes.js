import { useState, useEffect } from 'react';

export function useStateZipCodes() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/state-zipcode-map.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load state-zipcode map:', err));
  }, []);

  return data;
}
