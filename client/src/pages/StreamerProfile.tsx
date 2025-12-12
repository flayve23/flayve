import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { useEffect } from "react";
import { Video, DollarSign, ArrowLeft, Phone, Heart } from "lucide-react";
import { toast } from "sonner";

export default function StreamerProfile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const profileId = parseInt(params.id);

  const { data: balance } = trpc.wallet.getBalance.useQuery(
    undefined,
    { enabled: !!user }
  );

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const handleStartCall = () => {
    // Verificar saldo
    if (!balance || balance.balance < 199) {
      toast.error("Saldo insuficiente! Adicione créditos para fazer chamadas.");
      return;
    }

    // Redirecionar para página de chamada
    setLocation(`/call/${profileId}`);
  };

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

  // Mock data - em produção, buscar do banco
  const streamer = {
    name: "Modelo Exemplo",
    photoUrl: "https://via.placeholder.com/600x800",
    bio: "Olá! Estou aqui para proporcionar momentos especiais e conversas interessantes. Adoro conhecer pessoas novas e criar conexões autênticas.",
    pricePerMinute: 500,
    tags: ["Iniciantes", "Loiras", "Fitness"],
    isOnline: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <Button onClick={() => setLocation("/feed")} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div className="flex items-center gap-2">
            <Video className="h-6 sm:h-8 w-6 sm:w-8 text-pink-600" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Flayve
            </h1>
          </div>
          <div className="w-16 sm:w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-pink-200">
            {/* Mobile Layout: Stack vertical */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
              {/* Photo - Responsive aspect ratio */}
              <div className="relative w-full">
                <div className="aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-gray-200">
                  <img
                    src={streamer.photoUrl}
                    alt={streamer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {streamer.isOnline && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Badge className="bg-green-500 text-white text-xs sm:text-lg px-2 sm:px-4 py-1 sm:py-2">
                      ● Online
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info - Responsive padding and text sizes */}
              <CardContent className="p-4 sm:p-6 flex flex-col justify-between">
                <div className="space-y-4 sm:space-y-6">
                  {/* Name */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-pink-900">
                      {streamer.name}
                    </h1>
                  </div>

                  {/* Tags - Responsive wrapping */}
                  <div className="flex flex-wrap gap-2">
                    {streamer.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio - Responsive text size */}
                  <div>
                    <h3 className="font-semibold text-pink-900 mb-2 text-sm sm:text-base">
                      Sobre
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {streamer.bio}
                    </p>
                  </div>

                  {/* Price Box - Responsive */}
                  <div className="bg-pink-50 rounded-lg p-3 sm:p-4 border border-pink-200">
                    <div className="flex items-center justify-between">
                      <span className="text-pink-900 font-medium text-sm sm:text-base">
                        Preço por minuto:
                      </span>
                      <div className="flex items-center gap-1 text-pink-600 font-bold text-xl sm:text-2xl">
                        <DollarSign className="h-5 sm:h-6 w-5 sm:w-6" />
                        <span>R$ {(streamer.pricePerMinute / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Full width on mobile */}
                <div className="space-y-2 sm:space-y-3 mt-6 sm:mt-0">
                  <Button
                    onClick={handleStartCall}
                    disabled={!streamer.isOnline}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-base sm:text-lg py-3 sm:py-6 font-semibold"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Ligar Agora
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritar
                  </Button>

                  {/* Balance Info - Responsive text */}
                  <div className="text-center text-xs sm:text-sm text-gray-600 pt-2">
                    <p className="font-medium">
                      Seu saldo: <span className="text-pink-600 font-bold">R$ {((balance?.balance || 0) / 100).toFixed(2)}</span>
                    </p>
                    <p className="text-xs mt-1">
                      Você será cobrado por minuto durante a chamada
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
