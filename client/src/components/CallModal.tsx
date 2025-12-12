import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Wallet, Check, Clock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

interface CallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamerId: number;
  streamerName?: string;
  streamerPrice?: number;
}

export function CallModal({ open, onOpenChange, streamerId, streamerName, streamerPrice = 199 }: CallModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(5000); // R$ 50
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: profile, refetch: refetchProfile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const createRechargePreferenceMutation = trpc.payment.createRechargePreference.useMutation();

  const initiateCallMutation = trpc.calls.initiateCall.useMutation({
    onSuccess: () => {
      setLoading(false);
      toast.success(`Chamada iniciada com ${streamerName}!`, {
        description: "Aguardando resposta do streamer...",
      });
      onOpenChange(false);
    },
    onError: (err: any) => {
      setError(err.message || "Erro ao iniciar chamada");
      setLoading(false);
      toast.error("Erro ao iniciar chamada", {
        description: err.message || "Tente novamente em alguns segundos",
      });
    },
  });

  const handleCall = async () => {
    setLoading(true);
    setError("");
    
    // Verificar saldo mínimo (5 minutos)
    const minBalance = streamerPrice * 5;
    const currentBalance = profile?.balance || 0;
    
    if (currentBalance < minBalance) {
      setError(`Saldo insuficiente. Você tem R$ ${(currentBalance / 100).toFixed(2)}, precisa de R$ ${(minBalance / 100).toFixed(2)}`);
      setShowRecharge(true);
      setLoading(false);
      return;
    }

    try {
      await initiateCallMutation.mutateAsync({ streamerId });
    } catch (err: any) {
      setError(err.message || "Erro ao iniciar chamada");
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    setIsProcessingPayment(true);
    try {
      const result = await createRechargePreferenceMutation.mutateAsync({
        amount: rechargeAmount,
        paymentMethod: "pix",
      });
      
      if (result?.checkoutUrl) {
        toast.loading("Redirecionando para pagamento...");
        // Aguardar um pouco antes de redirecionar para mostrar o toast
        setTimeout(() => {
          window.location.href = result.checkoutUrl!;
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar recarga");
      setIsProcessingPayment(false);
      toast.error("Erro ao processar recarga", {
        description: err.message || "Tente novamente",
      });
    }
  };

  const currentBalance = profile?.balance || 0;
  const minBalance = streamerPrice * 5;
  const hasEnoughBalance = currentBalance >= minBalance;
  const estimatedMinutes = Math.floor(currentBalance / streamerPrice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-pink-900">
            {showRecharge ? "💰 Adicionar Saldo" : "📞 Iniciar Chamada"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!showRecharge ? (
            <>
              {/* Streamer Info */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Você está prestes a chamar</p>
                <p className="text-2xl font-bold text-pink-600">{streamerName || "Modelo"}</p>
              </div>

              {/* Saldo Atual */}
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-blue-900">💳 Saldo Atual</span>
                    <span className="text-2xl font-bold text-blue-600">R$ {(currentBalance / 100).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    {estimatedMinutes > 0 ? (
                      <>✓ Suficiente para ~{estimatedMinutes} minutos de chamada</>
                    ) : (
                      <>✗ Saldo insuficiente</>
                    )}
                  </div>
                </div>

                {/* Preço da Chamada */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-900">⏱️ Preço por Minuto</span>
                    <span className="text-xl font-bold text-purple-600">R$ {(streamerPrice / 100).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-purple-700 mt-2">
                    5 minutos = R$ {((streamerPrice * 5) / 100).toFixed(2)} (mínimo recomendado)
                  </div>
                </div>
              </div>

              {/* Erro ou Aviso */}
              {!hasEnoughBalance && (
                <div className="p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Saldo insuficiente</p>
                    <p className="text-xs text-red-600 mt-1">
                      Você precisa de R$ {((minBalance - currentBalance) / 100).toFixed(2)} a mais para fazer essa chamada.
                    </p>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-900">
                  <Clock className="w-4 h-4 inline mr-1" />
                  <strong>A chamada começará assim que o streamer aceitar.</strong> Você será cobrado por minuto.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                {!hasEnoughBalance ? (
                  <Button
                    onClick={() => setShowRecharge(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Adicionar Saldo
                  </Button>
                ) : (
                  <Button
                    onClick={handleCall}
                    disabled={loading}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Chamar Agora
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Recharge Mode */}
              <div className="text-center">
                <Wallet className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Escolha o valor para recarregar</p>
                <p className="text-sm text-gray-500 mt-1">Sem taxas adicionais</p>
              </div>

              {/* Preset Options */}
              <div className="space-y-2">
                {[
                  { amount: 5000, label: "R$ 50", calls: Math.floor(5000 / streamerPrice) },
                  { amount: 10000, label: "R$ 100", calls: Math.floor(10000 / streamerPrice) },
                  { amount: 25000, label: "R$ 250", calls: Math.floor(25000 / streamerPrice) },
                  { amount: 50000, label: "R$ 500", calls: Math.floor(50000 / streamerPrice) },
                ].map(({ amount, label, calls }) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(amount)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      rechargeAmount === amount
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{label}</span>
                      <span className="text-xs text-gray-500">~{calls} chamadas</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ou digite um valor customizado
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center text-gray-600 font-medium">R$</span>
                  <Input
                    type="number"
                    min="10"
                    step="10"
                    value={rechargeAmount / 100}
                    onChange={(e) => setRechargeAmount(parseFloat(e.target.value) * 100)}
                    placeholder="50.00"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo: R$ 10,00 • Equivalente a ~{Math.floor(rechargeAmount / streamerPrice)} minutos de chamada
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  🔒 <strong>Pagamento seguro</strong> com SSL. Seus dados estão protegidos.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRecharge(false);
                    setError("");
                  }}
                  disabled={isProcessingPayment}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleRecharge}
                  disabled={isProcessingPayment || rechargeAmount < 1000}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Recarregar R$ {(rechargeAmount / 100).toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
