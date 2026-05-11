import request from "supertest";
import jwt from "jsonwebtoken";
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
    refresh: vi.fn(),
    logout: vi.fn(),
  };
});

vi.mock("./config/env", () => ({
  JWT_SECRET: "test-secret",
}));

vi.mock("./services/authService", () => ({
  AuthError: authMock.AuthError,
  login: authMock.login,
  refresh: authMock.refresh,
  logout: authMock.logout,
  register: vi.fn(),
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
          email: "user@example.com",
        },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "user@example.com",
          password: "secret123",
        })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: "access-token",
        user: {
          id: 1,
          email: "user@example.com",
        },
      });
      expect(response.headers["set-cookie"][0]).toContain(
        "refresh_token=refresh-token",
      );
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
      expect(response.headers["set-cookie"][0]).toContain("Path=/auth");
      expect(authService.login).toHaveBeenCalledWith(
        "user@example.com",
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
          email: "user@example.com",
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

  describe("GET /auth/me", () => {
    it("returns 401 when authorization header is missing", async () => {
      const response = await request(app).get("/auth/me").expect(401);

      expect(response.body).toEqual({ message: "No token" });
      expect(authService.getCurrentUser).not.toHaveBeenCalled();
    });

    it("returns 401 for an invalid access token", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toEqual({ message: "Invalid token" });
      expect(authService.getCurrentUser).not.toHaveBeenCalled();
    });

    it("returns the current user for a valid access token", async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue({
        id: 1,
        email: "user@example.com",
      });
      const accessToken = jwt.sign({ id: 1 }, "test-secret");

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: 1,
          email: "user@example.com",
        },
      });
      expect(authService.getCurrentUser).toHaveBeenCalledWith(1);
    });
  });

  describe("POST /auth/refresh", () => {
    it("returns 401 when refresh cookie is missing", async () => {
      const response = await request(app).post("/auth/refresh").expect(401);

      expect(response.body).toEqual({ error: "No refresh token" });
      expect(authService.refresh).not.toHaveBeenCalled();
    });

    it("rotates a valid refresh cookie", async () => {
      vi.mocked(authService.refresh).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        refreshExpiresAt: new Date(),
        user: {
          id: 1,
          email: "user@example.com",
        },
      });

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refresh_token=old-refresh-token")
        .expect(200);

      expect(response.body).toEqual({
        accessToken: "new-access-token",
        user: {
          id: 1,
          email: "user@example.com",
        },
      });
      expect(response.headers["set-cookie"][0]).toContain(
        "refresh_token=new-refresh-token",
      );
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
      expect(response.headers["set-cookie"][0]).toContain("Path=/auth");
      expect(authService.refresh).toHaveBeenCalledWith("old-refresh-token");
    });

    it("clears refresh cookie for an invalid refresh token", async () => {
      vi.mocked(authService.refresh).mockRejectedValue(
        new authService.AuthError(
          "INVALID_REFRESH_TOKEN",
          "Invalid refresh token",
        ),
      );

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refresh_token=stolen-refresh-token")
        .expect(401);

      expect(response.body).toEqual({ error: "Invalid refresh token" });
      expect(response.headers["set-cookie"][0]).toContain("refresh_token=");
      expect(response.headers["set-cookie"][0]).toContain(
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      );
    });
  });

  describe("POST /auth/logout", () => {
    it("revokes the current refresh cookie and clears it", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", "refresh_token=refresh-token")
        .expect(204);

      expect(response.text).toBe("");
      expect(response.headers["set-cookie"][0]).toContain("refresh_token=");
      expect(response.headers["set-cookie"][0]).toContain(
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      );
      expect(authService.logout).toHaveBeenCalledWith("refresh-token");
    });
  });
});
