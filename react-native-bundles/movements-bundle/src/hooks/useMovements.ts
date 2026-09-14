import { useEffect, useState } from 'react';
import { Movement } from '../../../../shared/theme/types';
import { getMovements } from '../services/movementsService';

export function useMovements() {
  const [items, setItems] = useState<Movement[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  async function load(nextPage: number) {
    setLoading(true);
    try {
      const next = await getMovements(nextPage);
      setItems(current => (nextPage ? [...current, ...next] : next));
      setHasMore(next.length > 0 && nextPage < 2);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(0);
  }, []);
  function loadMore() {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      load(nextPage);
    }
  }
  const filtered = items.filter(item =>
    item.description.toLowerCase().includes(query.toLowerCase()),
  );
  return { items: filtered, query, setQuery, loading, hasMore, loadMore };
}
