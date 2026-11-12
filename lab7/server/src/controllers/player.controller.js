import * as playerService from "../services/player.service.js";

export function list(req, res) {
  res.json(playerService.listProgress(req.user.id, req.query));
}

export function getOne(req, res) {
  res.json(
    playerService.getProgress(
      req.user.id,
      req.params.titleId,
      req.query.episodeId,
    ),
  );
}

export function save(req, res) {
  res.json(playerService.saveProgress(req.user.id, req.body));
}

export function remove(req, res) {
  res.json(playerService.deleteProgress(req.user.id, req.params.titleId));
}
