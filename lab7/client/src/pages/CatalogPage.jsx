import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from '../features/catalog/components/FilterPanel';
import { MediaCard } from '../features/catalog/components/MediaCard';
import { useTitles } from '../hooks/useTitles';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeType, setActiveType] = useState(urlType);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setActiveType(urlType);
  }, [urlType]);

  const { items, total, loading, error } = useTitles({
    search: debouncedQuery,
    type: activeType,
    sort: sortBy,
    order: 'desc',
    limit: 100,
  });

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (type === 'all') {
      searchParams.delete('type');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type });
    }
  };

  return (
    <div className="container">
      <div className={styles.catalog} data-testid="catalog-page">
        <div className={styles.header}>
          <h1 className={styles.title}>Каталог релізів</h1>
          <p className={styles.subtitle}>
            Повна бібліотека фільмів, серіалів та аніме з прямим стрімінгом через відкриті шлюзи.
          </p>
        </div>

        <FilterPanel
          query={query}
          onQueryChange={setQuery}
          activeType={activeType}
          onTypeChange={handleTypeChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={total}
        />

        {error ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyTitle}>Не вдалося завантажити каталог</span>
            <p
              role="alert"
              style={{ color: 'var(--status-error, #ff4d6d)', fontSize: 13 }}
            >
              {error}
            </p>
          </div>
        ) : loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '24px 0' }}>
            Завантаження тайтлів...
          </p>
        ) : items.length > 0 ? (
          <div className={styles.grid} data-testid="media-grid">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyTitle}>За вашим запитом нічого не знайдено</span>
            <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
              Спробуйте змінити фільтри пошуку або вибрати іншу категорію.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
