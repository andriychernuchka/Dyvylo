/**
 * Form validation utilities
 */

export function validateEmail(email) {
  if (!email) return 'Email обов’язковий для заповнення';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Некоректний формат email адреси';
}

export function validatePassword(password) {
  if (!password) return 'Пароль обов’язковий';
  if (password.length < 6) return 'Пароль має містити щонайменше 6 символів';
  return '';
}
