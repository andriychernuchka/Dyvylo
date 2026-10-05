const CURRENT_USER_KEY = 'dyvylo_auth_user';

export const authService = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  login(email, _password) {
    if (!email) return null;
    const user = { email, name: email.split('@')[0] || 'User' };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },
  register(name, email, _password) {
    const user = { name: name || 'User', email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};

export default authService;
