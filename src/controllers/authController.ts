import { Request, Response } from "express";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err: unknown) {
    console.error("register failed:", err);
    // единственная ошибка, которую можно показать юзеру — "email занят"
    if (err instanceof Error && err.message === "Email already in use") {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err: unknown) {
    console.error("login failed:", err);
    // НЕ разделяем "user not found" и "invalid password" — юзеру одинаковая ошибка,
    // иначе можно перебирать email'ы (user enumeration)
    res.status(401).json({ error: "Invalid email or password" });
  }
};
