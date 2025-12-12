import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { BarChart3, Users, TrendingUp, AlertCircle, LogOut, CheckCircle, XCircle, Clock, Shield, FileCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ModerationPanel } from "@/components/ModerationPanel";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = trpc.profile.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: transactions } = trpc.wallet.getTransactions.useQuery(
    undefined,
    { enabled: !!user }
  );

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
    if (!profileLoading && user?.role !== "admin") {
      setLocation("/");
    }
  }, [user, loading, profileLoading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-purple-100 to-pink-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const allTransactions = transactions || [];
  const platformRevenue = allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / 100 * 0.3; // 30% da plataforma
  const totalVolume = allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / 100;

  // Simular dados de KYC (em produção viriam do banco)
  const kycPending = [
    { id: 1, username: "streamer_001", status: "pending", submittedAt: new Date() },
    { id: 2, username: "streamer_002", status: "pending", submittedAt: new Date(Date.now() - 86400000) },
  ];

  const activeUsers = 42;
  const totalUsers = 156;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-sm text-gray-600">Gerenciamento da Plataforma Flayve</p>
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
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Online agora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">R$ {platformRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">30% do volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Volume Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">R$ {totalVolume.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Todas as transações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">{totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Cadastrados</p>
            </CardContent>
          </Card>
        </div>

        {/* KYC Pendente - Alerta */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              KYC Pendente ({kycPending.length})
            </CardTitle>
            <CardDescription>Documentos aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            {kycPending.length > 0 ? (
              <div className="space-y-3">
                {kycPending.map((kyc) => (
                  <div key={kyc.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="font-medium">{kyc.username}</p>
                      <p className="text-xs text-gray-500">
                        Enviado em {new Date(kyc.submittedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 gap-1"
                        onClick={() => toast.success("KYC aprovado!")}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => toast.success("KYC rejeitado!")}
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhum KYC pendente</p>
            )}
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              Transações Recentes
            </CardTitle>
            <CardDescription>Últimas 10 transações da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {allTransactions.length > 0 ? (
              <div className="space-y-3">
                {allTransactions.slice(0, 10).map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Transação #{idx + 1}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={tx.type === "credit" ? "default" : "secondary"}>
                        {tx.type === "credit" ? "Crédito" : "Débito"}
                      </Badge>
                      <p className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "credit" ? "+" : "-"}R$ {(tx.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
            )}
          </CardContent>
        </Card>

        {/* Moderação */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Painel de Moderação
            </CardTitle>
            <CardDescription>Gerenciar usuários, chamadas ativas e logs</CardDescription>
          </CardHeader>
          <CardContent>
            <ModerationPanel />
          </CardContent>
        </Card>

        {/* Usuários Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Usuários Recentes
            </CardTitle>
            <CardDescription>Últimos usuários cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { username: "streamer_premium_01", role: "streamer", status: "active" },
                { username: "viewer_cliente_01", role: "viewer", status: "active" },
                { username: "streamer_novo_02", role: "streamer", status: "pending_kyc" },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">
                      {user.role === "streamer" ? "🎥 Streamer" : "👁️ Viewer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Ativo" : "Pendente KYC"}
                    </Badge>
                    <Button size="sm" variant="outline">Gerenciar</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setLocation("/admin-commissions")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 h-12"
          >
            💰 Gerenciar Comissões
          </Button>
          <Button
            onClick={() => setLocation("/reports")}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 gap-2 h-12"
          >
            <BarChart3 className="w-4 h-4" />
            Ver Relatórios
          </Button>
          <Button
            onClick={() => toast.info("Configurações em desenvolvimento")}
            className="bg-purple-600 hover:bg-purple-700 gap-2 h-12"
          >
            Configurações
          </Button>
          <Button
            onClick={() => setLocation("/admin-kyc")}
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-12"
          >
            <FileCheck className="w-4 h-4" />
            Revisar KYC
          </Button>
          <Button
            onClick={() => setLocation("/profile")}
            className="bg-gray-600 hover:bg-gray-700 gap-2 h-12"
          >
            Meu Perfil
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 h-12"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
