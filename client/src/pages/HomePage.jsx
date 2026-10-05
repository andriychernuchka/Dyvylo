import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section data-testid="home-page">
      <h1>Головна сторінка</h1>
      <p>Архітектурний каркас медіа-хабу DYVYLO.</p>
      <Link to="/catalog">Перейти до каталогу</Link>
    </section>
  );
}

export default HomePage;
