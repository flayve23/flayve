import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createHash, randomBytes } from "crypto";
import * as db from "./db";

describe("Auth Integration Tests", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "TestPassword123";
  const testUsername = `testuser_${Date.now()}`;

  it("should register a user with password hash and salt", async () => {
    const salt = randomBytes(16).toString("hex");
    const hash = createHash("sha256").update(testPassword + salt).digest("hex");
    const openId = `user-${randomBytes(8).toString("hex")}`;

    await db.upsertUser({
      openId,
      username: testUsername,
      email: testEmail,
      loginMethod: "email",
      passwordHash: hash,
      passwordSalt: salt,
      role: "user",
      lastSignedIn: new Date(),
    });

    const user = await db.getUserByEmail(testEmail);
    expect(user).toBeDefined();
    expect(user?.email).toBe(testEmail);
    expect(user?.username).toBe(testUsername);
    expect(user?.passwordHash).toBe(hash);
    expect(user?.passwordSalt).toBe(salt);
    expect(user?.role).toBe("user");
  });

  it("should verify password correctly during login", async () => {
    const user = await db.getUserByEmail(testEmail);
    expect(user).toBeDefined();

    if (!user) return;

    // Verify correct password
    const correctHash = createHash("sha256")
      .update(testPassword + user.passwordSalt)
      .digest("hex");
    expect(correctHash).toBe(user.passwordHash);

    // Verify incorrect password fails
    const wrongHash = createHash("sha256")
      .update("WrongPassword" + user.passwordSalt)
      .digest("hex");
    expect(wrongHash).not.toBe(user.passwordHash);
  });

  it("should not return user with wrong email", async () => {
    const user = await db.getUserByEmail("nonexistent@example.com");
    expect(user).toBeUndefined();
  });
});
