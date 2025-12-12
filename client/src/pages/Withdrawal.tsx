import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, DollarSign, TrendingUp } from "lucide-react";

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [pixKeyType, setPixKeyType] = useState<"cpf" | "email" | "phone">("cpf");
  const [pixKey, setPixKey] = useState<string>("");
  const [anticipate, setAnticipate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const { data: withdrawals } = trpc.withdrawals.getWithdrawals.useQuery();
  const { data: profile } = trpc.profile.getMyProfile.useQuery();
  const withdrawalMutation = trpc.withdrawals.requestWithdrawal.useMutation();

  // Calcular valores
  const amountInCents = Math.round(parseFloat(amount || "0") * 100);
  const fee = anticipate ? Math.round(amountInCents * 0.05) : 0;
  const netAmount = amountInCents - fee;

  // Validações
  const isValid = useMemo(() => {
    if (amountInCents < 10000) return false; // Mínimo R$ 100
    if (amountInCents > 1000000) return false; // Máximo R$ 10.000
    if (!pixKey || pixKey.length < 3) return false;
    return true;
  }, [amountInCents, pixKey]);

  const handleWithdraw = async () => {
    if (!isValid) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await withdrawalMutation.mutateAsync({
        amount: amountInCents,
        pixKey,
        pixKeyType,
        anticipate,
      });

      setSuccess(true);
      setAmount("");
      setPixKey("");
      setAnticipate(false);

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar saque"
      );
    } finally {
      setLoading(false);
    }
  };

  const balance = profile?.balance || 0;
  const balanceInReais = (balance / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sacar Dinheiro</h1>
          <p className="text-gray-600">
            Solicite seu saque via Pix. Disponível em D+30 ou antecipe com taxa de 5%.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Saque */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-lg">
              <div className="space-y-6">
                {/* Saldo Disponível */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Saldo Disponível</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {balanceInReais}
                  </p>
                </div>

                {/* Valor do Saque */}
                <div>
                  <Label htmlFor="amount" className="text-base font-semibold mb-2 block">
                    Valor do Saque (R$)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    max="10000"
                    step="0.01"
                    className="h-12 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Mínimo: R$ 100 | Máximo: R$ 10.000
                  </p>
                </div>

                {/* Tipo de Chave Pix */}
                <div>
                  <Label htmlFor="pixKeyType" className="text-base font-semibold mb-2 block">
                    Tipo de Chave Pix
                  </Label>
                  <Select value={pixKeyType} onValueChange={(v: any) => setPixKeyType(v)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF (11 dígitos)</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone (11 dígitos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Chave Pix */}
                <div>
                  <Label htmlFor="pixKey" className="text-base font-semibold mb-2 block">
                    Chave Pix
                  </Label>
                  <Input
                    id="pixKey"
                    type="text"
                    placeholder={
                      pixKeyType === "cpf"
                        ? "12345678901"
                        : pixKeyType === "email"
                        ? "seu@email.com"
                        : "11987654321"
                    }
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {pixKeyType === "cpf"
                      ? "Digite seu CPF sem pontos ou traços"
                      : pixKeyType === "email"
                      ? "Digite seu email registrado no Pix"
                      : "Digite seu telefone com DDD"}
                  </p>
                </div>

                {/* Opção de Antecipação */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anticipate}
                      onChange={(e) => setAnticipate(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Antecipar Saque (Taxa 5%)
                      </p>
                      <p className="text-sm text-gray-600">
                        Receba hoje em vez de esperar 30 dias
                      </p>
                    </div>
                  </label>
                </div>

                {/* Mensagens */}
                {error && (
                  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      Saque solicitado com sucesso! Você receberá em breve.
                    </p>
                  </div>
                )}

                {/* Botão de Saque */}
                <Button
                  onClick={handleWithdraw}
                  disabled={!isValid || loading}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {loading ? "Processando..." : "Solicitar Saque"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Resumo e Simulador */}
          <div className="space-y-6">
            {/* Resumo do Saque */}
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Resumo
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Solicitado</span>
                  <span className="font-semibold">
                    R$ {(amountInCents / 100).toFixed(2)}
                  </span>
                </div>

                {anticipate && (
                  <>
                    <div className="flex justify-between items-center text-red-600">
                      <span>Taxa de Antecipação (5%)</span>
                      <span className="font-semibold">-R$ {(fee / 100).toFixed(2)}</span>
                    </div>

                    <div className="border-t border-purple-200 pt-3 flex justify-between items-center">
                      <span className="font-semibold">Você Receberá</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {(netAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                {!anticipate && amountInCents > 0 && (
                  <div className="bg-blue-100 p-3 rounded-lg text-sm text-blue-900">
                    ✓ Sem taxa! Disponível em D+30
                  </div>
                )}
              </div>
            </Card>

            {/* Informações */}
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Informações
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Saque Normal</p>
                  <p className="text-gray-600">
                    Sem taxa, disponível em 30 dias (D+30)
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="font-semibold text-gray-900 mb-1">Saque Antecipado</p>
                  <p className="text-gray-600">
                    Taxa de 5%, receba hoje mesmo
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="font-semibold text-gray-900 mb-1">Limite Diário</p>
                  <p className="text-gray-600">
                    Máximo 3 saques por dia
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="font-semibold text-gray-900 mb-1">Processamento</p>
                  <p className="text-gray-600">
                    Saques são processados em até 2 horas úteis
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Histórico de Saques */}
        {withdrawals && withdrawals.length > 0 && (
          <Card className="mt-8 p-6 border-0 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Histórico de Saques</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Taxa
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Tipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(w.requestedAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        R$ {(w.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {w.fee && w.fee > 0 ? `R$ ${(w.fee / 100).toFixed(2)}` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            w.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : w.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : w.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {w.status === "completed"
                            ? "Concluído"
                            : w.status === "processing"
                            ? "Processando"
                            : w.status === "failed"
                            ? "Falhou"
                            : "Pendente"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {w.isAnticipated ? "Antecipado" : "Normal"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
