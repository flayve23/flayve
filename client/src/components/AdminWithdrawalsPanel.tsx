import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface WithdrawalRequest {
  id: number;
  streamerId: number;
  streamerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  pixKey: string;
  pixKeyType: "cpf" | "email" | "phone";
  isAnticipated: boolean;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  reason?: string;
}

interface AdminWithdrawalsPanelProps {
  withdrawals: WithdrawalRequest[];
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number, reason: string) => Promise<void>;
}

export function AdminWithdrawalsPanel({
  withdrawals,
  onApprove,
  onReject,
}: AdminWithdrawalsPanelProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (filter === "all") return true;
    return w.status === filter;
  });

  const handleApprove = async (id: number) => {
    if (!onApprove) return;
    setIsProcessing(true);
    try {
      await onApprove(id);
      toast.success("Solicitação aprovada!");
      setSelectedId(null);
    } catch (error: any) {
      toast.error("Erro ao aprovar: " + (error.message || "Tente novamente"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!onReject || !rejectReason.trim()) {
      toast.error("Informe um motivo para rejeitar");
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(id, rejectReason);
      toast.success("Solicitação rejeitada!");
      setSelectedId(null);
      setRejectReason("");
    } catch (error: any) {
      toast.error("Erro ao rejeitar: " + (error.message || "Tente novamente"));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPending = withdrawals.filter((w) => w.status === "pending").length;
  const totalAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.netAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Total Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-pink-600">
              R$ {(totalAmount / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={
              filter === status
                ? "bg-pink-600 hover:bg-pink-700"
                : ""
            }
          >
            {status === "all"
              ? "Todas"
              : status === "pending"
              ? "Pendentes"
              : status === "approved"
              ? "Aprovadas"
              : "Rejeitadas"}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredWithdrawals.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-8 text-center text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma solicitação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredWithdrawals.map((withdrawal) => (
            <Card
              key={withdrawal.id}
              className={`border-2 cursor-pointer transition-all ${
                selectedId === withdrawal.id
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              onClick={() => setSelectedId(selectedId === withdrawal.id ? null : withdrawal.id)}
            >
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {withdrawal.streamerName}
                      </h3>
                      {withdrawal.isAnticipated && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          ⚡ Antecipação
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      ID: #{withdrawal.id} • {new Date(withdrawal.requestedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(withdrawal.status)}
                    <Badge className={getStatusColor(withdrawal.status)}>
                      {getStatusLabel(withdrawal.status)}
                    </Badge>
                  </div>
                </div>

                {/* Amount Info */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Valor Solicitado</p>
                    <p className="font-semibold text-gray-900">
                      R$ {(withdrawal.amount / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Taxa</p>
                    <p className={`font-semibold ${withdrawal.isAnticipated ? "text-orange-600" : "text-gray-900"}`}>
                      R$ {(withdrawal.fee / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Valor Líquido</p>
                    <p className="font-semibold text-green-600">
                      R$ {(withdrawal.netAmount / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* PIX Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Chave PIX ({withdrawal.pixKeyType})</p>
                  <p className="text-sm font-mono text-gray-900">{withdrawal.pixKey}</p>
                </div>

                {/* Expanded Details */}
                {selectedId === withdrawal.id && (
                  <div className="border-t pt-4 space-y-4">
                    {/* Reason for Rejection (if rejected) */}
                    {withdrawal.status === "rejected" && withdrawal.reason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 font-medium mb-1">Motivo da Rejeição</p>
                        <p className="text-sm text-red-900">{withdrawal.reason}</p>
                      </div>
                    )}

                    {/* Actions for Pending */}
                    {withdrawal.status === "pending" && (
                      <div className="space-y-3">
                        {/* Reject Reason Input */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-2">
                            Motivo da Rejeição (se aplicável)
                          </label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Informe o motivo para rejeitar esta solicitação..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            rows={2}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={isProcessing}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Aprovar
                          </Button>
                          <Button
                            onClick={() => handleReject(withdrawal.id)}
                            disabled={isProcessing || !rejectReason.trim()}
                            variant="destructive"
                            className="flex-1 gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Info for Approved/Completed */}
                    {(withdrawal.status === "approved" || withdrawal.status === "completed") && (
                      <div className="text-sm text-gray-600">
                        <p>
                          ✓ Aprovado em:{" "}
                          {withdrawal.approvedAt
                            ? new Date(withdrawal.approvedAt).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </p>
                        {withdrawal.status === "completed" && (
                          <p>
                            ✓ Concluído em:{" "}
                            {withdrawal.completedAt
                              ? new Date(withdrawal.completedAt).toLocaleDateString("pt-BR")
                              : "N/A"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
