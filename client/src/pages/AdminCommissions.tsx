import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit2, Save, X } from "lucide-react";

interface CommissionRow {
  id: number;
  streamerId: number;
  streamerName: string;
  streamerEmail: string;
  baseCommission: string;
  totalCommission: string;
  notes: string | null;
}

export default function AdminCommissions() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<CommissionRow>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: commissions, isLoading, refetch } = trpc.commission.getAllCommissions.useQuery();
  const updateMutation = trpc.commission.updateStreamerCommission.useMutation();

  const handleEdit = (commission: CommissionRow) => {
    setEditingId(commission.id);
    setEditData(commission);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingId || !editData.streamerId) return;

    try {
      await updateMutation.mutateAsync({
        streamerId: editData.streamerId,
        baseCommission: parseFloat(editData.baseCommission || "70"),
        notes: editData.notes || undefined,
      });

      toast.success("Comissão atualizada com sucesso!");
      setIsDialogOpen(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar comissão");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setEditData({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Carregando comissões...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Comissões</h1>
        <p className="text-gray-600">Negocie e ajuste as comissões dos streamers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comissões de Streamers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Streamer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Comissão Base</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Bônus Lealdade</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ação</th>
                </tr>
              </thead>
              <tbody>
                {commissions?.map((commission) => (
                  <tr key={commission.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{commission.streamerName}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{commission.streamerEmail}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {parseFloat(commission.baseCommission).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {commission.loyaltyBonus ? `+${parseFloat(commission.loyaltyBonus).toFixed(2)}%` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        {parseFloat(commission.totalCommission).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(commission as CommissionRow)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!commissions || commissions.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma comissão encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Comissão - {editData.streamerName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comissão Base (%)
              </label>
              <Input
                type="number"
                min="60"
                max="85"
                step="0.01"
                value={editData.baseCommission || ""}
                onChange={(e) => setEditData({ ...editData, baseCommission: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo: 60% | Máximo: 85%</p>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={editData.notes || ""}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Motivo da negociação..."
              />
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Comissão Base:</strong>{" "}
                <span className="text-lg font-bold text-blue-600">
                  {parseFloat(editData.baseCommission || "70").toFixed(2)}%
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
