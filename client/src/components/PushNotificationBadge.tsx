import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  usePushNotifications();

  useEffect(() => {
    // Polling para atualizar badge a cada 5 segundos
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/trpc/notifications.getUnread?input={}");
        if (!response.ok) return;

        const data = await response.json();
        const notifications = data.result?.data || [];
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}
