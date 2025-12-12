import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Video, LogOut, Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function ShareProfile() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const { data: profile } = trpc.profile.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
    if (!loading && profile && profile.userType !== "streamer") {
      setLocation("/dashboard");
    }
  }, [user, loading, profile, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const shareUrl = `${window.location.origin}/streamer/${profile.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `Olá! Venha fazer uma chamada comigo no Flayve! 🎥\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = `Estou disponível para chamadas de vídeo no Flayve! Venha me conhecer 🎥`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Video className="h-8 w-8 text-pink-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Flayve
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setLocation("/dashboard")} variant="outline" size="sm">
              Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Share Card */}
          <Card className="border-2 border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Share2 className="h-6 w-6 text-pink-600" />
                Compartilhe seu Perfil
              </CardTitle>
              <CardDescription>
                Envie este link para seus clientes acessarem seu perfil e iniciarem chamadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Share Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-pink-900">
                  Seu Link Compartilhável
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="bg-gray-50 border-pink-200"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="default"
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Este link é único e permanente. Compartilhe-o com seus clientes!
                </p>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-pink-900 block">
                  Compartilhar em Redes Sociais
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                  >
                    📱 WhatsApp
                  </Button>
                  <Button
                    onClick={handleShareTwitter}
                    variant="outline"
                    className="border-blue-500 text-blue-700 hover:bg-blue-50"
                  >
                    𝕏 Twitter
                  </Button>
                  <Button
                    onClick={() => {
                      const text = `Confira meu perfil no Flayve: ${shareUrl}`;
                      window.open(
                        `https://www.instagram.com/`,
                        "_blank"
                      );
                      toast.info("Cole o link na sua bio do Instagram!");
                    }}
                    variant="outline"
                    className="border-pink-500 text-pink-700 hover:bg-pink-50"
                  >
                    📸 Instagram
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <h3 className="font-semibold text-pink-900 mb-3">
                  Código QR
                </h3>
                <p className="text-sm text-pink-700 mb-4">
                  Gere um código QR para seus clientes escanearem:
                </p>
                <Button
                  onClick={() => {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
                    window.open(qrUrl, "_blank");
                    toast.success("Código QR aberto em nova aba!");
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600"
                >
                  Gerar Código QR
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pink-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">-</p>
                  <p className="text-xs text-gray-500">Visualizações</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">-</p>
                  <p className="text-xs text-gray-500">Chamadas Iniciadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Dicas para Aumentar Vendas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-pink-900">Compartilhe em suas redes sociais</p>
                  <p className="text-sm text-gray-600">
                    Use o link em sua bio do Instagram, Twitter e WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-pink-900">Use o código QR em anúncios</p>
                  <p className="text-sm text-gray-600">
                    Imprima ou compartilhe o código QR para fácil acesso
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-pink-900">Mantenha seu perfil atualizado</p>
                  <p className="text-sm text-gray-600">
                    Atualize sua foto, bio e preço regularmente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
