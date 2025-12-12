import { eq, and, desc, gte, lte, or, isNull, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, tags, profileTags, callsHistory, transactions, InsertProfile, InsertTransaction, InsertCallHistory, withdrawals, InsertWithdrawal, kycApprovals, InsertKycApproval, callNotifications, streamerProfiles, callRooms, streamerCommissions, InsertStreamerCommission, StreamerCommission, balanceRecharges, InsertBalanceRecharge, mpWithdrawals, InsertMpWithdrawal, userBans, InsertUserBan, userSuspensions, InsertUserSuspension, moderationWarnings, InsertModerationWarning, moderationLogs, InsertModerationLog, activeCalls, InsertActiveCall, callReviews, InsertCallReview, notifications, InsertNotification, streamerBadges, InsertStreamerBadge, kycVerifications, InsertKYCVerification, KYCVerification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "username", "email", "loginMethod", "passwordHash", "passwordSalt"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== FLAYVE-SPECIFIC QUERIES =====

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProfile(profile: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getProfileByUserId(profile.userId);
  
  if (existing) {
    await db.update(profiles)
      .set(profile)
      .where(eq(profiles.userId, profile.userId));
    return existing.id;
  } else {
    const result = await db.insert(profiles).values(profile);
    return Number(result[0].insertId);
  }
}

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tags);
}

export async function getOnlineStreamers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      profile: profiles,
      user: users,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(and(
      eq(profiles.userType, "streamer"),
      eq(profiles.isOnline, true)
    ));
}

export async function getStreamersByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      profile: profiles,
      user: users,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .innerJoin(profileTags, eq(profileTags.profileId, profiles.id))
    .where(and(
      eq(profiles.userType, "streamer"),
      eq(profiles.isOnline, true),
      eq(profileTags.tagId, tagId)
    ));
}

export async function addProfileTag(profileId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(profileTags).values({ profileId, tagId });
}

export async function removeProfileTag(profileId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(profileTags)
    .where(and(
      eq(profileTags.profileId, profileId),
      eq(profileTags.tagId, tagId)
    ));
}

export async function getProfileTags(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({ tag: tags })
    .from(profileTags)
    .innerJoin(tags, eq(profileTags.tagId, tags.id))
    .where(eq(profileTags.profileId, profileId));
}

export async function createCall(call: InsertCallHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(callsHistory).values(call);
  return Number(result[0].insertId);
}

export async function getCallByRoomId(roomId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(callsHistory).where(eq(callsHistory.roomId, roomId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCall(callId: number, updates: Partial<InsertCallHistory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(callsHistory).set(updates).where(eq(callsHistory.id, callId));
}

export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values(transaction);
  return Number(result[0].insertId);
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

export async function updateBalance(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const profile = await getProfileByUserId(userId);
  if (!profile) throw new Error("Profile not found");
  
  const newBalance = (profile.balance || 0) + amount;
  
  await db.update(profiles)
    .set({ balance: newBalance })
    .where(eq(profiles.userId, userId));
  
  return newBalance;
}

export async function processCallBilling(callId: number, viewerId: number, streamerId: number, pricePerMinute: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const platformSplit = 0.30; // 30% para plataforma
  const streamerSplit = 0.70; // 70% para streamer
  
  const streamerEarning = Math.floor(pricePerMinute * streamerSplit);
  
  // Debitar do viewer
  await updateBalance(viewerId, -pricePerMinute);
  await createTransaction({
    userId: viewerId,
    type: "call_charge",
    amount: pricePerMinute,
    callId,
    description: "Cobrança por minuto de chamada",
    status: "completed"
  });
  
  // Creditar para streamer
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

export async function getPendingKYC() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      profile: profiles,
      user: users,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(profiles.kycStatus, "pending"));
}

export async function updateKYCStatus(profileId: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(profiles)
    .set({ kycStatus: status })
    .where(eq(profiles.id, profileId));
}

export async function createWithdrawal(data: {
  streamerId: number;
  amount: number;
  pixKey: string;
  pixKeyType: "cpf" | "email" | "phone";
  description?: string;
  isAnticipated: boolean;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Calcular taxa de antecipação (5% ENCIMA do valor disponível)
  // Se antecipar: streamer recebe valor disponível + 5% de taxa
  // Exemplo: R$ 100 disponível → com antecipação = R$ 105
  const fee = data.isAnticipated ? Math.round(data.amount * 0.05) : 0;
  const netAmount = data.isAnticipated ? data.amount + fee : data.amount;
  
  // Datas
  const now = new Date();
  const availableDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // D+30
  
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
    status: "pending",
  });
  
  return Number(result[0].insertId);
}

export async function getWithdrawalsByStreamerId(streamerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.streamerId, streamerId))
    .orderBy(desc(withdrawals.createdAt));
}

