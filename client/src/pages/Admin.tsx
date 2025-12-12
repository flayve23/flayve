import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Video, LogOut, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KYCApprovalModal } from "@/components/KYCApprovalModal";

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedStreamer, setSelectedStreamer] = useState<any>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  const { data: pendingKYC, isLoading: kycLoading } = trpc.admin.getPendingKYC.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  const utils = trpc.useUtils();

  const handleOpenKYCModal = (streamer: any) => {
    setSelectedStreamer(streamer);
    setKycModalOpen(true);
  };

  const handleKYCSuccess = () => {
    utils.admin.getPendingKYC.invalidate();
  };

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
    if (!loading && user && user.role !== "admin") {
      toast.error("Acesso negado. Apenas administradores.");
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading || kycLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Video className="h-8 w-8 text-pink-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Flayve Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Admin: <strong>{user.name}</strong>
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Split da Plataforma</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-600">30%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Retenção automática por transação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KYC Pendentes</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {pendingKYC?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Aguardando aprovação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streamers Ativos</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  -
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total de streamers cadastrados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* KYC Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciador de KYC</CardTitle>
              <CardDescription>
                Aprove ou rejeite documentos de verificação para liberação de saques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingKYC && pendingKYC.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Streamer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingKYC.map(({ profile, user: streamer }) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {streamer.name || "Sem nome"}
                        </TableCell>
                        <TableCell>{streamer.email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Pendente
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.kycDocumentUrl ? (
                            <a
                              href={profile.kycDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:underline"
                            >
                              Ver Documento
                            </a>
                          ) : (
                            <span className="text-gray-400">Não enviado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleOpenKYCModal(profile)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Revisar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Nenhum KYC pendente no momento
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Todas as verificações foram processadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Plataforma</CardTitle>
              <CardDescription>
                Regras de negócio e configurações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-semibold text-pink-900 mb-2">Split de Pagamentos</h4>
                  <p className="text-sm text-pink-700">
                    • Streamer recebe: <strong>70%</strong> do valor por minuto
                  </p>
                  <p className="text-sm text-pink-700">
                    • Plataforma retém: <strong>30%</strong> automaticamente
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Billing Loop</h4>
                  <p className="text-sm text-purple-700">
                    • Verificação de saldo: <strong>a cada 60 segundos</strong>
                  </p>
                  <p className="text-sm text-purple-700">
                    • Desconexão automática se saldo insuficiente
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Preço Mínimo</h4>
                  <p className="text-sm text-green-700">
                    • Valor mínimo por minuto: <strong>R$ 1,99</strong>
                  </p>
                  <p className="text-sm text-green-700">
                    • Streamers podem definir valores maiores
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Compliance</h4>
                  <p className="text-sm text-blue-700">
                    • Modal de confirmação +18 obrigatório
                  </p>
                  <p className="text-sm text-blue-700">
                    • KYC necessário para saques
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KYC Approval Modal */}
      <KYCApprovalModal
        open={kycModalOpen}
        onOpenChange={setKycModalOpen}
        streamer={selectedStreamer ? {
          id: selectedStreamer.userId,
          username: selectedStreamer.user?.username || "Desconhecido",
          email: selectedStreamer.user?.email || "N/A",
          bio: selectedStreamer.bio,
        } : null}
        onSuccess={handleKYCSuccess}
      />
    </div>
  );
}
