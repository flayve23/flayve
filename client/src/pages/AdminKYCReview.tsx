import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface KYCReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kyc: any;
  onApprove: (comment?: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

function KYCReviewModal({ open, onOpenChange, kyc, onApprove, onReject }: KYCReviewModalProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(comment);
      onOpenChange(false);
      setAction(null);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert("Motivo da rejeição é obrigatório");
      return;
    }
    setLoading(true);
    try {
      await onReject(comment);
      onOpenChange(false);
      setAction(null);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  if (!kyc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar KYC - {kyc.user?.username}</DialogTitle>
          <DialogDescription>
            Submetido em {new Date(kyc.kyc.submittedAt).toLocaleDateString("pt-BR")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="font-semibold mb-3">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nome Completo</p>
                <p className="font-medium">{kyc.kyc.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">CPF</p>
                <p className="font-medium">{kyc.kyc.cpf}</p>
              </div>
              <div>
                <p className="text-gray-600">Data de Nascimento</p>
                <p className="font-medium">{new Date(kyc.kyc.dateOfBirth).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-gray-600">Nacionalidade</p>
                <p className="font-medium">{kyc.kyc.nationality}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <p className="text-gray-600">Endereço</p>
                <p className="font-medium">{kyc.kyc.address}</p>
              </div>
              <div>
                <p className="text-gray-600">Cidade</p>
                <p className="font-medium">{kyc.kyc.city}</p>
              </div>
              <div>
                <p className="text-gray-600">Estado</p>
                <p className="font-medium">{kyc.kyc.state}</p>
              </div>
              <div>
                <p className="text-gray-600">CEP</p>
                <p className="font-medium">{kyc.kyc.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div>
            <h3 className="font-semibold mb-3">Dados Bancários</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Banco</p>
                <p className="font-medium">{kyc.kyc.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600">Código do Banco</p>
                <p className="font-medium">{kyc.kyc.bankCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Agência</p>
                <p className="font-medium">{kyc.kyc.branchCode}</p>
              </div>
              <div>
                <p className="text-gray-600">Conta</p>
                <p className="font-medium">{kyc.kyc.accountNumber}-{kyc.kyc.accountDigit}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Titular</p>
                <p className="font-medium">{kyc.kyc.accountHolder}</p>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div>
            <h3 className="font-semibold mb-3">Documentos</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Documento de Identidade</p>
                <p className="font-medium">{kyc.kyc.idDocumentType.toUpperCase()} - {kyc.kyc.idDocumentNumber}</p>
                <a href={kyc.kyc.idDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ver documento
                </a>
              </div>
              <div>
                <p className="text-gray-600">Comprovante de Endereço</p>
                <a href={kyc.kyc.proofOfAddressUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ver comprovante
                </a>
              </div>
            </div>
          </div>

          {/* Ação */}
          {action === null && (
            <div className="flex gap-2">
              <Button
                onClick={() => setAction("approve")}
                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Aprovar
              </Button>
              <Button
                onClick={() => setAction("reject")}
                variant="destructive"
                className="flex-1 gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeitar
              </Button>
            </div>
          )}

          {action === "approve" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="approveComment">Comentário (Opcional)</Label>
                <Textarea
                  id="approveComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex: Documentos válidos e completos"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setAction(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Aprovando..." : "Confirmar Aprovação"}
                </Button>
              </div>
            </div>
          )}

          {action === "reject" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="rejectReason">Motivo da Rejeição *</Label>
                <Textarea
                  id="rejectReason"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex: Documento de identidade ilegível, CPF não corresponde"
                  className="mt-2"
                  minLength={10}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setAction(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={loading || !comment.trim()}
                >
                  {loading ? "Rejeitando..." : "Confirmar Rejeição"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminKYCReview() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const { data: pendingKYCs, isLoading, refetch } = trpc.kyc.getPendingKYCs.useQuery(
    { limit: 100 },
    { enabled: !!user && user.role === "admin" }
  );

  const approveMutation = trpc.kyc.approveKYC.useMutation({
    onSuccess: () => {
      alert("KYC aprovado com sucesso!");
      refetch();
    },
    onError: (error) => {
      alert("Erro ao aprovar: " + error.message);
    },
  });

  const rejectMutation = trpc.kyc.rejectKYC.useMutation({
    onSuccess: () => {
      alert("KYC rejeitado com sucesso!");
      refetch();
    },
    onError: (error) => {
      alert("Erro ao rejeitar: " + error.message);
    },
  });

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Acesso restrito a administradores</p>
          <Button onClick={() => setLocation("/")} variant="outline">
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  const filteredKYCs = (pendingKYCs || []).filter((item: any) => {
    const matchesSearch =
      item.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kyc?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kyc?.cpf?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || item.kyc?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium"><Clock className="w-3 h-3" /> Pendente</span>;
      case "approved":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"><CheckCircle className="w-3 h-3" /> Aprovado</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"><XCircle className="w-3 h-3" /> Rejeitado</span>;
      default:
        return <span className="text-xs text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Revisão de KYC</h1>
            <p className="text-gray-600">Gerenciar verificações de identidade</p>
          </div>
          <Button
            onClick={() => {
              logout();
              setLocation("/");
            }}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, username ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-8">Carregando KYCs...</div>
        ) : filteredKYCs.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nenhum KYC encontrado</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome Completo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Submetido em</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredKYCs.map((item: any) => (
                  <tr key={item.kyc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{item.user?.username}</td>
                    <td className="px-6 py-4 text-sm">{item.kyc.fullName}</td>
                    <td className="px-6 py-4 text-sm font-mono">{item.kyc.cpf}</td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(item.kyc.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.kyc.submittedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        onClick={() => {
                          setSelectedKYC(item);
                          setReviewModalOpen(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Revisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <KYCReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        kyc={selectedKYC}
        onApprove={async (comment) => {
          await approveMutation.mutateAsync({
            kycId: selectedKYC.kyc.id,
            comment,
          });
        }}
        onReject={async (reason) => {
          await rejectMutation.mutateAsync({
            kycId: selectedKYC.kyc.id,
            reason,
          });
        }}
      />
    </div>
  );
}
