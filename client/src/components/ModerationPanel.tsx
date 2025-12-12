import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Ban, Clock, AlertTriangle, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ModerationPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "calls" | "logs">("users");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [banReason, setBanReason] = useState("");
  const [suspensionDays, setSuspensionDays] = useState(7);

  // Queries
  const { data: activeCalls, refetch: refetchCalls } = trpc.moderation.getActiveCalls.useQuery();
  const { data: moderationLogs } = trpc.moderation.getModerationLogs.useQuery({ limit: 50 });
  const { data: userWarnings } = trpc.moderation.getUserWarnings.useQuery(
    { userId: selectedUserId || 0 },
    { enabled: !!selectedUserId }
  );

  // Mutations
  const banUserMutation = trpc.moderation.banUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário banido com sucesso");
      setBanReason("");
      setSelectedUserId(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const suspendUserMutation = trpc.moderation.suspendUser.useMutation({
    onSuccess: () => {
      toast.success(`Usuário suspenso por ${suspensionDays} dias`);
      setBanReason("");
      setSelectedUserId(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const warnUserMutation = trpc.moderation.warnUser.useMutation({
    onSuccess: () => {
      toast.success("Aviso enviado com sucesso");
      setBanReason("");
    },
    onError: (error) => toast.error(error.message),
  });

  const endCallMutation = trpc.moderation.endActiveCall.useMutation({
    onSuccess: () => {
      toast.success("Chamada encerrada");
      refetchCalls();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleBanUser = async () => {
    if (!selectedUserId || !banReason) {
      toast.error("Preencha todos os campos");
      return;
    }
    await banUserMutation.mutateAsync({
      userId: selectedUserId,
      reason: banReason,
      banType: "permanent",
    });
  };

  const handleSuspendUser = async () => {
    if (!selectedUserId || !banReason) {
      toast.error("Preencha todos os campos");
      return;
    }
    await suspendUserMutation.mutateAsync({
      userId: selectedUserId,
      reason: banReason,
      suspensionDays,
    });
  };

  const handleWarnUser = async () => {
    if (!selectedUserId || !banReason) {
      toast.error("Preencha todos os campos");
      return;
    }
    await warnUserMutation.mutateAsync({
      userId: selectedUserId,
      reason: banReason,
    });
  };

  const handleEndCall = async (callRoomId: string) => {
    await endCallMutation.mutateAsync({
      callRoomId,
      reason: "Encerrada pela moderação",
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "users"
              ? "border-b-2 border-pink-600 text-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Ban className="w-4 h-4 inline mr-2" />
          Gerenciar Usuários
        </button>
        <button
          onClick={() => setActiveTab("calls")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "calls"
              ? "border-b-2 border-pink-600 text-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Chamadas Ativas ({activeCalls?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "logs"
              ? "border-b-2 border-pink-600 text-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Logs
        </button>
      </div>

      {/* Users Management */}
      {activeTab === "users" && (
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">ID do Usuário</label>
              <Input
                type="number"
                placeholder="Digite o ID do usuário"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>

            {selectedUserId && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">Motivo</label>
                  <Textarea
                    placeholder="Descreva o motivo da ação"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                {/* Warnings */}
                {userWarnings && userWarnings.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-900">
                      ⚠️ Avisos: {userWarnings.length}
                    </p>
                    <ul className="text-xs text-yellow-800 mt-2 space-y-1">
                      {userWarnings.map((w: any) => (
                        <li key={w.id}>• {w.reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={handleWarnUser}
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={warnUserMutation.isPending}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Avisar
                  </Button>

                  <Button
                    onClick={handleSuspendUser}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={suspendUserMutation.isPending}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Suspender
                  </Button>

                  <Button
                    onClick={handleBanUser}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={banUserMutation.isPending}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Banir
                  </Button>
                </div>

                {/* Suspension Days */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Dias de Suspensão
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={suspensionDays}
                    onChange={(e) => setSuspensionDays(parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Calls */}
      {activeTab === "calls" && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Chamadas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCalls && activeCalls.length > 0 ? (
              <div className="space-y-3">
                {activeCalls.map((item: any) => (
                  <div
                    key={item.call.id}
                    className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {item.streamer.username} → {item.viewer.username}
                      </p>
                      <p className="text-xs text-gray-600">
                        Sala: {item.call.callRoomId}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleEndCall(item.call.callRoomId)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={endCallMutation.isPending}
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Encerrar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Nenhuma chamada ativa</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Moderation Logs */}
      {activeTab === "logs" && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Logs de Moderação</CardTitle>
          </CardHeader>
          <CardContent>
            {moderationLogs && moderationLogs.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {moderationLogs.map((log: any) => (
                  <div
                    key={log.log.id}
                    className="p-3 bg-purple-50 rounded border border-purple-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm uppercase text-purple-900">
                          {log.action}
                        </p>
                        <p className="text-xs text-gray-600">
                          Admin: {log.admin.username} → Usuário: {log.target.username}
                        </p>
                        {log.log.reason && (
                          <p className="text-xs text-gray-700 mt-1">
                            Motivo: {log.log.reason}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {new Date(log.log.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Nenhum log de moderação</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
