import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from '../features/catalog/components/FilterPanel';
import { MediaCard } from '../features/catalog/components/MediaCard';
import { MOCK_RELEASES } from '../data/mockData';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState(urlType);
  const [sortBy, setSortBy] = useState('rating');

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (type === 'all') {
      searchParams.delete('type');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type });
    }
  };

  const filteredItems = useMemo(() => {
    let result = [...MOCK_RELEASES];

    // Filter by type
    if (activeType !== 'all') {
      result = result.filter((item) => item.type === activeType);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.titleUk.toLowerCase().includes(q) ||
          item.genre.toLowerCase().includes(q) ||
          item.creator.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });

    return result;
  }, [activeType, query, sortBy]);

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
          totalCount={filteredItems.length}
        />

        {filteredItems.length > 0 ? (
          <div className={styles.grid} data-testid="media-grid">
            {filteredItems.map((item) => (
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
