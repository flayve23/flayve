import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Video, Search, CreditCard, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ViewerOnboarding() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

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

  const handleSkip = () => {
    setLocation("/feed");
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Bem-vindo ao Flayve!");
      setLocation("/feed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-pink-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo ao Flayve
            </h1>
          </div>
          <p className="text-gray-600">
            Aprenda como usar a plataforma em 3 passos rápidos
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-pink-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Browse */}
        {step === 1 && (
          <Card className="border-2 border-pink-200">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-600 text-white">
                    <Search className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">Passo 1: Navegue pelo Feed</CardTitle>
                  <CardDescription>
                    Descubra modelos online e filtros por categoria
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-8 text-center">
                <Search className="h-16 w-16 text-pink-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-medium mb-2">
                  Explore modelos online em tempo real
                </p>
                <p className="text-sm text-gray-600">
                  Use os filtros para encontrar exatamente o que você procura
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Filtros por Tags</p>
                    <p className="text-sm text-gray-600">
                      Procure por categorias como Iniciantes, Maduras, Trans, etc.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Status Online</p>
                    <p className="text-sm text-gray-600">
                      Veja quem está disponível agora mesmo
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Perfis Detalhados</p>
                    <p className="text-sm text-gray-600">
                      Veja foto, bio e preço de cada modelo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Credits */}
        {step === 2 && (
          <Card className="border-2 border-pink-200">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-600 text-white">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">Passo 2: Adicione Créditos</CardTitle>
                  <CardDescription>
                    Recarregue sua carteira para fazer chamadas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8 text-center">
                <CreditCard className="h-16 w-16 text-green-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-medium mb-2">
                  Múltiplas formas de pagamento
                </p>
                <p className="text-sm text-gray-600">
                  Pix, Cartão de Crédito, Débito
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Pix Instantâneo</p>
                    <p className="text-sm text-gray-600">
                      Créditos aparecem na hora
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Seguro</p>
                    <p className="text-sm text-gray-600">
                      Seus dados são criptografados
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Sem Compromisso</p>
                    <p className="text-sm text-gray-600">
                      Use quando quiser, créditos não expiram
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Dica:</strong> Comece com R$ 50 para testar a plataforma
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Start Calling */}
        {step === 3 && (
          <Card className="border-2 border-pink-200">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-600 text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">Passo 3: Inicie uma Chamada</CardTitle>
                  <CardDescription>
                    Conecte-se com modelos em tempo real
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 text-center">
                <Phone className="h-16 w-16 text-purple-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-medium mb-2">
                  Chamadas privadas 1-para-1
                </p>
                <p className="text-sm text-gray-600">
                  Você é cobrado por minuto
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Privacidade Total</p>
                    <p className="text-sm text-gray-600">
                      Chamadas 1-para-1, sem gravação
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Controle Total</p>
                    <p className="text-sm text-gray-600">
                      Você pode encerrar a qualquer momento
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Transparência</p>
                    <p className="text-sm text-gray-600">
                      Veja o custo em tempo real
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  ⚠️ <strong>Importante:</strong> Sua chamada será encerrada automaticamente se o saldo acabar
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
          >
            Pular Tutorial
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
          >
            {step === 3 ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Começar
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
