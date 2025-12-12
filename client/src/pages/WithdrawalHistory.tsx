import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

type WithdrawalStatus = "pending" | "approved" | "rejected" | "completed";

interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  fee: number;
  netAmount: number;
  status: WithdrawalStatus;
  isAnticipated: boolean;
  requestedAt: string;
  processedAt: string | null;
  rejectionReason: string | null;
  bankAccount?: {
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
  };
}

export default function WithdrawalHistory() {
  const [, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState<WithdrawalStatus | "all">("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);

  // Mock data - em produção seria uma query tRPC
  const withdrawals: Withdrawal[] = [
    {
      id: 1,
      userId: 1,
      amount: 1000,
      fee: 50,
      netAmount: 950,
      status: "completed",
      isAnticipated: false,
      requestedAt: "2025-12-01T10:00:00Z",
      processedAt: "2025-12-31T15:30:00Z",
      rejectionReason: null,
    },
    {
      id: 2,
      userId: 1,
      amount: 500,
      fee: 25,
      netAmount: 525,
      status: "approved",
      isAnticipated: true,
      requestedAt: "2025-12-05T14:20:00Z",
      processedAt: "2025-12-05T16:45:00Z",
      rejectionReason: null,
    },
    {
      id: 3,
      userId: 1,
      amount: 750,
      fee: 0,
      netAmount: 750,
      status: "pending",
      isAnticipated: false,
      requestedAt: "2025-12-09T09:15:00Z",
      processedAt: null,
      rejectionReason: null,
    },
    {
      id: 4,
      userId: 1,
      amount: 300,
      fee: 15,
      netAmount: 315,
      status: "rejected",
      isAnticipated: true,
      requestedAt: "2025-12-08T11:00:00Z",
      processedAt: "2025-12-08T13:30:00Z",
      rejectionReason: "Dados bancários inválidos",
    },
  ];

  const filteredWithdrawals =
    filterStatus === "all"
      ? withdrawals
      : withdrawals.filter((w) => w.status === filterStatus);

  const getStatusBadge = (status: WithdrawalStatus) => {
    const variants: Record<WithdrawalStatus, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      approved: "secondary",
      completed: "outline",
      rejected: "destructive",
    };

    const labels: Record<WithdrawalStatus, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      completed: "Concluído",
      rejected: "Rejeitado",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${(value / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Histórico de Saques</h1>
            <p className="text-gray-600">Acompanhe todos os seus saques e antecipações</p>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "completed", "rejected"] as const).map(
                (status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    size="sm"
                  >
                    {status === "all"
                      ? "Todos"
                      : status === "pending"
                      ? "Pendentes"
                      : status === "approved"
                      ? "Aprovados"
                      : status === "completed"
                      ? "Concluídos"
                      : "Rejeitados"}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Solicitado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    withdrawals.reduce((sum, w) => sum + w.amount, 0)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {withdrawals.filter((w) => w.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {withdrawals.filter((w) => w.status === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">
                  {withdrawals.filter((w) => w.status === "rejected").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Saques */}
        <Card>
          <CardHeader>
            <CardTitle>Saques Recentes</CardTitle>
            <CardDescription>
              {filteredWithdrawals.length} saque(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWithdrawals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum saque encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Valor
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Taxa
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Líquido
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Tipo
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {formatDate(withdrawal.requestedAt)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {formatCurrency(withdrawal.amount)}
                        </td>
                        <td className="py-3 px-4">
                          {withdrawal.fee > 0 ? (
                            <span className="text-red-600">
                              -{formatCurrency(withdrawal.fee)}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-green-600">
                          {formatCurrency(withdrawal.netAmount)}
                        </td>
                        <td className="py-3 px-4">
                          {withdrawal.isAnticipated ? (
                            <Badge variant="secondary">Antecipado</Badge>
                          ) : (
                            <Badge variant="outline">Padrão (D+30)</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWithdrawal(withdrawal)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Saque</DialogTitle>
            <DialogDescription>
              Informações completas sobre este saque
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID do Saque</p>
                  <p className="font-semibold">#{selectedWithdrawal.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedWithdrawal.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Solicitado</p>
                  <p className="font-semibold">
                    {formatCurrency(selectedWithdrawal.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taxa</p>
                  <p className="font-semibold text-red-600">
                    {selectedWithdrawal.fee > 0
                      ? `-${formatCurrency(selectedWithdrawal.fee)}`
                      : "Sem taxa"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Valor Líquido</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(selectedWithdrawal.netAmount)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Tipo de Saque</p>
                <p className="font-semibold">
                  {selectedWithdrawal.isAnticipated
                    ? "Antecipado (5% de taxa)"
                    : "Padrão (D+30, sem taxa)"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Data de Solicitação</p>
                <p className="font-semibold">
                  {formatDate(selectedWithdrawal.requestedAt)}
                </p>
              </div>

              {selectedWithdrawal.processedAt && (
                <div>
                  <p className="text-sm text-gray-600">Data de Processamento</p>
                  <p className="font-semibold">
                    {formatDate(selectedWithdrawal.processedAt)}
                  </p>
                </div>
              )}

              {selectedWithdrawal.rejectionReason && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Motivo da Rejeição:</strong>{" "}
                    {selectedWithdrawal.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
