import { Link } from 'react-router-dom';
import { HeroSpotlight } from '../features/catalog/components/HeroSpotlight';
import { MediaCard } from '../features/catalog/components/MediaCard';
import { EpisodeCard } from '../features/catalog/components/EpisodeCard';
import { TelemetryCard } from '../features/player/components/TelemetryCard';
import { Badge, Button } from '../components/ui';
import { MOCK_RELEASES, MOCK_EPISODES } from '../data/mockData';
import styles from './HomePage.module.css';

export function HomePage() {
  const heroRelease = MOCK_RELEASES[0]; // House of the Dragon
  const series = MOCK_RELEASES.filter((r) => r.type === 'series');
  const anime = MOCK_RELEASES.filter((r) => r.type === 'anime');
  const movies = MOCK_RELEASES.filter((r) => r.type === 'movies');

  return (
    <div className="container">
      <div className={styles.home} data-testid="home-page">
        {/* 1. HERO SPOTLIGHT */}
        <HeroSpotlight release={heroRelease} />

        {/* 2. CONTINUE WATCHING */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>Продовжити перегляд</span>
              <span className={styles.sectionSubtitle}>Збережений прогрес на edge-вузлі</span>
            </div>
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                Всі збережені →
              </Button>
            </Link>
          </div>
          <div className={styles.episodesGrid}>
            {MOCK_EPISODES.slice(0, 3).map((ep) => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                mediaId={heroRelease.id}
                thumb={heroRelease.backdrop}
              />
            ))}
          </div>
        </section>

        {/* 3. TRENDING SERIES */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>Популярні серіали</span>
              <span className={styles.sectionSubtitle}>Найвищий бітрейт та локалізація</span>
            </div>
            <Link to="/catalog?type=series">
              <Button variant="ghost" size="sm">
                Дивитися всі →
              </Button>
            </Link>
          </div>
          <div className={styles.postersGrid}>
            {series.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 4. CULT ANIME */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>Культове аніме</span>
              <span className={styles.sectionSubtitle}>4K ремастери, класика та онґоїнґи</span>
            </div>
            <Link to="/catalog?type=anime">
              <Button variant="ghost" size="sm">
                Весь каталог аніме →
              </Button>
            </Link>
          </div>
          <div className={styles.postersGrid}>
            {anime.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 5. MOVIES IN 4K */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>Кінопрем’єри 4K HDR</span>
              <span className={styles.sectionSubtitle}>Незжатий звук Dolby Atmos</span>
            </div>
            <Link to="/catalog?type=movies">
              <Button variant="ghost" size="sm">
                Всі фільми →
              </Button>
            </Link>
          </div>
          <div className={styles.postersGrid}>
            {movies.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 6. MANIFESTO & STREAMING INTERMEDIARY */}
        <section className={styles.manifesto}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Badge variant="primary">ПОСЕРЕДНИК ДИВИЛО</Badge>
              <Badge variant="live" liveDot>
                СТРІМІНГ-ХАБ
              </Badge>
            </div>
            <h2 className={styles.manifestoTitle}>
              НЕ СХОВИЩЕ. КОМФОРТНИЙ СТРІМІНГ-ПОСЕРЕДНИК.
            </h2>
            <p className={styles.manifestoText}>
              «Дивило» — це швидкий та комфортний посередник між глядачем і відкритими
              онлайн-кінотеатрами (HDRezka, UAKino та ін.). Ми не зберігаємо важкі файли
              на власних серверах, а агрегуємо відкриті потоки в єдиний високотехнологічний
              інтерфейс — з чистим плеєром, повною відсутністю нав’язливої реклами та
              максимальною зручністю перегляду.
            </p>
          </div>
          <div>
            <TelemetryCard />
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
