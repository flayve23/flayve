import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, DollarSign, Star, TrendingUp } from "lucide-react";

export default function CallHistory() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month");

  // Mock data for demonstration
  const mockCalls = [
    {
      id: 1,
      viewerName: "João Silva",
      startTime: new Date(Date.now() - 86400000),
      durationMinutes: 15,
      totalCost: 2985,
      streamerEarnings: 2089,
      status: "completed" as const,
      viewerRating: 5,
    },
    {
      id: 2,
      viewerName: "Maria Santos",
      startTime: new Date(Date.now() - 172800000),
      durationMinutes: 20,
      totalCost: 3980,
      streamerEarnings: 2786,
      status: "completed" as const,
      viewerRating: 4,
    },
    {
      id: 3,
      viewerName: "Carlos Oliveira",
      startTime: new Date(Date.now() - 259200000),
      durationMinutes: 10,
      totalCost: 1990,
      streamerEarnings: 1393,
      status: "completed" as const,
      viewerRating: 5,
    },
  ];

  const stats = {
    totalCalls: mockCalls.length,
    totalEarnings: mockCalls.reduce((sum, c) => sum + c.streamerEarnings, 0),
    totalMinutes: mockCalls.reduce((sum, c) => sum + c.durationMinutes, 0),
    averageRating: (
      mockCalls.reduce((sum, c) => sum + (c.viewerRating || 0), 0) / mockCalls.length
    ).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Histórico de Chamadas</h1>
          <p className="text-gray-600">Acompanhe seus ganhos e desempenho</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total de Chamadas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCalls}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Ganhos Totais</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {(stats.totalEarnings / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Minutos Totais</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalMinutes}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avaliação Média</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.averageRating} ⭐</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "all"] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period === "week" ? "Esta Semana" : period === "month" ? "Este Mês" : "Tudo"}
            </Button>
          ))}
        </div>

        {/* Calls Table */}
        <Card>
          <CardHeader>
            <CardTitle>Chamadas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Duração</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Valor</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Ganho</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Avaliação</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCalls.map((call) => (
                    <tr key={call.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{call.viewerName}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {format(call.startTime, "dd MMM yyyy HH:mm", { locale: ptBR })}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900">
                        {call.durationMinutes} min
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900">
                        R$ {(call.totalCost / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-green-600">
                        R$ {(call.streamerEarnings / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {call.viewerRating ? (
                          <span className="text-yellow-500">
                            {"⭐".repeat(call.viewerRating)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mockCalls.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma chamada neste período</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <Button className="gap-2">
            📊 Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
}
