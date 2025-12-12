import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";


export function usePushNotifications() {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNotificationRef = useRef<number>(0);

  // Criar elemento de áudio para notificação
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
      );
    }
  }, []);

  // Polling de notificações a cada 5 segundos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/trpc/notifications.getUnread?input={}");
        if (!response.ok) return;

        const data = await response.json();
        const notifications = data.result?.data || [];

        if (notifications.length > 0) {
          const now = Date.now();
          // Evitar notificações duplicadas (mínimo 2 segundos entre notificações)
          if (now - lastNotificationRef.current > 2000) {
            lastNotificationRef.current = now;

            // Tocar som
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Som pode falhar em alguns navegadores
              });
            }

            // Mostrar notificação do navegador se permitido
            if ("Notification" in window && Notification.permission === "granted") {
              const latestNotif = notifications[0];
              new Notification("Flayve", {
                body: latestNotif.message || "Você tem uma nova notificação",
                icon: "/logo.png",
                badge: "/logo.png",
                tag: "flayve-notification",
                requireInteraction: true,
              });
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
}
