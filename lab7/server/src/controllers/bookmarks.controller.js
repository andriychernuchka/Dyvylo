import * as bookmarksService from "../services/bookmarks.service.js";

export function list(req, res) {
  res.json(bookmarksService.listBookmarks(req.user.id));
}

export function add(req, res) {
  res.status(201).json(bookmarksService.addBookmark(req.user.id, req.body));
}

export function remove(req, res) {
  res.json(bookmarksService.removeBookmark(req.user.id, req.params.titleId));
}

export function clear(req, res) {
  bookmarksService.clearBookmarks(req.user.id);
  res.status(204).end();
}
