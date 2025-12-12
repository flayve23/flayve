import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" | "streamer" | "viewer" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("profile router", () => {
  it("getTags returns array of tags", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const tags = await caller.profile.getTags();

    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0]).toHaveProperty("id");
    expect(tags[0]).toHaveProperty("name");
    expect(tags[0]).toHaveProperty("slug");
  });

  it("getOnlineStreamers returns array", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const streamers = await caller.profile.getOnlineStreamers();

    expect(Array.isArray(streamers)).toBe(true);
  });
});

describe("wallet router", () => {
  it("getBalance returns balance object", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wallet.getBalance();

    expect(result).toHaveProperty("balance");
    expect(typeof result.balance).toBe("number");
  });

  it("getTransactions returns array", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const transactions = await caller.wallet.getTransactions();

    expect(Array.isArray(transactions)).toBe(true);
  });
});

describe("admin router", () => {
  it("getPendingKYC requires admin role", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getPendingKYC()).rejects.toThrow("Unauthorized");
  });

  it("getPendingKYC works for admin", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const pending = await caller.admin.getPendingKYC();

    expect(Array.isArray(pending)).toBe(true);
  });
});
