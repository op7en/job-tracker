import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authService from "./authService";
import * as refreshTokenRepo from "../repositories/refreshTokenRepo";
import * as userRepo from "../repositories/userRepo";

vi.mock("../config/env", () => ({
  JWT_SECRET: "test-secret",
}));

vi.mock("../repositories/userRepo", () => ({
  findByEmail: vi.fn(),
  findById: vi.fn(),
  createUser: vi.fn(),
}));

vi.mock("../repositories/refreshTokenRepo", () => ({
  create: vi.fn(),
  rotate: vi.fn(),
  findByHash: vi.fn(),
  revokeFamilyById: vi.fn(),
  revokeByHash: vi.fn(),
}));

const publicUser = {
  id: 1,
  email: "oleg@example.com",
};

const expectAuthError = async (
  action: Promise<unknown>,
  code: authService.AuthErrorCode,
) => {
  await expect(action).rejects.toMatchObject({
    name: "AuthError",
    code,
  });
};

describe("authService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(userRepo.findById).mockResolvedValue(publicUser);
    vi.mocked(refreshTokenRepo.create).mockResolvedValue({
      id: 1,
      user_id: publicUser.id,
      token_hash: "hash",
      expires_at: new Date().toISOString(),
      revoked_at: null,
      family_id: "family-1",
      created_at: new Date().toISOString(),
    });
  });

  describe("register", () => {
    it("creates a user with a hashed password", async () => {
      vi.mocked(userRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(userRepo.createUser).mockResolvedValue(publicUser);

      const result = await authService.register(publicUser.email, "secret123");

      expect(result).toEqual(publicUser);
      expect(userRepo.createUser).toHaveBeenCalledTimes(1);
      const [, hashedPassword] = vi.mocked(userRepo.createUser).mock.calls[0];
      expect(hashedPassword).not.toBe("secret123");
      await expect(bcrypt.compare("secret123", hashedPassword)).resolves.toBe(
        true,
      );
    });

    it("rejects a duplicate email", async () => {
      vi.mocked(userRepo.findByEmail).mockResolvedValue({
        ...publicUser,
        password: "existing-hash",
      });

      await expectAuthError(
        authService.register(publicUser.email, "secret123"),
        "EMAIL_IN_USE",
      );
      expect(userRepo.createUser).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("returns auth payload for valid credentials", async () => {
      const passwordHash = await bcrypt.hash("secret123", 10);
      vi.mocked(userRepo.findByEmail).mockResolvedValue({
        ...publicUser,
        password: passwordHash,
      });

      const result = await authService.login(publicUser.email, "secret123");

      expect(result.user).toEqual(publicUser);
      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.refreshToken).toHaveLength(96);
      expect(result.refreshExpiresAt).toBeInstanceOf(Date);
      expect(refreshTokenRepo.create).toHaveBeenCalledWith(
        publicUser.id,
        expect.stringMatching(/^[a-f0-9]{64}$/),
        expect.any(Date),
        undefined,
      );
    });

    it("rejects an invalid password", async () => {
      const passwordHash = await bcrypt.hash("secret123", 10);
      vi.mocked(userRepo.findByEmail).mockResolvedValue({
        ...publicUser,
        password: passwordHash,
      });

      await expectAuthError(
        authService.login(publicUser.email, "wrong-password"),
        "INVALID_CREDENTIALS",
      );
      expect(userRepo.findById).not.toHaveBeenCalled();
      expect(refreshTokenRepo.create).not.toHaveBeenCalled();
    });

    it("runs bcrypt compare for a missing email", async () => {
      const compareSpy = vi.spyOn(bcrypt, "compare");
      vi.mocked(userRepo.findByEmail).mockResolvedValue(null);

      await expectAuthError(
        authService.login("missing@example.com", "secret123"),
        "INVALID_CREDENTIALS",
      );
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy.mock.calls[0][1]).toEqual(
        expect.stringMatching(/^\$2b\$10\$/),
      );
      expect(userRepo.findById).not.toHaveBeenCalled();
      expect(refreshTokenRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("rotates a valid refresh token", async () => {
      vi.mocked(refreshTokenRepo.rotate).mockResolvedValue({
        user_id: publicUser.id,
        family_id: "family-1",
      });

      const result = await authService.refresh("refresh-token");

      expect(result.user).toEqual(publicUser);
      expect(result.accessToken).toEqual(expect.any(String));
      expect(result.refreshToken).toHaveLength(96);
      expect(refreshTokenRepo.create).toHaveBeenCalledWith(
        publicUser.id,
        expect.stringMatching(/^[a-f0-9]{64}$/),
        expect.any(Date),
        "family-1",
      );
    });

    it("rejects an invalid refresh token", async () => {
      vi.mocked(refreshTokenRepo.rotate).mockResolvedValue(null);
      vi.mocked(refreshTokenRepo.findByHash).mockResolvedValue(null);

      await expectAuthError(
        authService.refresh("invalid-refresh-token"),
        "INVALID_REFRESH_TOKEN",
      );
      expect(refreshTokenRepo.revokeFamilyById).not.toHaveBeenCalled();
    });

    it("revokes a token family when a revoked token is reused", async () => {
      vi.mocked(refreshTokenRepo.rotate).mockResolvedValue(null);
      vi.mocked(refreshTokenRepo.findByHash).mockResolvedValue({
        id: 1,
        user_id: publicUser.id,
        token_hash: "hash",
        expires_at: new Date().toISOString(),
        revoked_at: new Date().toISOString(),
        family_id: "family-1",
        created_at: new Date().toISOString(),
      });

      await expectAuthError(
        authService.refresh("reused-refresh-token"),
        "INVALID_REFRESH_TOKEN",
      );
      expect(refreshTokenRepo.revokeFamilyById).toHaveBeenCalledWith(
        "family-1",
      );
    });
  });
});
