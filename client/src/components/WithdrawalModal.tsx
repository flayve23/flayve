import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { AlertCircle } from "lucide-react";

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  username: string;
}

export function WithdrawalModal({ open, onOpenChange, balance, username }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [pixKeyType, setPixKeyType] = useState<"cpf" | "email" | "phone">("cpf");
  const [pixKey, setPixKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const { data: hasKYC } = trpc.kyc.hasApprovedKYC.useQuery();

  const requestWithdrawal = trpc.withdrawals.requestWithdrawal.useMutation({
    onSuccess: (data: any) => {
      setSuccessMessage(`Saque de R$ ${(data.withdrawal.amount / 100).toFixed(2)} foi registrado como pendente. Username: ${username}`);
      setAmount("");
      setPixKey("");
      setPixKeyType("cpf");
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage("");
      }, 2000);
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Falha ao solicitar saque");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!hasKYC) {
        setErrorMessage("Você precisa completar a verificação KYC antes de fazer saques");
        return;
      }

      const amountInCents = Math.floor(parseFloat(amount) * 100);

      if (amountInCents < 10000) {
        setErrorMessage("Saque mínimo é R$ 100");
        return;
      }

      if (amountInCents > balance) {
        setErrorMessage(`Você tem R$ ${(balance / 100).toFixed(2)} disponível`);
        return;
      }

      await requestWithdrawal.mutateAsync({
        amount: amountInCents,
        pixKey,
        pixKeyType,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
          <DialogDescription>
            Saldo disponível: <strong>R$ {(balance / 100).toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
            <p className="text-sm text-green-900 dark:text-green-100">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
            <p className="text-sm text-red-900 dark:text-red-100">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Saque (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="100"
              max={balance / 100}
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo: R$ 100 | Máximo: R$ {(balance / 100).toFixed(2)}
            </p>
          </div>

          {/* Tipo de Chave Pix */}
          <div className="space-y-2">
            <Label htmlFor="pixKeyType">Tipo de Chave Pix</Label>
            <Select value={pixKeyType} onValueChange={(value: any) => setPixKeyType(value)}>
              <SelectTrigger id="pixKeyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chave Pix */}
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave Pix</Label>
            <Input
              id="pixKey"
              type="text"
              placeholder={
                pixKeyType === "cpf"
                  ? "000.000.000-00"
                  : pixKeyType === "email"
                    ? "seu@email.com"
                    : "(11) 99999-9999"
              }
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
            />
          </div>

          {/* Info sobre username */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>Descrição do pagamento:</strong> {username}
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              Seu username será enviado ao fornecedor de pagamento para identificar este saque.
            </p>
          </div>

          {/* Próximo saque */}
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
            <p className="text-xs text-amber-900 dark:text-amber-100">
              <strong>Próximo saque disponível:</strong> 05 do próximo mês
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !amount || !pixKey}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              {isLoading ? "Processando..." : "Solicitar Saque"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
