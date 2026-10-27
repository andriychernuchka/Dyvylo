import { Input, Button } from '../../../components/ui';
import styles from './FilterPanel.module.css';

const TYPES = [
  { id: 'all', label: 'Всі релізи' },
  { id: 'series', label: 'Серіали' },
  { id: 'anime', label: 'Аніме' },
  { id: 'movies', label: 'Фільми 4K' },
];

export function FilterPanel({
  query,
  onQueryChange,
  activeType,
  onTypeChange,
  sortBy,
  onSortChange,
  totalCount = 0,
}) {
  return (
    <div className={styles.panel} data-testid="filter-panel">
      <div className={styles.topRow}>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Швидкий пошук за назвою, автором, жанром..."
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
        </div>

        <div className={styles.typeChips}>
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.chip} ${activeType === t.id ? styles.activeChip : ''}`}
              onClick={() => onTypeChange?.(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metaRow}>
        <span>Знайдено записів: <strong>{totalCount}</strong></span>
        <div className={styles.sortGroup}>
          <span>Сортування:</span>
          <Button
            variant={sortBy === 'rating' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSortChange?.('rating')}
          >
            Рейтинг
          </Button>
          <Button
            variant={sortBy === 'year' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSortChange?.('year')}
          >
            Рік
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
