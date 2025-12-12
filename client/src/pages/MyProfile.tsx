import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StreamerProfileModal } from "@/components/StreamerProfileModal";
import { trpc } from "@/lib/trpc";
import { Copy, Edit, Share2 } from "lucide-react";

export default function MyProfile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: profile } = trpc.streamerProfile.getProfile.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user && user.role === "streamer" }
  );

  // Redirect non-streamers using useEffect (not during render)
  useEffect(() => {
    if (!loading && (!user || user.role !== "streamer")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "streamer") {
    return null;
  }

  const shareUrl = `${window.location.origin}?ref=${user.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Flayve",
          text: "Vem chamar comigo no Flayve!",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-900">Meu Perfil</h1>
          <p className="text-pink-700 mt-2">Gerencie suas informações e compartilhe seu link</p>
        </div>

        {/* Profile Card */}
        <Card className="border-2 border-pink-200 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
            <CardTitle className="text-pink-900">Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Foto */}
            {profile?.photoUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={profile.photoUrl}
                  alt="Perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-300"
                />
              </div>
            )}

            {/* Bio */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Bio</label>
              <p className="text-gray-600 mt-1">{profile?.bio || "Nenhuma bio adicionada"}</p>
            </div>

            {/* Sobre */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Sobre</label>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                {profile?.about || "Nenhuma descrição adicionada"}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setShowEditModal(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold h-12 sm:h-10 text-base sm:text-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Share Link Card */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-purple-900">Compartilhar Link</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-gray-600 text-sm">
              Compartilhe este link com clientes para que eles criem conta e te chamem:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-purple-300 rounded-md bg-purple-50 text-sm font-mono"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-purple-600 hover:bg-purple-700 text-white h-10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {copied && (
              <p className="text-green-600 text-sm font-semibold">✓ Link copiado!</p>
            )}

            {/* Share Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-10"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
              <Button
                onClick={() => {
                  const text = `Vem chamar comigo no Flayve! ${shareUrl}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-sm h-10"
              >
                <Share2 className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  const text = `Vem chamar comigo no Flayve! ${shareUrl}`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    "_blank"
                  );
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white text-sm h-10"
              >
                <Share2 className="w-4 h-4 mr-1" />
                X/Twitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <StreamerProfileModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={() => {
          // Refresh profile data
          window.location.reload();
        }}
      />
    </div>
  );
}
