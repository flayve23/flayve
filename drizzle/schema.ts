import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Flayve-specific fields for streamers and viewers.
 */
export const users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Profiles table for streamers and viewers
 * Contains Flayve-specific data like pricing, balance, online status
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  userType: mysqlEnum("userType", ["streamer", "viewer"]).notNull(),
  
  // Streamer-specific fields
  bio: text("bio"),
  photoUrl: text("photoUrl"),
  pricePerMinute: int("pricePerMinute").default(199), // em centavos (R$ 1,99)
  isOnline: boolean("isOnline").default(false),
  
  // Premium/Famous fields
  isPremium: boolean("isPremium").default(false),
  isFamous: boolean("isFamous").default(false),
  famousName: varchar("famousName", { length: 255 }),
  famousVerificationUrl: varchar("famousVerificationUrl", { length: 500 }),
  premiumTier: mysqlEnum("premiumTier", ["standard", "gold", "platinum"]).default("standard"),
  
  // Financial fields
  balance: int("balance").default(0), // em centavos
  totalEarnings: int("totalEarnings").default(0), // em centavos
  
  // KYC fields
  kycStatus: mysqlEnum("kycStatus", ["pending", "approved", "rejected"]).default("pending"),
  kycDocumentUrl: text("kycDocumentUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Tags brasileiras para categorização de streamers
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Relacionamento many-to-many entre profiles e tags
 */
export const profileTags = mysqlTable("profileTags", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => profiles.id),
  tagId: int("tagId").notNull().references(() => tags.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProfileTag = typeof profileTags.$inferSelect;
export type InsertProfileTag = typeof profileTags.$inferInsert;

/**
 * Histórico de chamadas entre viewers e streamers
 */
export const callsHistory = mysqlTable("callsHistory", {
  id: int("id").autoincrement().primaryKey(),
  roomId: varchar("roomId", { length: 255 }).notNull().unique(),
  viewerId: int("viewerId").notNull().references(() => users.id),
  streamerId: int("streamerId").notNull().references(() => users.id),
  
  startedAt: timestamp("startedAt").notNull(),
  endedAt: timestamp("endedAt"),
  
  durationMinutes: int("durationMinutes").default(0),
  totalCost: int("totalCost").default(0), // em centavos
  
  status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallHistory = typeof callsHistory.$inferSelect;
export type InsertCallHistory = typeof callsHistory.$inferInsert;

/**
 * Transações financeiras (créditos, débitos, saques)
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  type: mysqlEnum("type", ["credit", "debit", "withdrawal", "call_charge", "call_earning"]).notNull(),
  amount: int("amount").notNull(), // em centavos
  
  callId: int("callId").references(() => callsHistory.id),
  withdrawalId: int("withdrawalId").references(() => withdrawals.id),
  
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Saques de streamers
 */
export const withdrawals = mysqlTable("withdrawals", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull().references(() => users.id),
  
  amount: int("amount").notNull(), // em centavos
  fee: int("fee").default(0), // taxa de antecipacao (5%)
  netAmount: int("netAmount").notNull(), // amount - fee
  
  pixKey: varchar("pixKey", { length: 255 }).notNull(),
  pixKeyType: mysqlEnum("pixKeyType", ["cpf", "email", "phone"]).notNull(),
  
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
  isAnticipated: boolean("isAnticipated").default(false),
  
  earningDate: timestamp("earningDate"),
  availableDate: timestamp("availableDate").notNull(),
  
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  description: text("description"), // username do streamer para o fornecedor
  
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = typeof withdrawals.$inferInsert;

/**
 * Aprovações de KYC
 */
export const kycApprovals = mysqlTable("kycApprovals", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull().references(() => users.id),
  
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  
  approvedBy: int("approvedBy").references(() => users.id), // admin que aprovou
  comment: text("comment"),
  
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KycApproval = typeof kycApprovals.$inferSelect;
export type InsertKycApproval = typeof kycApprovals.$inferInsert;


/**
 * Perfil estendido de streamer com bio e sobre
 */
export const streamerProfiles = mysqlTable("streamerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  
  bio: text("bio"),
  about: text("about"),
  photoUrl: text("photoUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StreamerProfile = typeof streamerProfiles.$inferSelect;
export type InsertStreamerProfile = typeof streamerProfiles.$inferInsert;

/**
 * Notificacoes de chamadas em tempo real
 */
export const callNotifications = mysqlTable("callNotifications", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull().references(() => users.id),
  viewerId: int("viewerId").notNull().references(() => users.id),
  
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "expired"]).default("pending"),
  
  viewerName: varchar("viewerName", { length: 255 }),
  viewerPhotoUrl: text("viewerPhotoUrl"),
  
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallNotification = typeof callNotifications.$inferSelect;
export type InsertCallNotification = typeof callNotifications.$inferInsert;

/**
 * Salas de chamadas ativas
 */
export const callRooms = mysqlTable("callRooms", {
  id: int("id").autoincrement().primaryKey(),
  roomId: varchar("roomId", { length: 255 }).notNull().unique(),
  
  streamerId: int("streamerId").notNull().references(() => users.id),
  viewerId: int("viewerId").notNull().references(() => users.id),
  
  status: mysqlEnum("status", ["waiting", "active", "ended"]).default("waiting"),
  
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallRoom = typeof callRooms.$inferSelect;
export type InsertCallRoom = typeof callRooms.$inferInsert;


/**
 * Streamer commissions table
 * Tracks commission rates for each streamer (negotiable)
 */
export const streamerCommissions = mysqlTable("streamer_commissions", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull().references(() => users.id).unique(),
  
  // Base commission percentage (60-85)
  baseCommission: decimal("baseCommission", { precision: 5, scale: 2 }).default("70.00").notNull(),
  
  // Bonuses
  loyaltyBonus: decimal("loyaltyBonus", { precision: 5, scale: 2 }).default("0.00"), // 0-5%
  referralBonus: decimal("referralBonus", { precision: 10, scale: 2 }).default("0.00"), // R$ 0-3000
  performanceBonus: decimal("performanceBonus", { precision: 10, scale: 2 }).default("0.00"), // R$ 0-2500
  
  // Total commission (calculated)
  totalCommission: decimal("totalCommission", { precision: 5, scale: 2 }).default("70.00").notNull(),
  
  // Metadata
  notes: text("notes"), // Reason for negotiation
  effectiveDate: timestamp("effectiveDate").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StreamerCommission = typeof streamerCommissions.$inferSelect;
export type InsertStreamerCommission = typeof streamerCommissions.$inferInsert;

/**
 * Recargas de saldo para viewers (Mercado Pago)
 */
export const balanceRecharges = mysqlTable("balanceRecharges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  amount: int("amount").notNull(), // em centavos
  
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BalanceRecharge = typeof balanceRecharges.$inferSelect;
export type InsertBalanceRecharge = typeof balanceRecharges.$inferInsert;

/**
 * Saques para conta bancária via Mercado Pago
 */
export const mpWithdrawals = mysqlTable("mpWithdrawals", {
  id: int("id").autoincrement().primaryKey(),
  streamerId: int("streamerId").notNull().references(() => users.id),
  
  amount: int("amount").notNull(), // em centavos
  
  // Mercado Pago identifiers
  transferId: varchar("transferId", { length: 255 }).unique(),
  
  // Pix details
  pixKey: varchar("pixKey", { length: 255 }).notNull(),
  pixKeyType: mysqlEnum("pixKeyType", ["cpf", "email", "phone", "random"]).notNull(),
  
  // Status
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
  
  // Metadata
  description: text("description"), // username do streamer
  failureReason: text("failureReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MpWithdrawal = typeof mpWithdrawals.$inferSelect;
export type InsertMpWithdrawal = typeof mpWithdrawals.$inferInsert;


/**
 * User Bans - Banimento permanente ou temporário de usuários
 */
export const userBans = mysqlTable("userBans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  adminId: int("adminId").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  banType: mysqlEnum("banType", ["permanent", "temporary"]).notNull(),
  expiresAt: timestamp("expiresAt"), // null = permanent
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserBan = typeof userBans.$inferSelect;
export type InsertUserBan = typeof userBans.$inferInsert;

/**
 * User Suspensions - Suspensão temporária de streamers
 */
export const userSuspensions = mysqlTable("userSuspensions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  adminId: int("adminId").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  suspensionDays: int("suspensionDays").notNull(), // dias de suspensão
  expiresAt: timestamp("expiresAt").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSuspension = typeof userSuspensions.$inferSelect;
export type InsertUserSuspension = typeof userSuspensions.$inferInsert;

/**
 * Moderation Warnings - Avisos antes de ações mais severas
 */
export const moderationWarnings = mysqlTable("moderationWarnings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  adminId: int("adminId").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  warningCount: int("warningCount").default(1).notNull(), // número de avisos acumulados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ModerationWarning = typeof moderationWarnings.$inferSelect;
export type InsertModerationWarning = typeof moderationWarnings.$inferInsert;

/**
 * Moderation Logs - Log de todas as ações de moderação
 */
export const moderationLogs = mysqlTable("moderationLogs", {
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
  details: json("details"), // JSON com detalhes adicionais
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModerationLog = typeof moderationLogs.$inferSelect;
export type InsertModerationLog = typeof moderationLogs.$inferInsert;

/**
 * Active Calls - Rastreamento de chamadas ativas para moderação
 */
export const activeCalls = mysqlTable("activeCalls", {
  id: int("id").autoincrement().primaryKey(),
  callRoomId: varchar("callRoomId", { length: 255 }).notNull().unique(),
  streamerId: int("streamerId").notNull().references(() => users.id),
  viewerId: int("viewerId").notNull().references(() => users.id),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type ActiveCall = typeof activeCalls.$inferSelect;
export type InsertActiveCall = typeof activeCalls.$inferInsert;


/**
 * Call Reviews - Avaliações de chamadas
 */
export const callReviews = mysqlTable("callReviews", {
  id: int("id").autoincrement().primaryKey(),
  callId: int("callId").notNull().references(() => activeCalls.id),
  reviewerId: int("reviewerId").notNull().references(() => users.id),
  revieweeId: int("revieweeId").notNull().references(() => users.id),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CallReview = typeof callReviews.$inferSelect;
export type InsertCallReview = typeof callReviews.$inferInsert;

/**
 * Notifications - Notificações em tempo real
 */
export const notifications = mysqlTable("notifications", {
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
  data: json("data"), // JSON com dados adicionais (callId, reviewId, etc)
  isRead: boolean("isRead").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Streamer Badges - Badges de confiança e reputação
 */
export const streamerBadges = mysqlTable("streamerBadges", {
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
  expiresAt: timestamp("expiresAt"), // NULL = permanent
  reason: text("reason"),
});
export type StreamerBadge = typeof streamerBadges.$inferSelect;
export type InsertStreamerBadge = typeof streamerBadges.$inferInsert;

/**
 * KYC Verification - Verificação de identidade com documentos e dados bancários
 */
export const kycVerifications = mysqlTable("kycVerifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  // Dados Pessoais
  fullName: varchar("fullName", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 11 }).notNull(), // Apenas números
  dateOfBirth: date("dateOfBirth").notNull(),
  nationality: varchar("nationality", { length: 100 }).default("Brasileira"),
  
  // Endereço
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(), // UF
  zipCode: varchar("zipCode", { length: 8 }).notNull(), // CEP sem hífen
  
  // Dados Bancários
  bankName: varchar("bankName", { length: 100 }).notNull(),
  bankCode: varchar("bankCode", { length: 3 }).notNull(), // Código do banco
  accountType: mysqlEnum("accountType", ["checking", "savings"]).notNull(),
  accountNumber: varchar("accountNumber", { length: 20 }).notNull(),
  accountDigit: varchar("accountDigit", { length: 2 }),
  branchCode: varchar("branchCode", { length: 5 }).notNull(),
  accountHolder: varchar("accountHolder", { length: 255 }).notNull(),
  
  // Documentos
  idDocumentType: mysqlEnum("idDocumentType", ["rg", "cnh", "passport"]).notNull(),
  idDocumentUrl: text("idDocumentUrl").notNull(),
  idDocumentNumber: varchar("idDocumentNumber", { length: 20 }).notNull(),
  
  proofOfAddressUrl: text("proofOfAddressUrl").notNull(), // Conta de água, luz, etc
  
  // Status
  status: mysqlEnum("status", ["pending", "approved", "rejected", "expired"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"), // Motivo da rejeição
  
  // Auditoria
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: int("reviewedBy").references(() => users.id), // Admin que revisou
  expiresAt: timestamp("expiresAt"), // KYC expira após 1 ano
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KYCVerification = typeof kycVerifications.$inferSelect;
export type InsertKYCVerification = typeof kycVerifications.$inferInsert;
