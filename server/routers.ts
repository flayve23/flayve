import { COOKIE_NAME } from "@shared/const";
import { createHash, randomBytes } from "crypto";
import { SignJWT } from "jose";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { reviewsRouter } from "./routers/reviews";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email inválido"),
          password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
          username: z.string().min(3, "Nome de usuário deve ter no mínimo 3 caracteres"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) throw new Error("Email já cadastrado");
        const salt = randomBytes(16).toString("hex");
        const hash = createHash("sha256").update(input.password + salt).digest("hex");
        const openId = `user-${randomBytes(8).toString("hex")}`;
        await db.upsertUser({
          openId,
          username: input.username,
          email: input.email,
          loginMethod: "email",
          passwordHash: hash,
          passwordSalt: salt,
          role: "user",
          lastSignedIn: new Date(),
        });
        const user = await db.getUserByOpenId(openId);
        if (!user) throw new Error("Erro ao criar usuário");
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const token = Buffer.from(JSON.stringify({ userId: user.id, openId: user.openId, passwordHash: hash, salt })).toString("base64");
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        const verificationToken = randomBytes(32).toString("hex");
        const verificationTokenHash = createHash("sha256").update(verificationToken).digest("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await db.saveEmailVerificationToken(user.id, verificationTokenHash, verificationTokenExpiry);
        return { success: true, message: "Conta criada! Verifique seu email para confirmar", verificationToken, userId: user.id, requiresEmailVerification: true };
      }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user) throw new Error("Email ou senha inválidos");
        
        // Verificar se usuário está banido
        const isBanned = await db.isUserBanned(user.id);
        if (isBanned) throw new Error("Sua conta foi banida. Entre em contato com o suporte.");
        
        // Verificar senha
        if (!user.passwordHash || !user.passwordSalt) {
          throw new Error("Email ou senha inválidos");
        }
        
        const hash = createHash("sha256").update(input.password + user.passwordSalt).digest("hex");
        if (hash !== user.passwordHash) {
          throw new Error("Email ou senha inválidos");
        }
        
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
        const token = await new SignJWT({ userId: user.id, openId: user.openId, appId: process.env.VITE_APP_ID || 'flayve', name: user.username || 'User' })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('7d')
          .sign(secretKey);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } };
      }),
    forgotPassword: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user) {
          return { success: true, message: "Se o email existir, voce recebera um link de reset" };
        }
        const resetToken = randomBytes(32).toString("hex");
        const resetTokenHash = createHash("sha256").update(resetToken).digest("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await db.savePasswordResetToken(user.id, resetTokenHash, resetTokenExpiry);
        return { success: true, message: "Se o email existir, voce recebera um link de reset", resetToken };
      }),
    verifyEmail: publicProcedure
      .input(z.object({ verificationToken: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const verificationTokenHash = createHash("sha256").update(input.verificationToken).digest("hex");
        const user = await db.getUserByEmailVerificationToken(verificationTokenHash);
        if (!user) throw new Error("Token de verificacao invalido ou expirado");
        await db.markEmailAsVerified(user.id);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
        const token = await new SignJWT({ userId: user.id, openId: user.openId, appId: process.env.VITE_APP_ID || 'flayve', name: user.username || 'User' })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('7d')
          .sign(secretKey);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } };
      }),
    resendVerificationEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user) return { success: true, message: "Se o email existir, voce recebera um novo link" };
        if (user.emailVerified) return { success: true, message: "Email ja foi verificado" };
        const verificationToken = randomBytes(32).toString("hex");
        const verificationTokenHash = createHash("sha256").update(verificationToken).digest("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await db.saveEmailVerificationToken(user.id, verificationTokenHash, verificationTokenExpiry);
        return { success: true, message: "Email de verificacao reenviado", verificationToken };
      })
  }),

  profile: router({
    getTags: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),

    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getProfileByUserId(ctx.user.id);
      return profile || null; // Return null instead of undefined
    }),

    createStreamerProfile: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          photoUrl: z.string().url(),
          bio: z.string().min(5, "Bio deve ter no mínimo 5 caracteres"),
          pricePerMinute: z.number().min(199),
          tagIds: z.array(z.number()),
        })
      )
      .mutation(async ({ input }) => {
        const profileId = await db.upsertProfile({
          userId: input.userId,
          userType: "streamer",
          photoUrl: input.photoUrl,
          bio: input.bio,
          pricePerMinute: input.pricePerMinute,
          isOnline: false,
          balance: 0,
          totalEarnings: 0,
          kycStatus: "pending",
        });

        for (const tagId of input.tagIds) {
          await db.addProfileTag(profileId, tagId);
        }

        return { success: true, profileId };
      }),

    createViewerProfile: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const profileId = await db.upsertProfile({
          userId: input.userId,
          userType: "viewer",
          balance: 0,
        });

        return { success: true, profileId };
      }),

    updateOnlineStatus: protectedProcedure
      .input(
        z.object({
          isOnline: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile not found");

        await db.upsertProfile({
          ...profile,
          isOnline: input.isOnline,
        });

        return { success: true };
      }),

    updatePrice: protectedProcedure
      .input(
        z.object({
          pricePerMinute: z.number().min(199),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile not found");

        await db.upsertProfile({
          ...profile,
          pricePerMinute: input.pricePerMinute,
        });

        return { success: true };
      }),

    getOnlineStreamers: publicProcedure.query(async () => {
      return await db.getOnlineStreamers();
    }),

    getStreamersByTag: publicProcedure
      .input(z.object({ tagId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStreamersByTag(input.tagId);
      }),

    getProfileTags: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProfileTags(input.profileId);
      }),
  }),

  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getProfileByUserId(ctx.user.id);
      return { balance: profile?.balance || 0 };
    }),

    addCredits: protectedProcedure
      .input(
        z.object({
          amount: z.number().min(100),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newBalance = await db.updateBalance(ctx.user.id, input.amount);

        await db.createTransaction({
          userId: ctx.user.id,
          type: "credit",
          amount: input.amount,
          description: "Créditos adicionados via Pix",
          status: "completed",
        });

        return { success: true, newBalance };
      }),

    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserTransactions(ctx.user.id);
    }),
  }),

  withdrawals: router({
    requestWithdrawal: protectedProcedure
      .input(
        z.object({
          amount: z.number().min(10000).max(1000000),
          pixKey: z.string().min(3),
          pixKeyType: z.enum(["cpf", "email", "phone"]),
          anticipate: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const canWithdraw = await db.canWithdraw(ctx.user.id, input.amount);
        if (!canWithdraw.can) {
          throw new Error(canWithdraw.reason || "Cannot withdraw");
        }

        const profile = await db.getProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile not found");
        const balance = profile.balance || 0;
        if (balance < input.amount) throw new Error("Saldo insuficiente");

        const fee = input.anticipate ? Math.round(input.amount * 0.05) : 0;
        const netAmount = input.amount - fee;

        const withdrawal = await db.createWithdrawal({
          streamerId: ctx.user.id,
          amount: input.amount,
          pixKey: input.pixKey,
          pixKeyType: input.pixKeyType,
          description: ctx.user.username || `Streamer ${ctx.user.id}`,
          isAnticipated: input.anticipate,
          ipAddress: ctx.req?.ip,
          userAgent: ctx.req?.headers["user-agent"],
        });

        await db.updateBalance(ctx.user.id, -input.amount);

        const description = input.anticipate
          ? `Saque antecipado de R$ ${(netAmount / 100).toFixed(2)} (taxa 5%: R$ ${(fee / 100).toFixed(2)})`
          : `Saque de R$ ${(input.amount / 100).toFixed(2)} via Pix`;

        await db.createTransaction({
          userId: ctx.user.id,
          type: "withdrawal",
          amount: input.anticipate ? netAmount : input.amount,
          description,
          status: "pending",
        });

        return {
          success: true,
          withdrawal,
          fee,
          netAmount,
          message: input.anticipate
            ? `Saque antecipado solicitado. Taxa de 5% (R$ ${(fee / 100).toFixed(2)}) foi descontada.`
            : `Saque solicitado. Disponivel em D+30.`,
        };
      }),

    getWithdrawals: protectedProcedure.query(async ({ ctx }) => {
      return await db.getWithdrawalsByStreamerId(ctx.user.id);
    }),
  }),

  admin: router({
    getPendingKYC: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getPendingKYC();
    }),

    approveKYC: protectedProcedure
      .input(z.object({ streamerId: z.number(), comment: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        await db.approveKYC(input.streamerId, ctx.user.id, input.comment);
        return { success: true };
      }),

    rejectKYC: protectedProcedure
      .input(z.object({ streamerId: z.number(), comment: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        await db.rejectKYC(input.streamerId, ctx.user.id, input.comment);
        return { success: true };
      }),

    getWithdrawals: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getAllWithdrawals();
    }),

    getReports: protectedProcedure
      .input(
        z.object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.getReports(input);
      }),

    getWithdrawalStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getWithdrawalStats();
    }),

    getTransactionStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getTransactionStats();
    }),
  }),

  calls: router({
    initiateCall: protectedProcedure
      .input(
        z.object({
          streamerId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const streamer = await db.getUserById(input.streamerId);
        if (!streamer) throw new Error("Streamer not found");
        if (streamer.role !== "streamer") throw new Error("User is not a streamer");

        const viewer = await db.getUserById(ctx.user.id);
        if (!viewer) throw new Error("Viewer not found");

        const notification = await db.createCallNotification({
          streamerId: input.streamerId,
          viewerId: ctx.user.id,
          viewerName: viewer.username || "Visitante",
          viewerPhotoUrl: "",
          expiresAt: new Date(Date.now() + 30 * 1000),
        });

        return { success: true, notificationId: notification.id };
      }),

    acceptCall: protectedProcedure
      .input(
        z.object({
          notificationId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const notification = await db.getCallNotificationById(input.notificationId);
        if (!notification) throw new Error("Notification not found");
        if (notification.streamerId !== ctx.user.id) throw new Error("Unauthorized");

        const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const room = await db.createCallRoom({
          roomId,
          streamerId: notification.streamerId,
          viewerId: notification.viewerId,
          status: "active",
          startedAt: new Date(),
        });

        await db.updateCallNotificationStatus(input.notificationId, "accepted");

        return { success: true, roomId, callRoomId: room.id };
      }),

    rejectCall: protectedProcedure
      .input(
        z.object({
          notificationId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const notification = await db.getCallNotificationById(input.notificationId);
        if (!notification) throw new Error("Notification not found");
        if (notification.streamerId !== ctx.user.id) throw new Error("Unauthorized");

        await db.updateCallNotificationStatus(input.notificationId, "rejected");

        return { success: true };
      }),

    endCall: protectedProcedure
      .input(
        z.object({
          roomId: z.string(),
          durationMinutes: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const room = await db.getCallRoomByRoomId(input.roomId);
        if (!room) throw new Error("Room not found");

        const streamer = await db.getProfileByUserId(room.streamerId);
        if (!streamer) throw new Error("Streamer profile not found");

        const totalCost = (streamer.pricePerMinute || 199) * input.durationMinutes;

        await db.updateCallRoom(room.id, {
          status: "ended",
          endedAt: new Date(),
        });

        await db.createCallHistory({
          roomId: input.roomId,
          viewerId: room.viewerId,
          streamerId: room.streamerId,
          startedAt: room.startedAt || new Date(),
          endedAt: new Date(),
          durationMinutes: input.durationMinutes,
          totalCost,
          status: "completed",
        });

        const viewerProfile = await db.getProfileByUserId(room.viewerId);
        if (viewerProfile && (viewerProfile.balance ?? 0) >= totalCost) {
          const newViewerBalance = (viewerProfile.balance ?? 0) - totalCost;
          await db.updateProfileBalance(room.viewerId, newViewerBalance);

          const streamerEarnings = Math.floor(totalCost * 0.7);
          const newStreamerBalance = (streamer.balance || 0) + streamerEarnings;
          await db.updateProfileBalance(room.streamerId, newStreamerBalance);

          await db.createTransaction({
            userId: room.viewerId,
            type: "call_charge",
            amount: totalCost,
            callId: undefined,
            description: "Chamada com streamer",
            status: "completed",
          });

          await db.createTransaction({
            userId: room.streamerId,
            type: "call_earning",
            amount: streamerEarnings,
            callId: undefined,
            description: "Ganho de chamada",
            status: "completed",
          });
        }

        return { success: true, totalCost };
      }),

    getActiveNotifications: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "streamer") throw new Error("Only streamers can receive calls");
      return await db.getActiveCallNotifications(ctx.user.id);
    }),
  }),

  streamerProfile: router({
    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStreamerProfile(input.userId);
      }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          bio: z.string().optional(),
          about: z.string().optional(),
          photoUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getStreamerProfile(ctx.user.id);
        if (!profile) {
          await db.createStreamerProfile({
            userId: ctx.user.id,
            bio: input.bio,
            about: input.about,
            photoUrl: input.photoUrl,
          });
        } else {
          await db.updateStreamerProfile(ctx.user.id, input);
        }
        return { success: true };
      }),
  }),
  commission: router({
    // Get streamer's commission
    getMyCommission: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "streamer") {
          throw new Error("Only streamers can view their commission");
        }
        const commission = await db.getStreamerCommission(ctx.user.id);
        if (!commission) {
          // Create default commission if doesn't exist
          return db.createStreamerCommission(ctx.user.id, 70);
        }
        return commission;
      }),

    // Admin: Get all commissions
    getAllCommissions: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can view all commissions");
        }
        const commissions = await db.getAllStreamerCommissions();
        // Join with user data
        const result = await Promise.all(
          commissions.map(async (commission) => {
            const streamer = await db.getUserById(commission.streamerId);
            return {
              ...commission,
              streamerName: streamer?.name || "Unknown",
              streamerEmail: streamer?.email || "",
            };
          })
        );
        return result;
      }),

    // Admin: Update streamer commission
    updateStreamerCommission: protectedProcedure
      .input(
        z.object({
          streamerId: z.number(),
          baseCommission: z.number().min(60).max(85),
          loyaltyBonus: z.number().optional(),
          referralBonus: z.number().optional(),
          performanceBonus: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can update commissions");
        }
        const result = await db.updateStreamerCommission(input.streamerId, {
          baseCommission: input.baseCommission,
          loyaltyBonus: input.loyaltyBonus,
          referralBonus: input.referralBonus,
          performanceBonus: input.performanceBonus,
          notes: input.notes || `Updated by admin ${ctx.user.id}`,
        });
        return result;
      }),
  }),

  // ===== MERCADO PAGO PAYMENTS =====
  payment: router({
    // Viewer: Iniciar recarga de saldo
    createRechargePreference: protectedProcedure
      .input(
        z.object({
          amount: z.number().min(5000).max(500000), // R$ 50 a R$ 5000
          paymentMethod: z.enum(["pix", "credit_card", "debit_card"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("User not authenticated");
        
        try {
          const { createRechargePreference } = await import("./mercadopago");
          const result = await createRechargePreference(
            ctx.user.id,
            input.amount,
            ctx.user.email,
            ctx.user.username
          );
          
          // Registrar recarga no banco
          const paymentMethod: "pix" | "credit_card" | "debit_card" = input.paymentMethod;
          const preferenceId = result.preferenceId || "";
          const rechargeId = await db.createBalanceRecharge(
            ctx.user.id,
            input.amount,
            preferenceId,
            paymentMethod
          );
          
          return {
            success: true,
            rechargeId,
            preferenceId: result.preferenceId,
            checkoutUrl: result.sandboxInitPoint || result.initPoint,
          };
        } catch (error) {
          console.error("[Payment] Erro ao criar preferência:", error);
          throw new Error("Erro ao iniciar pagamento. Tente novamente.");
        }
      }),

    // Viewer: Obter histórico de recargas
    getRechargeHistory: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new Error("User not authenticated");
        
        const db_module = await import("./db");
        // Implementar função no db.ts
        return [];
      }),

    // Streamer: Solicitar saque via Mercado Pago
    requestMpWithdrawal: protectedProcedure
      .input(
        z.object({
          amount: z.number().min(10000).max(1000000), // R$ 100 a R$ 10.000
          pixKey: z.string().min(3),
          pixKeyType: z.enum(["cpf", "email", "phone", "random"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "streamer") {
          throw new Error("Only streamers can request withdrawals");
        }
        
        // Verificar KYC e saldo
        const profile = await db.getProfileByUserId(ctx.user.id);
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
          const user = await db.getUserById(ctx.user.id);
          if (!user) throw new Error("User not found");
          
          // Criar saque no banco
          const withdrawalId = await db.createMpWithdrawal(
            ctx.user.id,
            input.amount,
            input.pixKey,
            input.pixKeyType,
            user.username || `Streamer ${ctx.user.id}`
          );
          
          // Debitar saldo
          const newBalance = (profile.balance || 0) - input.amount;
          await db.updateProfileBalance(profile.id, newBalance);
          
          return {
            success: true,
            withdrawalId,
            amount: input.amount,
            status: "pending",
          };
        } catch (error) {
          console.error("[Payment] Erro ao solicitar saque:", error);
          throw new Error("Erro ao solicitar saque. Tente novamente.");
        }
      }),

    // Streamer: Obter histórico de saques
    getMpWithdrawalHistory: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== "streamer") {
          throw new Error("Only streamers can view withdrawals");
        }
        
        return await db.getMpWithdrawalsByStreamerId(ctx.user.id);
      }),

    // Admin: Obter todos os saques
    getAllMpWithdrawals: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can view all withdrawals");
        }
        
        return await db.getAllMpWithdrawals();
      }),
  }),
  // ===== MODERATION =====
  moderation: router({
    banUser: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string().min(5), banType: z.enum(["permanent", "temporary"]), daysToExpire: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can ban users");
        await db.banUser(input.userId, ctx.user.id, input.reason, input.banType, input.daysToExpire);
        return { success: true };
      }),

    unbanUser: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can unban users");
        await db.unbanUser(input.userId, ctx.user.id, input.reason);
        return { success: true };
      }),

    suspendUser: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string().min(5), suspensionDays: z.number().min(1).max(365) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can suspend users");
        await db.suspendUser(input.userId, ctx.user.id, input.reason, input.suspensionDays);
        return { success: true };
      }),

    unsuspendUser: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can unsuspend users");
        await db.unsuspendUser(input.userId, ctx.user.id, input.reason);
        return { success: true };
      }),

    warnUser: protectedProcedure
      .input(z.object({ userId: z.number(), reason: z.string().min(5) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can warn users");
        const warningCount = await db.warnUser(input.userId, ctx.user.id, input.reason);
        return { success: true, warningCount };
      }),

    getUserWarnings: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view warnings");
        return await db.getUserWarnings(input.userId);
      }),

    endActiveCall: protectedProcedure
      .input(z.object({ callRoomId: z.string(), reason: z.string().min(5) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can end calls");
        await db.endActiveCall(input.callRoomId, ctx.user.id, input.reason);
        return { success: true };
      }),

    getActiveCalls: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view active calls");
        return await db.getActiveCalls();
      }),

    getModerationLogs: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view logs");
        return await db.getAllModerationLogs(input.limit);
      }),

    getUserModerationHistory: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view history");
        return await db.getUserModerationLogs(input.userId);
      }),
   }),
  kyc: router({
    submit: protectedProcedure
      .input(
        z.object({
          fullName: z.string().min(3),
          cpf: z.string(),
          dateOfBirth: z.string(),
          nationality: z.string().default("Brasileira"),
          address: z.string().min(5),
          city: z.string().min(2),
          state: z.string().length(2),
          zipCode: z.string(),
          bankName: z.string().min(3),
          bankCode: z.string().length(3),
          accountType: z.enum(["checking", "savings"]),
          accountNumber: z.string().min(5),
          accountDigit: z.string().optional(),
          branchCode: z.string().min(4),
          accountHolder: z.string().min(3),
          idDocumentType: z.enum(["rg", "cnh", "passport"]),
          idDocumentUrl: z.string().url(),
          idDocumentNumber: z.string().min(5),
          proofOfAddressUrl: z.string().url(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await db.submitKYC(ctx.user.id, {
          ...input,
          dateOfBirth: new Date(input.dateOfBirth),
        } as any);
        return result;
      }),

    getMyKYC: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserKYC(ctx.user.id);
      }),

    getPendingKYCs: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view pending KYCs");
        return await db.getPendingKYCs(input.limit);
      }),

    approveKYC: protectedProcedure
      .input(
        z.object({
          kycId: z.number(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can approve KYC");
        return await db.approveKYCVerification(input.kycId, ctx.user.id, input.comment);
      }),

    rejectKYC: protectedProcedure
      .input(
        z.object({
          kycId: z.number(),
          reason: z.string().min(10),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can reject KYC");
        return await db.rejectKYCVerification(input.kycId, ctx.user.id, input.reason);
      }),

    getKYCStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Only admins can view KYC stats");
        return await db.getKYCStats();
      }),

    hasApprovedKYC: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.hasApprovedKYC(ctx.user.id);
      }),
  }),
  reviews: reviewsRouter,
});
export type AppRouter = typeof appRouter;


