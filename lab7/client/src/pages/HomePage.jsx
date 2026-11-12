import { Link, useNavigate } from "react-router-dom";
import { HeroSpotlight } from "../features/catalog/components/HeroSpotlight";
import { MediaCard } from "../features/catalog/components/MediaCard";
import { EpisodeCard } from "../features/catalog/components/EpisodeCard";
import { TelemetryCard } from "../features/player/components/TelemetryCard";
import { Badge, Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useTitles } from "../hooks/useTitles";
import { useContinueWatching } from "../hooks/useContinueWatching";
import { useBookmarks } from "../hooks/useBookmarks";
import styles from "./HomePage.module.css";

function toEpisodeCard(entry) {
  const episode = entry.episode || {
    id: "",
    num: "ФІЛЬМ",
    title: entry.title?.title || "Повнометражний реліз",
    duration: entry.title?.duration || "",
    desc: entry.title?.synopsis || "",
  };

  return {
    episode: {
      ...episode,
      progress: entry.percent || 0,
    },
    mediaId: entry.titleId,
    thumb: entry.title?.backdrop || entry.title?.poster,
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, loading, error } = useTitles({ limit: 100 });
  const { bookmarks, add, remove } = useBookmarks({ enabled: isAuthenticated });
  const {
    items: continueItems,
    loading: continueLoading,
    error: continueError,
  } = useContinueWatching(isAuthenticated);

  const heroRelease =
    items.find((item) => item.id === "blade-runner-2049") || items[0];

  const series = items.filter((item) => item.type === "series");
  const anime = items.filter((item) => item.type === "anime");
  const movies = items.filter((item) => item.type === "movies");
  const isHeroBookmarked = Boolean(
    heroRelease && bookmarks.some((bookmark) => bookmark.id === heroRelease.id),
  );

  const handleHeroBookmark = async () => {
    if (!heroRelease) return;

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      if (isHeroBookmarked) {
        await remove(heroRelease.id);
      } else {
        await add(heroRelease.id);
      }
    } catch {
      // The error is stored inside useBookmarks.
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p style={{ color: "var(--text-muted)", padding: "40px 0" }}>
          Завантаження каталогу з сервера...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p
          role="alert"
          style={{
            color: "var(--status-error, #ff4d6d)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            padding: "40px 0",
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (!heroRelease) {
    return (
      <div className="container">
        <p style={{ color: "var(--text-muted)", padding: "40px 0" }}>
          Каталог порожній. Додайте тайтли через API.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.home} data-testid="home-page">
        {/* 1. HERO SPOTLIGHT */}
        <HeroSpotlight
          release={heroRelease}
          isBookmarked={isHeroBookmarked}
          onToggleBookmark={handleHeroBookmark}
        />

        {/* 2. CONTINUE WATCHING */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>Продовжити перегляд</span>
              <span className={styles.sectionSubtitle}>
                Збережений прогрес на edge-вузлі
              </span>
            </div>
            <Link to={isAuthenticated ? "/profile" : "/auth"}>
              <Button variant="ghost" size="sm">
                {isAuthenticated ? "Всі збережені →" : "Увійти →"}
              </Button>
            </Link>
          </div>

          {!isAuthenticated ? (
            <div
              style={{
                border: "1px dashed var(--border-subtle)",
                padding: 24,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              Увійдіть, щоб бачити збережений прогрес перегляду.
            </div>
          ) : continueLoading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Завантаження прогресу...
            </p>
          ) : continueError ? (
            <p
              role="alert"
              style={{
                color: "var(--status-error, #ff4d6d)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {continueError}
            </p>
          ) : continueItems.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border-subtle)",
                padding: 24,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              Ви ще нічого не дивилися. Відкрийте тайтл і запустіть плеєр.
            </div>
          ) : (
            <div className={styles.episodesGrid}>
              {continueItems.map((entry) => {
                const card = toEpisodeCard(entry);

                return (
                  <EpisodeCard
                    key={`${entry.titleId}-${entry.episodeId || "title"}`}
                    episode={card.episode}
                    mediaId={card.mediaId}
                    thumb={card.thumb}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 3. TRENDING SERIES */}
        <section>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTitle}>
                Популярні кіберпанк-серіали
              </span>
              <span className={styles.sectionSubtitle}>
                Найвищий бітрейт та локалізація
              </span>
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
              <span className={styles.sectionTitle}>
                Культове кіберпанк-аніме
              </span>
              <span className={styles.sectionSubtitle}>
                4K ремастери, класика та онґоїнґи
              </span>
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
              <span className={styles.sectionSubtitle}>
                Незжатий звук Dolby Atmos
              </span>
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
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <Badge variant="primary">ПОСЕРЕДНИК ДИВИЛО</Badge>
              <Badge variant="live" liveDot>
                СТРІМІНГ-ХАБ
              </Badge>
            </div>
            <h2 className={styles.manifestoTitle}>
              НЕ СХОВИЩЕ. КОМФОРТНИЙ СТРІМІНГ-ПОСЕРЕДНИК.
            </h2>
            <p className={styles.manifestoText}>
              «Дивило» — це швидкий та комфортний посередник між глядачем і
              відкритими онлайн-кінотеатрами (HDRezka, UAKino та ін.). Ми не
              зберігаємо важкі файли на власних серверах, а агрегуємо відкриті
              потоки в єдиний високотехнологічний інтерфейс — з чистим плеєром,
              повною відсутністю нав’язливої реклами та максимальною зручністю
              перегляду.
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
