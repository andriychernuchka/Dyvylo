import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { useAuth } from '../features/auth/hooks/useAuth';

export function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = ({ email, password }) => {
    login(email, password);
    navigate('/profile');
  };

  const handleRegister = ({ name, email, password }) => {
    register(name, email, password);
    navigate('/profile');
  };

  return (
    <section data-testid="auth-page">
      <h1>Авторизація</h1>
      <LoginForm onSubmit={handleLogin} />
      <hr />
      <RegisterForm onSubmit={handleRegister} />
    </section>
  );
}

export default AuthPage;
