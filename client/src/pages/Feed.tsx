import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Video, LogOut, Search, Filter, Star, Gem, Wallet } from "lucide-react";
import { toast } from "sonner";
import { CallModal } from "@/components/CallModal";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Feed() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "standard" | "premium">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedStreamerId, setSelectedStreamerId] = useState<number | null>(null);
  const [selectedStreamerName, setSelectedStreamerName] = useState<string>("");
  const [selectedStreamerPrice, setSelectedStreamerPrice] = useState<number>(199);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating">("popular");

  const { data: tags } = trpc.profile.getTags.useQuery();
  const { data: streamers } = trpc.profile.getOnlineStreamers.useQuery();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Filtrar e ordenar streamers
  const filteredStreamers = (streamers || [])
    .filter((streamer) => {
      // Filtro por preço
      const priceInReais = (streamer.profile?.pricePerMinute || 199) / 100;
      const priceMatch = (() => {
        switch (priceFilter) {
          case "budget":
            return priceInReais <= 10;
          case "standard":
            return priceInReais <= 50;
          case "premium":
            return priceInReais > 50;
          default:
            return true;
        }
      })();

      // Filtro por busca
      const userName = streamer.user?.name || "";
      const userUsername = streamer.user?.username || "";
      const searchMatch = !searchQuery || 
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userUsername.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por tags (será implementado depois com dados corretos)
      const tagsMatch = true; // selectedTags.length === 0 || true;

      return priceMatch && searchMatch && tagsMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.profile?.pricePerMinute || 199) - (b.profile?.pricePerMinute || 199);
        case "price-high":
          return (b.profile?.pricePerMinute || 199) - (a.profile?.pricePerMinute || 199);
        case "rating":
          // Ordenar por avaliação (será implementado depois)
          return 0;
        case "popular":
        default:
          // Ordenar por número de chamadas (será implementado depois)
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center mb-3 sm:mb-0">
            <div className="flex items-center gap-2">
              <Video className="h-6 sm:h-8 w-6 sm:w-8 text-pink-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Flayve
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="md:hidden"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>
        </div>

        {/* Filtros Mobile */}
        {showFilters && (
          <div className="border-t bg-white/95 px-3 sm:px-4 py-4 md:hidden">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Faixa de Preço</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "budget", label: "Até R$ 10" },
                    { value: "standard", label: "Até R$ 50" },
                    { value: "premium", label: "Premium (R$ 50+)" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={priceFilter === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriceFilter(option.value as typeof priceFilter)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filtros (Desktop) */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Filtros</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Faixa de Preço</p>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "Todos" },
                        { value: "budget", label: "Até R$ 10" },
                        { value: "standard", label: "Até R$ 50" },
                        { value: "premium", label: "Premium (R$ 50+)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={priceFilter === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPriceFilter(option.value as typeof priceFilter)}
                          className="w-full justify-start text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {tags && tags.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Categorias</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {tags.map((tag) => (
                          <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTags([...selectedTags, tag.id]);
                                } else {
                                  setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                                }
                              }}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm text-gray-700">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grid de Streamers */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Modelos Online
              </h2>
              <p className="text-gray-600">
                {filteredStreamers?.length || 0} modelos disponíveis
              </p>
            </div>

            {filteredStreamers && filteredStreamers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredStreamers.map((item) => {
                  const streamer = item.profile;
                  const streamerUser = item.user;
                  const priceInReais = (streamer?.pricePerMinute || 199) / 100;

                  return (
                    <Card
                      key={streamer?.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => setLocation(`/streamer/${streamerUser?.id}`)}
                    >
                      {/* Foto */}
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-pink-200 to-purple-200 overflow-hidden">
                        {streamer?.photoUrl ? (
                          <img
                            src={streamer.photoUrl}
                            alt={streamerUser?.name || "Streamer"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-pink-400" />
                          </div>
                        )}

                        {/* Badge Premium */}
                        {streamer?.isPremium && (
                          <div className="absolute top-2 right-2">
                            {streamer.premiumTier === "platinum" ? (
                              <Badge className="bg-purple-600 text-white flex items-center gap-1">
                                <Gem className="w-3 h-3" />
                                Platinum
                              </Badge>
                            ) : streamer.premiumTier === "gold" ? (
                              <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Gold
                              </Badge>
                            ) : null}
                          </div>
                        )}

                        {/* Status Online */}
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-green-500 text-white">🔴 Online</Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                          {streamerUser?.name || "Streamer"}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">(150)</span>
                        </div>

                        {/* Preço */}
                        <div className="mb-4">
                          <p className={`text-2xl font-bold ${streamer?.isPremium && streamer.premiumTier === "platinum" ? "text-purple-600" : "text-pink-600"}`}>
                            R$ {priceInReais.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">por minuto</p>
                        </div>

                        {/* CTA */}
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              setSelectedStreamerId(streamer.userId);
                              setSelectedStreamerName(streamerUser?.name || "Modelo");
                              setSelectedStreamerPrice(streamer.pricePerMinute || 199);
                              setCallModalOpen(true);
                            }}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                          >
                            Ligar Agora
                          </Button>
                          <Button
                            onClick={() => setLocation("/viewer-dashboard")}
                            variant="outline"
                            className="w-full gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            Adicionar Saldo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma modelo disponível
                </h3>
                <p className="text-gray-600">
                  Tente ajustar seus filtros
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {selectedStreamerId && (
        <CallModal
          open={callModalOpen}
          onOpenChange={setCallModalOpen}
          streamerId={selectedStreamerId}
          streamerName={selectedStreamerName}
          streamerPrice={selectedStreamerPrice}
        />
      )}
    </div>
  );
}
