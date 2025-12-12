import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Política de Privacidade
          </h1>
          <p className="text-gray-600">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introdução
            </h2>
            <p className="text-gray-700 leading-relaxed">
              A Flayve ("Plataforma") respeita sua privacidade e está comprometida
              em proteger seus dados pessoais. Esta Política de Privacidade descreve
              como coletamos, usamos, compartilhamos e protegemos suas informações
              de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          {/* Dados Coletados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Dados que Coletamos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dados de Identificação
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nome completo</li>
                  <li>Email</li>
                  <li>Telefone</li>
                  <li>Data de nascimento</li>
                  <li>CPF (para verificação KYC)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dados Bancários (Criptografados)
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Número de agência</li>
                  <li>Número de conta</li>
                  <li>Tipo de conta</li>
                  <li>Titular da conta</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dados de Uso
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Histórico de chamadas</li>
                  <li>Transações e pagamentos</li>
                  <li>Endereço IP</li>
                  <li>Tipo de navegador</li>
                  <li>Páginas visitadas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dados de Verificação (KYC)
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Documentos de identidade (foto)</li>
                  <li>Comprovante de endereço</li>
                  <li>Selfie para verificação facial</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Base Legal */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Base Legal para Processamento
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Processamos seus dados com base nas seguintes justificativas legais (Art. 7º LGPD):
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Consentimento:</strong> Você consentiu explicitamente ao usar a Plataforma
              </li>
              <li>
                <strong>Cumprimento de Obrigação Legal:</strong> Verificação KYC conforme regulações de AML/KYC
              </li>
              <li>
                <strong>Execução de Contrato:</strong> Processamento necessário para fornecer serviços
              </li>
              <li>
                <strong>Proteção de Direitos:</strong> Prevenção de fraude e segurança da Plataforma
              </li>
            </ul>
          </section>

          {/* Uso de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Como Usamos Seus Dados
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Criar e manter sua conta</li>
              <li>Processar pagamentos e saques</li>
              <li>Verificação de identidade (KYC)</li>
              <li>Prevenir fraude e abuso</li>
              <li>Melhorar a Plataforma</li>
              <li>Enviar notificações importantes</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Compartilhamos dados apenas com:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Provedores de Pagamento:</strong> Stripe, Mercado Pago (dados de transação)
              </li>
              <li>
                <strong>Autoridades Legais:</strong> Quando exigido por lei
              </li>
              <li>
                <strong>Prestadores de Serviço:</strong> Hospedagem, email, analytics
              </li>
              <li>
                <strong>Nunca:</strong> Dados bancários não são compartilhados com terceiros
              </li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Segurança de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas de segurança robustas:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Criptografia AES-256 para dados bancários</li>
              <li>HTTPS/TLS para todas as comunicações</li>
              <li>Autenticação OAuth com Manus</li>
              <li>Rate limiting para prevenir ataques</li>
              <li>Validação e sanitização de inputs</li>
              <li>Backups automáticos e criptografados</li>
            </ul>
          </section>

          {/* Direitos do Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Acesso:</strong> Solicitar cópia de seus dados
              </li>
              <li>
                <strong>Retificação:</strong> Corrigir dados incorretos
              </li>
              <li>
                <strong>Exclusão:</strong> Solicitar apagamento de dados (direito ao esquecimento)
              </li>
              <li>
                <strong>Portabilidade:</strong> Receber dados em formato estruturado
              </li>
              <li>
                <strong>Oposição:</strong> Recusar processamento de dados
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para exercer esses direitos, entre em contato: privacy@flayve.com
            </p>
          </section>

          {/* Retenção */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Retenção de Dados
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Dados de Conta:</strong> Mantidos enquanto a conta estiver ativa
              </li>
              <li>
                <strong>Dados KYC:</strong> Retidos por 5 anos conforme regulações AML
              </li>
              <li>
                <strong>Dados de Transação:</strong> Retidos por 10 anos conforme lei fiscal
              </li>
              <li>
                <strong>Logs de Segurança:</strong> Retidos por 90 dias
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Cookies e Rastreamento
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Usamos cookies para autenticação e melhorar a experiência. Você pode
              desabilitar cookies no seu navegador, mas isso pode afetar a funcionalidade
              da Plataforma.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contato
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para dúvidas sobre esta política ou para exercer seus direitos:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@flayve.com
              </p>
              <p className="text-gray-700">
                <strong>Encarregado de Dados (DPO):</strong> dpo@flayve.com
              </p>
            </div>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Alterações nesta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos você
              sobre mudanças significativas via email ou na Plataforma.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  );
}
