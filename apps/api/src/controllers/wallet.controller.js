import { asyncHandler } from "../utils/asyncHandler.js";
import * as wallet from "../services/wallet.service.js";

export const get = asyncHandler(async (req, res) => res.json(await wallet.getWallet(req.user.id)));

export const transactions = asyncHandler(async (req, res) =>
  res.json(await wallet.listTransactions(req.user.id, req.query))
);

export const reset = asyncHandler(async (req, res) => res.json(await wallet.resetBalance(req.user.id)));