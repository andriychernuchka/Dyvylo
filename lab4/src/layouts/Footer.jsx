import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} data-testid="site-footer">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <div className={styles.brandSquare}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className={styles.brandName}>ДИВИЛО.</span>
            </div>
            <p className={styles.desc}>
              Український стрімінг-агрегатор нового покоління. Ми не зберігаємо відеофайли,
              а виступаємо комфортним та швидким посередником для перегляду відкритих потоків
              без реклами з чистим плеєром та живою телеметрією.
            </p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Навігація</h4>
            <ul className={styles.links}>
              <li><a href="#catalog">Головна каталогу</a></li>
              <li><a href="#catalog">Фільми у 4K HDR</a></li>
              <li><a href="#catalog">Серіали та онґоїнґи</a></li>
              <li><a href="#catalog">Культове аніме</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Студії озвучки</h4>
            <ul className={styles.links}>
              <li><a href="#catalog">Цікава Ідея</a></li>
              <li><a href="#catalog">НеЗупиняйПродакшн</a></li>
              <li><a href="#catalog">В одне рило</a></li>
              <li><a href="#catalog">DniproFilm</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Шлюз та профіль</h4>
            <ul className={styles.links}>
              <li><a href="#profile">Особистий кабінет</a></li>
              <li><a href="#auth">Вхід та реєстрація</a></li>
              <li><a href="https://github.com/andriychernuchka/Dyvylo" target="_blank" rel="noreferrer">GitHub репозиторій</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© 2026 ДИВИЛО · УСІ ПРАВА НАЛЕЖАТЬ ПРАВОВЛАСНИКАМ · АГРЕГАТОР-ПОСЕРЕДНИК</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className={styles.telemetryBadge}>
              <span className={styles.dot} />
              <span>КИЇВ #1 ACTIVE</span>
            </span>
            <span>ПІНГ: 18.2 MS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
