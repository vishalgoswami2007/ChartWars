import { asyncHandler } from "../utils/asyncHandler.js";
import * as matches from "../services/match.service.js";

export const mine = asyncHandler(async (req, res) => res.json(await matches.listMine(req.user.id, req.query)));

export const one = asyncHandler(async (req, res) =>
  res.json({ match: await matches.getOne(req.user.id, req.params.id) })
);