// src/api/auth.js

import { request, setToken, getToken, clearSession } from "./client";

const AUTH_STATUS_KEY = "dyvylo_auth_status";
const USER_KEY = "dyvylo_user";

export function isAuthenticated() {
  return Boolean(getToken()) && localStorage.getItem(AUTH_STATUS_KEY) === "authenticated";
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(data) {
  if (data?.token) setToken(data.token);
  localStorage.setItem(AUTH_STATUS_KEY, "authenticated");
  if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event("auth-change"));
}

export async function login(credentials) {
  const data = await request("/auth/login", {
    method: "POST",
    body: credentials,
  });

  saveSession(data);
  return data;
}

export async function register(payload) {
  const data = await request("/auth/register", {
    method: "POST",
    body: payload,
  });

  saveSession(data);
  return data;
}

export async function me() {
  const data = await request("/auth/me");
  const user = data?.user || null;

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  }

  return user;
}

export async function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(token, newPassword) {
  return request("/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });
}

/**
 * Keep the locally stored user in sync after a profile update.
 */
export function updateStoredUser(user) {
  if (!user) return;

  localStorage.setItem(USER_KEY, JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }));
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Validate the stored token against the API. If the token is missing or
 * expired, the local session is cleared.
 */
export async function refreshSession() {
  if (!getToken()) {
    clearSession();
    return null;
  }

  try {
    return await me();
  } catch {
    clearSession();
    return null;
  }
}

export function logout() {
  // JWT is stateless: clear the client session immediately and let the
  // server-side logout request finish in the background.
  if (getToken()) {
    request("/auth/logout", { method: "POST" }).catch(() => {});
  }

  clearSession();
}
