import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Users,
  Zap,
  BarChart3,
  Gift,
} from "lucide-react";

export default function WhyJoin() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Flayve</h1>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="sm"
          >
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Título */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Por que se Juntar à Flayve?
          </h2>
          <p className="text-xl text-gray-600">
            Ganhe dinheiro fazendo o que você ama. Sem limites, sem compromissos.
          </p>
        </div>

        {/* Benefícios Principais */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Benefícios Exclusivos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefício 1 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <DollarSign className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    70% de Comissão
                  </h4>
                  <p className="text-gray-600">
                    Você fica com 70% de cada chamada. A comissão mais alta do mercado!
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefício 2 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Horário Flexível
                  </h4>
                  <p className="text-gray-600">
                    Trabalhe quando quiser. Ative/desative seu status online a qualquer momento.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefício 3 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    100% Seguro
                  </h4>
                  <p className="text-gray-600">
                    Sua privacidade é protegida. Criptografia end-to-end em todas as chamadas.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefício 4 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Crescimento Garantido
                  </h4>
                  <p className="text-gray-600">
                    Quanto melhor seu perfil, mais clientes. Sistema de recomendação inteligente.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefício 5 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Comunidade Ativa
                  </h4>
                  <p className="text-gray-600">
                    Conecte com outros streamers. Compartilhe dicas e estratégias.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefício 6 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Sem Complicações
                  </h4>
                  <p className="text-gray-600">
                    Sem contrato. Sem taxa de inscrição. Sem compromisso. Cancele quando quiser.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Sistema de Negociação */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Negocie Sua Comissão
          </h3>

          <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Comissão Base:</strong> 70% para todos os streamers
              </p>
              <p className="text-gray-700">
                <strong>Bônus de Lealdade:</strong> +2% a +5% após 100 chamadas
              </p>
              <p className="text-gray-700">
                <strong>Bônus de Referral:</strong> +3% por cada novo streamer que você indicar
              </p>
              <p className="text-gray-700">
                <strong>Bônus de Performance:</strong> +5% se você atingir 500+ minutos/mês
              </p>
              <div className="bg-white p-4 rounded-lg mt-4 border-l-4 border-pink-600">
                <p className="font-bold text-gray-900">
                  Exemplo: Com todos os bônus, você pode chegar a 85% de comissão!
                </p>
              </div>
            </div>
          </Card>

          <p className="text-center text-gray-600">
            Quer negociar uma comissão personalizada? Fale conosco!
          </p>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Antecipação de Saque */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Saque Quando Quiser
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opção 1 */}
            <Card className="p-6 border-0 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Saque Normal
              </h4>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Prazo:</strong> D+30 (30 dias após a chamada)
                </p>
                <p className="text-gray-600">
                  <strong>Taxa:</strong> Sem taxa
                </p>
                <p className="text-gray-600">
                  <strong>Limite:</strong> Até R$ 10.000/saque
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  ℹ️ O período de 30 dias protege contra chargeback e fraude.
                </p>
              </div>
            </Card>

            {/* Opção 2 */}
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-600" />
                Saque Antecipado
              </h4>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Prazo:</strong> Hoje mesmo (até 2 horas)
                </p>
                <p className="text-gray-600">
                  <strong>Taxa:</strong> 5% do valor
                </p>
                <p className="text-gray-600">
                  <strong>Limite:</strong> Até R$ 10.000/saque
                </p>
                <div className="bg-white p-3 rounded-lg mt-4 text-sm">
                  <p className="text-gray-700">
                    <strong>Exemplo:</strong> R$ 100 → R$ 95 (5% de taxa)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Projeção de Ganhos */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Quanto Você Pode Ganhar?
          </h3>

          <Card className="p-8 border-0 shadow-lg">
            <div className="space-y-6">
              {[
                {
                  title: "Iniciante (10 chamadas/mês)",
                  calc: "10 chamadas × 30 min × R$ 5/min × 70% = R$ 1.050/mês",
                },
                {
                  title: "Intermediário (50 chamadas/mês)",
                  calc: "50 chamadas × 30 min × R$ 5/min × 75% = R$ 5.625/mês",
                },
                {
                  title: "Avançado (100 chamadas/mês)",
                  calc: "100 chamadas × 30 min × R$ 5/min × 80% = R$ 12.000/mês",
                },
                {
                  title: "Profissional (200 chamadas/mês)",
                  calc: "200 chamadas × 30 min × R$ 8/min × 85% = R$ 40.800/mês",
                },
              ].map((scenario, idx) => (
                <div key={idx} className="border-l-4 border-pink-600 pl-4">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {scenario.title}
                  </h4>
                  <p className="text-gray-600 font-mono text-sm">
                    {scenario.calc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6">
              * Valores são estimativas baseadas em preço médio de R$ 5-8/min. Seus ganhos podem variar.
            </p>
          </Card>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Suporte */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Suporte Dedicado
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-0 shadow-lg text-center">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">
                Dashboard Completo
              </h4>
              <p className="text-sm text-gray-600">
                Acompanhe seus ganhos, chamadas e estatísticas em tempo real.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg text-center">
              <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">
                Recursos Grátis
              </h4>
              <p className="text-sm text-gray-600">
                Ferramentas de marketing, templates e guias para crescer.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg text-center">
              <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">
                Comunidade
              </h4>
              <p className="text-sm text-gray-600">
                Conecte com outros streamers e compartilhe estratégias.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-12 text-white text-center space-y-4">
          <h3 className="text-3xl font-bold">Pronto para Começar?</h3>
          <p className="text-lg text-pink-100">
            Cadastre-se agora e comece a ganhar em minutos
          </p>
          <Button
            onClick={() => setLocation("/signup")}
            className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-3"
            size="lg"
          >
            Cadastrar como Streamer
          </Button>
        </div>
      </div>
    </div>
  );
}
