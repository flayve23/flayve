import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { BarChart3, Download, Filter, LogOut, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ReportsAdmin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: reports, isLoading: reportsLoading } = trpc.admin.getReports.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit: 20,
    },
    { enabled: !!user && user.role === "admin" }
  );

  const { data: withdrawalStats } = trpc.admin.getWithdrawalStats.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  const { data: transactionStats } = trpc.admin.getTransactionStats.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
    if (!loading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleExportCSV = () => {
    if (!reports) return;

    const headers = ["ID", "Tipo", "Valor (R$)", "Status", "Data"];
    const rows: string[] = [];

    // Adicionar saques
    reports.withdrawals.forEach((w: any) => {
      rows.push([
        w.id,
        "Saque",
        (w.amount / 100).toFixed(2),
        w.status,
        new Date(w.requestedAt).toLocaleDateString("pt-BR"),
      ].join(","));
    });

    // Adicionar transações
    reports.transactions.forEach((t: any) => {
      rows.push([
        t.id,
        t.type,
        (t.amount / 100).toFixed(2),
        t.status || "N/A",
        new Date(t.createdAt).toLocaleDateString("pt-BR"),
      ].join(","));
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Relatório exportado com sucesso!");
  };

  if (loading || reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const totalPages = reports ? Math.ceil(reports.total / 20) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Relatórios
            </h1>
            <p className="text-sm text-gray-600">Análise de saques e transações</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Saques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{withdrawalStats?.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Todos os tempos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{withdrawalStats?.pending || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Aguardando processamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{withdrawalStats?.completed || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Saques concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Volume Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                R$ {((withdrawalStats?.totalAmount || 0) / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Em saques</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-xs">Data Inicial</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-xs">Data Final</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Limpar Filtros
                </Button>
                <Button
                  onClick={handleExportCSV}
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Saques */}
        <Card>
          <CardHeader>
            <CardTitle>Saques</CardTitle>
            <CardDescription>
              Mostrando {reports?.withdrawals.length || 0} de {reports?.total || 0} registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports && reports.withdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Streamer</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Chave Pix</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.withdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">#{withdrawal.id}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-semibold">{withdrawal.streamerUsername || "N/A"}</p>
                            <p className="text-xs text-gray-500">{withdrawal.streamerId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          R$ {(withdrawal.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {withdrawal.pixKey ? withdrawal.pixKey.substring(0, 20) + "..." : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              withdrawal.status === "completed"
                                ? "default"
                                : withdrawal.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {withdrawal.status === "pending" && "Pendente"}
                            {withdrawal.status === "processing" && "Processando"}
                            {withdrawal.status === "completed" && "Concluído"}
                            {withdrawal.status === "failed" && "Falhou"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(withdrawal.requestedAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhum saque encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              Mostrando {reports?.transactions.length || 0} de {reports?.total || 0} registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports && reports.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.transactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">#{transaction.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.type === "call_earning" && "Ganho de Chamada"}
                            {transaction.type === "call_charge" && "Cobrança de Chamada"}
                            {transaction.type === "credit" && "Crédito"}
                            {transaction.type === "debit" && "Débito"}
                            {transaction.type === "withdrawal" && "Saque"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {transaction.amount > 0 ? "+" : ""}R$ {(transaction.amount / 100).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {transaction.description || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                            {transaction.status || "Concluída"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              variant="outline"
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