export async function getAvailableWithdrawalAmount(streamerId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const profile = await getProfileByUserId(streamerId);
  if (!profile) return 0;
  
  const now = new Date();
  
  // Pegar saques pendentes que já passaram D+30
  const availableWithdrawals = await db
    .select()
    .from(withdrawals)
    .where(
      and(
        eq(withdrawals.streamerId, streamerId),
        eq(withdrawals.status, "pending"),
        lte(withdrawals.availableDate, now)
      )
    );
  
  const availableAmount = availableWithdrawals.reduce((sum, w) => sum + (w.netAmount || 0), 0);
  
  return Math.min(profile.balance || 0, availableAmount);
}

export async function canWithdraw(streamerId: number, amount: number): Promise<{ can: boolean; reason?: string }> {
  const db = await getDb();
  if (!db) return { can: false, reason: "Database not available" };
  
  // Verificar KYC
  const kyc = await db
    .select()
    .from(kycApprovals)
    .where(eq(kycApprovals.streamerId, streamerId))
    .limit(1);
  
  if (!kyc || kyc.length === 0 || kyc[0].status !== "approved") {
    return { can: false, reason: "Complete KYC verification to withdraw" };
  }
  
  // Verificar saldo
  const profile = await getProfileByUserId(streamerId);
  if (!profile || (profile.balance || 0) < amount) {
    return { can: false, reason: "Insufficient balance" };
  }
  
  // Verificar limite máximo (R$ 10.000)
  if (amount > 1000000) { // 1.000.000 centavos = R$ 10.000
    return { can: false, reason: "Maximum withdrawal is R$ 10,000" };
  }
  
  // Verificar limite diário (3 saques/dia)
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const todayWithdrawals = await db
    .select()
    .from(withdrawals)
    .where(
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

export async function getAllWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      withdrawal: withdrawals,
      user: users,
    })
    .from(withdrawals)
    .innerJoin(users, eq(withdrawals.streamerId, users.id))
    .orderBy(desc(withdrawals.createdAt));
}

export async function updateWithdrawalStatus(withdrawalId: number, status: "pending" | "processing" | "completed" | "failed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(withdrawals)
    .set({ status, processedAt: new Date() })
    .where(eq(withdrawals.id, withdrawalId));
}

export async function approveKYC(streamerId: number, adminId: number, comment?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Atualizar status KYC no perfil
  const profile = await getProfileByUserId(streamerId);
  if (!profile) throw new Error("Profile not found");
  
  await db.update(profiles)
    .set({ kycStatus: "approved" })
    .where(eq(profiles.id, profile.id));
  
  // Registrar aprovação
  await db.insert(kycApprovals).values({
    streamerId,
    status: "approved",
    approvedBy: adminId,
    comment,
    reviewedAt: new Date(),
  });
}

export async function rejectKYC(streamerId: number, adminId: number, comment: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Atualizar status KYC no perfil
  const profile = await getProfileByUserId(streamerId);
  if (!profile) throw new Error("Profile not found");
  
  await db.update(profiles)
    .set({ kycStatus: "rejected" })
    .where(eq(profiles.id, profile.id));
  
  // Registrar rejeição
  await db.insert(kycApprovals).values({
    streamerId,
    status: "rejected",
    approvedBy: adminId,
    comment,
    reviewedAt: new Date(),
  });
}

