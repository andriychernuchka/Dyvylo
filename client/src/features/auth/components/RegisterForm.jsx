import { useState } from 'react';

export function RegisterForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="register-form">
      <div>
        <label htmlFor="register-name">Ім&apos;я:</label>
        <input
          id="register-name"
          type="text"
          placeholder="Ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="register-email">Email:</label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="register-password">Пароль:</label>
        <input
          id="register-password"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" data-testid="register-submit-btn">
        Зареєструватися
      </button>
    </form>
  );
}

export default RegisterForm;
