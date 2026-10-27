import { FilterPanel } from '../features/catalog/components/FilterPanel';
import { MediaGrid } from '../features/catalog/components/MediaGrid';
import { useCatalog } from '../features/catalog/hooks/useCatalog';

export function CatalogPage() {
  const { items } = useCatalog();

  return (
    <section data-testid="catalog-page">
      <h1>Каталог медіа</h1>
      <FilterPanel />
      <MediaGrid items={items} />
    </section>
  );
}

export default CatalogPage;
