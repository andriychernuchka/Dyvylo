// src/api/titles.js

import { request } from "./client";

function toQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function fetchTitles(params = {}) {
  return request(`/titles${toQuery(params)}`);
}

export async function fetchTitle(id) {
  return request(`/titles/${encodeURIComponent(id)}`);
}

export async function fetchEpisodes(id) {
  return request(`/titles/${encodeURIComponent(id)}/episodes`);
}
