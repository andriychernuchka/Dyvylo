import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import styles from './AuthPage.module.css';

export function AuthPage() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Non-blocking UI demonstration without backend
    navigate('/profile');
  };

  return (
    <div className="container">
      <div className={styles.authContainer} data-testid="auth-page">
        <div className={styles.box}>
          <div className={styles.topLogo}>
            <div
              style={{
                width: 32,
                height: 32,
                border: '1px solid var(--accent-primary)',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              [·]
            </div>
            <h2 className={styles.title}>
              {tab === 'login' ? 'Вхід у термінал' : 'Реєстрація вузла'}
            </h2>
            <p className={styles.sub}>
              {tab === 'login'
                ? 'Авторизація оператора платформи ДИВИЛО'
                : 'Створення облікового запису та персонального списку'}
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
              onClick={() => setTab('login')}
            >
              Вхід
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`}
              onClick={() => setTab('register')}
            >
              Реєстрація
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} data-testid="auth-form">
            {tab === 'register' && (
              <Input
                label="Позивний / Ім'я оператора"
                placeholder="Наприклад: operator-01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Електронна пошта"
              type="email"
              placeholder="operator@dyvylo.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Ключ доступу (Пароль)"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className={styles.checkboxRow}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Запам&apos;ятати цей пристрій</span>
              </label>
              <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 11 }}>
                Забули ключ?
              </span>
            </div>

            <Button type="submit" variant="primary" size="lg">
              {tab === 'login' ? 'Увійти в термінал' : 'Зареєструвати вузол'}
            </Button>
          </form>

          <div className={styles.divider}>АБО ШВИДКИЙ ВХІД</div>

          <div className={styles.socials}>
            <Button
              variant="outline"
              size="md"
              style={{ flex: 1 }}
              onClick={() => navigate('/profile')}
            >
              GitHub ID
            </Button>
            <Button
              variant="outline"
              size="md"
              style={{ flex: 1 }}
              onClick={() => navigate('/profile')}
            >
              Passkey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
