// src/api/client.js

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "dyvylo_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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

  if (!response.ok) {
    let message = `Помилка запиту (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // Response was not JSON - keep the default error message.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
}

/**
 * True when the request failed because there is no API behind the URL
 * (network error, Vite SPA fallback HTML, missing route, etc.).
 */
export function isApiUnavailable(error) {
  return (
    !error?.status ||
    error.status === 404 ||
    error.status === 405
  );
}
