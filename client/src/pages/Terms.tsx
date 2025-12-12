import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Título */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Termos de Serviço
          </h2>
          <p className="text-gray-600">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* Seção 1 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              1. Aceitação dos Termos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar e usar a plataforma Flayve, você concorda em cumprir estes Termos de Serviço e todas as leis e regulamentações aplicáveis. Se você não concordar com qualquer parte destes termos, você não poderá usar o serviço.
            </p>
          </Card>

          {/* Seção 2 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              2. Elegibilidade
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Para usar a Flayve, você deve:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Ter capacidade legal para celebrar contratos</li>
                <li>Não estar em jurisdição onde o serviço é proibido</li>
                <li>Fornecer informações precisas e atualizadas</li>
              </ul>
            </div>
          </Card>

          {/* Seção 3 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              3. Contas de Usuário
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notificar-nos imediatamente de qualquer acesso não autorizado</li>
                <li>Não compartilhar sua senha com terceiros</li>
                <li>Não usar contas de outras pessoas</li>
                <li>Não criar múltiplas contas para contornar limitações</li>
              </ul>
            </div>
          </Card>

          {/* Seção 4 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              4. Conduta Proibida
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Você não pode:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Usar a plataforma para atividades ilegais</li>
                <li>Assediar, ameaçar ou abusar de outros usuários</li>
                <li>Compartilhar conteúdo sexual envolvendo menores</li>
                <li>Tentar contornar medidas de segurança</li>
                <li>Usar bots ou automação não autorizada</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
                <li>Fazer fraude ou enganar outros usuários</li>
              </ul>
            </div>
          </Card>

          {/* Seção 5 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              5. Política de Pagamento
            </h3>
            <div className="space-y-3 text-gray-600">
              <p><strong>Para Streamers:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você recebe 70% do valor de cada chamada</li>
                <li>Saques são processados em D+30 para proteção contra chargeback</li>
                <li>Você pode antecipar saques pagando taxa de 5%</li>
                <li>Limite máximo de R$ 10.000 por saque</li>
                <li>Máximo 3 saques por dia</li>
              </ul>
              <p className="mt-4"><strong>Para Clientes:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você paga pelo tempo de chamada (preço definido pelo streamer)</li>
                <li>Créditos não utilizados são reembolsáveis</li>
                <li>Sem taxas escondidas</li>
              </ul>
            </div>
          </Card>

          {/* Seção 6 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              6. Propriedade Intelectual
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo da Flayve (logo, design, código) é propriedade nossa. Você concede à Flayve uma licença para usar sua foto de perfil e bio para fins de marketing, a menos que você opte por não participar.
            </p>
          </Card>

          {/* Seção 7 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              7. Isenção de Responsabilidade
            </h3>
            <p className="text-gray-600 leading-relaxed">
              A Flayve é fornecida "como está" sem garantias de qualquer tipo. Não somos responsáveis por:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3 text-gray-600">
              <li>Interrupções de serviço ou perda de dados</li>
              <li>Comportamento de outros usuários</li>
              <li>Danos diretos ou indiretos resultantes do uso</li>
              <li>Falhas técnicas fora do nosso controle</li>
            </ul>
          </Card>

          {/* Seção 8 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitação de Responsabilidade
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nossa responsabilidade total por qualquer reclamação não excederá o valor que você pagou nos últimos 12 meses. Em nenhum caso seremos responsáveis por danos consequenciais, incidentais ou punitivos.
            </p>
          </Card>

          {/* Seção 9 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              9. Encerramento
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Podemos encerrar sua conta a qualquer momento se você violar estes termos. Você pode deletar sua conta a qualquer momento através das configurações. Após a exclusão, seus dados serão removidos conforme LGPD.
            </p>
          </Card>

          {/* Seção 10 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              10. Modificações dos Termos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Podemos modificar estes termos a qualquer momento. Notificaremos você por email sobre mudanças significativas. Seu uso contínuo da plataforma após as mudanças constitui aceitação dos novos termos.
            </p>
          </Card>

          {/* Seção 11 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              11. Lei Aplicável
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
            </p>
          </Card>

          {/* Seção 12 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contato
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco em{" "}
              <a href="mailto:legal@flayve.com" className="text-blue-600 hover:underline">
                legal@flayve.com
              </a>
            </p>
          </Card>
        </div>

        {/* Rodapé */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => setLocation("/")}
            className="bg-gray-900 hover:bg-gray-800 font-semibold px-8 py-3"
            size="lg"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
}
