import * as titlesService from "../services/titles.service.js";

export function list(req, res) {
  res.json(titlesService.listTitles(req.query));
}

export function getOne(req, res) {
  res.json(
    titlesService.getTitleWithEpisodes(req.params.id, req.user?.id || null),
  );
}

export function getEpisodes(req, res) {
  res.json(titlesService.getEpisodes(req.params.id, req.user?.id || null));
}