export async function getReports(filters: {
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}) {
  const db = await getDb();
  if (!db) return { withdrawals: [], transactions: [], total: 0 };
  
  const offset = (filters.page - 1) * filters.limit;
  
  // Obter todos os saques
  const allWithdrawals = await db.select().from(withdrawals);
  
  // Filtrar por data se necessário
  let filteredWithdrawals = allWithdrawals;
  if (filters.startDate || filters.endDate) {
    filteredWithdrawals = allWithdrawals.filter(w => {
      const date = new Date(w.requestedAt);
      if (filters.startDate && date < filters.startDate) return false;
      if (filters.endDate && date > filters.endDate) return false;
      return true;
    });
  }
  
  const withdrawalsList = filteredWithdrawals.slice(offset, offset + filters.limit);
  
  // Obter todas as transações
  const allTransactions = await db.select().from(transactions);
  
  // Filtrar por data se necessário
  let filteredTransactions = allTransactions;
  if (filters.startDate || filters.endDate) {
    filteredTransactions = allTransactions.filter(t => {
      const date = new Date(t.createdAt);
      if (filters.startDate && date < filters.startDate) return false;
      if (filters.endDate && date > filters.endDate) return false;
      return true;
    });
  }
  
  const transactionsList = filteredTransactions.slice(offset, offset + filters.limit);
  
  return {
    withdrawals: withdrawalsList,
    transactions: transactionsList,
    total: Math.max(filteredWithdrawals.length, filteredTransactions.length),
  };
}

export async function getWithdrawalStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, processing: 0, completed: 0, failed: 0, totalAmount: 0 };
  
  const allWithdrawals = await db.select().from(withdrawals);
  
  return {
    total: allWithdrawals.length,
    pending: allWithdrawals.filter(w => w.status === "pending").length,
    processing: allWithdrawals.filter(w => w.status === "processing").length,
    completed: allWithdrawals.filter(w => w.status === "completed").length,
    failed: allWithdrawals.filter(w => w.status === "failed").length,
    totalAmount: allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0),
  };
}

export async function getTransactionStats() {
  const db = await getDb();
  if (!db) return { total: 0, earnings: 0, expenses: 0, credits: 0 };
  
  const allTransactions = await db.select().from(transactions);
  
  return {
    total: allTransactions.length,
    earnings: allTransactions
      .filter(t => t.type === "call_earning")
      .reduce((sum, t) => sum + t.amount, 0),
    expenses: allTransactions
      .filter(t => t.type === "call_charge" || t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0),
    credits: allTransactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0),
  };
}


// ===== PASSWORD RESET =====

export async function savePasswordResetToken(userId: number, tokenHash: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) return;
  
  // Armazenar em um campo temporário do usuário (em produção, usar tabela separada)
  // Por enquanto, apenas retornar sucesso
  return { success: true };
}

export async function getUserByResetToken(tokenHash: string) {
  // Em produção, buscar no banco de dados
  // Por enquanto, retornar null
  return null;
}

export async function updateUserPassword(userId: number, passwordHash: string, passwordSalt: string) {
  const db = await getDb();
  if (!db) return;
  
  const user = await getUserById(userId);
  if (!user) return;
  
  await db.update(users)
    .set({ passwordHash, passwordSalt })
    .where(eq(users.id, userId));
}

export async function clearPasswordResetToken(userId: number) {
  // Em produção, limpar token do banco de dados
  return { success: true };
}


// ===== EMAIL VERIFICATION =====

export async function saveEmailVerificationToken(userId: number, tokenHash: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users)
    .set({ emailVerificationToken: tokenHash, emailVerificationTokenExpiry: expiresAt })
    .where(eq(users.id, userId));
}

export async function getUserByEmailVerificationToken(tokenHash: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.emailVerificationToken, tokenHash)).limit(1);
  if (result.length === 0) return undefined;
  
  const user = result[0];
  if (!user.emailVerificationTokenExpiry || new Date() > user.emailVerificationTokenExpiry) {
    return undefined;
  }
  
  return user;
}

export async function markEmailAsVerified(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users)
    .set({ emailVerified: true, emailVerificationToken: null, emailVerificationTokenExpiry: null })
    .where(eq(users.id, userId));
}


// ===== CALL SYSTEM QUERIES =====

