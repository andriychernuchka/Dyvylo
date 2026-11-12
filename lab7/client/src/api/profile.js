// src/api/profile.js

import { request } from "./client";

export async function fetchProfile() {
  return request("/profile");
}

export async function updateProfile(patch) {
  return request("/profile", {
    method: "PATCH",
    body: patch,
  });
}

export async function changePassword(payload) {
  return request("/profile/password", {
    method: "PUT",
    body: payload,
  });
}
