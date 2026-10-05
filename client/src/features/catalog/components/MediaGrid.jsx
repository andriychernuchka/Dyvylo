import { MediaCard } from './MediaCard';

export function MediaGrid({ items = [] }) {
  if (items.length === 0) {
    return <p data-testid="media-grid-empty">Елементи відсутні</p>;
  }

  return (
    <div data-testid="media-grid">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default MediaGrid;