export async function createCallNotification(data: {
  streamerId: number;
  viewerId: number;
  viewerName?: string;
  viewerPhotoUrl?: string;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(callNotifications).values({
    streamerId: data.streamerId,
    viewerId: data.viewerId,
    viewerName: data.viewerName,
    viewerPhotoUrl: data.viewerPhotoUrl,
    expiresAt: data.expiresAt,
    status: "pending",
  });
  
  return { id: result[0].insertId };
}

export async function getCallNotificationById(notificationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(callNotifications)
    .where(eq(callNotifications.id, notificationId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCallNotificationStatus(notificationId: number, status: "pending" | "accepted" | "rejected" | "expired") {
  const db = await getDb();
  if (!db) return;
  
  await db.update(callNotifications)
    .set({ status })
    .where(eq(callNotifications.id, notificationId));
}

export async function getActiveCallNotifications(streamerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(callNotifications)
    .where(and(
      eq(callNotifications.streamerId, streamerId),
      eq(callNotifications.status, "pending")
    ))
    .orderBy(desc(callNotifications.createdAt));
  
  return result;
}

export async function createCallRoom(data: {
  roomId: string;
  streamerId: number;
  viewerId: number;
  status: "waiting" | "active" | "ended";
  startedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(callRooms).values({
    roomId: data.roomId,
    streamerId: data.streamerId,
    viewerId: data.viewerId,
    status: data.status,
    startedAt: data.startedAt,
  });
  
  return { id: result[0].insertId };
}

export async function getCallRoomByRoomId(roomId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(callRooms)
    .where(eq(callRooms.roomId, roomId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCallRoom(roomId: number, updates: Partial<{
  status: "waiting" | "active" | "ended";
  startedAt: Date;
  endedAt: Date;
}>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(callRooms)
    .set(updates)
    .where(eq(callRooms.id, roomId));
}

export async function createCallHistory(data: {
  roomId: string;
  viewerId: number;
  streamerId: number;
  startedAt: Date;
  endedAt: Date;
  durationMinutes: number;
  totalCost: number;
  status: "active" | "completed" | "cancelled";
}) {
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
    status: data.status,
  });
}

export async function updateProfileBalance(userId: number, newBalance: number) {
  const db = await getDb();
  if (!db) return;
  
  const profile = await getProfileByUserId(userId);
  if (!profile) return;
  
  await db.update(profiles)
    .set({ balance: newBalance })
    .where(eq(profiles.userId, userId));
}

export async function createStreamerProfile(data: {
  userId: number;
  bio?: string;
  about?: string;
  photoUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(streamerProfiles).values({
    userId: data.userId,
    bio: data.bio,
    about: data.about,
    photoUrl: data.photoUrl,
  });
  
  return { id: result[0].insertId };
}

export async function getStreamerProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(streamerProfiles)
    .where(eq(streamerProfiles.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStreamerProfile(userId: number, updates: {
  bio?: string;
  about?: string;
  photoUrl?: string;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(streamerProfiles)
    .set(updates)
    .where(eq(streamerProfiles.userId, userId));
}


// ============ STREAMER COMMISSIONS ============

export async function getStreamerCommission(streamerId: number): Promise<StreamerCommission | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(streamerCommissions)
    .where(eq(streamerCommissions.streamerId, streamerId));

  return result.length > 0 ? result[0] : undefined;
}

export async function createStreamerCommission(streamerId: number, baseCommission: number = 70): Promise<StreamerCommission | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(streamerCommissions)
    .values({
      streamerId,
      baseCommission: baseCommission.toString(),
      totalCommission: baseCommission.toString(),
      notes: "Initial commission"
    });

  return getStreamerCommission(streamerId);
}

export async function updateStreamerCommission(
  streamerId: number,
  updates: {
    baseCommission?: number;
    loyaltyBonus?: number;
    referralBonus?: number;
    performanceBonus?: number;
    notes?: string;
  }
): Promise<StreamerCommission | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  // Get current commission
  const current = await getStreamerCommission(streamerId);
  if (!current) {
    // Create if doesn't exist
    return createStreamerCommission(streamerId, updates.baseCommission || 70);
  }

  // Calculate total commission
  const baseCommission = updates.baseCommission ?? parseFloat(current.baseCommission.toString());
  const loyaltyBonus = updates.loyaltyBonus ?? parseFloat(current.loyaltyBonus?.toString() || "0");
  const totalCommission = baseCommission + loyaltyBonus;

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (updates.baseCommission !== undefined) updateData.baseCommission = updates.baseCommission.toString();
  if (updates.loyaltyBonus !== undefined) updateData.loyaltyBonus = updates.loyaltyBonus.toString();
  if (updates.referralBonus !== undefined) updateData.referralBonus = updates.referralBonus.toString();
  if (updates.performanceBonus !== undefined) updateData.performanceBonus = updates.performanceBonus.toString();
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  updateData.totalCommission = totalCommission.toString();

  await db.update(streamerCommissions)
    .set(updateData)
    .where(eq(streamerCommissions.streamerId, streamerId));

  return getStreamerCommission(streamerId);
}

export async function getAllStreamerCommissions(): Promise<StreamerCommission[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(streamerCommissions)
    .orderBy(desc(streamerCommissions.updatedAt));
}


// ============ CALL HISTORY STATS ============

export async function getStreamerCallStats(streamerId: number): Promise<{
  totalCalls: number;
  totalEarnings: number;
  totalMinutes: number;
}> {
  const db = await getDb();
  if (!db) return { totalCalls: 0, totalEarnings: 0, totalMinutes: 0 };

  const calls = await db.select()
    .from(callsHistory)
    .where(eq(callsHistory.streamerId, streamerId));

  const totalCalls = calls.length;
  const totalEarnings = calls.reduce((sum, call) => sum + (call.totalCost || 0), 0);
  const totalMinutes = calls.reduce((sum, call) => sum + (call.durationMinutes || 0), 0);

  return { totalCalls, totalEarnings, totalMinutes };
}

export async function getViewerCallStats(viewerId: number): Promise<{
  totalCalls: number;
  totalSpent: number;
  totalMinutes: number;
}> {
  const db = await getDb();
  if (!db) return { totalCalls: 0, totalSpent: 0, totalMinutes: 0 };

  const calls = await db.select()
    .from(callsHistory)
    .where(eq(callsHistory.viewerId, viewerId));

  const totalCalls = calls.length;
  const totalSpent = calls.reduce((sum, call) => sum + (call.totalCost || 0), 0);
  const totalMinutes = calls.reduce((sum, call) => sum + (call.durationMinutes || 0), 0);

  return { totalCalls, totalSpent, totalMinutes };
}


// ===== MERCADO PAGO PAYMENTS =====

export async function createBalanceRecharge(
  userId: number,
  amount: number,
  preferenceId: string,
  paymentMethod: "pix" | "credit_card" | "debit_card"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(balanceRecharges).values({
    userId,
    amount,
    preferenceId,
    paymentMethod,
    status: "pending",
    description: `Recarga de saldo - R$ ${(amount / 100).toFixed(2)}`,
  });
  
  return Number(result[0].insertId);
}

export async function getBalanceRechargeByPreferenceId(preferenceId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(balanceRecharges)
    .where(eq(balanceRecharges.preferenceId, preferenceId))
    .limit(1);
  
  return result[0] || null;
}

export async function updateBalanceRechargeStatus(
  rechargeId: number,
  status: "pending" | "approved" | "rejected" | "cancelled",
  paymentId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };
  
  if (paymentId) {
    updates.paymentId = paymentId;
  }
  
  if (status === "approved") {
    updates.approvedAt = new Date();
  }
  
  await db.update(balanceRecharges)
    .set(updates)
    .where(eq(balanceRecharges.id, rechargeId));
}

export async function createMpWithdrawal(
  streamerId: number,
  amount: number,
  pixKey: string,
  pixKeyType: "cpf" | "email" | "phone" | "random",
  description: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(mpWithdrawals).values({
    streamerId,
    amount,
    pixKey,
    pixKeyType,
    status: "pending",
    description,
  });
  
  return Number(result[0].insertId);
}

export async function getMpWithdrawalsByStreamerId(streamerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(mpWithdrawals)
    .where(eq(mpWithdrawals.streamerId, streamerId))
    .orderBy(desc(mpWithdrawals.createdAt));
}

export async function updateMpWithdrawalStatus(
  withdrawalId: number,
  status: "pending" | "processing" | "completed" | "failed",
  transferId?: string,
  failureReason?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };
  
  if (transferId) {
    updates.transferId = transferId;
  }
  
  if (failureReason) {
    updates.failureReason = failureReason;
  }
  
  if (status === "completed" || status === "failed") {
    updates.processedAt = new Date();
  }
  
  await db.update(mpWithdrawals)
    .set(updates)
    .where(eq(mpWithdrawals.id, withdrawalId));
}

export async function getAllMpWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      withdrawal: mpWithdrawals,
      user: users,
    })
    .from(mpWithdrawals)
    .innerJoin(users, eq(mpWithdrawals.streamerId, users.id))
    .orderBy(desc(mpWithdrawals.createdAt));
}


// ============ MODERATION & SECURITY ============

/**
 * Ban a user (permanent or temporary)
 */
export async function banUser(
  userId: number,
  adminId: number,
  reason: string,
  banType: "permanent" | "temporary" = "permanent",
  daysToExpire?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiresAt = banType === "temporary" && daysToExpire 
    ? new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000)
    : null;

  await db.insert(userBans).values({
    userId,
    adminId,
    reason,
    banType,
    expiresAt,
    isActive: true,
  });

  // Log the action
  await logModerationAction(adminId, userId, "ban", reason, { banType, expiresAt });
}

/**
 * Unban a user
 */
export async function unbanUser(userId: number, adminId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userBans)
    .set({ isActive: false })
    .where(and(eq(userBans.userId, userId), eq(userBans.isActive, true)));

  // Log the action
  await logModerationAction(adminId, userId, "unban", reason);
}

