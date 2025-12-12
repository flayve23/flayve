import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface KYCApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamer: {
    id: number;
    username: string;
    email: string;
    bio?: string;
  } | null;
  onSuccess?: () => void;
}

export function KYCApprovalModal({
  open,
  onOpenChange,
  streamer,
  onSuccess,
}: KYCApprovalModalProps) {
  const [rejectionComment, setRejectionComment] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const approveKYC = trpc.admin.approveKYC.useMutation({
    onSuccess: () => {
      setSuccessMessage("KYC aprovado com sucesso!");
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage("");
        onSuccess?.();
      }, 2000);
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Erro ao aprovar KYC");
    },
  });

  const rejectKYC = trpc.admin.rejectKYC.useMutation({
    onSuccess: () => {
      setSuccessMessage("KYC rejeitado com sucesso!");
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage("");
        setRejectionComment("");
        setIsRejecting(false);
        onSuccess?.();
      }, 2000);
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Erro ao rejeitar KYC");
    },
  });

  const handleApprove = async () => {
    if (!streamer) return;
    await approveKYC.mutateAsync({
      streamerId: streamer.id,
    });
  };

  const handleReject = async () => {
    if (!streamer || !rejectionComment.trim()) {
      setErrorMessage("Comentário é obrigatório para rejeição");
      return;
    }
    await rejectKYC.mutateAsync({
      streamerId: streamer.id,
      comment: rejectionComment,
    });
  };

  if (!streamer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Revisar KYC</DialogTitle>
          <DialogDescription>
            Streamer: <strong>{streamer.username}</strong>
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md flex gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900 dark:text-green-100">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 dark:text-red-100">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Informações do Streamer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Nome de Usuário</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{streamer.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{streamer.email}</p>
            </div>
            {streamer.bio && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Bio</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{streamer.bio}</p>
              </div>
            )}
          </div>

          {/* Alerta de Verificação */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold">Verificação Necessária</p>
              <p className="text-xs mt-1">Revise os documentos do streamer antes de aprovar ou rejeitar.</p>
            </div>
          </div>

          {/* Seção de Rejeição (se ativada) */}
          {isRejecting && (
            <div className="space-y-2">
              <Label htmlFor="rejection-comment">Motivo da Rejeição *</Label>
              <Textarea
                id="rejection-comment"
                placeholder="Explique por que o KYC foi rejeitado (ex: documento ilegível, dados inconsistentes, etc.)"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                className="min-h-24"
              />
              <p className="text-xs text-gray-500">
                Este comentário será registrado no sistema para auditoria.
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setIsRejecting(false);
                setRejectionComment("");
              }}
              disabled={approveKYC.isPending || rejectKYC.isPending}
            >
              Cancelar
            </Button>

            {!isRejecting ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsRejecting(true)}
                  disabled={approveKYC.isPending || rejectKYC.isPending}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </Button>
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 gap-2"
                  onClick={handleApprove}
                  disabled={approveKYC.isPending || rejectKYC.isPending}
                >
                  <CheckCircle className="w-4 h-4" />
                  {approveKYC.isPending ? "Processando..." : "Aprovar"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRejecting(false)}
                  disabled={approveKYC.isPending || rejectKYC.isPending}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionComment.trim() || rejectKYC.isPending}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {rejectKYC.isPending ? "Processando..." : "Confirmar Rejeição"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
