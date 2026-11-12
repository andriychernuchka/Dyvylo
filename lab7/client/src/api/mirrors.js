// src/api/mirrors.js

import { request } from "./client";

export async function fetchMirrors() {
  return request("/mirrors");
}

export async function fetchMirrorSelection(titleId) {
  return request(`/mirrors/${encodeURIComponent(titleId)}/selection`);
}

export async function saveMirrorSelection(titleId, mirrorId) {
  return request(`/mirrors/${encodeURIComponent(titleId)}/selection`, {
    method: "PUT",
    body: { mirrorId },
  });
}
