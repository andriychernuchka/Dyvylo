// src/api/player.js

import { API_BASE, getToken, request } from "./client";

export async function fetchProgress(limit = 20) {
  return request(`/player/progress?limit=${encodeURIComponent(limit)}`);
}

export async function fetchTitleProgress(titleId, episodeId) {
  const query = episodeId ? `?episodeId=${encodeURIComponent(episodeId)}` : "";

  return request(`/player/progress/${encodeURIComponent(titleId)}${query}`);
}

export async function saveProgress(payload) {
  return request("/player/progress", {
    method: "PUT",
    body: payload,
  });
}

export async function deleteProgress(titleId) {
  return request(`/player/progress/${encodeURIComponent(titleId)}`, {
    method: "DELETE",
  });
}

/**
 * Progress save that survives page unload. Called on pagehide / beforeunload.
 */
export function saveProgressBeacon(payload) {
  const token = getToken();

  if (!token) return Promise.resolve(null);

  return fetch(`${API_BASE}/player/progress`, {
    method: "PUT",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).catch(() => null);
}
