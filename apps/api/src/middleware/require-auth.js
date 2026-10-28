import { verifyAccessToken } from "../services/token.service.js";

export function requireAuth(req, res, next) {
  const accessToken = req.cookies?.cw_access;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
    });
  }

  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_ACCESS_TOKEN",
        message: "The access token is invalid or expired.",
      },
    });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.sub !== "string" ||
    !payload.sub
  ) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_ACCESS_TOKEN",
        message: "The access token is invalid or expired.",
      },
    });
  }

  req.auth = { userId: payload.sub };
  return next();
}