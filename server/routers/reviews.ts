import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  createCallReview,
  getStreamerReviews,
  getStreamerAverageRating,
  createNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  addStreamerBadge,
  getStreamerBadges,
  hasStreamerBadge,
} from "../db";

export const reviewsRouter = router({
  // ============================================================================
  // REVIEWS
  // ============================================================================

  createReview: protectedProcedure
    .input(
      z.object({
        callId: z.number(),
        revieweeId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().max(500).optional(),
        isAnonymous: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await createCallReview({
        callId: input.callId,
        reviewerId: ctx.user.id,
        revieweeId: input.revieweeId,
        rating: input.rating,
        comment: input.comment || null,
        isAnonymous: input.isAnonymous,
      });
    }),

  getStreamerReviews: protectedProcedure
    .input(z.object({ streamerId: z.number(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await getStreamerReviews(input.streamerId, input.limit);
    }),

  getStreamerRating: protectedProcedure
    .input(z.object({ streamerId: z.number() }))
    .query(async ({ input }) => {
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
          "1": reviews.filter((r) => r.rating === 1).length,
        },
      };
    }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  getMyNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input, ctx }) => {
      return await getUserNotifications(ctx.user.id, input?.limit || 20);
    }),

  getUnreadNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotifications(ctx.user.id);
  }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      return await markNotificationAsRead(input.notificationId);
    }),

  // ============================================================================
  // BADGES
  // ============================================================================

  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    return await getStreamerBadges(ctx.user.id);
  }),

  getStreamerBadges: protectedProcedure
    .input(z.object({ streamerId: z.number() }))
    .query(async ({ input }) => {
      return await getStreamerBadges(input.streamerId);
    }),
});
