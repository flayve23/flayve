import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Shield,
  Lock,
  Eye,
  CheckCircle,
  AlertCircle,
  Key,
  Database,
} from "lucide-react";

export default function Security() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
            Segurança e Privacidade
          </h2>
          <p className="text-xl text-gray-600">
            Seus dados e privacidade são nossa prioridade máxima
          </p>
        </div>

        {/* Pilares de Segurança */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-900">
            Nossos Pilares de Segurança
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilar 1 */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Criptografia End-to-End
                  </h4>
                  <p className="text-gray-600">
                    Todas as chamadas de vídeo são criptografadas. Nem mesmo nós conseguimos ver ou ouvir suas conversas.
                  </p>
                </div>
              </div>
            </Card>

            {/* Pilar 2 */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Key className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Autenticação Forte
                  </h4>
                  <p className="text-gray-600">
                    Verificação de email obrigatória, senhas criptografadas, proteção contra força bruta.
                  </p>
                </div>
              </div>
            </Card>

            {/* Pilar 3 */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Database className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Dados Protegidos
                  </h4>
                  <p className="text-gray-600">
                    Backup automático, redundância geográfica, conformidade com LGPD e GDPR.
                  </p>
                </div>
              </div>
            </Card>

            {/* Pilar 4 */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Proteção contra Fraude
                  </h4>
                  <p className="text-gray-600">
                    Detecção de atividades suspeitas, limite de saques diários, período D+30 contra chargeback.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* O que Coletamos */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900">
            Dados que Coletamos
          </h3>

          <div className="space-y-4">
            {[
              {
                title: "Informações de Conta",
                items: [
                  "Nome, email, telefone",
                  "Data de nascimento (para verificação)",
                  "Senha (criptografada)",
                ],
              },
              {
                title: "Informações de Pagamento",
                items: [
                  "Chave Pix (CPF, email ou telefone)",
                  "Histórico de transações",
                  "Saldo de conta",
                ],
              },
              {
                title: "Informações de Perfil (Streamers)",
                items: [
                  "Foto de perfil",
                  "Bio e descrição",
                  "Preço por minuto",
                  "Status online/offline",
                ],
              },
              {
                title: "Dados de Uso",
                items: [
                  "Histórico de chamadas",
                  "Duração das chamadas",
                  "IP e dispositivo (para segurança)",
                  "Logs de acesso",
                ],
              },
            ].map((section, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  {section.title}
                </h4>
                <ul className="space-y-2 ml-7">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* O que NÃO Coletamos */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900">
            O que NÃO Coletamos
          </h3>

          <Card className="p-8 border-0 shadow-lg bg-green-50 border-l-4 border-green-600">
            <div className="space-y-3">
              <p className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Conteúdo de Vídeo:</strong> Não armazenamos gravações de chamadas. Tudo é em tempo real e descartado após o término.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Dados de Cartão:</strong> Nunca armazenamos dados de cartão. Processamos via Mercado Pago (PCI-DSS).
                </span>
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Biometria:</strong> Não coletamos dados biométricos ou reconhecimento facial.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Localização Precisa:</strong> Não rastreamos sua localização em tempo real.
                </span>
              </p>
            </div>
          </Card>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Conformidade Legal */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900">
            Conformidade Legal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "LGPD (Brasil)",
                desc: "Lei Geral de Proteção de Dados. Você tem direito a acessar, corrigir e deletar seus dados.",
              },
              {
                title: "GDPR (Europa)",
                desc: "General Data Protection Regulation. Conformidade total com regulamentações europeias.",
              },
              {
                title: "PCI-DSS",
                desc: "Padrão de Segurança de Dados do Setor de Cartões. Pagamentos seguros garantidos.",
              },
              {
                title: "ISO 27001",
                desc: "Certificação de Segurança da Informação. Auditoria anual de segurança.",
              },
            ].map((cert, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">{cert.title}</h4>
                <p className="text-gray-600">{cert.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Seus Direitos */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900">
            Seus Direitos
          </h3>

          <div className="space-y-4">
            {[
              {
                icon: Eye,
                title: "Direito de Acesso",
                desc: "Você pode solicitar uma cópia de todos os seus dados a qualquer momento.",
              },
              {
                icon: AlertCircle,
                title: "Direito de Correção",
                desc: "Você pode corrigir informações incorretas no seu perfil.",
              },
              {
                icon: Lock,
                title: "Direito de Exclusão",
                desc: "Você pode deletar sua conta e todos os dados associados (exceto registros legais).",
              },
              {
                icon: Shield,
                title: "Direito de Portabilidade",
                desc: "Você pode solicitar seus dados em formato portável para transferir para outro serviço.",
              },
            ].map((right, idx) => {
              const Icon = right.icon;
              return (
                <Card key={idx} className="p-6 border-0 shadow-lg">
                  <div className="flex items-start gap-4">
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {right.title}
                      </h4>
                      <p className="text-gray-600">{right.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Contato */}
        <section className="space-y-8 max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900">
            Dúvidas sobre Segurança?
          </h3>
          <p className="text-lg text-gray-600">
            Entre em contato conosco. Respondemos em até 24 horas.
          </p>
          <Button
            onClick={() => setLocation("/contact")}
            className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-3"
            size="lg"
          >
            Fale Conosco
          </Button>
        </section>
      </div>
    </div>
  );
}
