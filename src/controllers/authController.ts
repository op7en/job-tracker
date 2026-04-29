import { CookieOptions, Request, Response } from "express";
import * as authService from "../services/authService";

const REFRESH_COOKIE = "refresh_token";
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const isSecureCookie =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.RAILWAY_ENVIRONMENT) ||
  process.env.FRONTEND_URL?.startsWith("https://");

interface AuthRequest extends Request {
  userId?: number;
}

const refreshCookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: isSecureCookie ? "none" : "lax",
  path: "/auth",
};

const refreshCookieOptions: CookieOptions = {
  ...refreshCookieBaseOptions,
  maxAge: REFRESH_MAX_AGE,
};

const getCookie = (req: Request, key: string): string | undefined => {
  const raw = req.headers.cookie;
  if (!raw) return undefined;

  const parts = raw.split(";").map((p) => p.trim());
  const item = parts.find((p) => p.startsWith(`${key}=`));
  if (!item) return undefined;
  return decodeURIComponent(item.slice(key.length + 1));
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err: unknown) {
    if (err instanceof authService.AuthError && err.code === "EMAIL_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }

    console.error("register failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions);
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err: unknown) {
    if (
      err instanceof authService.AuthError &&
      err.code === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.error("login failed:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = getCookie(req, REFRESH_COOKIE);
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const result = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions);
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err: unknown) {
    if (
      err instanceof authService.AuthError &&
      err.code === "INVALID_REFRESH_TOKEN"
    ) {
      res.clearCookie(REFRESH_COOKIE, refreshCookieBaseOptions);
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    console.error("refresh failed:", err);
    res.clearCookie(REFRESH_COOKIE, refreshCookieBaseOptions);
    res.status(500).json({ error: "Refresh failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = getCookie(req, REFRESH_COOKIE);
    await authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, refreshCookieBaseOptions);
    res.status(204).send();
  } catch (err: unknown) {
    console.error("logout failed:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await authService.getCurrentUser(req.userId);
    res.json({ user });
  } catch (err: unknown) {
    if (
      err instanceof authService.AuthError &&
      err.code === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.error("me failed:", err);
    res.status(500).json({ error: "Failed to load current user" });
  }
};
