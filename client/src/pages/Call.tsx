import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Phone, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, RotateCw, ArrowLeft, Gift, Plus } from "lucide-react";
import { toast } from "sonner";
import { BalanceRechargePanel } from "@/components/BalanceRechargePanel";
import { GiftPanel } from "@/components/GiftPanel";
import { CallRatingModal } from "@/components/CallRatingModal";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Call() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ streamerId: string }>();
  const streamerId = parseInt(params.streamerId);

  const [callStarted, setCallStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showRechargePanel, setShowRechargePanel] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [streamerName, setStreamerName] = useState("");

  const billingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: balance } = trpc.wallet.getBalance.useQuery(
    undefined,
    { enabled: !!user }
  );

  const utils = trpc.useUtils();

  // Mock streamer data - em produção, buscar do banco
  const pricePerMinute = 500; // R$ 5,00 em centavos

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (callStarted) {
      // Timer para atualizar tempo decorrido
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      // Billing loop: verificar saldo a cada 60 segundos
      billingIntervalRef.current = setInterval(() => {
        checkBalanceAndCharge();
      }, 60000); // 60 segundos

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (billingIntervalRef.current) clearInterval(billingIntervalRef.current);
      };
    }
  }, [callStarted]);

  useEffect(() => {
    // Atualizar custo total baseado no tempo decorrido
    const minutes = Math.ceil(elapsedSeconds / 60);
    setTotalCost(minutes * pricePerMinute);
  }, [elapsedSeconds, pricePerMinute]);

  const checkBalanceAndCharge = async () => {
    if (!balance || balance.balance < pricePerMinute) {
      toast.error("Saldo insuficiente! A chamada será encerrada.");
      handleEndCall();
      return;
    }

    // Cobrar por minuto (simulado)
    // Em produção, chamar mutation para processar billing
    toast.info("Cobrança de R$ " + (pricePerMinute / 100).toFixed(2) + " processada");
    utils.wallet.getBalance.invalidate();
  };

  const handleStartCall = () => {
    if (!balance || balance.balance < pricePerMinute) {
      setShowRechargePanel(true);
      return;
    }
    setCallStarted(true);
    toast.success("Chamada iniciada!");
  };

  const handleRecharge = (amount: number) => {
    // Simular recarga
    toast.success(`Recarga de R$ ${(amount / 100).toFixed(2)} realizada com sucesso!`);
    utils.wallet.getBalance.invalidate();
  };

  const handleSendGift = (giftId: number, giftName: string, amount: number) => {
    toast.success(`Presente "${giftName}" enviado!`);
    utils.wallet.getBalance.invalidate();
  };

  const handleEndCall = () => {
    setCallStarted(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (billingIntervalRef.current) clearInterval(billingIntervalRef.current);
    
    const durationMinutes = Math.ceil(elapsedSeconds / 60);
    setCallDuration(durationMinutes);
    setStreamerName("Streamer");
    setShowRatingModal(true);
    
    toast.success(`Chamada encerrada. Duracao: ${formatTime(elapsedSeconds)}`);
  };

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      setTimeout(() => {
        setLocation("/feed");
      }, 1000);
    } catch (error) {
      toast.error("Erro ao enviar avaliacao");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <BalanceRechargePanel
        isOpen={showRechargePanel}
        onClose={() => setShowRechargePanel(false)}
        currentBalance={balance?.balance || 0}
        onRecharge={handleRecharge}
      />
      <GiftPanel
        isOpen={showGiftPanel}
        onClose={() => setShowGiftPanel(false)}
        streamerName="Streamer"
        onSendGift={handleSendGift}
        balance={balance?.balance || 0}
      />
      <CallRatingModal
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        streamerName={streamerName}
        callDuration={callDuration}
        onSubmitRating={handleSubmitRating}
      />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Area (Simulado) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {callStarted ? (
          <div className="relative w-full h-full bg-gradient-to-br from-pink-900 to-purple-900">
            {/* Simulação de vídeo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <VideoIcon className="h-24 sm:h-32 w-24 sm:w-32 text-white/30 mx-auto mb-4" />
                <p className="text-white/50 text-base sm:text-lg">
                  Vídeo Simulado
                </p>
                <p className="text-white/30 text-xs sm:text-sm mt-2">
                  Em produção, integrar com LiveKit aqui
                </p>
              </div>
            </div>

            {/* Self video (Picture-in-Picture) - Responsivo */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-20 h-16 sm:w-32 sm:h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
              {isVideoOff ? (
                <VideoOff className="h-6 sm:h-8 w-6 sm:w-8 text-white/50" />
              ) : (
                <div className="text-white/50 text-xs">Você</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center px-4">
            <VideoIcon className="h-24 sm:h-32 w-24 sm:w-32 text-white/30 mx-auto mb-4" />
            <p className="text-white/50 text-base sm:text-lg mb-8">
              Pronto para iniciar a chamada?
            </p>
            <Button
              onClick={handleStartCall}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold"
            >
              <Phone className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
              Iniciar Chamada
            </Button>
          </div>
        )}
      </div>

      {/* Call Info Overlay - Responsivo */}
      {callStarted && (
        <>
          {/* Top Bar - Timer and Cost - Responsivo */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-6 z-40">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto">
              {/* Timer */}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-center">
                <p className="text-xs sm:text-sm text-white/70">Tempo</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>

              {/* Cost */}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-center">
                <p className="text-xs sm:text-sm text-white/70">Custo</p>
                <p className="text-lg sm:text-2xl font-bold text-pink-400">
                  R$ {(totalCost / 100).toFixed(2)}
                </p>
              </div>

              {/* Balance */}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-center">
                <p className="text-xs sm:text-sm text-white/70">Saldo</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400">
                  R$ {((balance?.balance || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Controls - Mobile Grid 2x2, Desktop Horizontal */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-8 z-40">
            {/* Mobile Layout: Grid 2x2 */}
            <div className="sm:hidden flex justify-center">
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {/* Mute Button */}
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant={isMuted ? "destructive" : "secondary"}
                  className="rounded-full w-full h-16 flex items-center justify-center"
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>

                {/* Video Toggle */}
                <Button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  variant={isVideoOff ? "destructive" : "secondary"}
                  className="rounded-full w-full h-16 flex items-center justify-center"
                >
                  {isVideoOff ? (
                    <VideoOff className="h-6 w-6" />
                  ) : (
                    <VideoIcon className="h-6 w-6" />
                  )}
                </Button>

              {/* Recharge Button */}
              <Button
                onClick={() => setShowRechargePanel(true)}
                variant="secondary"
                className="rounded-full w-full h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-6 w-6" />
              </Button>

              {/* Gift Button */}
              <Button
                onClick={() => setShowGiftPanel(true)}
                variant="secondary"
                className="rounded-full w-full h-16 flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Gift className="h-6 w-6" />
              </Button>

              {/* End Call Button - Destaque */}
                <Button
                  onClick={handleEndCall}
                  className="rounded-full w-full h-16 bg-red-600 hover:bg-red-700 flex items-center justify-center col-span-2"
                >
                  <PhoneOff className="h-6 w-6 mr-2" />
                  <span>Encerrar</span>
                </Button>
              </div>
            </div>

            {/* Desktop Layout: Horizontal */}
            <div className="hidden sm:flex justify-center items-center gap-6">
              {/* Mute Button */}
              <Button
                onClick={() => setIsMuted(!isMuted)}
                size="lg"
                variant={isMuted ? "destructive" : "secondary"}
                className="rounded-full w-16 h-16"
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              {/* Video Toggle */}
              <Button
                onClick={() => setIsVideoOff(!isVideoOff)}
                size="lg"
                variant={isVideoOff ? "destructive" : "secondary"}
                className="rounded-full w-16 h-16"
              >
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6" />
                ) : (
                  <VideoIcon className="h-6 w-6" />
                )}
              </Button>

              {/* Recharge Button */}
              <Button
                onClick={() => setShowRechargePanel(true)}
                size="lg"
                className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-6 w-6" />
              </Button>

              {/* Gift Button */}
              <Button
                onClick={() => setShowGiftPanel(true)}
                size="lg"
                className="rounded-full w-16 h-16 bg-pink-600 hover:bg-pink-700"
              >
                <Gift className="h-6 w-6" />
              </Button>

              {/* End Call Button */}
              <Button
                onClick={handleEndCall}
                size="lg"
                className="rounded-full w-20 h-20 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>

              {/* Rotate Camera */}
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full w-16 h-16"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
            </div>

            <div className="text-center mt-4 sm:mt-6">
              <p className="text-white/50 text-xs sm:text-sm">
                Você está em chamada privada. Clique em Encerrar para sair.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}
