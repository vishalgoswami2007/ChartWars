
import { signupUser, loginUser , googleLoginUser} from "../services/auth.service.js";
import { createAccessToken } from "../services/token.service.js";
import {
  createRefreshSession,
  rotateRefreshSession,
  revokeRefreshSession,
} from "../services/refresh-session.service.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../config/cookies.js";
import User from "../models/User.js";

export async function signup(req, res, next) {
  try {
    const user = await signupUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);

    const accessToken = createAccessToken(user.id);
    const refreshSession = await createRefreshSession(user.id);

    res.cookie("cw_access", accessToken, accessCookieOptions);
    res.cookie("cw_refresh", refreshSession.token, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function googleLogin(req, res, next) {
  try {
    const user = await googleLoginUser(req.body);

    const accessToken = createAccessToken(user.id);
    const refreshSession = await createRefreshSession(user.id);

    res.cookie("cw_access", accessToken, accessCookieOptions);
    res.cookie("cw_refresh", refreshSession.token, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.cw_refresh;

    if (!refreshToken) {
      const error = new Error("Refresh token is missing.");
      error.statusCode = 401;
      error.code = "INVALID_REFRESH_TOKEN";
      return next(error);
    }

    const session = await rotateRefreshSession(refreshToken);
    const accessToken = createAccessToken(session.userId);

    res.cookie("cw_access", accessToken, accessCookieOptions);
    res.cookie("cw_refresh", session.token, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
    });
  } catch (error) {
    if (error.statusCode === 401) {
      res.clearCookie("cw_access", accessCookieOptions);
      res.clearCookie("cw_refresh", refreshCookieOptions);
    }

    return next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.cw_refresh;

    if (refreshToken) {
      await revokeRefreshSession(refreshToken);
    }

    res.clearCookie("cw_access", accessCookieOptions);
    res.clearCookie("cw_refresh", refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId)
      .select("_id username email createdAt")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "The user account no longer exists.",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: String(user._id),
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}
