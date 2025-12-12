import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUp, Download, Filter } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export function TransactionHistory() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Queries para histórico
  const { data: recharges, isLoading: rechargesLoading } = trpc.payment.getRechargeHistory.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: withdrawals, isLoading: withdrawalsLoading } = trpc.payment.getMpWithdrawalHistory.useQuery(
    undefined,
    { enabled: !!user && user.role === "streamer" }
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
      completed: "Concluído",
      failed: "Falhou",
      processing: "Processando",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Transações</h1>
          <p className="text-gray-600">Acompanhe seus pagamentos e saques</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date-filter">Data</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todos</option>
                  <option value="approved">Aprovado</option>
                  <option value="pending">Pendente</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas de Transações */}
        <Tabs defaultValue="recharges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recharges">Recargas</TabsTrigger>
            <TabsTrigger value="withdrawals">Saques</TabsTrigger>
          </TabsList>

          {/* Recargas */}
          <TabsContent value="recharges" className="space-y-4">
            {rechargesLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">Carregando...</div>
                </CardContent>
              </Card>
            ) : recharges && recharges.length > 0 ? (
              recharges.map((recharge: any) => (
                <Card key={recharge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <ArrowDown className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Recarga de Saldo</p>
                          <p className="text-sm text-gray-500">{formatDate(recharge.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          +R$ {(recharge.amount / 100).toFixed(2)}
                        </p>
                        <p className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(recharge.status)}`}>
                          {getStatusLabel(recharge.status)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <p>Método: {recharge.paymentMethod === "pix" ? "PIX" : "Cartão"}</p>
                      {recharge.paymentId && <p>ID: {recharge.paymentId}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">Nenhuma recarga encontrada</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Saques */}
          <TabsContent value="withdrawals" className="space-y-4">
            {withdrawalsLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">Carregando...</div>
                </CardContent>
              </Card>
            ) : withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((withdrawal: any) => (
                <Card key={withdrawal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <ArrowUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Saque via PIX</p>
                          <p className="text-sm text-gray-500">{formatDate(withdrawal.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-purple-600">
                          -R$ {(withdrawal.amount / 100).toFixed(2)}
                        </p>
                        <p className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}>
                          {getStatusLabel(withdrawal.status)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <p>Chave PIX: {withdrawal.pixKey}</p>
                      {withdrawal.transferId && <p>ID Transferência: {withdrawal.transferId}</p>}
                      {withdrawal.failureReason && <p className="text-red-600">Motivo: {withdrawal.failureReason}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">Nenhum saque encontrado</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Botão de Download */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Baixar Extrato
          </Button>
        </div>
      </div>
    </div>
  );
}
