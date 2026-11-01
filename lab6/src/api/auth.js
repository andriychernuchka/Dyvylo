// src/api/auth.js

import { request, setToken, clearToken, isApiUnavailable } from "./client";
import { loginLocally, registerLocally } from "./localStore";

const AUTH_STATUS_KEY = "dyvylo_auth_status";
const USER_KEY = "dyvylo_user";

function canUseLocalFallback(error) {
  return isApiUnavailable(error);
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_STATUS_KEY) === "authenticated";
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
  // The header listens to this event and updates the auth state immediately.
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("auth-change"));
}

export async function login(credentials) {
  let data;
  try {
    data = await request("/auth/login", {
      method: "POST",
      body: credentials,
    });
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    data = loginLocally(credentials);
  }

  saveSession(data);
  return data;
}

export async function register(payload) {
  let data;
  try {
    data = await request("/auth/register", {
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    data = registerLocally(payload);
  }

  saveSession(data);
  return data;
}

export function logout() {
  clearToken();
  localStorage.removeItem(AUTH_STATUS_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("auth-change"));
}
