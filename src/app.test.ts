import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "./app";
import * as authService from "./services/authService";

const authMock = vi.hoisted(() => {
  class AuthError extends Error {
    code: string;

    constructor(code: string, message: string) {
      super(message);
      this.code = code;
      this.name = "AuthError";
    }
  }

  return {
    AuthError,
    login: vi.fn(),
  };
});

vi.mock("./config/env", () => ({
  JWT_SECRET: "test-secret",
}));

vi.mock("./services/authService", () => ({
  AuthError: authMock.AuthError,
  login: authMock.login,
  register: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe("auth HTTP routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("POST /auth/login", () => {
    it("returns access token, user, and refresh cookie for valid credentials", async () => {
      vi.mocked(authService.login).mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        refreshExpiresAt: new Date(),
        user: {
          id: 1,
          email: "oleg@example.com",
        },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "OLEG@example.com",
          password: "secret123",
        })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: "access-token",
        user: {
          id: 1,
          email: "oleg@example.com",
        },
      });
      expect(response.headers["set-cookie"][0]).toContain(
        "refresh_token=refresh-token",
      );
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
      expect(response.headers["set-cookie"][0]).toContain("Path=/auth");
      expect(authService.login).toHaveBeenCalledWith(
        "oleg@example.com",
        "secret123",
      );
    });

    it("returns 401 for invalid credentials", async () => {
      vi.mocked(authService.login).mockRejectedValue(
        new authService.AuthError(
          "INVALID_CREDENTIALS",
          "Invalid email or password",
        ),
      );

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "oleg@example.com",
          password: "wrong-password",
        })
        .expect(401);

      expect(response.body).toEqual({ error: "Invalid email or password" });
    });

    it("returns 400 and does not call service for invalid input", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "not-an-email",
          password: "",
        })
        .expect(400);

      expect(response.body.error).toBe("Validation failed");
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "email" }),
          expect.objectContaining({ field: "password" }),
        ]),
      );
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});
