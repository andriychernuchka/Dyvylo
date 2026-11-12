// src/api/bookmarks.js

import { request } from "./client";

export async function fetchBookmarks() {
  return request("/bookmarks");
}

export async function addBookmark(item) {
  const id = typeof item === "string" ? item : item?.id;

  return request("/bookmarks", {
    method: "POST",
    body: { id },
  });
}

export async function removeBookmark(id) {
  return request(`/bookmarks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function clearBookmarks() {
  return request("/bookmarks", {
    method: "DELETE",
  });
}
