// src/api/localStore.js
//
// Temporary browser-side storage used only when the API is not available.
// It is not a backend and does not replace a real server; it just keeps the
// Lab 6 UI functional while the API part is not connected yet.

const BOOKMARKS_KEY = "dyvylo_bookmarks";
const AUTH_STATUS_KEY = "dyvylo_auth_status";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function requireAuth(message = "Додавати в закладки можна тільки після реєстрації") {
  if (localStorage.getItem(AUTH_STATUS_KEY) !== "authenticated") {
    const error = new Error(message);
    error.status = 401;
    throw error;
  }
}

export function getLocalBookmarks() {
  const list = read(BOOKMARKS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function addLocalBookmark(item) {
  requireAuth();
  if (!item?.id) {
    const error = new Error("У тайтла відсутній id");
    error.status = 400;
    throw error;
  }

  const bookmarks = getLocalBookmarks();
  if (bookmarks.some((bookmark) => bookmark.id === item.id)) {
    return item;
  }

  write(BOOKMARKS_KEY, [item, ...bookmarks]);
  return item;
}

export function removeLocalBookmark(id) {
  requireAuth("Керувати закладками можна тільки після реєстрації");
  const bookmarks = getLocalBookmarks().filter((bookmark) => bookmark.id !== id);
  write(BOOKMARKS_KEY, bookmarks);
  return { ok: true };
}

export function clearLocalBookmarks() {
  requireAuth("Керувати закладками можна тільки після реєстрації");
  write(BOOKMARKS_KEY, []);
  return null;
}

export function loginLocally({ email, password }) {
  if (!email || !password) {
    const error = new Error("Вкажіть електронну пошту та пароль");
    error.status = 400;
    throw error;
  }

  return {
    token: `local_token_${Date.now()}`,
    user: {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0] || "operator",
    },
  };
}

export function registerLocally({ name, email, password }) {
  if (!email || !password) {
    const error = new Error("Вкажіть електронну пошту та пароль");
    error.status = 400;
    throw error;
  }

  return {
    token: `local_token_${Date.now()}`,
    user: {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split("@")[0] || "operator",
    },
  };
}
