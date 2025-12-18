var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, date } from "drizzle-orm/mysql-core";
var users, profiles, tags, profileTags, callsHistory, transactions, withdrawals, kycApprovals, streamerProfiles, callNotifications, callRooms, streamerCommissions, balanceRecharges, mpWithdrawals, userBans, userSuspensions, moderationWarnings, moderationLogs, activeCalls, callReviews, notifications, streamerBadges, kycVerifications;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      username: varchar("username", { length: 64 }).unique(),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      passwordHash: text("passwordHash"),
      passwordSalt: text("passwordSalt"),
      emailVerified: boolean("emailVerified").default(false).notNull(),
      emailVerificationToken: text("emailVerificationToken"),
      emailVerificationTokenExpiry: timestamp("emailVerificationTokenExpiry"),
      role: mysqlEnum("role", ["user", "admin", "streamer", "viewer"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    profiles = mysqlTable("profiles", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      userType: mysqlEnum("userType", ["streamer", "viewer"]).notNull(),
      // Streamer-specific fields
      bio: text("bio"),
      photoUrl: text("photoUrl"),
      pricePerMinute: int("pricePerMinute").default(199),
      // em centavos (R$ 1,99)
      isOnline: boolean("isOnline").default(false),
      // Premium/Famous fields
      isPremium: boolean("isPremium").default(false),
      isFamous: boolean("isFamous").default(false),
      famousName: varchar("famousName", { length: 255 }),
      famousVerificationUrl: varchar("famousVerificationUrl", { length: 500 }),
      premiumTier: mysqlEnum("premiumTier", ["standard", "gold", "platinum"]).default("standard"),
      // Financial fields
      balance: int("balance").default(0),
      // em centavos
      totalEarnings: int("totalEarnings").default(0),
      // em centavos
      // KYC fields
      kycStatus: mysqlEnum("kycStatus", ["pending", "approved", "rejected"]).default("pending"),
      kycDocumentUrl: text("kycDocumentUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    tags = mysqlTable("tags", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 100 }).notNull().unique(),
      slug: varchar("slug", { length: 100 }).notNull().unique(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    profileTags = mysqlTable("profileTags", {
      id: int("id").autoincrement().primaryKey(),
      profileId: int("profileId").notNull().references(() => profiles.id),
      tagId: int("tagId").notNull().references(() => tags.id),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    callsHistory = mysqlTable("callsHistory", {
      id: int("id").autoincrement().primaryKey(),
      roomId: varchar("roomId", { length: 255 }).notNull().unique(),
      viewerId: int("viewerId").notNull().references(() => users.id),
      streamerId: int("streamerId").notNull().references(() => users.id),
      startedAt: timestamp("startedAt").notNull(),
      endedAt: timestamp("endedAt"),
      durationMinutes: int("durationMinutes").default(0),
      totalCost: int("totalCost").default(0),
      // em centavos
      status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    transactions = mysqlTable("transactions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      type: mysqlEnum("type", ["credit", "debit", "withdrawal", "call_charge", "call_earning"]).notNull(),
      amount: int("amount").notNull(),
      // em centavos
      callId: int("callId").references(() => callsHistory.id),
      withdrawalId: int("withdrawalId").references(() => withdrawals.id),
      description: text("description"),
      status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    withdrawals = mysqlTable("withdrawals", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      amount: int("amount").notNull(),
      // em centavos
      fee: int("fee").default(0),
      // taxa de antecipacao (5%)
      netAmount: int("netAmount").notNull(),
      // amount - fee
      pixKey: varchar("pixKey", { length: 255 }).notNull(),
      pixKeyType: mysqlEnum("pixKeyType", ["cpf", "email", "phone"]).notNull(),
      status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
      isAnticipated: boolean("isAnticipated").default(false),
      earningDate: timestamp("earningDate"),
      availableDate: timestamp("availableDate").notNull(),
      ipAddress: varchar("ipAddress", { length: 45 }),
      userAgent: text("userAgent"),
      description: text("description"),
      // username do streamer para o fornecedor
      requestedAt: timestamp("requestedAt").defaultNow().notNull(),
      processedAt: timestamp("processedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    kycApprovals = mysqlTable("kycApprovals", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
      approvedBy: int("approvedBy").references(() => users.id),
      // admin que aprovou
      comment: text("comment"),
      requestedAt: timestamp("requestedAt").defaultNow().notNull(),
      reviewedAt: timestamp("reviewedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    streamerProfiles = mysqlTable("streamerProfiles", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique().references(() => users.id),
      bio: text("bio"),
      about: text("about"),
      photoUrl: text("photoUrl"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    callNotifications = mysqlTable("callNotifications", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      viewerId: int("viewerId").notNull().references(() => users.id),
      status: mysqlEnum("status", ["pending", "accepted", "rejected", "expired"]).default("pending"),
      viewerName: varchar("viewerName", { length: 255 }),
      viewerPhotoUrl: text("viewerPhotoUrl"),
      expiresAt: timestamp("expiresAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    callRooms = mysqlTable("callRooms", {
      id: int("id").autoincrement().primaryKey(),
      roomId: varchar("roomId", { length: 255 }).notNull().unique(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      viewerId: int("viewerId").notNull().references(() => users.id),
      status: mysqlEnum("status", ["waiting", "active", "ended"]).default("waiting"),
      startedAt: timestamp("startedAt"),
      endedAt: timestamp("endedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    streamerCommissions = mysqlTable("streamer_commissions", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id).unique(),
      // Base commission percentage (60-85)
      baseCommission: decimal("baseCommission", { precision: 5, scale: 2 }).default("70.00").notNull(),
      // Bonuses
      loyaltyBonus: decimal("loyaltyBonus", { precision: 5, scale: 2 }).default("0.00"),
      // 0-5%
      referralBonus: decimal("referralBonus", { precision: 10, scale: 2 }).default("0.00"),
      // R$ 0-3000
      performanceBonus: decimal("performanceBonus", { precision: 10, scale: 2 }).default("0.00"),
      // R$ 0-2500
      // Total commission (calculated)
      totalCommission: decimal("totalCommission", { precision: 5, scale: 2 }).default("70.00").notNull(),
      // Metadata
      notes: text("notes"),
      // Reason for negotiation
      effectiveDate: timestamp("effectiveDate").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    balanceRecharges = mysqlTable("balanceRecharges", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      amount: int("amount").notNull(),
      // em centavos
      // Mercado Pago identifiers
      preferenceId: varchar("preferenceId", { length: 255 }).unique(),
      paymentId: varchar("paymentId", { length: 255 }).unique(),
      // Payment method
      paymentMethod: mysqlEnum("paymentMethod", ["pix", "credit_card", "debit_card"]),
      // Status
      status: mysqlEnum("status", ["pending", "approved", "rejected", "cancelled"]).default("pending"),
      // Metadata
      description: text("description"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      approvedAt: timestamp("approvedAt"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    mpWithdrawals = mysqlTable("mpWithdrawals", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      amount: int("amount").notNull(),
      // em centavos
      // Mercado Pago identifiers
      transferId: varchar("transferId", { length: 255 }).unique(),
      // Pix details
      pixKey: varchar("pixKey", { length: 255 }).notNull(),
      pixKeyType: mysqlEnum("pixKeyType", ["cpf", "email", "phone", "random"]).notNull(),
      // Status
      status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
      // Metadata
      description: text("description"),
      // username do streamer
      failureReason: text("failureReason"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      processedAt: timestamp("processedAt"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    userBans = mysqlTable("userBans", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      adminId: int("adminId").notNull().references(() => users.id),
      reason: text("reason").notNull(),
      banType: mysqlEnum("banType", ["permanent", "temporary"]).notNull(),
      expiresAt: timestamp("expiresAt"),
      // null = permanent
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    userSuspensions = mysqlTable("userSuspensions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      adminId: int("adminId").notNull().references(() => users.id),
      reason: text("reason").notNull(),
      suspensionDays: int("suspensionDays").notNull(),
      // dias de suspensão
      expiresAt: timestamp("expiresAt").notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    moderationWarnings = mysqlTable("moderationWarnings", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      adminId: int("adminId").notNull().references(() => users.id),
      reason: text("reason").notNull(),
      warningCount: int("warningCount").default(1).notNull(),
      // número de avisos acumulados
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    moderationLogs = mysqlTable("moderationLogs", {
      id: int("id").autoincrement().primaryKey(),
      adminId: int("adminId").notNull().references(() => users.id),
      targetUserId: int("targetUserId").notNull().references(() => users.id),
      action: mysqlEnum("action", [
        "ban",
        "unban",
        "suspend",
        "unsuspend",
        "warn",
        "end_call",
        "remove_content",
        "restrict_streaming",
        "other"
      ]).notNull(),
      reason: text("reason"),
      details: json("details"),
      // JSON com detalhes adicionais
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    activeCalls = mysqlTable("activeCalls", {
      id: int("id").autoincrement().primaryKey(),
      callRoomId: varchar("callRoomId", { length: 255 }).notNull().unique(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      viewerId: int("viewerId").notNull().references(() => users.id),
      startedAt: timestamp("startedAt").defaultNow().notNull(),
      endedAt: timestamp("endedAt"),
      isActive: boolean("isActive").default(true).notNull()
    });
    callReviews = mysqlTable("callReviews", {
      id: int("id").autoincrement().primaryKey(),
      callId: int("callId").notNull().references(() => activeCalls.id),
      reviewerId: int("reviewerId").notNull().references(() => users.id),
      revieweeId: int("revieweeId").notNull().references(() => users.id),
      rating: int("rating").notNull(),
      // 1-5 stars
      comment: text("comment"),
      isAnonymous: boolean("isAnonymous").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      type: mysqlEnum("type", [
        "call_incoming",
        "call_accepted",
        "call_rejected",
        "call_ended",
        "new_review",
        "account_warning",
        "account_suspended",
        "account_banned",
        "balance_low",
        "payment_received",
        "promotion",
        "system"
      ]).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message"),
      data: json("data"),
      // JSON com dados adicionais (callId, reviewId, etc)
      isRead: boolean("isRead").default(false).notNull(),
      actionUrl: varchar("actionUrl", { length: 500 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      readAt: timestamp("readAt")
    });
    streamerBadges = mysqlTable("streamerBadges", {
      id: int("id").autoincrement().primaryKey(),
      streamerId: int("streamerId").notNull().references(() => users.id),
      badgeType: mysqlEnum("badgeType", [
        "verified",
        "new",
        "top_rated",
        "top_earner",
        "most_active",
        "trusted",
        "premium",
        "vip"
      ]).notNull(),
      earnedAt: timestamp("earnedAt").defaultNow().notNull(),
      expiresAt: timestamp("expiresAt"),
      // NULL = permanent
      reason: text("reason")
    });
    kycVerifications = mysqlTable("kycVerifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().references(() => users.id),
      // Dados Pessoais
      fullName: varchar("fullName", { length: 255 }).notNull(),
      cpf: varchar("cpf", { length: 11 }).notNull(),
      // Apenas números
      dateOfBirth: date("dateOfBirth").notNull(),
      nationality: varchar("nationality", { length: 100 }).default("Brasileira"),
      // Endereço
      address: text("address").notNull(),
      city: varchar("city", { length: 100 }).notNull(),
      state: varchar("state", { length: 2 }).notNull(),
      // UF
      zipCode: varchar("zipCode", { length: 8 }).notNull(),
      // CEP sem hífen
      // Dados Bancários
      bankName: varchar("bankName", { length: 100 }).notNull(),
      bankCode: varchar("bankCode", { length: 3 }).notNull(),
      // Código do banco
      accountType: mysqlEnum("accountType", ["checking", "savings"]).notNull(),
      accountNumber: varchar("accountNumber", { length: 20 }).notNull(),
      accountDigit: varchar("accountDigit", { length: 2 }),
      branchCode: varchar("branchCode", { length: 5 }).notNull(),
      accountHolder: varchar("accountHolder", { length: 255 }).notNull(),
      // Documentos
      idDocumentType: mysqlEnum("idDocumentType", ["rg", "cnh", "passport"]).notNull(),
      idDocumentUrl: text("idDocumentUrl").notNull(),
      idDocumentNumber: varchar("idDocumentNumber", { length: 20 }).notNull(),
      proofOfAddressUrl: text("proofOfAddressUrl").notNull(),
      // Conta de água, luz, etc
      // Status
      status: mysqlEnum("status", ["pending", "approved", "rejected", "expired"]).default("pending").notNull(),
      rejectionReason: text("rejectionReason"),
      // Motivo da rejeição
      // Auditoria
      submittedAt: timestamp("submittedAt").defaultNow().notNull(),
      reviewedAt: timestamp("reviewedAt"),
      reviewedBy: int("reviewedBy").references(() => users.id),
      // Admin que revisou
      expiresAt: timestamp("expiresAt"),
      // KYC expira após 1 ano
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  addProfileTag: () => addProfileTag,
  addStreamerBadge: () => addStreamerBadge,
  approveKYC: () => approveKYC,
  approveKYCVerification: () => approveKYCVerification,
  banUser: () => banUser,
  canWithdraw: () => canWithdraw,
  clearPasswordResetToken: () => clearPasswordResetToken,
  createActiveCall: () => createActiveCall,
  createBalanceRecharge: () => createBalanceRecharge,
  createCall: () => createCall,
  createCallHistory: () => createCallHistory,
  createCallNotification: () => createCallNotification,
  createCallReview: () => createCallReview,
  createCallRoom: () => createCallRoom,
  createMpWithdrawal: () => createMpWithdrawal,
  createNotification: () => createNotification,
  createStreamerCommission: () => createStreamerCommission,
  createStreamerProfile: () => createStreamerProfile,
  createTransaction: () => createTransaction,
  createWithdrawal: () => createWithdrawal,
  endActiveCall: () => endActiveCall,
  getActiveCallNotifications: () => getActiveCallNotifications,
  getActiveCalls: () => getActiveCalls,
  getAllModerationLogs: () => getAllModerationLogs,
  getAllMpWithdrawals: () => getAllMpWithdrawals,
  getAllStreamerCommissions: () => getAllStreamerCommissions,
  getAllTags: () => getAllTags,
  getAllWithdrawals: () => getAllWithdrawals,
  getAvailableWithdrawalAmount: () => getAvailableWithdrawalAmount,
  getBalanceRechargeByPreferenceId: () => getBalanceRechargeByPreferenceId,
  getCallByRoomId: () => getCallByRoomId,
  getCallNotificationById: () => getCallNotificationById,
  getCallReviewById: () => getCallReviewById,
  getCallRoomByRoomId: () => getCallRoomByRoomId,
  getDb: () => getDb,
  getKYCById: () => getKYCById,
  getKYCStats: () => getKYCStats,
  getMpWithdrawalsByStreamerId: () => getMpWithdrawalsByStreamerId,
  getNotificationById: () => getNotificationById,
  getOnlineStreamers: () => getOnlineStreamers,
  getPendingKYC: () => getPendingKYC,
  getPendingKYCs: () => getPendingKYCs,
  getProfileByUserId: () => getProfileByUserId,
  getProfileTags: () => getProfileTags,
  getReports: () => getReports,
  getStreamerAverageRating: () => getStreamerAverageRating,
  getStreamerBadges: () => getStreamerBadges,
  getStreamerCallStats: () => getStreamerCallStats,
  getStreamerCommission: () => getStreamerCommission,
  getStreamerProfile: () => getStreamerProfile,
  getStreamerReviews: () => getStreamerReviews,
  getStreamersByTag: () => getStreamersByTag,
  getTransactionStats: () => getTransactionStats,
  getUnreadNotifications: () => getUnreadNotifications,
  getUserByEmail: () => getUserByEmail,
  getUserByEmailVerificationToken: () => getUserByEmailVerificationToken,
  getUserById: () => getUserById,
  getUserByOpenId: () => getUserByOpenId,
  getUserByResetToken: () => getUserByResetToken,
  getUserKYC: () => getUserKYC,
  getUserModerationLogs: () => getUserModerationLogs,
  getUserNotifications: () => getUserNotifications,
  getUserTransactions: () => getUserTransactions,
  getUserWarnings: () => getUserWarnings,
  getViewerCallStats: () => getViewerCallStats,
  getWithdrawalStats: () => getWithdrawalStats,
  getWithdrawalsByStreamerId: () => getWithdrawalsByStreamerId,
  hasApprovedKYC: () => hasApprovedKYC,
  hasStreamerBadge: () => hasStreamerBadge,
  isUserBanned: () => isUserBanned,
  isUserSuspended: () => isUserSuspended,
  logModerationAction: () => logModerationAction,
  markEmailAsVerified: () => markEmailAsVerified,
  markNotificationAsRead: () => markNotificationAsRead,
  processCallBilling: () => processCallBilling,
  rejectKYC: () => rejectKYC,
  rejectKYCVerification: () => rejectKYCVerification,
  removeProfileTag: () => removeProfileTag,
  removeStreamerBadge: () => removeStreamerBadge,
  saveEmailVerificationToken: () => saveEmailVerificationToken,
  savePasswordResetToken: () => savePasswordResetToken,
  submitKYC: () => submitKYC,
  suspendUser: () => suspendUser,
  unbanUser: () => unbanUser,
  unsuspendUser: () => unsuspendUser,
  updateBalance: () => updateBalance,
  updateBalanceRechargeStatus: () => updateBalanceRechargeStatus,
  updateCall: () => updateCall,
  updateCallNotificationStatus: () => updateCallNotificationStatus,
  updateCallRoom: () => updateCallRoom,
  updateKYCStatus: () => updateKYCStatus,
  updateMpWithdrawalStatus: () => updateMpWithdrawalStatus,
  updateProfileBalance: () => updateProfileBalance,
  updateStreamerCommission: () => updateStreamerCommission,
  updateStreamerProfile: () => updateStreamerProfile,
  updateUserPassword: () => updateUserPassword,
  updateWithdrawalStatus: () => updateWithdrawalStatus,
  upsertProfile: () => upsertProfile,
  upsertUser: () => upsertUser,
  warnUser: () => warnUser
});
import { eq, and, desc, gte, lte, or, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "username", "email", "loginMethod", "passwordHash", "passwordSalt"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getProfileByUserId(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function upsertProfile(profile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getProfileByUserId(profile.userId);
  if (existing) {
    await db.update(profiles).set(profile).where(eq(profiles.userId, profile.userId));
    return existing.id;
  } else {
    const result = await db.insert(profiles).values(profile);
    return Number(result[0].insertId);
  }
}
async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tags);
}
async function getOnlineStreamers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    profile: profiles,
    user: users
  }).from(profiles).innerJoin(users, eq(profiles.userId, users.id)).where(and(
    eq(profiles.userType, "streamer"),
    eq(profiles.isOnline, true)
  ));
}
async function getStreamersByTag(tagId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    profile: profiles,
    user: users
  }).from(profiles).innerJoin(users, eq(profiles.userId, users.id)).innerJoin(profileTags, eq(profileTags.profileId, profiles.id)).where(and(
    eq(profiles.userType, "streamer"),
    eq(profiles.isOnline, true),
    eq(profileTags.tagId, tagId)
  ));
}
async function addProfileTag(profileId, tagId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(profileTags).values({ profileId, tagId });
}
async function removeProfileTag(profileId, tagId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(profileTags).where(and(
    eq(profileTags.profileId, profileId),
    eq(profileTags.tagId, tagId)
  ));
}
async function getProfileTags(profileId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({ tag: tags }).from(profileTags).innerJoin(tags, eq(profileTags.tagId, tags.id)).where(eq(profileTags.profileId, profileId));
}
async function createCall(call) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(callsHistory).values(call);
  return Number(result[0].insertId);
}
async function getCallByRoomId(roomId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(callsHistory).where(eq(callsHistory.roomId, roomId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateCall(callId, updates) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(callsHistory).set(updates).where(eq(callsHistory.id, callId));
}
async function createTransaction(transaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(transactions).values(transaction);
  return Number(result[0].insertId);
}
async function getUserTransactions(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
}
async function updateBalance(userId, amount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const profile = await getProfileByUserId(userId);
  if (!profile) throw new Error("Profile not found");
  const newBalance = (profile.balance || 0) + amount;
  await db.update(profiles).set({ balance: newBalance }).where(eq(profiles.userId, userId));
  return newBalance;
}
async function processCallBilling(callId, viewerId, streamerId, pricePerMinute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const platformSplit = 0.3;
  const streamerSplit = 0.7;
  const streamerEarning = Math.floor(pricePerMinute * streamerSplit);
  await updateBalance(viewerId, -pricePerMinute);
  await createTransaction({
    userId: viewerId,
    type: "call_charge",
    amount: pricePerMinute,
    callId,
    description: "Cobran\xE7a por minuto de chamada",
    status: "completed"
  });
  await updateBalance(streamerId, streamerEarning);
  await createTransaction({
    userId: streamerId,
    type: "call_earning",
    amount: streamerEarning,
    callId,
    description: "Ganho por minuto de chamada (70%)",
    status: "completed"
  });
  return { charged: pricePerMinute, earned: streamerEarning };
}
async function getPendingKYC() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    profile: profiles,
    user: users
  }).from(profiles).innerJoin(users, eq(profiles.userId, users.id)).where(eq(profiles.kycStatus, "pending"));
}
async function updateKYCStatus(profileId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set({ kycStatus: status }).where(eq(profiles.id, profileId));
}
async function createWithdrawal(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const fee = data.isAnticipated ? Math.round(data.amount * 0.05) : 0;
  const netAmount = data.isAnticipated ? data.amount + fee : data.amount;
  const now = /* @__PURE__ */ new Date();
  const availableDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
  const result = await db.insert(withdrawals).values({
    streamerId: data.streamerId,
    amount: data.amount,
    fee,
    netAmount,
    pixKey: data.pixKey,
    pixKeyType: data.pixKeyType,
    description: data.description,
    isAnticipated: data.isAnticipated,
    earningDate: now,
    availableDate,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    status: "pending"
  });
  return Number(result[0].insertId);
}
async function getWithdrawalsByStreamerId(streamerId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(withdrawals).where(eq(withdrawals.streamerId, streamerId)).orderBy(desc(withdrawals.createdAt));
}
async function getAvailableWithdrawalAmount(streamerId) {
  const db = await getDb();
  if (!db) return 0;
  const profile = await getProfileByUserId(streamerId);
  if (!profile) return 0;
  const now = /* @__PURE__ */ new Date();
  const availableWithdrawals = await db.select().from(withdrawals).where(
    and(
      eq(withdrawals.streamerId, streamerId),
      eq(withdrawals.status, "pending"),
      lte(withdrawals.availableDate, now)
    )
  );
  const availableAmount = availableWithdrawals.reduce((sum, w) => sum + (w.netAmount || 0), 0);
  return Math.min(profile.balance || 0, availableAmount);
}
async function canWithdraw(streamerId, amount) {
  const db = await getDb();
  if (!db) return { can: false, reason: "Database not available" };
  const kyc = await db.select().from(kycApprovals).where(eq(kycApprovals.streamerId, streamerId)).limit(1);
  if (!kyc || kyc.length === 0 || kyc[0].status !== "approved") {
    return { can: false, reason: "Complete KYC verification to withdraw" };
  }
  const profile = await getProfileByUserId(streamerId);
  if (!profile || (profile.balance || 0) < amount) {
    return { can: false, reason: "Insufficient balance" };
  }
  if (amount > 1e6) {
    return { can: false, reason: "Maximum withdrawal is R$ 10,000" };
  }
  const now = /* @__PURE__ */ new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayWithdrawals = await db.select().from(withdrawals).where(
    and(
      eq(withdrawals.streamerId, streamerId),
      gte(withdrawals.requestedAt, dayStart),
      eq(withdrawals.status, "pending")
    )
  );
  if (todayWithdrawals.length >= 3) {
    return { can: false, reason: "Maximum 3 withdrawals per day" };
  }
  return { can: true };
}
async function getAllWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    withdrawal: withdrawals,
    user: users
  }).from(withdrawals).innerJoin(users, eq(withdrawals.streamerId, users.id)).orderBy(desc(withdrawals.createdAt));
}
async function updateWithdrawalStatus(withdrawalId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(withdrawals).set({ status, processedAt: /* @__PURE__ */ new Date() }).where(eq(withdrawals.id, withdrawalId));
}
async function approveKYC(streamerId, adminId, comment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const profile = await getProfileByUserId(streamerId);
  if (!profile) throw new Error("Profile not found");
  await db.update(profiles).set({ kycStatus: "approved" }).where(eq(profiles.id, profile.id));
  await db.insert(kycApprovals).values({
    streamerId,
    status: "approved",
    approvedBy: adminId,
    comment,
    reviewedAt: /* @__PURE__ */ new Date()
  });
}
async function rejectKYC(streamerId, adminId, comment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const profile = await getProfileByUserId(streamerId);
  if (!profile) throw new Error("Profile not found");
  await db.update(profiles).set({ kycStatus: "rejected" }).where(eq(profiles.id, profile.id));
  await db.insert(kycApprovals).values({
    streamerId,
    status: "rejected",
    approvedBy: adminId,
    comment,
    reviewedAt: /* @__PURE__ */ new Date()
  });
}
async function getReports(filters) {
  const db = await getDb();
  if (!db) return { withdrawals: [], transactions: [], total: 0 };
  const offset = (filters.page - 1) * filters.limit;
  const allWithdrawals = await db.select().from(withdrawals);
  let filteredWithdrawals = allWithdrawals;
  if (filters.startDate || filters.endDate) {
    filteredWithdrawals = allWithdrawals.filter((w) => {
      const date2 = new Date(w.requestedAt);
      if (filters.startDate && date2 < filters.startDate) return false;
      if (filters.endDate && date2 > filters.endDate) return false;
      return true;
    });
  }
  const withdrawalsList = filteredWithdrawals.slice(offset, offset + filters.limit);
  const allTransactions = await db.select().from(transactions);
  let filteredTransactions = allTransactions;
  if (filters.startDate || filters.endDate) {
    filteredTransactions = allTransactions.filter((t2) => {
      const date2 = new Date(t2.createdAt);
      if (filters.startDate && date2 < filters.startDate) return false;
      if (filters.endDate && date2 > filters.endDate) return false;
      return true;
    });
  }
  const transactionsList = filteredTransactions.slice(offset, offset + filters.limit);
  return {
    withdrawals: withdrawalsList,
    transactions: transactionsList,
    total: Math.max(filteredWithdrawals.length, filteredTransactions.length)
  };
}
async function getWithdrawalStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, processing: 0, completed: 0, failed: 0, totalAmount: 0 };
  const allWithdrawals = await db.select().from(withdrawals);
  return {
    total: allWithdrawals.length,
    pending: allWithdrawals.filter((w) => w.status === "pending").length,
    processing: allWithdrawals.filter((w) => w.status === "processing").length,
    completed: allWithdrawals.filter((w) => w.status === "completed").length,
    failed: allWithdrawals.filter((w) => w.status === "failed").length,
    totalAmount: allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)
  };
}
async function getTransactionStats() {
  const db = await getDb();
  if (!db) return { total: 0, earnings: 0, expenses: 0, credits: 0 };
  const allTransactions = await db.select().from(transactions);
  return {
    total: allTransactions.length,
    earnings: allTransactions.filter((t2) => t2.type === "call_earning").reduce((sum, t2) => sum + t2.amount, 0),
    expenses: allTransactions.filter((t2) => t2.type === "call_charge" || t2.type === "withdrawal").reduce((sum, t2) => sum + t2.amount, 0),
    credits: allTransactions.filter((t2) => t2.type === "credit").reduce((sum, t2) => sum + t2.amount, 0)
  };
}
async function savePasswordResetToken(userId, tokenHash, expiresAt) {
  const db = await getDb();
  if (!db) return;
  return { success: true };
}
async function getUserByResetToken(tokenHash) {
  return null;
}
async function updateUserPassword(userId, passwordHash, passwordSalt) {
  const db = await getDb();
  if (!db) return;
  const user = await getUserById(userId);
  if (!user) return;
  await db.update(users).set({ passwordHash, passwordSalt }).where(eq(users.id, userId));
}
async function clearPasswordResetToken(userId) {
  return { success: true };
}
async function saveEmailVerificationToken(userId, tokenHash, expiresAt) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ emailVerificationToken: tokenHash, emailVerificationTokenExpiry: expiresAt }).where(eq(users.id, userId));
}
async function getUserByEmailVerificationToken(tokenHash) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.emailVerificationToken, tokenHash)).limit(1);
  if (result.length === 0) return void 0;
  const user = result[0];
  if (!user.emailVerificationTokenExpiry || /* @__PURE__ */ new Date() > user.emailVerificationTokenExpiry) {
    return void 0;
  }
  return user;
}
async function markEmailAsVerified(userId) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ emailVerified: true, emailVerificationToken: null, emailVerificationTokenExpiry: null }).where(eq(users.id, userId));
}
async function createCallNotification(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(callNotifications).values({
    streamerId: data.streamerId,
    viewerId: data.viewerId,
    viewerName: data.viewerName,
    viewerPhotoUrl: data.viewerPhotoUrl,
    expiresAt: data.expiresAt,
    status: "pending"
  });
  return { id: result[0].insertId };
}
async function getCallNotificationById(notificationId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(callNotifications).where(eq(callNotifications.id, notificationId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateCallNotificationStatus(notificationId, status) {
  const db = await getDb();
  if (!db) return;
  await db.update(callNotifications).set({ status }).where(eq(callNotifications.id, notificationId));
}
async function getActiveCallNotifications(streamerId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(callNotifications).where(and(
    eq(callNotifications.streamerId, streamerId),
    eq(callNotifications.status, "pending")
  )).orderBy(desc(callNotifications.createdAt));
  return result;
}
async function createCallRoom(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(callRooms).values({
    roomId: data.roomId,
    streamerId: data.streamerId,
    viewerId: data.viewerId,
    status: data.status,
    startedAt: data.startedAt
  });
  return { id: result[0].insertId };
}
async function getCallRoomByRoomId(roomId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(callRooms).where(eq(callRooms.roomId, roomId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateCallRoom(roomId, updates) {
  const db = await getDb();
  if (!db) return;
  await db.update(callRooms).set(updates).where(eq(callRooms.id, roomId));
}
async function createCallHistory(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(callsHistory).values({
    roomId: data.roomId,
    viewerId: data.viewerId,
    streamerId: data.streamerId,
    startedAt: data.startedAt,
    endedAt: data.endedAt,
    durationMinutes: data.durationMinutes,
    totalCost: data.totalCost,
    status: data.status
  });
}
async function updateProfileBalance(userId, newBalance) {
  const db = await getDb();
  if (!db) return;
  const profile = await getProfileByUserId(userId);
  if (!profile) return;
  await db.update(profiles).set({ balance: newBalance }).where(eq(profiles.userId, userId));
}
async function createStreamerProfile(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(streamerProfiles).values({
    userId: data.userId,
    bio: data.bio,
    about: data.about,
    photoUrl: data.photoUrl
  });
  return { id: result[0].insertId };
}
async function getStreamerProfile(userId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(streamerProfiles).where(eq(streamerProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateStreamerProfile(userId, updates) {
  const db = await getDb();
  if (!db) return;
  await db.update(streamerProfiles).set(updates).where(eq(streamerProfiles.userId, userId));
}
async function getStreamerCommission(streamerId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(streamerCommissions).where(eq(streamerCommissions.streamerId, streamerId));
  return result.length > 0 ? result[0] : void 0;
}
async function createStreamerCommission(streamerId, baseCommission = 70) {
  const db = await getDb();
  if (!db) return void 0;
  await db.insert(streamerCommissions).values({
    streamerId,
    baseCommission: baseCommission.toString(),
    totalCommission: baseCommission.toString(),
    notes: "Initial commission"
  });
  return getStreamerCommission(streamerId);
}
async function updateStreamerCommission(streamerId, updates) {
  const db = await getDb();
  if (!db) return void 0;
  const current = await getStreamerCommission(streamerId);
  if (!current) {
    return createStreamerCommission(streamerId, updates.baseCommission || 70);
  }
  const baseCommission = updates.baseCommission ?? parseFloat(current.baseCommission.toString());
  const loyaltyBonus = updates.loyaltyBonus ?? parseFloat(current.loyaltyBonus?.toString() || "0");
  const totalCommission = baseCommission + loyaltyBonus;
  const updateData = {
    updatedAt: /* @__PURE__ */ new Date()
  };
  if (updates.baseCommission !== void 0) updateData.baseCommission = updates.baseCommission.toString();
  if (updates.loyaltyBonus !== void 0) updateData.loyaltyBonus = updates.loyaltyBonus.toString();
  if (updates.referralBonus !== void 0) updateData.referralBonus = updates.referralBonus.toString();
  if (updates.performanceBonus !== void 0) updateData.performanceBonus = updates.performanceBonus.toString();
  if (updates.notes !== void 0) updateData.notes = updates.notes;
  updateData.totalCommission = totalCommission.toString();
  await db.update(streamerCommissions).set(updateData).where(eq(streamerCommissions.streamerId, streamerId));
  return getStreamerCommission(streamerId);
}
async function getAllStreamerCommissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(streamerCommissions).orderBy(desc(streamerCommissions.updatedAt));
}
async function getStreamerCallStats(streamerId) {
  const db = await getDb();
  if (!db) return { totalCalls: 0, totalEarnings: 0, totalMinutes: 0 };
  const calls = await db.select().from(callsHistory).where(eq(callsHistory.streamerId, streamerId));
  const totalCalls = calls.length;
  const totalEarnings = calls.reduce((sum, call) => sum + (call.totalCost || 0), 0);
  const totalMinutes = calls.reduce((sum, call) => sum + (call.durationMinutes || 0), 0);
  return { totalCalls, totalEarnings, totalMinutes };
}
async function getViewerCallStats(viewerId) {
  const db = await getDb();
  if (!db) return { totalCalls: 0, totalSpent: 0, totalMinutes: 0 };
  const calls = await db.select().from(callsHistory).where(eq(callsHistory.viewerId, viewerId));
  const totalCalls = calls.length;
  const totalSpent = calls.reduce((sum, call) => sum + (call.totalCost || 0), 0);
  const totalMinutes = calls.reduce((sum, call) => sum + (call.durationMinutes || 0), 0);
  return { totalCalls, totalSpent, totalMinutes };
}
async function createBalanceRecharge(userId, amount, preferenceId, paymentMethod) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(balanceRecharges).values({
    userId,
    amount,
    preferenceId,
    paymentMethod,
    status: "pending",
    description: `Recarga de saldo - R$ ${(amount / 100).toFixed(2)}`
  });
  return Number(result[0].insertId);
}
async function getBalanceRechargeByPreferenceId(preferenceId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(balanceRecharges).where(eq(balanceRecharges.preferenceId, preferenceId)).limit(1);
  return result[0] || null;
}
async function updateBalanceRechargeStatus(rechargeId, status, paymentId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates = {
    status,
    updatedAt: /* @__PURE__ */ new Date()
  };
  if (paymentId) {
    updates.paymentId = paymentId;
  }
  if (status === "approved") {
    updates.approvedAt = /* @__PURE__ */ new Date();
  }
  await db.update(balanceRecharges).set(updates).where(eq(balanceRecharges.id, rechargeId));
}
async function createMpWithdrawal(streamerId, amount, pixKey, pixKeyType, description) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mpWithdrawals).values({
    streamerId,
    amount,
    pixKey,
    pixKeyType,
    status: "pending",
    description
  });
  return Number(result[0].insertId);
}
async function getMpWithdrawalsByStreamerId(streamerId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(mpWithdrawals).where(eq(mpWithdrawals.streamerId, streamerId)).orderBy(desc(mpWithdrawals.createdAt));
}
async function updateMpWithdrawalStatus(withdrawalId, status, transferId, failureReason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates = {
    status,
    updatedAt: /* @__PURE__ */ new Date()
  };
  if (transferId) {
    updates.transferId = transferId;
  }
  if (failureReason) {
    updates.failureReason = failureReason;
  }
  if (status === "completed" || status === "failed") {
    updates.processedAt = /* @__PURE__ */ new Date();
  }
  await db.update(mpWithdrawals).set(updates).where(eq(mpWithdrawals.id, withdrawalId));
}
async function getAllMpWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    withdrawal: mpWithdrawals,
    user: users
  }).from(mpWithdrawals).innerJoin(users, eq(mpWithdrawals.streamerId, users.id)).orderBy(desc(mpWithdrawals.createdAt));
}
async function banUser(userId, adminId, reason, banType = "permanent", daysToExpire) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const expiresAt = banType === "temporary" && daysToExpire ? new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1e3) : null;
  await db.insert(userBans).values({
    userId,
    adminId,
    reason,
    banType,
    expiresAt,
    isActive: true
  });
  await logModerationAction(adminId, userId, "ban", reason, { banType, expiresAt });
}
async function unbanUser(userId, adminId, reason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userBans).set({ isActive: false }).where(and(eq(userBans.userId, userId), eq(userBans.isActive, true)));
  await logModerationAction(adminId, userId, "unban", reason);
}
async function isUserBanned(userId) {
  const db = await getDb();
  if (!db) return false;
  const activeBans = await db.select().from(userBans).where(and(
    eq(userBans.userId, userId),
    eq(userBans.isActive, true)
  ));
  if (activeBans.length === 0) return false;
  for (const ban of activeBans) {
    if (ban.banType === "permanent") return true;
    if (ban.expiresAt && ban.expiresAt > /* @__PURE__ */ new Date()) return true;
  }
  return false;
}
async function suspendUser(userId, adminId, reason, suspensionDays) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const expiresAt = new Date(Date.now() + suspensionDays * 24 * 60 * 60 * 1e3);
  await db.insert(userSuspensions).values({
    userId,
    adminId,
    reason,
    suspensionDays,
    expiresAt,
    isActive: true
  });
  await logModerationAction(adminId, userId, "suspend", reason, { suspensionDays });
}
async function unsuspendUser(userId, adminId, reason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userSuspensions).set({ isActive: false }).where(and(eq(userSuspensions.userId, userId), eq(userSuspensions.isActive, true)));
  await logModerationAction(adminId, userId, "unsuspend", reason);
}
async function isUserSuspended(userId) {
  const db = await getDb();
  if (!db) return false;
  const activeSuspensions = await db.select().from(userSuspensions).where(and(
    eq(userSuspensions.userId, userId),
    eq(userSuspensions.isActive, true)
  ));
  if (activeSuspensions.length === 0) return false;
  for (const suspension of activeSuspensions) {
    if (suspension.expiresAt > /* @__PURE__ */ new Date()) return true;
  }
  return false;
}
async function warnUser(userId, adminId, reason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existingWarnings = await db.select().from(moderationWarnings).where(eq(moderationWarnings.userId, userId));
  const warningCount = existingWarnings.length + 1;
  await db.insert(moderationWarnings).values({
    userId,
    adminId,
    reason,
    warningCount
  });
  await logModerationAction(adminId, userId, "warn", reason, { warningCount });
  return warningCount;
}
async function getUserWarnings(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(moderationWarnings).where(eq(moderationWarnings.userId, userId)).orderBy(desc(moderationWarnings.createdAt));
}
async function logModerationAction(adminId, targetUserId, action, reason, details) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(moderationLogs).values({
    adminId,
    targetUserId,
    action,
    reason,
    details: details ? JSON.stringify(details) : null
  });
}
async function getUserModerationLogs(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(moderationLogs).where(eq(moderationLogs.targetUserId, userId)).orderBy(desc(moderationLogs.createdAt));
}
async function getAllModerationLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  const logs = await db.select({
    log: moderationLogs,
    admin: users
  }).from(moderationLogs).innerJoin(users, eq(moderationLogs.adminId, users.id)).orderBy(desc(moderationLogs.createdAt)).limit(limit);
  const result = await Promise.all(
    logs.map(async (item) => {
      const targetUser = await db.select().from(users).where(eq(users.id, item.log.targetUserId)).limit(1);
      return {
        log: item.log,
        admin: item.admin,
        target: targetUser[0] || null
      };
    })
  );
  return result;
}
async function endActiveCall(callRoomId, adminId, reason) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const call = await db.select().from(activeCalls).where(eq(activeCalls.callRoomId, callRoomId)).limit(1);
  if (call.length === 0) throw new Error("Call not found");
  const activeCall = call[0];
  await db.update(activeCalls).set({ isActive: false, endedAt: /* @__PURE__ */ new Date() }).where(eq(activeCalls.id, activeCall.id));
  await logModerationAction(adminId, activeCall.streamerId, "end_call", reason, {
    callRoomId,
    viewerId: activeCall.viewerId
  });
}
async function createActiveCall(callRoomId, streamerId, viewerId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(activeCalls).values({
    callRoomId,
    streamerId,
    viewerId,
    isActive: true
  });
}
async function getActiveCalls() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    call: activeCalls,
    streamer: users,
    viewer: users
  }).from(activeCalls).innerJoin(users, eq(activeCalls.streamerId, users.id)).innerJoin(users, eq(activeCalls.viewerId, users.id)).where(eq(activeCalls.isActive, true));
}
async function createCallReview(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(callReviews).values(data);
    return await getCallReviewById(result[0].insertId);
  } catch (error) {
    console.error("[Database] Error creating review:", error);
    return null;
  }
}
async function getCallReviewById(id) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(callReviews).where(eq(callReviews.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting review:", error);
    return null;
  }
}
async function getStreamerReviews(streamerId, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(callReviews).where(eq(callReviews.revieweeId, streamerId)).orderBy(desc(callReviews.createdAt)).limit(limit);
  } catch (error) {
    console.error("[Database] Error getting streamer reviews:", error);
    return [];
  }
}
async function getStreamerAverageRating(streamerId) {
  const db = await getDb();
  if (!db) return 0;
  try {
    const result = await db.select({
      avgRating: sql`AVG(${callReviews.rating})`,
      count: sql`COUNT(*)`
    }).from(callReviews).where(eq(callReviews.revieweeId, streamerId));
    return result[0]?.avgRating ? parseFloat(result[0].avgRating) : 0;
  } catch (error) {
    console.error("[Database] Error getting average rating:", error);
    return 0;
  }
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(notifications).values(data);
    return await getNotificationById(result[0].insertId);
  } catch (error) {
    console.error("[Database] Error creating notification:", error);
    return null;
  }
}
async function getNotificationById(id) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting notification:", error);
    return null;
  }
}
async function getUserNotifications(userId, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
  } catch (error) {
    console.error("[Database] Error getting user notifications:", error);
    return [];
  }
}
async function getUnreadNotifications(userId) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false))).orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error("[Database] Error getting unread notifications:", error);
    return [];
  }
}
async function markNotificationAsRead(id) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.update(notifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(eq(notifications.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Error marking notification as read:", error);
    return false;
  }
}
async function addStreamerBadge(data) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(streamerBadges).values(data);
    return true;
  } catch (error) {
    console.error("[Database] Error adding badge:", error);
    return false;
  }
}
async function getStreamerBadges(streamerId) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(streamerBadges).where(
      and(
        eq(streamerBadges.streamerId, streamerId),
        or(
          isNull(streamerBadges.expiresAt),
          gte(streamerBadges.expiresAt, /* @__PURE__ */ new Date())
        )
      )
    );
  } catch (error) {
    console.error("[Database] Error getting badges:", error);
    return [];
  }
}
async function removeStreamerBadge(streamerId, badgeType) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.delete(streamerBadges).where(
      and(
        eq(streamerBadges.streamerId, streamerId),
        eq(streamerBadges.badgeType, badgeType)
      )
    );
    return true;
  } catch (error) {
    console.error("[Database] Error removing badge:", error);
    return false;
  }
}
async function hasStreamerBadge(streamerId, badgeType) {
  const db = await getDb();
  if (!db) return false;
  try {
    const result = await db.select().from(streamerBadges).where(
      and(
        eq(streamerBadges.streamerId, streamerId),
        eq(streamerBadges.badgeType, badgeType),
        or(
          isNull(streamerBadges.expiresAt),
          gte(streamerBadges.expiresAt, /* @__PURE__ */ new Date())
        )
      )
    ).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("[Database] Error checking badge:", error);
    return false;
  }
}
function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}
async function submitKYC(userId, data) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  try {
    if (!isValidCPF(data.cpf)) {
      return { success: false, error: "CPF inv\xE1lido" };
    }
    const existing = await db.select().from(kycVerifications).where(
      and(
        eq(kycVerifications.userId, userId),
        or(
          eq(kycVerifications.status, "pending"),
          eq(kycVerifications.status, "approved")
        )
      )
    ).limit(1);
    if (existing.length > 0) {
      return { success: false, error: "Voc\xEA j\xE1 tem uma verifica\xE7\xE3o KYC em andamento ou aprovada" };
    }
    const result = await db.insert(kycVerifications).values({
      ...data,
      userId,
      cpf: data.cpf.replace(/\D/g, "")
      // Armazenar apenas números
    });
    return { success: true, kycId: result.insertId || 0 };
  } catch (error) {
    console.error("[Database] Error submitting KYC:", error);
    return { success: false, error: "Erro ao submeter KYC" };
  }
}
async function getUserKYC(userId) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(kycVerifications).where(eq(kycVerifications.userId, userId)).orderBy(desc(kycVerifications.createdAt)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error getting user KYC:", error);
    return null;
  }
}
async function getKYCById(kycId) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(kycVerifications).where(eq(kycVerifications.id, kycId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error getting KYC by ID:", error);
    return null;
  }
}
async function getPendingKYCs(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select({
      kyc: kycVerifications,
      user: users
    }).from(kycVerifications).innerJoin(users, eq(kycVerifications.userId, users.id)).where(eq(kycVerifications.status, "pending")).orderBy(desc(kycVerifications.submittedAt)).limit(limit);
  } catch (error) {
    console.error("[Database] Error getting pending KYCs:", error);
    return [];
  }
}
async function approveKYCVerification(kycId, adminId, comment) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  try {
    await db.update(kycVerifications).set({
      status: "approved",
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedBy: adminId,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
      // 1 ano
    }).where(eq(kycVerifications.id, kycId));
    return { success: true };
  } catch (error) {
    console.error("[Database] Error approving KYC:", error);
    return { success: false, error: "Erro ao aprovar KYC" };
  }
}
async function rejectKYCVerification(kycId, adminId, reason) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  try {
    if (!reason || reason.trim().length === 0) {
      return { success: false, error: "Motivo da rejei\xE7\xE3o \xE9 obrigat\xF3rio" };
    }
    await db.update(kycVerifications).set({
      status: "rejected",
      rejectionReason: reason,
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedBy: adminId
    }).where(eq(kycVerifications.id, kycId));
    return { success: true };
  } catch (error) {
    console.error("[Database] Error rejecting KYC:", error);
    return { success: false, error: "Erro ao rejeitar KYC" };
  }
}
async function hasApprovedKYC(userId) {
  const db = await getDb();
  if (!db) return false;
  try {
    const result = await db.select().from(kycVerifications).where(
      and(
        eq(kycVerifications.userId, userId),
        eq(kycVerifications.status, "approved"),
        or(
          isNull(kycVerifications.expiresAt),
          gte(kycVerifications.expiresAt, /* @__PURE__ */ new Date())
        )
      )
    ).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("[Database] Error checking approved KYC:", error);
    return false;
  }
}
async function getKYCStats() {
  const db = await getDb();
  if (!db) return { pending: 0, approved: 0, rejected: 0, total: 0 };
  try {
    const result = await db.select({
      status: kycVerifications.status,
      count: sql`COUNT(*) as count`
    }).from(kycVerifications).groupBy(kycVerifications.status);
    const stats = { pending: 0, approved: 0, rejected: 0, total: 0 };
    result.forEach((row) => {
      const count = parseInt(row.count);
      stats.total += count;
      if (row.status === "pending") stats.pending = count;
      if (row.status === "approved") stats.approved = count;
      if (row.status === "rejected") stats.rejected = count;
    });
    return stats;
  } catch (error) {
    console.error("[Database] Error getting KYC stats:", error);
    return { pending: 0, approved: 0, rejected: 0, total: 0 };
  }
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/mercadopago.ts
var mercadopago_exports = {};
__export(mercadopago_exports, {
  createPixTransfer: () => createPixTransfer,
  createRechargePreference: () => createRechargePreference,
  getPaymentInfo: () => getPaymentInfo,
  getPaymentStatus: () => getPaymentStatus,
  getTransferInfo: () => getTransferInfo,
  getTransferStatus: () => getTransferStatus
});
import {
  MercadoPagoConfig,
  Preference,
  Payment
} from "mercadopago";
async function createRechargePreference(userId, amount, userEmail, userName) {
  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: `balance_recharge_${userId}`,
            title: `Recarga de Saldo - R$ ${(amount / 100).toFixed(2)}`,
            description: `Recarga de saldo para a plataforma Flayve`,
            quantity: 1,
            unit_price: amount / 100,
            // Mercado Pago usa reais, não centavos
            currency_id: "BRL"
          }
        ],
        payer: {
          email: userEmail || "viewer@flayve.com",
          name: userName || "Viewer"
        },
        back_urls: {
          success: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-success`,
          failure: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-failure`,
          pending: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-pending`
        },
        auto_return: "approved",
        notification_url: `${process.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/webhooks/mercadopago`,
        metadata: {
          user_id: userId,
          type: "balance_recharge"
        }
      }
    });
    return {
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao criar prefer\xEAncia:", error);
    throw error;
  }
}
async function getPaymentInfo(paymentId) {
  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error("[Mercado Pago] Erro ao obter pagamento:", error);
    throw error;
  }
}
async function createPixTransfer(streamerId, amount, pixKey, pixKeyType, description) {
  try {
    console.log(
      `[Mercado Pago] Simulando transfer\xEAncia Pix para ${pixKey} (${pixKeyType}): R$ ${(amount / 100).toFixed(2)}`
    );
    return {
      transferId: `transfer_${Date.now()}_${streamerId}`,
      status: "pending",
      amount: amount / 100,
      pixKey,
      pixKeyType,
      description
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao criar transfer\xEAncia Pix:", error);
    throw error;
  }
}
async function getTransferInfo(transferId) {
  try {
    console.log(`[Mercado Pago] Obtendo informa\xE7\xF5es da transfer\xEAncia: ${transferId}`);
    return {
      id: transferId,
      status: "pending"
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao obter transfer\xEAncia:", error);
    throw error;
  }
}
function getPaymentStatus(status) {
  const statusMap = {
    pending: "pending",
    approved: "approved",
    authorized: "approved",
    in_process: "processing",
    in_mediation: "processing",
    rejected: "rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "rejected"
  };
  return statusMap[status] || "pending";
}
function getTransferStatus(status) {
  const statusMap = {
    pending: "pending",
    processing: "processing",
    success: "completed",
    failed: "failed",
    cancelled: "cancelled"
  };
  return statusMap[status] || "pending";
}
var client;
var init_mercadopago = __esm({
  "server/mercadopago.ts"() {
    "use strict";
    client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ""
    });
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { Server as SocketIOServer } from "socket.io";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/routers.ts
import { createHash, randomBytes } from "crypto";
import { SignJWT } from "jose";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();
import { z as z3 } from "zod";

// server/routers/reviews.ts
init_db();
import { z as z2 } from "zod";
var reviewsRouter = router({
  // ============================================================================
  // REVIEWS
  // ============================================================================
  createReview: protectedProcedure.input(
    z2.object({
      callId: z2.number(),
      revieweeId: z2.number(),
      rating: z2.number().min(1).max(5),
      comment: z2.string().max(500).optional(),
      isAnonymous: z2.boolean().default(false)
    })
  ).mutation(async ({ input, ctx }) => {
    return await createCallReview({
      callId: input.callId,
      reviewerId: ctx.user.id,
      revieweeId: input.revieweeId,
      rating: input.rating,
      comment: input.comment || null,
      isAnonymous: input.isAnonymous
    });
  }),
  getStreamerReviews: protectedProcedure.input(z2.object({ streamerId: z2.number(), limit: z2.number().default(10) })).query(async ({ input }) => {
    return await getStreamerReviews(input.streamerId, input.limit);
  }),
  getStreamerRating: protectedProcedure.input(z2.object({ streamerId: z2.number() })).query(async ({ input }) => {
    const avgRating = await getStreamerAverageRating(input.streamerId);
    const reviews = await getStreamerReviews(input.streamerId, 100);
    return {
      averageRating: avgRating,
      totalReviews: reviews.length,
      ratingDistribution: {
        "5": reviews.filter((r) => r.rating === 5).length,
        "4": reviews.filter((r) => r.rating === 4).length,
        "3": reviews.filter((r) => r.rating === 3).length,
        "2": reviews.filter((r) => r.rating === 2).length,
        "1": reviews.filter((r) => r.rating === 1).length
      }
    };
  }),
  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  getMyNotifications: protectedProcedure.input(z2.object({ limit: z2.number().default(20) }).optional()).query(async ({ input, ctx }) => {
    return await getUserNotifications(ctx.user.id, input?.limit || 20);
  }),
  getUnreadNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotifications(ctx.user.id);
  }),
  markAsRead: protectedProcedure.input(z2.object({ notificationId: z2.number() })).mutation(async ({ input }) => {
    return await markNotificationAsRead(input.notificationId);
  }),
  // ============================================================================
  // BADGES
  // ============================================================================
  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    return await getStreamerBadges(ctx.user.id);
  }),
  getStreamerBadges: protectedProcedure.input(z2.object({ streamerId: z2.number() })).query(async ({ input }) => {
    return await getStreamerBadges(input.streamerId);
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    }),
    register: publicProcedure.input(
      z3.object({
        email: z3.string().email("Email inv\xE1lido"),
        password: z3.string().min(6, "Senha deve ter no m\xEDnimo 6 caracteres"),
        username: z3.string().min(3, "Nome de usu\xE1rio deve ter no m\xEDnimo 3 caracteres")
      })
    ).mutation(async ({ input, ctx }) => {
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) throw new Error("Email j\xE1 cadastrado");
      const salt = randomBytes(16).toString("hex");
      const hash = createHash("sha256").update(input.password + salt).digest("hex");
      const openId = `user-${randomBytes(8).toString("hex")}`;
      await upsertUser({
        openId,
        username: input.username,
        email: input.email,
        loginMethod: "email",
        passwordHash: hash,
        passwordSalt: salt,
        role: "user",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const user = await getUserByOpenId(openId);
      if (!user) throw new Error("Erro ao criar usu\xE1rio");
      const cookieOptions = getSessionCookieOptions(ctx.req);
      const token = Buffer.from(JSON.stringify({ userId: user.id, openId: user.openId, passwordHash: hash, salt })).toString("base64");
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1e3 });
      const verificationToken = randomBytes(32).toString("hex");
      const verificationTokenHash = createHash("sha256").update(verificationToken).digest("hex");
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      await saveEmailVerificationToken(user.id, verificationTokenHash, verificationTokenExpiry);
      return { success: true, message: "Conta criada! Verifique seu email para confirmar", verificationToken, userId: user.id, requiresEmailVerification: true };
    }),
    login: publicProcedure.input(
      z3.object({
        email: z3.string().email(),
        password: z3.string()
      })
    ).mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(input.email);
      if (!user) throw new Error("Email ou senha inv\xE1lidos");
      const isBanned = await isUserBanned(user.id);
      if (isBanned) throw new Error("Sua conta foi banida. Entre em contato com o suporte.");
      if (!user.passwordHash || !user.passwordSalt) {
        throw new Error("Email ou senha inv\xE1lidos");
      }
      const hash = createHash("sha256").update(input.password + user.passwordSalt).digest("hex");
      if (hash !== user.passwordHash) {
        throw new Error("Email ou senha inv\xE1lidos");
      }
      const cookieOptions = getSessionCookieOptions(ctx.req);
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");
      const token = await new SignJWT({ userId: user.id, openId: user.openId, appId: process.env.VITE_APP_ID || "flayve", name: user.username || "User" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secretKey);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1e3 });
      return { success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } };
    }),
    forgotPassword: publicProcedure.input(z3.object({ email: z3.string().email() })).mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) {
        return { success: true, message: "Se o email existir, voce recebera um link de reset" };
      }
      const resetToken = randomBytes(32).toString("hex");
      const resetTokenHash = createHash("sha256").update(resetToken).digest("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1e3);
      await savePasswordResetToken(user.id, resetTokenHash, resetTokenExpiry);
      return { success: true, message: "Se o email existir, voce recebera um link de reset", resetToken };
    }),
    verifyEmail: publicProcedure.input(z3.object({ verificationToken: z3.string() })).mutation(async ({ input, ctx }) => {
      const verificationTokenHash = createHash("sha256").update(input.verificationToken).digest("hex");
      const user = await getUserByEmailVerificationToken(verificationTokenHash);
      if (!user) throw new Error("Token de verificacao invalido ou expirado");
      await markEmailAsVerified(user.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret");
      const token = await new SignJWT({ userId: user.id, openId: user.openId, appId: process.env.VITE_APP_ID || "flayve", name: user.username || "User" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secretKey);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1e3 });
      return { success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } };
    }),
    resendVerificationEmail: publicProcedure.input(z3.object({ email: z3.string().email() })).mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) return { success: true, message: "Se o email existir, voce recebera um novo link" };
      if (user.emailVerified) return { success: true, message: "Email ja foi verificado" };
      const verificationToken = randomBytes(32).toString("hex");
      const verificationTokenHash = createHash("sha256").update(verificationToken).digest("hex");
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      await saveEmailVerificationToken(user.id, verificationTokenHash, verificationTokenExpiry);
      return { success: true, message: "Email de verificacao reenviado", verificationToken };
    })
  }),
  profile: router({
    getTags: publicProcedure.query(async () => {
      return await getAllTags();
    }),
    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      return profile || null;
    }),
    createStreamerProfile: protectedProcedure.input(
      z3.object({
        userId: z3.number(),
        photoUrl: z3.string().url(),
        bio: z3.string().min(5, "Bio deve ter no m\xEDnimo 5 caracteres"),
        pricePerMinute: z3.number().min(199),
        tagIds: z3.array(z3.number())
      })
    ).mutation(async ({ input }) => {
      const profileId = await upsertProfile({
        userId: input.userId,
        userType: "streamer",
        photoUrl: input.photoUrl,
        bio: input.bio,
        pricePerMinute: input.pricePerMinute,
        isOnline: false,
        balance: 0,
        totalEarnings: 0,
        kycStatus: "pending"
      });
      for (const tagId of input.tagIds) {
        await addProfileTag(profileId, tagId);
      }
      return { success: true, profileId };
    }),
    createViewerProfile: protectedProcedure.input(
      z3.object({
        userId: z3.number()
      })
    ).mutation(async ({ input }) => {
      const profileId = await upsertProfile({
        userId: input.userId,
        userType: "viewer",
        balance: 0
      });
      return { success: true, profileId };
    }),
    updateOnlineStatus: protectedProcedure.input(
      z3.object({
        isOnline: z3.boolean()
      })
    ).mutation(async ({ ctx, input }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      if (!profile) throw new Error("Profile not found");
      await upsertProfile({
        ...profile,
        isOnline: input.isOnline
      });
      return { success: true };
    }),
    updatePrice: protectedProcedure.input(
      z3.object({
        pricePerMinute: z3.number().min(199)
      })
    ).mutation(async ({ ctx, input }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      if (!profile) throw new Error("Profile not found");
      await upsertProfile({
        ...profile,
        pricePerMinute: input.pricePerMinute
      });
      return { success: true };
    }),
    getOnlineStreamers: publicProcedure.query(async () => {
      return await getOnlineStreamers();
    }),
    getStreamersByTag: publicProcedure.input(z3.object({ tagId: z3.number() })).query(async ({ input }) => {
      return await getStreamersByTag(input.tagId);
    }),
    getProfileTags: publicProcedure.input(z3.object({ profileId: z3.number() })).query(async ({ input }) => {
      return await getProfileTags(input.profileId);
    })
  }),
  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getProfileByUserId(ctx.user.id);
      return { balance: profile?.balance || 0 };
    }),
    addCredits: protectedProcedure.input(
      z3.object({
        amount: z3.number().min(100)
      })
    ).mutation(async ({ ctx, input }) => {
      const newBalance = await updateBalance(ctx.user.id, input.amount);
      await createTransaction({
        userId: ctx.user.id,
        type: "credit",
        amount: input.amount,
        description: "Cr\xE9ditos adicionados via Pix",
        status: "completed"
      });
      return { success: true, newBalance };
    }),
    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTransactions(ctx.user.id);
    })
  }),
  withdrawals: router({
    requestWithdrawal: protectedProcedure.input(
      z3.object({
        amount: z3.number().min(1e4).max(1e6),
        pixKey: z3.string().min(3),
        pixKeyType: z3.enum(["cpf", "email", "phone"]),
        anticipate: z3.boolean().default(false)
      })
    ).mutation(async ({ ctx, input }) => {
      const canWithdraw2 = await canWithdraw(ctx.user.id, input.amount);
      if (!canWithdraw2.can) {
        throw new Error(canWithdraw2.reason || "Cannot withdraw");
      }
      const profile = await getProfileByUserId(ctx.user.id);
      if (!profile) throw new Error("Profile not found");
      const balance = profile.balance || 0;
      if (balance < input.amount) throw new Error("Saldo insuficiente");
      const fee = input.anticipate ? Math.round(input.amount * 0.05) : 0;
      const netAmount = input.amount - fee;
      const withdrawal = await createWithdrawal({
        streamerId: ctx.user.id,
        amount: input.amount,
        pixKey: input.pixKey,
        pixKeyType: input.pixKeyType,
        description: ctx.user.username || `Streamer ${ctx.user.id}`,
        isAnticipated: input.anticipate,
        ipAddress: ctx.req?.ip,
        userAgent: ctx.req?.headers["user-agent"]
      });
      await updateBalance(ctx.user.id, -input.amount);
      const description = input.anticipate ? `Saque antecipado de R$ ${(netAmount / 100).toFixed(2)} (taxa 5%: R$ ${(fee / 100).toFixed(2)})` : `Saque de R$ ${(input.amount / 100).toFixed(2)} via Pix`;
      await createTransaction({
        userId: ctx.user.id,
        type: "withdrawal",
        amount: input.anticipate ? netAmount : input.amount,
        description,
        status: "pending"
      });
      return {
        success: true,
        withdrawal,
        fee,
        netAmount,
        message: input.anticipate ? `Saque antecipado solicitado. Taxa de 5% (R$ ${(fee / 100).toFixed(2)}) foi descontada.` : `Saque solicitado. Disponivel em D+30.`
      };
    }),
    getWithdrawals: protectedProcedure.query(async ({ ctx }) => {
      return await getWithdrawalsByStreamerId(ctx.user.id);
    })
  }),
  admin: router({
    getPendingKYC: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getPendingKYC();
    }),
    approveKYC: protectedProcedure.input(z3.object({ streamerId: z3.number(), comment: z3.string().optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      await approveKYC(input.streamerId, ctx.user.id, input.comment);
      return { success: true };
    }),
    rejectKYC: protectedProcedure.input(z3.object({ streamerId: z3.number(), comment: z3.string() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      await rejectKYC(input.streamerId, ctx.user.id, input.comment);
      return { success: true };
    }),
    getWithdrawals: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllWithdrawals();
    }),
    getReports: protectedProcedure.input(
      z3.object({
        startDate: z3.date().optional(),
        endDate: z3.date().optional(),
        page: z3.number().min(1).default(1),
        limit: z3.number().min(1).max(100).default(20)
      })
    ).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getReports(input);
    }),
    getWithdrawalStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getWithdrawalStats();
    }),
    getTransactionStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getTransactionStats();
    })
  }),
  calls: router({
    initiateCall: protectedProcedure.input(
      z3.object({
        streamerId: z3.number()
      })
    ).mutation(async ({ ctx, input }) => {
      const streamer = await getUserById(input.streamerId);
      if (!streamer) throw new Error("Streamer not found");
      if (streamer.role !== "streamer") throw new Error("User is not a streamer");
      const viewer = await getUserById(ctx.user.id);
      if (!viewer) throw new Error("Viewer not found");
      const notification = await createCallNotification({
        streamerId: input.streamerId,
        viewerId: ctx.user.id,
        viewerName: viewer.username || "Visitante",
        viewerPhotoUrl: "",
        expiresAt: new Date(Date.now() + 30 * 1e3)
      });
      return { success: true, notificationId: notification.id };
    }),
    acceptCall: protectedProcedure.input(
      z3.object({
        notificationId: z3.number()
      })
    ).mutation(async ({ ctx, input }) => {
      const notification = await getCallNotificationById(input.notificationId);
      if (!notification) throw new Error("Notification not found");
      if (notification.streamerId !== ctx.user.id) throw new Error("Unauthorized");
      const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const room = await createCallRoom({
        roomId,
        streamerId: notification.streamerId,
        viewerId: notification.viewerId,
        status: "active",
        startedAt: /* @__PURE__ */ new Date()
      });
      await updateCallNotificationStatus(input.notificationId, "accepted");
      return { success: true, roomId, callRoomId: room.id };
    }),
    rejectCall: protectedProcedure.input(
      z3.object({
        notificationId: z3.number()
      })
    ).mutation(async ({ ctx, input }) => {
      const notification = await getCallNotificationById(input.notificationId);
      if (!notification) throw new Error("Notification not found");
      if (notification.streamerId !== ctx.user.id) throw new Error("Unauthorized");
      await updateCallNotificationStatus(input.notificationId, "rejected");
      return { success: true };
    }),
    endCall: protectedProcedure.input(
      z3.object({
        roomId: z3.string(),
        durationMinutes: z3.number()
      })
    ).mutation(async ({ ctx, input }) => {
      const room = await getCallRoomByRoomId(input.roomId);
      if (!room) throw new Error("Room not found");
      const streamer = await getProfileByUserId(room.streamerId);
      if (!streamer) throw new Error("Streamer profile not found");
      const totalCost = (streamer.pricePerMinute || 199) * input.durationMinutes;
      await updateCallRoom(room.id, {
        status: "ended",
        endedAt: /* @__PURE__ */ new Date()
      });
      await createCallHistory({
        roomId: input.roomId,
        viewerId: room.viewerId,
        streamerId: room.streamerId,
        startedAt: room.startedAt || /* @__PURE__ */ new Date(),
        endedAt: /* @__PURE__ */ new Date(),
        durationMinutes: input.durationMinutes,
        totalCost,
        status: "completed"
      });
      const viewerProfile = await getProfileByUserId(room.viewerId);
      if (viewerProfile && (viewerProfile.balance ?? 0) >= totalCost) {
        const newViewerBalance = (viewerProfile.balance ?? 0) - totalCost;
        await updateProfileBalance(room.viewerId, newViewerBalance);
        const streamerEarnings = Math.floor(totalCost * 0.7);
        const newStreamerBalance = (streamer.balance || 0) + streamerEarnings;
        await updateProfileBalance(room.streamerId, newStreamerBalance);
        await createTransaction({
          userId: room.viewerId,
          type: "call_charge",
          amount: totalCost,
          callId: void 0,
          description: "Chamada com streamer",
          status: "completed"
        });
        await createTransaction({
          userId: room.streamerId,
          type: "call_earning",
          amount: streamerEarnings,
          callId: void 0,
          description: "Ganho de chamada",
          status: "completed"
        });
      }
      return { success: true, totalCost };
    }),
    getActiveNotifications: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "streamer") throw new Error("Only streamers can receive calls");
      return await getActiveCallNotifications(ctx.user.id);
    })
  }),
  streamerProfile: router({
    getProfile: publicProcedure.input(z3.object({ userId: z3.number() })).query(async ({ input }) => {
      return await getStreamerProfile(input.userId);
    }),
    updateProfile: protectedProcedure.input(
      z3.object({
        bio: z3.string().optional(),
        about: z3.string().optional(),
        photoUrl: z3.string().optional()
      })
    ).mutation(async ({ ctx, input }) => {
      const profile = await getStreamerProfile(ctx.user.id);
      if (!profile) {
        await createStreamerProfile({
          userId: ctx.user.id,
          bio: input.bio,
          about: input.about,
          photoUrl: input.photoUrl
        });
      } else {
        await updateStreamerProfile(ctx.user.id, input);
      }
      return { success: true };
    })
  }),
  commission: router({
    // Get streamer's commission
    getMyCommission: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "streamer") {
        throw new Error("Only streamers can view their commission");
      }
      const commission = await getStreamerCommission(ctx.user.id);
      if (!commission) {
        return createStreamerCommission(ctx.user.id, 70);
      }
      return commission;
    }),
    // Admin: Get all commissions
    getAllCommissions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can view all commissions");
      }
      const commissions = await getAllStreamerCommissions();
      const result = await Promise.all(
        commissions.map(async (commission) => {
          const streamer = await getUserById(commission.streamerId);
          return {
            ...commission,
            streamerName: streamer?.name || "Unknown",
            streamerEmail: streamer?.email || ""
          };
        })
      );
      return result;
    }),
    // Admin: Update streamer commission
    updateStreamerCommission: protectedProcedure.input(
      z3.object({
        streamerId: z3.number(),
        baseCommission: z3.number().min(60).max(85),
        loyaltyBonus: z3.number().optional(),
        referralBonus: z3.number().optional(),
        performanceBonus: z3.number().optional(),
        notes: z3.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update commissions");
      }
      const result = await updateStreamerCommission(input.streamerId, {
        baseCommission: input.baseCommission,
        loyaltyBonus: input.loyaltyBonus,
        referralBonus: input.referralBonus,
        performanceBonus: input.performanceBonus,
        notes: input.notes || `Updated by admin ${ctx.user.id}`
      });
      return result;
    })
  }),
  // ===== MERCADO PAGO PAYMENTS =====
  payment: router({
    // Viewer: Iniciar recarga de saldo
    createRechargePreference: protectedProcedure.input(
      z3.object({
        amount: z3.number().min(5e3).max(5e5),
        // R$ 50 a R$ 5000
        paymentMethod: z3.enum(["pix", "credit_card", "debit_card"])
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("User not authenticated");
      try {
        const { createRechargePreference: createRechargePreference2 } = await Promise.resolve().then(() => (init_mercadopago(), mercadopago_exports));
        const result = await createRechargePreference2(
          ctx.user.id,
          input.amount,
          ctx.user.email,
          ctx.user.username
        );
        const paymentMethod = input.paymentMethod;
        const preferenceId = result.preferenceId || "";
        const rechargeId = await createBalanceRecharge(
          ctx.user.id,
          input.amount,
          preferenceId,
          paymentMethod
        );
        return {
          success: true,
          rechargeId,
          preferenceId: result.preferenceId,
          checkoutUrl: result.sandboxInitPoint || result.initPoint
        };
      } catch (error) {
        console.error("[Payment] Erro ao criar prefer\xEAncia:", error);
        throw new Error("Erro ao iniciar pagamento. Tente novamente.");
      }
    }),
    // Viewer: Obter histórico de recargas
    getRechargeHistory: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("User not authenticated");
      const db_module = await Promise.resolve().then(() => (init_db(), db_exports));
      return [];
    }),
    // Streamer: Solicitar saque via Mercado Pago
    requestMpWithdrawal: protectedProcedure.input(
      z3.object({
        amount: z3.number().min(1e4).max(1e6),
        // R$ 100 a R$ 10.000
        pixKey: z3.string().min(3),
        pixKeyType: z3.enum(["cpf", "email", "phone", "random"])
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "streamer") {
        throw new Error("Only streamers can request withdrawals");
      }
      const profile = await getProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new Error("Profile not found");
      }
      if (profile.kycStatus !== "approved") {
        throw new Error("Complete KYC verification to withdraw");
      }
      if ((profile.balance || 0) < input.amount) {
        throw new Error("Insufficient balance");
      }
      try {
        const user = await getUserById(ctx.user.id);
        if (!user) throw new Error("User not found");
        const withdrawalId = await createMpWithdrawal(
          ctx.user.id,
          input.amount,
          input.pixKey,
          input.pixKeyType,
          user.username || `Streamer ${ctx.user.id}`
        );
        const newBalance = (profile.balance || 0) - input.amount;
        await updateProfileBalance(profile.id, newBalance);
        return {
          success: true,
          withdrawalId,
          amount: input.amount,
          status: "pending"
        };
      } catch (error) {
        console.error("[Payment] Erro ao solicitar saque:", error);
        throw new Error("Erro ao solicitar saque. Tente novamente.");
      }
    }),
    // Streamer: Obter histórico de saques
    getMpWithdrawalHistory: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "streamer") {
        throw new Error("Only streamers can view withdrawals");
      }
      return await getMpWithdrawalsByStreamerId(ctx.user.id);
    }),
    // Admin: Obter todos os saques
    getAllMpWithdrawals: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can view all withdrawals");
      }
      return await getAllMpWithdrawals();
    })
  }),
  // ===== MODERATION =====
  moderation: router({
    banUser: protectedProcedure.input(z3.object({ userId: z3.number(), reason: z3.string().min(5), banType: z3.enum(["permanent", "temporary"]), daysToExpire: z3.number().optional() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can ban users");
      await banUser(input.userId, ctx.user.id, input.reason, input.banType, input.daysToExpire);
      return { success: true };
    }),
    unbanUser: protectedProcedure.input(z3.object({ userId: z3.number(), reason: z3.string() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can unban users");
      await unbanUser(input.userId, ctx.user.id, input.reason);
      return { success: true };
    }),
    suspendUser: protectedProcedure.input(z3.object({ userId: z3.number(), reason: z3.string().min(5), suspensionDays: z3.number().min(1).max(365) })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can suspend users");
      await suspendUser(input.userId, ctx.user.id, input.reason, input.suspensionDays);
      return { success: true };
    }),
    unsuspendUser: protectedProcedure.input(z3.object({ userId: z3.number(), reason: z3.string() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can unsuspend users");
      await unsuspendUser(input.userId, ctx.user.id, input.reason);
      return { success: true };
    }),
    warnUser: protectedProcedure.input(z3.object({ userId: z3.number(), reason: z3.string().min(5) })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can warn users");
      const warningCount = await warnUser(input.userId, ctx.user.id, input.reason);
      return { success: true, warningCount };
    }),
    getUserWarnings: protectedProcedure.input(z3.object({ userId: z3.number() })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view warnings");
      return await getUserWarnings(input.userId);
    }),
    endActiveCall: protectedProcedure.input(z3.object({ callRoomId: z3.string(), reason: z3.string().min(5) })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can end calls");
      await endActiveCall(input.callRoomId, ctx.user.id, input.reason);
      return { success: true };
    }),
    getActiveCalls: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view active calls");
      return await getActiveCalls();
    }),
    getModerationLogs: protectedProcedure.input(z3.object({ limit: z3.number().default(100) })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view logs");
      return await getAllModerationLogs(input.limit);
    }),
    getUserModerationHistory: protectedProcedure.input(z3.object({ userId: z3.number() })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view history");
      return await getUserModerationLogs(input.userId);
    })
  }),
  kyc: router({
    submit: protectedProcedure.input(
      z3.object({
        fullName: z3.string().min(3),
        cpf: z3.string(),
        dateOfBirth: z3.string(),
        nationality: z3.string().default("Brasileira"),
        address: z3.string().min(5),
        city: z3.string().min(2),
        state: z3.string().length(2),
        zipCode: z3.string(),
        bankName: z3.string().min(3),
        bankCode: z3.string().length(3),
        accountType: z3.enum(["checking", "savings"]),
        accountNumber: z3.string().min(5),
        accountDigit: z3.string().optional(),
        branchCode: z3.string().min(4),
        accountHolder: z3.string().min(3),
        idDocumentType: z3.enum(["rg", "cnh", "passport"]),
        idDocumentUrl: z3.string().url(),
        idDocumentNumber: z3.string().min(5),
        proofOfAddressUrl: z3.string().url()
      })
    ).mutation(async ({ input, ctx }) => {
      const result = await submitKYC(ctx.user.id, {
        ...input,
        dateOfBirth: new Date(input.dateOfBirth)
      });
      return result;
    }),
    getMyKYC: protectedProcedure.query(async ({ ctx }) => {
      return await getUserKYC(ctx.user.id);
    }),
    getPendingKYCs: protectedProcedure.input(z3.object({ limit: z3.number().default(50) })).query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view pending KYCs");
      return await getPendingKYCs(input.limit);
    }),
    approveKYC: protectedProcedure.input(
      z3.object({
        kycId: z3.number(),
        comment: z3.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can approve KYC");
      return await approveKYCVerification(input.kycId, ctx.user.id, input.comment);
    }),
    rejectKYC: protectedProcedure.input(
      z3.object({
        kycId: z3.number(),
        reason: z3.string().min(10)
      })
    ).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can reject KYC");
      return await rejectKYCVerification(input.kycId, ctx.user.id, input.reason);
    }),
    getKYCStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Only admins can view KYC stats");
      return await getKYCStats();
    }),
    hasApprovedKYC: protectedProcedure.query(async ({ ctx }) => {
      return await hasApprovedKYC(ctx.user.id);
    })
  }),
  reviews: reviewsRouter
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT as SignJWT2, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client2) {
    this.client = client2;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client2 = createOAuthHttpClient()) {
    this.client = client2;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT2({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path2.resolve(process.cwd(), "dist", "public");
  console.log("[serveStatic] Serving from:", distPath);
  console.log("[serveStatic] Directory exists:", fs.existsSync(distPath));
  app.get("/assets/*", (req, res) => {
    const filePath = path2.resolve(distPath, "assets", req.params[0]);
    console.log("[serveStatic] Requested:", req.path, "-> File:", filePath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const ext = path2.extname(filePath);
      const mimeTypes = {
        ".js": "application/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".woff": "font/woff",
        ".woff2": "font/woff2"
      };
      res.set("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.send(content);
    } else {
      console.log("[serveStatic] File not found:", filePath);
      res.status(404).send("File not found");
    }
  });
  app.get("/test.html", (_req, res) => {
    const filePath = path2.resolve(distPath, "test.html");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.set("Content-Type", "text/html");
      res.send(content);
    } else {
      res.status(404).send("test.html not found");
    }
  });
}

// server/_core/security.ts
import helmet from "helmet";
function setupHelmet(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          connectSrc: ["'self'", "https:", "wss:"],
          frameSrc: ["'self'"],
          objectSrc: ["'none'"],
          ...process.env.NODE_ENV === "production" && { upgradeInsecureRequests: [] }
        }
      },
      hsts: {
        maxAge: 31536e3,
        // 1 ano
        includeSubDomains: true,
        preload: true
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
  );
}
var globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutos
  max: 100,
  // 100 requisições por janela
  message: "Muitas requisi\xE7\xF5es deste IP, tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === "/health";
  },
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded[0];
    }
    return req.ip || "unknown";
  }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutos
  max: 5,
  // 5 tentativas por janela
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded ? typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded[0] : req.ip || "unknown";
    return req.body?.email || ip;
  }
});
var paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hora
  max: 10,
  // 10 requisições por hora
  message: "Limite de requisi\xE7\xF5es de pagamento excedido.",
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    return forwarded ? typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded[0] : req.ip || "unknown";
  }
});
var kycLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1e3,
  // 24 horas
  max: 3,
  // 3 submissões por dia
  message: "Voc\xEA j\xE1 atingiu o limite de submiss\xF5es de KYC por dia.",
  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    return forwarded ? typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded[0] : req.ip || "unknown";
  }
});
function sanitizeInput(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/[<>]/g, "").trim();
      }
    }
  }
  next();
}
function securityHeadersMiddleware(req, res, next) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
  next();
}

// server/_core/index.ts
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.set("trust proxy", 1);
  const io = new SocketIOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });
  setupHelmet(app);
  app.use(securityHeadersMiddleware);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(sanitizeInput);
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  serveStatic(app);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8e3;
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
  return server;
}
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
