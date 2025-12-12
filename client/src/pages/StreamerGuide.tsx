import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play, Users, Star, TrendingUp, Shield, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function StreamerGuide() {
  const [, setLocation] = useLocation();

  const guides = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Comece Agora",
      description: "Configure seu perfil em menos de 5 minutos",
      steps: [
        "1. Adicione uma foto clara do seu rosto",
        "2. Escreva uma bio atraente (mínimo 50 caracteres)",
        "3. Defina seu preço por minuto (recomendado: R$ 2-5)",
        "4. Selecione suas categorias de interesse",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Atraia Viewers",
      description: "Dicas para ganhar mais chamadas",
      steps: [
        "✓ Use uma foto de alta qualidade e bem iluminada",
        "✓ Escreva uma bio completa com seus interesses",
        "✓ Responda rapidamente às chamadas recebidas",
        "✓ Mantenha uma taxa de aceitação alta (>80%)",
      ],
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Ganhe Avaliações",
      description: "Como construir uma reputação excelente",
      steps: [
        "✓ Seja profissional e respeitoso em todas as chamadas",
        "✓ Mantenha a câmera ligada e áudio claro",
        "✓ Cumpra o tempo de chamada acordado",
        "✓ Peça para viewers deixarem avaliações",
      ],
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Aumente sua Renda",
      description: "Estratégias para ganhar mais dinheiro",
      steps: [
        "✓ Comece com preço baixo para ganhar avaliações",
        "✓ Aumente o preço conforme sua reputação crescer",
        "✓ Ofereça pacotes de múltiplas chamadas",
        "✓ Mantenha-se online durante horários de pico",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Segurança",
      description: "Proteja-se na plataforma",
      steps: [
        "✓ Nunca compartilhe informações pessoais",
        "✓ Use a câmera apenas para chamadas na plataforma",
        "✓ Reporte comportamento inadequado imediatamente",
        "✓ Mantenha sua senha segura e única",
      ],
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Dicas Técnicas",
      description: "Qualidade de áudio e vídeo",
      steps: [
        "✓ Use uma câmera com resolução mínima de 720p",
        "✓ Teste seu microfone antes de ficar online",
        "✓ Tenha boa iluminação frontal",
        "✓ Use fone de ouvido para melhor qualidade de áudio",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => setLocation("/dashboard")}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-4"
          >
            ← Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            📚 Guia do Streamer
          </h1>
          <p className="text-gray-600 mt-2">
            Tudo que você precisa saber para ter sucesso na Flayve
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ganho Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-pink-600">R$ 500-2000</p>
              <p className="text-xs text-gray-500 mt-1">por mês (iniciantes)</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tempo de Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">~5 minutos</p>
              <p className="text-xs text-gray-500 mt-1">para começar</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Comissão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">70%</p>
              <p className="text-xs text-gray-500 mt-1">você recebe</p>
            </CardContent>
          </Card>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-pink-100">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                    {guide.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="border-pink-200 mb-8">
          <CardHeader>
            <CardTitle>❓ Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Quanto posso ganhar?
              </h4>
              <p className="text-sm text-gray-600">
                Você recebe 70% do valor cobrado por minuto. Iniciantes ganham em média R$ 500-2000/mês, 
                enquanto streamers experientes podem ganhar muito mais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Como recebo meu dinheiro?
              </h4>
              <p className="text-sm text-gray-600">
                Você pode sacar seu saldo via transferência bancária, Pix ou carteira digital. 
                Saques são processados em até 2 dias úteis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Posso rejeitar chamadas?
              </h4>
              <p className="text-sm text-gray-600">
                Sim, mas rejeitar muitas chamadas reduz sua visibilidade. Mantenha uma taxa de aceitação 
                acima de 80% para aparecer no topo dos resultados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Qual é a duração mínima de uma chamada?
              </h4>
              <p className="text-sm text-gray-600">
                A duração mínima é 1 minuto. Você será cobrado pelo tempo real da chamada, 
                arredondado para o minuto mais próximo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Pronto para começar?</h2>
          <p className="mb-6 opacity-90">
            Configure seu perfil agora e comece a ganhar dinheiro em minutos!
          </p>
          <Button
            onClick={() => setLocation("/onboarding")}
            className="bg-white text-pink-600 hover:bg-gray-100"
          >
            Ir para Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
}
