import { useState } from 'react';
import { AuthContext } from './authContextDef';
import { authService } from '../features/auth/services/authService';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = (email, password) => {
    const authenticated = authService.login(email, password);
    setUser(authenticated);
    return authenticated;
  };

  const register = (name, email, password) => {
    const registered = authService.register(name, email, password);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
