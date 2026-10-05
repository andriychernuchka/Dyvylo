export function FilterPanel({ onSearch }) {
  return (
    <div data-testid="filter-panel">
      <input
        type="search"
        placeholder="Пошук у каталозі..."
        data-testid="catalog-search-input"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
}

export default FilterPanel;
