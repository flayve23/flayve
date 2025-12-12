import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload } from "lucide-react";

interface StreamerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StreamerProfileModal({ open, onOpenChange, onSuccess }: StreamerProfileModalProps) {
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateProfileMutation = trpc.streamerProfile.updateProfile.useMutation({
    onSuccess: () => {
      setLoading(false);
      onOpenChange(false);
      setBio("");
      setAbout("");
      setPhotoFile(null);
      setPhotoPreview("");
      onSuccess?.();
    },
    onError: (err: any) => {
      setError(err.message || "Erro ao atualizar perfil");
      setLoading(false);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let photoUrl = "";
      
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da foto');
        }
        
        const { url } = await uploadResponse.json();
        photoUrl = url;
      }
      
      await updateProfileMutation.mutateAsync({
        bio: bio || undefined,
        about: about || undefined,
        photoUrl: photoUrl || undefined,
      });
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-pink-900">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Photo Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Foto de Perfil
            </label>
            
            {photoPreview && (
              <div className="mb-3 flex justify-center">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-pink-300"
                />
              </div>
            )}
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={loading}
                className="hidden"
                id="photo-input"
              />
              <label
                htmlFor="photo-input"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-pink-300 rounded-md cursor-pointer hover:bg-pink-50 transition"
              >
                <Upload className="w-4 h-4 text-pink-600" />
                <span className="text-sm text-pink-600 font-medium">
                  {photoFile ? photoFile.name : "Clique para fazer upload"}
                </span>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">Máximo 5MB • JPG, PNG</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Bio (Descrição Curta)
            </label>
            <Input
              type="text"
              placeholder="Ex: Modelo experiente, 25 anos"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
              maxLength={100}
              className="border-pink-200 focus:border-pink-600"
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/100</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Sobre (Descrição Longa)
            </label>
            <textarea
              placeholder="Conte mais sobre você, seus interesses, especialidades..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={loading}
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:border-pink-600 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">{about.length}/500</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Perfil"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
