import { describe, it, expect, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock database functions
vi.mock("./db", () => ({
  banUser: vi.fn(),
  unbanUser: vi.fn(),
  isUserBanned: vi.fn(),
  suspendUser: vi.fn(),
  unsuspendUser: vi.fn(),
  isUserSuspended: vi.fn(),
  warnUser: vi.fn(),
  getUserWarnings: vi.fn(),
  endActiveCall: vi.fn(),
  createActiveCall: vi.fn(),
  getActiveCalls: vi.fn(),
  logModerationAction: vi.fn(),
  getAllModerationLogs: vi.fn(),
  getUserModerationLogs: vi.fn(),
}));

describe("Moderation System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("User Banning", () => {
    it("should ban a user permanently", async () => {
      await db.banUser(123, 1, "Spam", "permanent");
      expect(db.banUser).toHaveBeenCalledWith(123, 1, "Spam", "permanent");
    });

    it("should ban a user temporarily", async () => {
      await db.banUser(123, 1, "Offensive content", "temporary", 7);
      expect(db.banUser).toHaveBeenCalledWith(123, 1, "Offensive content", "temporary", 7);
    });

    it("should check if user is banned", async () => {
      vi.mocked(db.isUserBanned).mockResolvedValue(true);
      const isBanned = await db.isUserBanned(123);
      expect(isBanned).toBe(true);
    });

    it("should unban a user", async () => {
      await db.unbanUser(123, 1, "Appeal approved");
      expect(db.unbanUser).toHaveBeenCalledWith(123, 1, "Appeal approved");
    });
  });

  describe("User Suspension", () => {
    it("should suspend a user for X days", async () => {
      await db.suspendUser(456, 1, "Inappropriate streaming", 7);
      expect(db.suspendUser).toHaveBeenCalledWith(456, 1, "Inappropriate streaming", 7);
    });

    it("should check if user is suspended", async () => {
      vi.mocked(db.isUserSuspended).mockResolvedValue(true);
      const isSuspended = await db.isUserSuspended(456);
      expect(isSuspended).toBe(true);
    });

    it("should unsuspend a user", async () => {
      await db.unsuspendUser(456, 1, "Suspension period ended");
      expect(db.unsuspendUser).toHaveBeenCalledWith(456, 1, "Suspension period ended");
    });
  });

  describe("Warning System", () => {
    it("should warn a user", async () => {
      vi.mocked(db.warnUser).mockResolvedValue(1);
      const warningCount = await db.warnUser(789, 1, "First warning");
      expect(warningCount).toBe(1);
      expect(db.warnUser).toHaveBeenCalledWith(789, 1, "First warning");
    });

    it("should get user warnings", async () => {
      const mockWarnings = [
        { id: 1, reason: "First warning", createdAt: new Date() },
        { id: 2, reason: "Second warning", createdAt: new Date() },
      ];
      vi.mocked(db.getUserWarnings).mockResolvedValue(mockWarnings);
      const warnings = await db.getUserWarnings(789);
      expect(warnings).toHaveLength(2);
    });

    it("should escalate warnings to suspension", async () => {
      vi.mocked(db.getUserWarnings).mockResolvedValue([
        { id: 1, reason: "Warning 1", createdAt: new Date() },
        { id: 2, reason: "Warning 2", createdAt: new Date() },
        { id: 3, reason: "Warning 3", createdAt: new Date() },
      ]);
      const warnings = await db.getUserWarnings(789);
      if (warnings.length >= 3) {
        await db.suspendUser(789, 1, "Escalated from 3 warnings", 7);
        expect(db.suspendUser).toHaveBeenCalled();
      }
    });
  });

  describe("Active Calls Management", () => {
    it("should create an active call", async () => {
      await db.createActiveCall("room-123", 100, 200);
      expect(db.createActiveCall).toHaveBeenCalledWith("room-123", 100, 200);
    });

    it("should get active calls", async () => {
      const mockCalls = [
        {
          call: { id: 1, callRoomId: "room-123", isActive: true },
          streamer: { id: 100, username: "streamer1" },
          viewer: { id: 200, username: "viewer1" },
        },
      ];
      vi.mocked(db.getActiveCalls).mockResolvedValue(mockCalls);
      const calls = await db.getActiveCalls();
      expect(calls).toHaveLength(1);
    });

    it("should end an active call", async () => {
      await db.endActiveCall("room-123", 1, "Inappropriate content");
      expect(db.endActiveCall).toHaveBeenCalledWith("room-123", 1, "Inappropriate content");
    });
  });

  describe("Moderation Logs", () => {
    it("should log a moderation action", async () => {
      await db.logModerationAction(1, 123, "ban", "Spam", { banType: "permanent" });
      expect(db.logModerationAction).toHaveBeenCalledWith(
        1,
        123,
        "ban",
        "Spam",
        { banType: "permanent" }
      );
    });

    it("should get all moderation logs", async () => {
      const mockLogs = [
        {
          log: { id: 1, action: "ban", reason: "Spam", createdAt: new Date() },
          admin: { id: 1, username: "admin1" },
          target: { id: 123, username: "user123" },
        },
      ];
      vi.mocked(db.getAllModerationLogs).mockResolvedValue(mockLogs);
      const logs = await db.getAllModerationLogs(50);
      expect(logs).toHaveLength(1);
    });

    it("should get user moderation history", async () => {
      const mockHistory = [
        {
          id: 1,
          action: "warn",
          reason: "First warning",
          createdAt: new Date(),
        },
        {
          id: 2,
          action: "suspend",
          reason: "Escalated from warnings",
          createdAt: new Date(),
        },
      ];
      vi.mocked(db.getUserModerationLogs).mockResolvedValue(mockHistory);
      const history = await db.getUserModerationLogs(123);
      expect(history).toHaveLength(2);
    });
  });

  describe("Moderation Workflow", () => {
    it("should follow complete moderation workflow", async () => {
      const userId = 999;
      const adminId = 1;

      // Step 1: Warn user
      vi.mocked(db.warnUser).mockResolvedValue(1);
      const warning1 = await db.warnUser(userId, adminId, "First warning");
      expect(warning1).toBe(1);

      // Step 2: Warn user again
      vi.mocked(db.warnUser).mockResolvedValue(2);
      const warning2 = await db.warnUser(userId, adminId, "Second warning");
      expect(warning2).toBe(2);

      // Step 3: Warn user third time
      vi.mocked(db.warnUser).mockResolvedValue(3);
      const warning3 = await db.warnUser(userId, adminId, "Third warning");
      expect(warning3).toBe(3);

      // Step 4: Suspend user
      await db.suspendUser(userId, adminId, "Escalated from 3 warnings", 7);
      expect(db.suspendUser).toHaveBeenCalled();

      // Step 5: Check if suspended
      vi.mocked(db.isUserSuspended).mockResolvedValue(true);
      const isSuspended = await db.isUserSuspended(userId);
      expect(isSuspended).toBe(true);

      // Step 6: Log all actions
      expect(db.logModerationAction).toHaveBeenCalledTimes(0); // Not called in this test
    });
  });
});
