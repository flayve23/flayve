import { useEffect, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Queries
  const { data: myNotifications, refetch: refetchNotifications } = trpc.reviews.getMyNotifications.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );

  const { data: unreadNotifications, refetch: refetchUnread } = trpc.reviews.getUnreadNotifications.useQuery(
    undefined,
    { enabled: !!user }
  );

  const markAsReadMutation = trpc.reviews.markAsRead.useMutation();

  // Atualizar notificações quando dados chegam
  useEffect(() => {
    if (myNotifications) {
      setNotifications(myNotifications);
    }
  }, [myNotifications]);

  // Atualizar contagem de não lidas
  useEffect(() => {
    if (unreadNotifications) {
      setUnreadCount(unreadNotifications.length);
    }
  }, [unreadNotifications]);

  // Marcar como lida
  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await markAsReadMutation.mutateAsync({ notificationId });
        // Atualizar estado local
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        refetchUnread();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [markAsReadMutation, refetchUnread]
  );

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const notification of unread) {
      await markAsRead(notification.id);
    }
  }, [notifications, markAsRead]);

  // Simular notificação em tempo real (polling)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refetchNotifications();
      refetchUnread();
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(interval);
  }, [user, refetchNotifications, refetchUnread]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: refetchNotifications,
  };
}
