import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [, setLocation] = useLocation();
  const [expandedIdx, setExpandedIdx] = useState<string | null>(null);

  const faqs = [
    {
      category: "Para Streamers",
      questions: [
        {
          q: "Como faço para me cadastrar como streamer?",
          a: "Clique em 'Cadastrar' na página inicial, escolha 'Streamer', preencha seus dados e faça verificação de email. Pronto! Você pode começar a receber chamadas.",
        },
        {
          q: "Qual é a comissão que recebo?",
          a: "Você recebe 70% de cada chamada. Saques disponíveis em D+30 ou com antecipação pagando 5% de taxa.",
        },
        {
          q: "Quando posso sacar meu dinheiro?",
          a: "Saques são processados em D+30 (30 dias após a chamada) sem taxa. Você pode antecipar pagando 5% de taxa.",
        },
        {
          q: "Qual é o limite de saque?",
          a: "Máximo R$ 10.000 por saque, com limite de 3 saques por dia.",
        },
        {
          q: "Como funciona a antecipação de saque?",
          a: "Se você quiser sacar antes de D+30, paga 5% ENCIMA do valor. Exemplo: R$ 100 vira R$ 105. O dinheiro cai em até 2 horas.",
        },
        {
          q: "Posso mudar meu preço por minuto?",
          a: "Sim! Você pode ajustar o preço a qualquer momento no seu dashboard. A mudança vale para novas chamadas.",
        },
        {
          q: "O que acontece se um cliente não pagar?",
          a: "Não se preocupe! Você só recebe chamadas de clientes que já adicionaram créditos. Pagamento é garantido.",
        },
        {
          q: "Posso recusar uma chamada?",
          a: "Sim, você pode aceitar ou rejeitar chamadas. Não há penalidade por rejeitar.",
        },
      ],
    },
    {
      category: "Para Clientes",
      questions: [
        {
          q: "Como faço para me cadastrar como cliente?",
          a: "Clique em 'Cadastrar' na página inicial, escolha 'Cliente', preencha seus dados e faça verificação de email.",
        },
        {
          q: "Como adiciono créditos?",
          a: "Vá para 'Adicionar Saldo' no seu dashboard. Escolha o valor (mínimo R$ 100) e pague via Pix ou cartão.",
        },
        {
          q: "Qual é o preço de uma chamada?",
          a: "O preço varia por streamer. Cada um define seu próprio preço por minuto (geralmente R$ 5-15).",
        },
        {
          q: "Como faço uma chamada?",
          a: "1. Adicione créditos. 2. Vá ao feed. 3. Escolha um streamer. 4. Clique 'Ligar Agora'. 5. Se aceitar, vocês entram em vídeo.",
        },
        {
          q: "E se o streamer não responder?",
          a: "Se não responder em 30 segundos, a chamada é cancelada e você recebe o crédito de volta.",
        },
        {
          q: "Meus créditos expiram?",
          a: "Não! Seus créditos não expiram. Você pode usar quando quiser.",
        },
        {
          q: "Posso pedir reembolso?",
          a: "Sim, créditos não utilizados são reembolsáveis. Fale conosco para solicitar.",
        },
        {
          q: "As chamadas são privadas?",
          a: "Sim! Todas as chamadas são criptografadas end-to-end. Ninguém mais consegue ver ou ouvir.",
        },
      ],
    },
    {
      category: "Segurança e Privacidade",
      questions: [
        {
          q: "Meus dados são seguros?",
          a: "Sim! Usamos criptografia de nível militar, conformidade LGPD e backup automático.",
        },
        {
          q: "Vocês gravam as chamadas?",
          a: "Não! As chamadas são em tempo real e descartadas após o término. Nada é armazenado.",
        },
        {
          q: "Quem pode ver meu perfil?",
          a: "Seu perfil é visível para clientes que procuram streamers. Você controla o que mostra (foto, bio, preço).",
        },
        {
          q: "Como posso deletar minha conta?",
          a: "Vá em Configurações > Deletar Conta. Seus dados serão removidos conforme LGPD.",
        },
        {
          q: "Vocês vendem meus dados?",
          a: "Nunca! Seus dados são privados e nunca são vendidos ou compartilhados com terceiros.",
        },
        {
          q: "Como reportar um usuário?",
          a: "Clique no ícone de denúncia no perfil do usuário. Nossa equipe investiga em 24 horas.",
        },
      ],
    },
    {
      category: "Pagamentos",
      questions: [
        {
          q: "Quais são as formas de pagamento?",
          a: "Aceitamos Pix e cartão de crédito via Mercado Pago. Sem taxa de processamento.",
        },
        {
          q: "Por que preciso esperar D+30 para sacar?",
          a: "O período de 30 dias protege contra chargeback e fraude. Garante que o dinheiro é seu de verdade.",
        },
        {
          q: "Posso antecipar o saque?",
          a: "Sim! Você pode sacar antes de D+30 pagando 5% de taxa. O dinheiro cai em até 2 horas.",
        },
        {
          q: "Qual é a taxa da Flayve?",
          a: "Streamers recebem 70% (até 85% com bônus). Flayve fica com 30% (até 15% com bônus).",
        },
        {
          q: "Há taxa para adicionar créditos?",
          a: "Não! Sem taxa. Você paga exatamente o valor que escolher.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>

        {/* FAQs por Categoria */}
        <div className="space-y-12">
          {faqs.map((category, catIdx) => (
            <section key={catIdx} className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></span>
                {category.category}
              </h3>

              <div className="space-y-3">
                {category.questions.map((faq, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isExpanded = expandedIdx === id;

                  return (
                    <Card
                      key={qIdx}
                      className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition"
                    >
                      <button
                        onClick={() =>
                          setExpandedIdx(isExpanded ? null : id)
                        }
                        className="w-full p-6 text-left hover:bg-gray-50 transition flex items-start justify-between gap-4"
                      >
                        <h4 className="font-semibold text-gray-900 flex-1">
                          {faq.q}
                        </h4>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* Ainda tem dúvida? */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-gray-900">
            Ainda tem dúvida?
          </h3>
          <p className="text-lg text-gray-600">
            Fale conosco! Respondemos em até 24 horas.
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
