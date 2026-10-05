import { useParams, Link } from 'react-router-dom';

export function TitlePage() {
  const { id } = useParams();

  return (
    <section data-testid="title-page">
      <h1>Деталі релізу: {id}</h1>
      <p>Опис та метадані медіа-елемента.</p>
      <Link to={`/player/${id}`}>Відкрити у плеєрі</Link>
    </section>
  );
}

export default TitlePage;
