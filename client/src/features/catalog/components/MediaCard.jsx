import { Link } from 'react-router-dom';

export function MediaCard({ item }) {
  if (!item) return null;

  return (
    <article data-testid="media-card">
      <Link to={`/title/${item.id}`} data-testid={`media-link-${item.id}`}>
        <h3>{item.title}</h3>
      </Link>
    </article>
  );
}

export default MediaCard;
