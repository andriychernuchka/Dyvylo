// src/api/bookmarks.js

import { request, isApiUnavailable } from "./client";
import {
  getLocalBookmarks,
  addLocalBookmark,
  removeLocalBookmark,
  clearLocalBookmarks,
} from "./localStore";

// If fetch fails because the API is not connected yet, use temporary browser
// storage instead of crashing the UI. HTTP errors from a real API are rethrown.
function canUseLocalFallback(error) {
  return isApiUnavailable(error);
}

export async function fetchBookmarks() {
  try {
    return await request("/bookmarks");
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    return getLocalBookmarks();
  }
}

export async function addBookmark(item) {
  try {
    return await request("/bookmarks", {
      method: "POST",
      body: item,
    });
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    return addLocalBookmark(item);
  }
}

export async function removeBookmark(id) {
  try {
    return await request(`/bookmarks/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    return removeLocalBookmark(id);
  }
}

export async function clearBookmarks() {
  try {
    return await request("/bookmarks", {
      method: "DELETE",
    });
  } catch (error) {
    if (!canUseLocalFallback(error)) throw error;
    return clearLocalBookmarks();
  }
}
