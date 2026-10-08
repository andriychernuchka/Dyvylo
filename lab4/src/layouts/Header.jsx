import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Modal } from '../components/ui';
import { STREAM_NODES } from '../data/mockData';
import styles from './Header.module.css';

export function Header() {
  const location = useLocation();
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(STREAM_NODES[0].name);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={styles.header} data-testid="site-header">
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.left}>
              <Link to="/" className={styles.brand}>
                <div className={styles.brandSquare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                  className={`${styles.navLink} ${isActive('/') && location.pathname === '/' ? styles.activeLink : ''}`}
                >
                  Головна
                </Link>
                <Link
                  to="/catalog"
                  className={`${styles.navLink} ${isActive('/catalog') ? styles.activeLink : ''}`}
                >
                  Каталог
                </Link>
                <Link
                  to="/player/house-of-the-dragon"
                  className={`${styles.navLink} ${isActive('/player') ? styles.activeLink : ''}`}
                >
                  Плеєр
                </Link>
              </nav>
            </div>

            <div className={styles.right}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNodeModalOpen(true)}
                title="Вибір стрімінг-вузла"
              >
                Вузол: {activeNode.split(' ')[0]}
              </Button>

              <Link to="/catalog" className={styles.searchBar}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Пошук...</span>
                <span className={styles.shortcut}>⌘K</span>
              </Link>

              <Link to="/profile" className={styles.userPill} title="Особистий кабінет">
                <div className={styles.avatar}>O</div>
                <span>@operator</span>
              </Link>

              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Вхід
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Node Selector Modal */}
      <Modal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        title="Вибір шлюзу ретрансляції"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            «Дивило» не зберігає контент, а напряму проксує відкриті відеопотоки через незалежні edge-вузли.
          </p>
          {STREAM_NODES.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                setActiveNode(node.name);
                setIsNodeModalOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: activeNode === node.name ? 'var(--accent-dim)' : 'var(--bg-card)',
                border: `1px solid ${activeNode === node.name ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: 13 }}>{node.name}</strong>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Навантаження: {node.load}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--status-live)',
                }}
              >
                ● {node.ping}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default Header;
