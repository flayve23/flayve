import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            Termos de Serviço
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
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e usar a Plataforma Flayve, você concorda em cumprir estes
              Termos de Serviço. Se não concordar, não use a Plataforma. Reservamo-nos
              o direito de modificar estes termos a qualquer momento.
            </p>
          </section>

          {/* Elegibilidade */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Elegibilidade
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Você deve ter no mínimo 18 anos</li>
              <li>Você deve ser residente legal no Brasil</li>
              <li>Você não pode estar banido ou suspenso da Plataforma</li>
              <li>Você deve fornecer informações precisas durante o registro</li>
              <li>Você é responsável por manter a confidencialidade da sua senha</li>
            </ul>
          </section>

          {/* Uso Aceitável */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Uso Aceitável
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você concorda em não:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Usar a Plataforma para atividades ilegais</li>
              <li>Assediar, ameaçar ou abusar de outros usuários</li>
              <li>Compartilhar conteúdo sexual explícito não consensual</li>
              <li>Tentar contornar sistemas de segurança</li>
              <li>Usar bots ou automação não autorizada</li>
              <li>Vender ou transferir sua conta</li>
              <li>Coletar dados de outros usuários sem consentimento</li>
              <li>Realizar fraude ou enganar outros usuários</li>
            </ul>
          </section>

          {/* Conteúdo do Usuário */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Conteúdo do Usuário
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você é responsável por todo conteúdo que você cria, compartilha ou
              transmite na Plataforma. Você garante que:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Você possui todos os direitos sobre o conteúdo</li>
              <li>O conteúdo não viola direitos de terceiros</li>
              <li>O conteúdo não é ilegal ou prejudicial</li>
              <li>Você concede à Flayve licença para usar o conteúdo</li>
            </ul>
          </section>

          {/* Verificação KYC */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Verificação de Identidade (KYC)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para usar certos recursos, você pode ser solicitado a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Fornecer informações pessoais verificáveis</li>
              <li>Fazer upload de documentos de identidade</li>
              <li>Completar verificação facial</li>
              <li>Fornecer informações bancárias</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Você concorda que essas informações serão usadas conforme nossa
              Política de Privacidade e regulações AML/KYC.
            </p>
          </section>

          {/* Pagamentos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Pagamentos e Saques
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Responsabilidade:</strong> Você é responsável por todos os pagamentos
              </li>
              <li>
                <strong>Taxas:</strong> Taxas podem ser aplicadas e serão informadas antes da transação
              </li>
              <li>
                <strong>Reembolsos:</strong> Reembolsos são processados conforme política específica
              </li>
              <li>
                <strong>Saques:</strong> Saques são processados em 1-3 dias úteis
              </li>
              <li>
                <strong>Limite:</strong> Limite mínimo de saque é R$ 10,00
              </li>
            </ul>
          </section>

          {/* Moderação */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Moderação e Enforcement
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Flayve pode:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Remover conteúdo que viole estes termos</li>
              <li>Suspender ou banir usuários que violem as regras</li>
              <li>Investigar atividades suspeitas</li>
              <li>Cooperar com autoridades legais</li>
            </ul>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Plataforma é fornecida "como está". Flayve não é responsável por:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Interrupções ou indisponibilidade da Plataforma</li>
              <li>Perda de dados ou danos causados por uso</li>
              <li>Comportamento de outros usuários</li>
              <li>Danos indiretos ou consequentes</li>
            </ul>
          </section>

          {/* Indenização */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Indenização
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Você concorda em indenizar e manter Flayve isenta de qualquer reclamação,
              dano ou despesa resultante de sua violação destes termos ou uso indevido
              da Plataforma.
            </p>
          </section>

          {/* Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Propriedade Intelectual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Todo conteúdo da Plataforma (design, logo, código) é propriedade de Flayve
              ou seus licenciadores. Você não pode copiar, modificar ou distribuir sem
              permissão.
            </p>
          </section>

          {/* Rescisão */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Rescisão
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Flayve pode rescindir sua conta:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Por violação destes termos</li>
              <li>Por atividade fraudulenta</li>
              <li>Por inatividade prolongada (180 dias)</li>
              <li>A qualquer momento, com aviso prévio</li>
            </ul>
          </section>

          {/* Lei Aplicável */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Lei Aplicável
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil.
              Qualquer disputa será resolvida nos tribunais brasileiros.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contato
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para dúvidas sobre estes termos:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@flayve.com
              </p>
            </div>
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
