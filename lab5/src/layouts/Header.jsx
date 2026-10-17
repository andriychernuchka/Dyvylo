import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui";
import styles from "./Header.module.css";

export function Header() {
  const location = useLocation();

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

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className={styles.header} data-testid="site-header">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link to="/" className={styles.brand}>
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
            </Link>

            <nav className={styles.nav}>
              <Link
                to="/"
                className={`${styles.navLink} ${isActive("/") && location.pathname === "/" ? styles.activeLink : ""}`}
              >
                Головна
              </Link>
              <Link
                to="/catalog"
                className={`${styles.navLink} ${isActive("/catalog") ? styles.activeLink : ""}`}
              >
                Каталог
              </Link>
              <Link
                to="/player/blade-runner-2049"
                className={`${styles.navLink} ${isActive("/player") ? styles.activeLink : ""}`}
              >
                Плеєр
              </Link>
            </nav>
          </div>

          <div className={styles.right}>
            <Link to="/catalog" className={styles.searchBar}>
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
            </Link>

            {/* Mutually exclusive auth display */}
            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link
                  to="/profile"
                  className={styles.userPill}
                  title="Особистий кабінет"
                >
                  <div className={styles.avatar}>O</div>
                  <span>@operator</span>
                </Link>
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
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Вхід / Реєстрація
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
