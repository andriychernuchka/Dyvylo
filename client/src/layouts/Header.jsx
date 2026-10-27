import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header data-testid="site-header">
      <nav>
        <Link to="/" data-testid="nav-home">
          Головна
        </Link>
        {' | '}
        <Link to="/catalog" data-testid="nav-catalog">
          Каталог
        </Link>
        {' | '}
        <Link to="/player/demo" data-testid="nav-player">
          Плеєр
        </Link>
        {' | '}
        {user ? (
          <>
            <Link to="/profile" data-testid="nav-profile">
              Профіль ({user.name})
            </Link>
            {' | '}
            <button type="button" onClick={logout} data-testid="nav-logout-btn">
              Вийти
            </button>
          </>
        ) : (
          <Link to="/auth" data-testid="nav-auth-btn">
            Вхід
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
