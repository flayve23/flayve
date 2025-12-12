import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Users,
  Video,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function HowItWorks() {
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
            Como Funciona a Flayve
          </h2>
          <p className="text-xl text-gray-600">
            Conectando streamers e clientes para conversas privadas em tempo real
          </p>
        </div>

        {/* Para Streamers */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-pink-600" />
            <h3 className="text-3xl font-bold text-gray-900">Para Streamers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Passo 1 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Crie sua Conta
                  </h4>
                  <p className="text-gray-600">
                    Cadastre-se como streamer, complete seu perfil com foto, bio e preço por minuto.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 2 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Fique Online
                  </h4>
                  <p className="text-gray-600">
                    Ative seu status online no dashboard e comece a receber chamadas de clientes.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 3 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Atenda Chamadas
                  </h4>
                  <p className="text-gray-600">
                    Receba notificações em tempo real quando clientes querem chamar. Aceite ou rejeite.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 4 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600">4</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Ganhe Dinheiro
                  </h4>
                  <p className="text-gray-600">
                    Receba 70% do valor de cada chamada. Saque via Pix em D+30 ou antecipe com 5% de taxa.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA para Streamers */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-white text-center">
            <h4 className="text-2xl font-bold mb-4">Pronto para começar a ganhar?</h4>
            <Button
              onClick={() => setLocation("/signup")}
              className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-3"
              size="lg"
            >
              Cadastrar como Streamer
            </Button>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Para Clientes */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-blue-600" />
            <h3 className="text-3xl font-bold text-gray-900">Para Clientes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Passo 1 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Crie sua Conta
                  </h4>
                  <p className="text-gray-600">
                    Cadastre-se como cliente e faça verificação de email para segurança.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 2 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Adicione Créditos
                  </h4>
                  <p className="text-gray-600">
                    Adicione saldo via Pix ou cartão. Sem taxa, sem surpresas. Seu dinheiro fica seguro.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 3 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Escolha um Streamer
                  </h4>
                  <p className="text-gray-600">
                    Navegue pelo feed, veja perfis, bio e preço por minuto. Escolha quem quer chamar.
                  </p>
                </div>
              </div>
            </Card>

            {/* Passo 4 */}
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Faça a Chamada
                  </h4>
                  <p className="text-gray-600">
                    Clique em "Ligar Agora". Se aceita, vocês entram em vídeo privado em tempo real.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA para Clientes */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-8 text-white text-center">
            <h4 className="text-2xl font-bold mb-4">Quer chamar agora?</h4>
            <Button
              onClick={() => setLocation("/signup")}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
              size="lg"
            >
              Cadastrar como Cliente
            </Button>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Recursos Principais */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Recursos Principais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recurso 1 */}
            <Card className="p-6 border-0 shadow-lg text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                100% Seguro
              </h4>
              <p className="text-gray-600">
                Criptografia end-to-end, verificação de identidade, proteção de dados LGPD.
              </p>
            </Card>

            {/* Recurso 2 */}
            <Card className="p-6 border-0 shadow-lg text-center">
              <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Tempo Real
              </h4>
              <p className="text-gray-600">
                Notificações instantâneas, vídeo em HD, sem latência. Experiência fluida.
              </p>
            </Card>

            {/* Recurso 3 */}
            <Card className="p-6 border-0 shadow-lg text-center">
              <DollarSign className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Pagamentos Justos
              </h4>
              <p className="text-gray-600">
                70% para streamers, 30% para Flayve. Sem taxas escondidas. Transparência total.
              </p>
            </Card>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Perguntas Frequentes */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Perguntas Frequentes
          </h3>

          <div className="space-y-4">
            {[
              {
                q: "Quanto tempo leva para receber o dinheiro?",
                a: "Saques são processados em D+30 (30 dias após a chamada) para proteger contra chargeback. Você pode antecipar com taxa de 5%.",
              },
              {
                q: "É seguro compartilhar meu Pix?",
                a: "Sim! Seu Pix é criptografado e armazenado com segurança. Nós nunca compartilhamos seus dados com terceiros.",
              },
              {
                q: "Posso mudar meu preço por minuto?",
                a: "Sim! Streamers podem ajustar o preço a qualquer momento no dashboard.",
              },
              {
                q: "Como funciona a antecipação de saque?",
                a: "Você pode sacar antes de D+30 pagando uma taxa de 5%. Exemplo: R$ 100 vira R$ 95.",
              },
            ].map((faq, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-gray-600 ml-7">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-12 text-white text-center space-y-4">
          <h3 className="text-3xl font-bold">Pronto para começar?</h3>
          <p className="text-lg text-gray-300">
            Junte-se a milhares de streamers e clientes na Flayve
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => setLocation("/signup")}
              className="bg-pink-600 hover:bg-pink-700 font-semibold px-8 py-3"
              size="lg"
            >
              Cadastrar Agora
            </Button>
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3"
              size="lg"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
