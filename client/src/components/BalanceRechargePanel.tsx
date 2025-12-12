import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Zap, Gift, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface BalanceRechargePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  onRecharge?: (amount: number) => void;
}

export function BalanceRechargePanel({
  isOpen,
  onClose,
  currentBalance = 0,
  onRecharge,
}: BalanceRechargePanelProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "debit_card">("pix");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecharge = trpc.payment.createRechargePreference.useMutation();

  const packages = [
    { id: 1, amount: 5000, label: "R$ 50" },
    { id: 2, amount: 10000, label: "R$ 100" },
    { id: 3, amount: 25000, label: "R$ 250" },
    { id: 4, amount: 50000, label: "R$ 500" },
  ];

  const handleSelectPackage = (amount: number) => {
    setSelectedPackage(amount);
    setCustomAmount("");
  };

  const handleRecharge = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const amount = selectedPackage || (customAmount ? parseInt(customAmount) : 0);
      if (!amount || amount < 5000 || amount > 500000) {
        setError("Valor inválido. Mínimo R$ 50, máximo R$ 5.000");
        return;
      }

      const result = await createRecharge.mutateAsync({
        amount,
        paymentMethod,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecionando para pagamento...");
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Erro ao iniciar pagamento");
      toast.error(err.message || "Erro ao iniciar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Recarregar Saldo</DialogTitle>
          <DialogDescription>
            Saldo atual: <span className="font-bold text-pink-600">R$ {(currentBalance / 100).toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pacotes Pré-definidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Pacotes Recomendados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition border-2 ${
                    selectedPackage === pkg.amount
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                  onClick={() => handleSelectPackage(pkg.amount)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-lg">{pkg.label}</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-pink-500" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Saldo adicionado: R$ {(pkg.amount / 100).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Valor Customizado */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Valor Customizado</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-amount">Valor (em centavos)</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Ex: 5000 (R$ 50,00)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPackage(null);
                    }}
                    min="5000"
                    max="500000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Mínimo: R$ 50 | Máximo: R$ 5.000</p>
              </div>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Método de Pagamento</h3>
            <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="font-normal cursor-pointer flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  PIX (Instantâneo)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit_card" id="credit" />
                <Label htmlFor="credit" className="font-normal cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cartão de Crédito
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="debit_card" id="debit" />
                <Label htmlFor="debit" className="font-normal cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cartão de Débito
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={!selectedPackage && !customAmount || isLoading}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Continuar para Pagamento"
              )}
            </Button>
          </div>

          {/* Aviso de Segurança */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              ✓ Pagamentos seguros via Mercado Pago. Saldo creditado instantaneamente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
