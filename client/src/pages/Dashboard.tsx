import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Clock, Video, LogOut, Share2, Eye, EyeOff, ArrowUpRight, Calendar, Wallet, User } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { WithdrawalModal } from "@/components/WithdrawalModal";
import { EarningsChart } from "@/components/EarningsChart";
import { KYCModal } from "@/components/KYCModal";

export default function Dashboard() {
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

  const [isOnline, setIsOnline] = useState(false);
  const [newPrice, setNewPrice] = useState(5.0);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  const utils = trpc.useUtils();

  const updateOnlineStatus = trpc.profile.updateOnlineStatus.useMutation({
    onSuccess: () => {
      toast.success(isOnline ? "Você está offline agora" : "Você está online agora!");
      utils.profile.getMyProfile.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status: " + error.message);
    },
  });

  const updatePrice = trpc.profile.updatePrice.useMutation({
    onSuccess: () => {
      toast.success("Preço atualizado com sucesso!");
      setShowPriceInput(false);
      utils.profile.getMyProfile.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar preço: " + error.message);
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
    if (!profileLoading && !profile) {
      setLocation("/onboarding");
    }
    if (profile) {
      setIsOnline(profile.isOnline || false);
      setNewPrice((profile.pricePerMinute || 500) / 100);
    }
  }, [user, loading, profile, profileLoading, setLocation]);

  const handleToggleOnline = () => {
    updateOnlineStatus.mutate({ isOnline: !isOnline });
    setIsOnline(!isOnline);
  };

  const handleUpdatePrice = () => {
    if (newPrice < 1.99) {
      toast.error("O preço mínimo é R$ 1,99");
      return;
    }
    if (newPrice > 100) {
      toast.error("O preço máximo é R$ 100,00");
      return;
    }
    updatePrice.mutate({ pricePerMinute: Math.round(newPrice * 100) });
  };

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
  const totalEarnings = (profile.totalEarnings || 0) / 100;
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {user?.username || "Streamer"}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setLocation("/withdrawal")}
              variant="default"
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Wallet className="w-4 h-4" />
              Sacar
            </Button>
            <Button
              onClick={() => setLocation("/my-profile")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Meu Perfil
            </Button>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Status Online - Destaque Principal */}
        <Card className="border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status Online</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isOnline ? "text-green-600" : "text-gray-600"}`}>
                  {isOnline ? "🟢 Online" : "⚫ Offline"}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleToggleOnline}
                  disabled={updateOnlineStatus.isPending}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {isOnline
                ? "Você está visível para clientes. Chamadas podem chegar a qualquer momento."
                : "Você está offline. Clientes não conseguem te ver."}
            </p>
          </CardContent>
        </Card>

        {/* Ganhos Hoje - Card Destacado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ganhos Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">R$ {balance.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Saldo disponível</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Ganho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">R$ {totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Desde o início</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Próximo Saque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">Dia 05</div>
              <p className="text-xs text-gray-500 mt-1">Próxima data de saque</p>
            </CardContent>
          </Card>
        </div>

        {/* Preço por Minuto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-pink-600" />
                Preço por Minuto
              </span>
              <span className="text-2xl font-bold text-pink-600">R$ {newPrice.toFixed(2)}</span>
            </CardTitle>
            <CardDescription>
              Defina o valor que você quer ganhar por minuto de chamada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showPriceInput ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="price" className="text-xs">Novo Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="1.99"
                      max="100"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdatePrice}
                    disabled={updatePrice.isPending}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    {updatePrice.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    onClick={() => setShowPriceInput(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowPriceInput(true)}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Editar Preço
              </Button>
            )}
            <p className="text-xs text-gray-500">
              💡 Dica: Streamers premium cobram até R$ 100/min. Quanto maior o preço, menos chamadas, mas maior ganho por chamada.
            </p>
          </CardContent>
        </Card>

        {/* Gráfico de Ganhos */}
        <EarningsChart transactions={transactions} period="7days" />

        {/* Chamadas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-pink-600" />
              Chamadas Recentes
            </CardTitle>
            <CardDescription>Últimas 5 chamadas recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Chamada #{idx + 1}</p>
                      <p className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+R$ {(tx.amount / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{tx.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma chamada ainda. Fique online para receber!</p>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setLocation("/call-history")}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 gap-2 h-12"
          >
            📊 Histórico
          </Button>
          <Button
            onClick={() => setWithdrawalModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 h-12"
          >
            <Wallet className="w-4 h-4" />
            Saque
          </Button>
          <Button
            onClick={() => setLocation("/share-profile")}
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-12"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
          <Button
            onClick={() => setLocation("/profile")}
            className="bg-purple-600 hover:bg-purple-700 gap-2 h-12"
          >
            <ArrowUpRight className="w-4 h-4" />
            Perfil
          </Button>
          <Button
            onClick={() => setKycModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 gap-2 h-12"
          >
            <User className="w-4 h-4" />
            KYC
          </Button>
        </div>
      </div>

      {/* KYC Modal */}
      <KYCModal
        open={kycModalOpen}
        onOpenChange={setKycModalOpen}
        onSuccess={() => {
          toast.success("KYC submetido com sucesso!");
          utils.kyc.getMyKYC.invalidate();
        }}
      />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        open={withdrawalModalOpen}
        onOpenChange={setWithdrawalModalOpen}
        balance={profile?.balance || 0}
        username={user?.username || "streamer"}
      />
    </div>
  );
}
