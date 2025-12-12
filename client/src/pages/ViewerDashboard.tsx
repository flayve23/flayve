import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Wallet, History, Star, TrendingDown, LogOut, Plus, Phone } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ViewerDashboard() {
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
    if (!profileLoading && !profile) {
      setLocation("/viewer-onboarding");
    }
  }, [user, loading, profile, profileLoading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const balance = (profile.balance || 0) / 100;
  const recentTransactions = transactions?.slice(0, 10) || [];
  const totalSpentThisMonth = recentTransactions
    .filter(tx => {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => sum + (tx.amount || 0), 0) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Saldo</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {user?.username || "Cliente"}</p>
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
        {/* Saldo - Card Destacado */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-600" />
              Saldo Disponível
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-blue-600">R$ {balance.toFixed(2)}</div>
            <Button
              onClick={() => setLocation("/feed")}
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2 h-12"
            >
              <Plus className="w-4 h-4" />
              Recarregar Saldo
            </Button>
            <p className="text-xs text-gray-500">
              💡 Você pode usar seu saldo para fazer chamadas com qualquer modelo online
            </p>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gasto Este Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">R$ {totalSpentThisMonth.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Total de chamadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Chamadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{recentTransactions.length}</div>
              <p className="text-xs text-gray-500 mt-1">Chamadas realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tempo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">
                {Math.round(recentTransactions.length * 5)}m
              </div>
              <p className="text-xs text-gray-500 mt-1">Minutos em chamadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Modelos Favoritos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Modelos Favoritos
            </CardTitle>
            <CardDescription>Seus modelos salvos para acesso rápido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Você ainda não tem modelos favoritos</p>
              <Button
                onClick={() => setLocation("/feed")}
                variant="outline"
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
                Explorar Modelos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Chamadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-pink-600" />
              Histórico de Chamadas
            </CardTitle>
            <CardDescription>Suas últimas chamadas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Chamada #{idx + 1}</p>
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
                    <div className="text-right">
                      <p className="font-bold text-red-600">-R$ {(tx.amount / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{tx.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">Você ainda não fez nenhuma chamada</p>
                <Button
                  onClick={() => setLocation("/feed")}
                  className="bg-pink-600 hover:bg-pink-700 gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Fazer Primeira Chamada
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setLocation("/feed")}
            className="bg-pink-600 hover:bg-pink-700 gap-2 h-12"
          >
            <Phone className="w-4 h-4" />
            Explorar Modelos
          </Button>
          <Button
            onClick={() => setLocation("/profile")}
            className="bg-purple-600 hover:bg-purple-700 gap-2 h-12"
          >
            Meu Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
