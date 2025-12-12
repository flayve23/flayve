import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
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
            Política de Privacidade
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
              1. Introdução
            </h3>
            <p className="text-gray-600 leading-relaxed">
              A Flayve ("nós", "nos", "nosso") opera o site e aplicativo Flayve. Esta página informa você sobre nossas políticas de coleta, uso e divulgação de dados pessoais quando você usa nosso serviço e as escolhas que você tem associadas a esses dados.
            </p>
          </Card>

          {/* Seção 2 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              2. Dados que Coletamos
            </h3>
            <div className="space-y-4 text-gray-600">
              <p><strong>Dados que você fornece:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nome, email, telefone, data de nascimento</li>
                <li>Senha (criptografada)</li>
                <li>Foto de perfil (para streamers)</li>
                <li>Bio e descrição (para streamers)</li>
                <li>Informações de pagamento (chave Pix)</li>
              </ul>

              <p className="mt-4"><strong>Dados coletados automaticamente:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Endereço IP</li>
                <li>Tipo de navegador e versão</li>
                <li>Páginas que você visita</li>
                <li>Hora e duração das visitas</li>
                <li>Informações do dispositivo</li>
              </ul>

              <p className="mt-4"><strong>Dados de chamadas:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Duração da chamada</li>
                <li>Data e hora</li>
                <li>Valor pago</li>
                <li>Status (aceita/rejeitada)</li>
              </ul>
            </div>
          </Card>

          {/* Seção 3 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              3. Como Usamos Seus Dados
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Usamos seus dados para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer e manter o serviço</li>
                <li>Processar transações de pagamento</li>
                <li>Enviar notificações de chamadas</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Detectar e prevenir fraude</li>
                <li>Cumprir obrigações legais (LGPD, GDPR)</li>
                <li>Enviar atualizações e comunicações (se você consentir)</li>
              </ul>
            </div>
          </Card>

          {/* Seção 4 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              4. Compartilhamento de Dados
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Nunca vendemos seus dados.</strong> Compartilhamos dados apenas quando necessário:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Mercado Pago:</strong> Para processar pagamentos (PCI-DSS compliant)
                </li>
                <li>
                  <strong>Provedores de Hospedagem:</strong> Para manter o serviço funcionando
                </li>
                <li>
                  <strong>Autoridades Legais:</strong> Se obrigados por lei
                </li>
              </ul>
            </div>
          </Card>

          {/* Seção 5 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              5. Segurança dos Dados
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Criptografia SSL/TLS em trânsito</li>
                <li>Criptografia de senhas com bcrypt</li>
                <li>Criptografia end-to-end para chamadas</li>
                <li>Firewall e proteção DDoS</li>
                <li>Backup automático e redundância geográfica</li>
                <li>Auditoria de segurança anual (ISO 27001)</li>
              </ul>
            </div>
          </Card>

          {/* Seção 6 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              6. Retenção de Dados
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>Mantemos seus dados pelo tempo necessário para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer o serviço (enquanto sua conta estiver ativa)</li>
                <li>Cumprir obrigações legais (até 5 anos para registros financeiros)</li>
                <li>Resolver disputas e investigações</li>
              </ul>
              <p className="mt-3">
                Quando você deleta sua conta, seus dados são removidos em até 30 dias (exceto registros legais obrigatórios).
              </p>
            </div>
          </Card>

          {/* Seção 7 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              7. Seus Direitos (LGPD)
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Acesso:</strong> Solicitar cópia de seus dados
                </li>
                <li>
                  <strong>Correção:</strong> Corrigir informações imprecisas
                </li>
                <li>
                  <strong>Exclusão:</strong> Deletar sua conta e dados
                </li>
                <li>
                  <strong>Portabilidade:</strong> Transferir dados para outro serviço
                </li>
                <li>
                  <strong>Consentimento:</strong> Revogar consentimento para marketing
                </li>
              </ul>
              <p className="mt-3">
                Para exercer esses direitos, envie um email para{" "}
                <a href="mailto:privacy@flayve.com" className="text-blue-600 hover:underline">
                  privacy@flayve.com
                </a>
              </p>
            </div>
          </Card>

          {/* Seção 8 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              8. Cookies
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                Usamos cookies para melhorar sua experiência. Você pode desabilitar cookies no seu navegador, mas isso pode afetar a funcionalidade do serviço.
              </p>
              <p>
                <strong>Tipos de cookies:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Essenciais:</strong> Necessários para o funcionamento
                </li>
                <li>
                  <strong>Performance:</strong> Para análise de uso
                </li>
                <li>
                  <strong>Marketing:</strong> Para publicidade personalizada (opcional)
                </li>
              </ul>
            </div>
          </Card>

          {/* Seção 9 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              9. Mudanças nesta Política
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email. Seu uso contínuo do serviço após as mudanças constitui aceitação da nova política.
            </p>
          </Card>

          {/* Seção 10 */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contato
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como lidamos com seus dados, entre em contato:
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@flayve.com" className="text-blue-600 hover:underline">
                  privacy@flayve.com
                </a>
              </p>
              <p>
                <strong>Enreço:</strong> Flayve Brasil, São Paulo, SP
              </p>
            </div>
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
