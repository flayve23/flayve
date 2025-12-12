import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, X } from "lucide-react";

interface OnboardingWizardProps {
  userId: number;
}

export function OnboardingWizard({ userId }: OnboardingWizardProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    bio: "",
    pricePerMinute: 5.0,
    selectedTags: [] as number[],
  });

  const { data: tags } = trpc.profile.getTags.useQuery();
  const createProfile = trpc.profile.createStreamerProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil criado com sucesso!");
      setLocation("/share");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar perfil: " + error.message);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
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

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleNext = () => {
    if (step === 1 && !photoFile) {
      toast.error("Por favor, adicione uma foto de perfil");
      return;
    }
    if (step === 2 && !formData.bio) {
      toast.error("Por favor, escreva uma bio");
      return;
    }
    if (step === 3 && formData.pricePerMinute < 1.99) {
      toast.error("O preço mínimo é R$ 1,99 por minuto");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!photoFile) {
      toast.error("Foto não encontrada");
      return;
    }

    // Converter arquivo para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      createProfile.mutate({
        userId,
        photoUrl: base64,
        bio: formData.bio,
        pricePerMinute: Math.round(formData.pricePerMinute * 100),
        tagIds: formData.selectedTags,
      });
    };
    reader.readAsDataURL(photoFile);
  };

  const toggleTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Configure seu Perfil de Streamer
          </CardTitle>
          <CardDescription className="text-center">
            Passo {step} de 4 • ⏱️ Faltam ~{5 - step} minutos
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    s <= step ? "bg-pink-600" : "bg-gray-200"
                  }`}
                />
                <p className="text-xs text-center mt-1 text-gray-500">
                  {s === 1 && "Foto"}
                  {s === 2 && "Bio"}
                  {s === 3 && "Preço"}
                  {s === 4 && "Tags"}
                </p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-pink-900 mb-2">
                  Foto de Perfil
                </h3>
                <p className="text-pink-700 mb-4">
                  Adicione uma foto atraente para seu perfil
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded p-3 text-sm text-pink-800">
                  💡 <strong>Dica:</strong> Use uma foto clara do seu rosto. Streamers com fotos de qualidade recebem 3x mais chamadas!
                </div>
              </div>

              {photoPreview ? (
                <div className="space-y-3">
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover border-4 border-pink-200"
                    />
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    onClick={() => document.getElementById("photo-input")?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Trocar Foto
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("photo-input")?.click()}
                  className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center cursor-pointer hover:bg-pink-50 transition"
                >
                  <Upload className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                  <p className="text-pink-900 font-medium">
                    Clique para fazer upload
                  </p>
                  <p className="text-sm text-pink-600">
                    ou arraste uma imagem aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo 5MB • JPG, PNG
                  </p>
                </div>
              )}

              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-pink-900 mb-2">
                  Sobre Você
                </h3>
                <p className="text-pink-700 mb-4">
                  Escreva uma bio atraente para seu perfil
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded p-3 text-sm text-pink-800">
                  💡 <strong>Dica:</strong> Mencione seus interesses, experiência e o que você oferece. Bios completas aumentam conversão!
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (mínimo 5 caracteres)</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você, seus interesses e o que você oferece..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={6}
                  className={formData.bio.length < 5 ? "border-red-500" : "border-green-500"}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {formData.bio.length} caracteres
                  </p>
                  {formData.bio.length < 5 ? (
                    <p className="text-sm text-red-500">Mínimo 5 caracteres</p>
                  ) : (
                    <p className="text-sm text-green-500">Válido</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-pink-900 mb-2">
                  Defina seu Preço
                </h3>
                <p className="text-pink-700 mb-4">
                  Quanto você quer cobrar por minuto de chamada?
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded p-3 text-sm text-pink-800">
                  💡 <strong>Dica:</strong> Comece com um preço competitivo (R$ 2-5) para ganhar avaliações. Você pode aumentar depois!
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço por Minuto (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1.99"
                  step="0.50"
                  value={formData.pricePerMinute}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerMinute: parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-gray-500">
                  Mínimo: R$ 1,99 por minuto
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <p className="text-sm text-pink-900">
                  <strong>Você receberá:</strong> R${" "}
                  {(formData.pricePerMinute * 0.7).toFixed(2)} por minuto (70%)
                </p>
                <p className="text-xs text-pink-700 mt-1">
                  A plataforma retém 30% para manutenção e suporte
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-pink-900 mb-2">
                  Escolha suas Tags
                </h3>
                <p className="text-pink-700 mb-4">
                  Selecione as categorias que melhor descrevem você
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {tags?.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-pink-200 hover:bg-pink-50 cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={formData.selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <Label
                      htmlFor={`tag-${tag.id}`}
                      className="cursor-pointer flex-1"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext} className="ml-auto">
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createProfile.isPending}
                className="ml-auto bg-gradient-to-r from-pink-600 to-purple-600"
              >
                {createProfile.isPending ? (
                  "Criando..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Finalizar
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
