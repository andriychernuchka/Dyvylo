// src/api/client.js

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

const TOKEN_KEY = "dyvylo_token";
const AUTH_STATUS_KEY = "dyvylo_auth_status";
const USER_KEY = "dyvylo_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_STATUS_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Small wrapper around fetch.
 * Adds JSON headers and the bearer token when the user is logged in.
 */
export async function request(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (response.status === 401) {
    // The session is no longer valid - drop it so the UI can react.
    clearSession();
  }

  if (!response.ok) {
    let message = `Помилка запиту (${response.status})`;
    let errors;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
      if (data?.errors) errors = data.errors;
    } catch {
      // Response was not JSON - keep the default error message.
    }
    const error = new Error(message);
    error.status = response.status;
    error.errors = errors;
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
}