/**
 * Check if user is banned (and if temporary ban expired)
 */
export async function isUserBanned(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const activeBans = await db.select()
    .from(userBans)
    .where(and(
      eq(userBans.userId, userId),
      eq(userBans.isActive, true)
    ));

  if (activeBans.length === 0) return false;

  // Check if any ban is still active
  for (const ban of activeBans) {
    if (ban.banType === "permanent") return true;
    if (ban.expiresAt && ban.expiresAt > new Date()) return true;
  }

  return false;
}

/**
 * Suspend a streamer (temporary)
 */
export async function suspendUser(
  userId: number,
  adminId: number,
  reason: string,
  suspensionDays: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiresAt = new Date(Date.now() + suspensionDays * 24 * 60 * 60 * 1000);

  await db.insert(userSuspensions).values({
    userId,
    adminId,
    reason,
    suspensionDays,
    expiresAt,
    isActive: true,
  });

  // Log the action
  await logModerationAction(adminId, userId, "suspend", reason, { suspensionDays });
}

/**
 * Unsuspend a user
 */
export async function unsuspendUser(userId: number, adminId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userSuspensions)
    .set({ isActive: false })
    .where(and(eq(userSuspensions.userId, userId), eq(userSuspensions.isActive, true)));

  // Log the action
  await logModerationAction(adminId, userId, "unsuspend", reason);
}

