import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../config/env";
import * as userRepo from "../repositories/userRepo";
import * as refreshTokenRepo from "../repositories/refreshTokenRepo";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30d

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (userId: number) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const createRefreshSession = async (userId: number) => {
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await refreshTokenRepo.create(userId, tokenHash, expiresAt);
  return { refreshToken, expiresAt };
};

const buildAuthPayload = async (userId: number) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const accessToken = signAccessToken(userId);
  const { refreshToken, expiresAt } = await createRefreshSession(userId);

  return {
    user,
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt,
  };
};

export const register = async (email: string, password: string) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  return userRepo.createUser(email, hashed);
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  return buildAuthPayload(user.id);
};

export const refresh = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  const stored = await refreshTokenRepo.findValidByHash(tokenHash);
  if (!stored) throw new Error("Invalid refresh token");

  await refreshTokenRepo.revokeById(stored.id);
  return buildAuthPayload(stored.user_id);
};

export const logout = async (refreshToken: string | undefined) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await refreshTokenRepo.revokeByHash(tokenHash);
};
