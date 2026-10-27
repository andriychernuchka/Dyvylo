import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';

export function useCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    catalogService.getAll().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return { items, loading };
}

export default useCatalog;