/**
 * Check if user is suspended (and if suspension expired)
 */
export async function isUserSuspended(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const activeSuspensions = await db.select()
    .from(userSuspensions)
    .where(and(
      eq(userSuspensions.userId, userId),
      eq(userSuspensions.isActive, true)
    ));

  if (activeSuspensions.length === 0) return false;

  // Check if suspension is still active
  for (const suspension of activeSuspensions) {
    if (suspension.expiresAt > new Date()) return true;
  }

  return false;
}

/**
 * Add a warning to a user
 */
export async function warnUser(
  userId: number,
  adminId: number,
  reason: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get existing warnings
  const existingWarnings = await db.select()
    .from(moderationWarnings)
    .where(eq(moderationWarnings.userId, userId));

  const warningCount = existingWarnings.length + 1;

  await db.insert(moderationWarnings).values({
    userId,
    adminId,
    reason,
    warningCount,
  });

  // Log the action
  await logModerationAction(adminId, userId, "warn", reason, { warningCount });

  return warningCount;
}

/**
 * Get user warnings
 */
export async function getUserWarnings(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(moderationWarnings)
    .where(eq(moderationWarnings.userId, userId))
    .orderBy(desc(moderationWarnings.createdAt));
}

/**
 * Log moderation action
 */
export async function logModerationAction(
  adminId: number,
  targetUserId: number,
  action: "ban" | "unban" | "suspend" | "unsuspend" | "warn" | "end_call" | "remove_content" | "restrict_streaming" | "other",
  reason?: string,
  details?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(moderationLogs).values({
    adminId,
    targetUserId,
    action,
    reason,
    details: details ? JSON.stringify(details) : null,
  });
}

/**
 * Get moderation logs for a user
 */
export async function getUserModerationLogs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(moderationLogs)
    .where(eq(moderationLogs.targetUserId, userId))
    .orderBy(desc(moderationLogs.createdAt));
}

/**
 * Get all moderation logs (for admin dashboard)
 */
