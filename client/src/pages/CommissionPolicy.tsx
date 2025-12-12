import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Clock, AlertCircle, DollarSign } from "lucide-react";

export default function CommissionPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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

      <div className="container mx-auto px-4 py-12 space-y-16 max-w-4xl">
        {/* Título */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Política de Comissão
          </h2>
          <p className="text-xl text-gray-600">
            Transparência total. Sem surpresas. Sem taxas escondidas.
          </p>
        </div>

        {/* Comissão Base */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900">Comissão Base</h3>

          <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-green-600">70%</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Para Todos os Streamers
                  </p>
                  <p className="text-gray-600">
                    Sem exceção. Desde o primeiro dia.
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Exemplo:</strong> Uma chamada de 30 minutos a R$ 5/min = R$ 150
                </p>
                <p className="text-gray-700 mt-2">
                  Você recebe: R$ 150 × 70% = <strong>R$ 105</strong>
                </p>
                <p className="text-gray-600 mt-2">
                  Flayve fica com: R$ 150 × 30% = R$ 45
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Saques */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900">
            Como Funciona os Saques
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saque Normal */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Saque Padrão (D+30)
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Sem taxa. Processado em 30 dias.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      ✓ <strong>Taxa:</strong> 0%
                    </li>
                    <li>
                      ✓ <strong>Prazo:</strong> D+30 (30 dias)
                    </li>
                    <li>
                      ✓ <strong>Limite:</strong> Até R$ 10.000
                    </li>
                    <li>
                      ✓ <strong>Frequência:</strong> Até 3 saques/dia
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Saque Antecipado */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <DollarSign className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Saque Antecipado
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Receba antes com taxa de 5%.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      ⚡ <strong>Taxa:</strong> 5% ENCIMA
                    </li>
                    <li>
                      ⚡ <strong>Exemplo:</strong> R$ 100 → R$ 105
                    </li>
                    <li>
                      ⚡ <strong>Prazo:</strong> Até 2 horas
                    </li>
                    <li>
                      ⚡ <strong>Limite:</strong> Até R$ 10.000
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Informações Importantes */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900">
            Informações Importantes
          </h3>

          <Card className="p-6 border-l-4 border-blue-600 bg-blue-50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Quando o Dinheiro Fica Disponível?
                </h4>
                <p className="text-gray-700">
                  Seus ganhos ficam disponíveis para saque 30 dias após cada chamada. Você pode solicitar saque antecipado pagando 5% de taxa.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-green-600 bg-green-50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Verificação de Identidade (KYC)
                </h4>
                <p className="text-gray-700">
                  Para sacar, você precisa completar a verificação de identidade. Isso leva alguns minutos e garante a segurança de todos.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-purple-600 bg-purple-50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Métodos de Saque
                </h4>
                <p className="text-gray-700">
                  Você pode sacar via PIX (instantâneo) ou transferência bancária. Escolha o método que preferir no seu dashboard.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <Button
            onClick={() => setLocation("/")}
            size="lg"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  );
}
