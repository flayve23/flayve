import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal, Flame, Star, TrendingUp } from "lucide-react";
import { StreamerBadgesCompact } from "@/components/StreamerBadges";

interface LeaderboardEntry {
  rank: number;
  streamerId: number;
  streamerName: string;
  streamerPhoto: string;
  metric: number;
  change: number; // +/- posições desde semana passada
  badges: any[];
  rating?: number;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("earnings");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por tRPC query
  useEffect(() => {
    setLoading(true);
    // Simular delay de API
    setTimeout(() => {
      const mockData = {
        earnings: [
          {
            rank: 1,
            streamerId: 1,
            streamerName: "Ana Silva",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4250.50,
            change: 2,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "top_earner", earnedAt: new Date() },
            ],
          },
          {
            rank: 2,
            streamerId: 2,
            streamerName: "Marina Costa",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 3890.00,
            change: -1,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "top_rated", earnedAt: new Date() },
            ],
          },
          {
            rank: 3,
            streamerId: 3,
            streamerName: "Juliana Santos",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 3450.75,
            change: 1,
            badges: [{ type: "verified", earnedAt: new Date() }],
          },
          {
            rank: 4,
            streamerId: 4,
            streamerName: "Beatriz Lima",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 3120.00,
            change: 0,
            badges: [{ type: "trusted", earnedAt: new Date() }],
          },
          {
            rank: 5,
            streamerId: 5,
            streamerName: "Camila Oliveira",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 2890.50,
            change: 3,
            badges: [{ type: "new", earnedAt: new Date() }],
          },
        ],
        ratings: [
          {
            rank: 1,
            streamerId: 1,
            streamerName: "Ana Silva",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4.95,
            change: 0,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "top_rated", earnedAt: new Date() },
            ],
            rating: 4.95,
          },
          {
            rank: 2,
            streamerId: 2,
            streamerName: "Marina Costa",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4.87,
            change: 1,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "top_rated", earnedAt: new Date() },
            ],
            rating: 4.87,
          },
          {
            rank: 3,
            streamerId: 3,
            streamerName: "Juliana Santos",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4.72,
            change: -1,
            badges: [{ type: "verified", earnedAt: new Date() }],
            rating: 4.72,
          },
          {
            rank: 4,
            streamerId: 4,
            streamerName: "Beatriz Lima",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4.65,
            change: 0,
            badges: [{ type: "trusted", earnedAt: new Date() }],
            rating: 4.65,
          },
          {
            rank: 5,
            streamerId: 5,
            streamerName: "Camila Oliveira",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 4.52,
            change: 2,
            badges: [{ type: "new", earnedAt: new Date() }],
            rating: 4.52,
          },
        ],
        activity: [
          {
            rank: 1,
            streamerId: 1,
            streamerName: "Ana Silva",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 287,
            change: 5,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "most_active", earnedAt: new Date() },
            ],
          },
          {
            rank: 2,
            streamerId: 2,
            streamerName: "Marina Costa",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 245,
            change: -2,
            badges: [
              { type: "verified", earnedAt: new Date() },
              { type: "top_rated", earnedAt: new Date() },
            ],
          },
          {
            rank: 3,
            streamerId: 3,
            streamerName: "Juliana Santos",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 198,
            change: 1,
            badges: [{ type: "verified", earnedAt: new Date() }],
          },
          {
            rank: 4,
            streamerId: 4,
            streamerName: "Beatriz Lima",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 176,
            change: -3,
            badges: [{ type: "trusted", earnedAt: new Date() }],
          },
          {
            rank: 5,
            streamerId: 5,
            streamerName: "Camila Oliveira",
            streamerPhoto: "https://via.placeholder.com/40",
            metric: 154,
            change: 0,
            badges: [{ type: "new", earnedAt: new Date() }],
          },
        ],
      };

      setLeaderboard(mockData[activeTab as keyof typeof mockData] || []);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case "earnings":
        return "R$";
      case "ratings":
        return "⭐";
      case "activity":
        return "chamadas";
      default:
        return "";
    }
  };

  const getMetricFormat = (value: number) => {
    switch (activeTab) {
      case "earnings":
        return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      case "ratings":
        return value.toFixed(2);
      case "activity":
        return value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🏆 Leaderboard Mensal
          </h1>
          <p className="text-gray-600 mt-2">
            Veja os melhores streamers da Flayve este mês
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle>Top Streamers</CardTitle>
            <CardDescription>
              Ranking atualizado diariamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="earnings" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ganhos
                </TabsTrigger>
                <TabsTrigger value="ratings" className="gap-2">
                  <Star className="w-4 h-4" />
                  Avaliações
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Flame className="w-4 h-4" />
                  Atividade
                </TabsTrigger>
              </TabsList>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Carregando...
                  </div>
                ) : (
                  leaderboard.map((entry) => (
                    <div
                      key={entry.streamerId}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100 hover:shadow-md transition-shadow"
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Photo */}
                      <img
                        src={entry.streamerPhoto}
                        alt={entry.streamerName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {entry.streamerName}
                        </p>
                        <div className="mt-1">
                          <StreamerBadgesCompact badges={entry.badges} />
                        </div>
                      </div>

                      {/* Metric */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-pink-600">
                          {getMetricFormat(entry.metric)}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            entry.change > 0
                              ? "text-green-600"
                              : entry.change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {entry.change > 0 ? "↑" : entry.change < 0 ? "↓" : "→"}{" "}
                          {Math.abs(entry.change)} posição
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* Ratings Tab */}
              <TabsContent value="ratings" className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Carregando...
                  </div>
                ) : (
                  leaderboard.map((entry) => (
                    <div
                      key={entry.streamerId}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow"
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Photo */}
                      <img
                        src={entry.streamerPhoto}
                        alt={entry.streamerName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {entry.streamerName}
                        </p>
                        <div className="mt-1">
                          <StreamerBadgesCompact badges={entry.badges} />
                        </div>
                      </div>

                      {/* Metric */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-lg font-bold text-yellow-600">
                            {getMetricFormat(entry.metric)}
                          </span>
                          <span className="text-yellow-500">⭐</span>
                        </div>
                        <p
                          className={`text-xs font-medium ${
                            entry.change > 0
                              ? "text-green-600"
                              : entry.change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {entry.change > 0 ? "↑" : entry.change < 0 ? "↓" : "→"}{" "}
                          {Math.abs(entry.change)} posição
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Carregando...
                  </div>
                ) : (
                  leaderboard.map((entry) => (
                    <div
                      key={entry.streamerId}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow"
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Photo */}
                      <img
                        src={entry.streamerPhoto}
                        alt={entry.streamerName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {entry.streamerName}
                        </p>
                        <div className="mt-1">
                          <StreamerBadgesCompact badges={entry.badges} />
                        </div>
                      </div>

                      {/* Metric */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-red-600">
                          {getMetricFormat(entry.metric)}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            entry.change > 0
                              ? "text-green-600"
                              : entry.change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {entry.change > 0 ? "↑" : entry.change < 0 ? "↓" : "→"}{" "}
                          {Math.abs(entry.change)} posição
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-blue-200 mt-8">
          <CardHeader>
            <CardTitle className="text-base">💡 Como aparecer no leaderboard?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              ✓ <strong>Ganhos:</strong> Quanto mais chamadas você faz, mais você ganha
            </p>
            <p>
              ✓ <strong>Avaliações:</strong> Mantenha uma taxa de avaliação alta (acima de 4.5 ⭐)
            </p>
            <p>
              ✓ <strong>Atividade:</strong> Fique online regularmente e aceite mais chamadas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
