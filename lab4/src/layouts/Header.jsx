import { useState, useEffect } from "react";
import { Button } from "../components/ui";
import styles from "./Header.module.css";

export function Header() {
  // Auth state synchronization: default unauthenticated unless logged in
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("dyvylo_auth_status") === "authenticated";
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(
        localStorage.getItem("dyvylo_auth_status") === "authenticated",
      );
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dyvylo_auth_status");
    setIsAuthenticated(false);
  };

  return (
    <header className={styles.header} data-testid="site-header">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <a href="#home" className={styles.brand}>
              <div className={styles.brandSquare}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div className={styles.brandName}>
                  ДИВИЛО<span className={styles.brandDot}>.</span>
                </div>
                <span className={styles.brandSub}>стрімінг-агрегатор</span>
              </div>
            </a>

            <nav className={styles.nav}>
              <a href="#home" className={`${styles.navLink} ${styles.activeLink}`}>
                Головна
              </a>
              <a href="#catalog" className={styles.navLink}>
                Каталог
              </a>
              <a href="#player" className={styles.navLink}>
                Плеєр
              </a>
            </nav>
          </div>

          <div className={styles.right}>
            <a href="#catalog" className={styles.searchBar}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Пошук...</span>
              <span className={styles.shortcut}>⌘K</span>
            </a>

            {/* Mutually exclusive auth display */}
            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <a
                  href="#profile"
                  className={styles.userPill}
                  title="Особистий кабінет"
                >
                  <div className={styles.avatar}>O</div>
                  <span>@operator</span>
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Вийти з акаунта"
                  className={styles.navLink}
                  style={{
                    fontSize: 11,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Вийти
                </button>
              </div>
            ) : (
              <a href="#auth">
                <Button variant="primary" size="sm">
                  Вхід / Реєстрація
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
