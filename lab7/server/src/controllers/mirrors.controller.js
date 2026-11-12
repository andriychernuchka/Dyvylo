import * as mirrorsService from "../services/mirrors.service.js";

export function list(_req, res) {
  res.json(mirrorsService.listMirrors());
}

export function getSelection(req, res) {
  res.json(mirrorsService.getSelection(req.user.id, req.params.titleId));
}

export function setSelection(req, res) {
  res.json(
    mirrorsService.setSelection(
      req.user.id,
      req.params.titleId,
      req.body,
    ),
  );
}
