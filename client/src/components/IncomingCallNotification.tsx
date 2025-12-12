import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";

interface IncomingCall {
  viewerId: number;
  viewerName: string;
  timestamp: Date;
}

export function IncomingCallNotification() {
  const { socket, isConnected } = useSocket();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for incoming calls
    socket.on("incoming-call", (call: IncomingCall) => {
      console.log("[Notification] Incoming call from:", call.viewerName);
      setIncomingCall(call);
      setIsOpen(true);
      
      // Play notification sound (optional)
      playNotificationSound();
    });

    return () => {
      socket.off("incoming-call");
    };
  }, [socket, isConnected]);

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleAccept = () => {
    if (!incomingCall) return;
    
    socket?.emit("call-accepted", {
      viewerId: incomingCall.viewerId,
      streamerId: 1, // TODO: Get actual streamer ID from context
    });
    
    toast.success(`Chamada aceita de ${incomingCall.viewerName}`);
    setIsOpen(false);
    setIncomingCall(null);
    
    // TODO: Redirect to call interface
  };

  const handleReject = () => {
    if (!incomingCall) return;
    
    socket?.emit("call-rejected", {
      viewerId: incomingCall.viewerId,
      streamerId: 1, // TODO: Get actual streamer ID from context
    });
    
    toast.info(`Chamada rejeitada de ${incomingCall.viewerName}`);
    setIsOpen(false);
    setIncomingCall(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Chamada Recebida</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {incomingCall?.viewerName}
            </h2>
            <p className="text-gray-600">está tentando chamar você</p>
          </div>

          {/* Animated ring icon */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 w-full">
            <Button
              onClick={handleReject}
              variant="destructive"
              className="flex-1 gap-2 h-12"
            >
              <PhoneOff className="w-4 h-4" />
              Rejeitar
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 gap-2 h-12 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4" />
              Atender
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
