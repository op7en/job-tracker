import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import * as userRepo from "../repositories/userRepo";

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

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.id, email: user.email } };
};
