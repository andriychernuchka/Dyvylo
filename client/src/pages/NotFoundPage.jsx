import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section data-testid="not-found-page">
      <h1>404 - Сторінку не знайдено</h1>
      <p>Запитуваний ресурс відсутній або переміщений.</p>
      <Link to="/">Повернутися на головну</Link>
    </section>
  );
}

export default NotFoundPage;