export async function getAllModerationLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  // Get logs with admin info
  const logs = await db.select({
    log: moderationLogs,
    admin: users,
  })
    .from(moderationLogs)
    .innerJoin(users, eq(moderationLogs.adminId, users.id))
    .orderBy(desc(moderationLogs.createdAt))
    .limit(limit);

  // Get target user info for each log
  const result = await Promise.all(
    logs.map(async (item) => {
      const targetUser = await db.select().from(users).where(eq(users.id, item.log.targetUserId)).limit(1);
      return {
        log: item.log,
        admin: item.admin,
        target: targetUser[0] || null,
      };
    })
  );

  return result;
}

/**
 * End an active call (admin action)
 */
export async function endActiveCall(
  callRoomId: string,
  adminId: number,
  reason: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const call = await db.select()
    .from(activeCalls)
    .where(eq(activeCalls.callRoomId, callRoomId))
    .limit(1);

  if (call.length === 0) throw new Error("Call not found");

  const activeCall = call[0];

  await db.update(activeCalls)
    .set({ isActive: false, endedAt: new Date() })
    .where(eq(activeCalls.id, activeCall.id));

  // Log the action
  await logModerationAction(adminId, activeCall.streamerId, "end_call", reason, {
    callRoomId,
    viewerId: activeCall.viewerId,
  });
}

/**
 * Create active call record
 */
export async function createActiveCall(
  callRoomId: string,
  streamerId: number,
  viewerId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(activeCalls).values({
    callRoomId,
    streamerId,
    viewerId,
    isActive: true,
  });
}

/**
 * Get active calls (for admin dashboard)
 */
export async function getActiveCalls() {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    call: activeCalls,
    streamer: users,
    viewer: users,
  })
    .from(activeCalls)
    .innerJoin(users, eq(activeCalls.streamerId, users.id))
    .innerJoin(users, eq(activeCalls.viewerId, users.id))
    .where(eq(activeCalls.isActive, true));
}


// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export async function createCallReview(data: InsertCallReview): Promise<any | null> {
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

export async function getCallReviewById(id: number): Promise<any | null> {
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

export async function getStreamerReviews(streamerId: number, limit = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(callReviews)
      .where(eq(callReviews.revieweeId, streamerId))
      .orderBy(desc(callReviews.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Error getting streamer reviews:", error);
    return [];
  }
}

export async function getStreamerAverageRating(streamerId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db
      .select({
        avgRating: sql`AVG(${callReviews.rating})`,
        count: sql`COUNT(*)`,
      })
      .from(callReviews)
      .where(eq(callReviews.revieweeId, streamerId));

    return result[0]?.avgRating ? parseFloat(result[0].avgRating as string) : 0;
  } catch (error) {
    console.error("[Database] Error getting average rating:", error);
    return 0;
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function createNotification(data: InsertNotification): Promise<any | null> {
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

export async function getNotificationById(id: number): Promise<any | null> {
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

export async function getUserNotifications(userId: number, limit = 20): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Error getting user notifications:", error);
    return [];
  }
}

export async function getUnreadNotifications(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
      .orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error("[Database] Error getting unread notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Error marking notification as read:", error);
    return false;
  }
}

// ============================================================================
// STREAMER BADGES
// ============================================================================

export async function addStreamerBadge(data: InsertStreamerBadge): Promise<boolean> {
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

export async function getStreamerBadges(streamerId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(streamerBadges)
      .where(
        and(
          eq(streamerBadges.streamerId, streamerId),
          or(
            isNull(streamerBadges.expiresAt),
            gte(streamerBadges.expiresAt, new Date())
          )
        )
      );
  } catch (error) {
    console.error("[Database] Error getting badges:", error);
    return [];
  }
}

export async function removeStreamerBadge(streamerId: number, badgeType: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(streamerBadges)
      .where(
        and(
          eq(streamerBadges.streamerId, streamerId),
          eq(streamerBadges.badgeType, badgeType as any)
        )
      );
    return true;
  } catch (error) {
    console.error("[Database] Error removing badge:", error);
    return false;
  }
}

export async function hasStreamerBadge(streamerId: number, badgeType: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db
      .select()
      .from(streamerBadges)
      .where(
        and(
          eq(streamerBadges.streamerId, streamerId),
          eq(streamerBadges.badgeType, badgeType as any),
          or(
            isNull(streamerBadges.expiresAt),
            gte(streamerBadges.expiresAt, new Date())
          )
        )
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("[Database] Error checking badge:", error);
    return false;
  }
}


// ============================================================================
// KYC VERIFICATION
// ============================================================================

/**
 * Validar CPF (algoritmo de checksum)
 */
function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

/**
 * Submeter KYC com documentos
 */
export async function submitKYC(userId: number, data: InsertKYCVerification): Promise<{ success: boolean; error?: string; kycId?: number }> {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    // Validar CPF
    if (!isValidCPF(data.cpf)) {
      return { success: false, error: "CPF inválido" };
    }

    // Verificar se já existe KYC pendente ou aprovado
    const existing = await db
      .select()
      .from(kycVerifications)
      .where(
        and(
          eq(kycVerifications.userId, userId),
          or(
            eq(kycVerifications.status, "pending"),
            eq(kycVerifications.status, "approved")
          )
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Você já tem uma verificação KYC em andamento ou aprovada" };
    }

    // Inserir KYC
    const result = await db.insert(kycVerifications).values({
      ...data,
      userId,
      cpf: data.cpf.replace(/\D/g, ""), // Armazenar apenas números
    }) as any;

    return { success: true, kycId: result.insertId || 0 };
  } catch (error) {
    console.error("[Database] Error submitting KYC:", error);
    return { success: false, error: "Erro ao submeter KYC" };
  }
}

/**
 * Obter KYC do usuário
 */
export async function getUserKYC(userId: number): Promise<KYCVerification | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(kycVerifications)
      .where(eq(kycVerifications.userId, userId))
      .orderBy(desc(kycVerifications.createdAt))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error getting user KYC:", error);
    return null;
  }
}

/**
 * Obter KYC por ID
 */
export async function getKYCById(kycId: number): Promise<KYCVerification | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(kycVerifications)
      .where(eq(kycVerifications.id, kycId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Error getting KYC by ID:", error);
    return null;
  }
}

/**
 * Listar KYCs pendentes para revisão
 */
export async function getPendingKYCs(limit: number = 50): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select({
        kyc: kycVerifications,
        user: users,
      })
      .from(kycVerifications)
      .innerJoin(users, eq(kycVerifications.userId, users.id))
      .where(eq(kycVerifications.status, "pending"))
      .orderBy(desc(kycVerifications.submittedAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Error getting pending KYCs:", error);
    return [];
  }
}

/**
 * Aprovar KYC (nova tabela)
 */
export async function approveKYCVerification(kycId: number, adminId: number, comment?: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db
      .update(kycVerifications)
      .set({
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      })
      .where(eq(kycVerifications.id, kycId));

    return { success: true };
  } catch (error) {
    console.error("[Database] Error approving KYC:", error);
    return { success: false, error: "Erro ao aprovar KYC" };
  }
}

/**
 * Rejeitar KYC (nova tabela)
 */
export async function rejectKYCVerification(kycId: number, adminId: number, reason: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    if (!reason || reason.trim().length === 0) {
      return { success: false, error: "Motivo da rejeição é obrigatório" };
    }

    await db
      .update(kycVerifications)
      .set({
        status: "rejected",
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      })
      .where(eq(kycVerifications.id, kycId));

    return { success: true };
  } catch (error) {
    console.error("[Database] Error rejecting KYC:", error);
    return { success: false, error: "Erro ao rejeitar KYC" };
  }
}

/**
 * Verificar se usuário tem KYC aprovado
 */
export async function hasApprovedKYC(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const result = await db
      .select()
      .from(kycVerifications)
      .where(
        and(
          eq(kycVerifications.userId, userId),
          eq(kycVerifications.status, "approved"),
          or(
            isNull(kycVerifications.expiresAt),
            gte(kycVerifications.expiresAt, new Date())
          )
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("[Database] Error checking approved KYC:", error);
    return false;
  }
}

/**
 * Obter estatísticas de KYC
 */
export async function getKYCStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
  const db = await getDb();
  if (!db) return { pending: 0, approved: 0, rejected: 0, total: 0 };

  try {
    const result = await db
      .select({
        status: kycVerifications.status,
        count: sql`COUNT(*) as count`,
      })
      .from(kycVerifications)
      .groupBy(kycVerifications.status);

    const stats = { pending: 0, approved: 0, rejected: 0, total: 0 };
    
    result.forEach((row: any) => {
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
