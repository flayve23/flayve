import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Mail, MessageSquare, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      await contactMutation.mutateAsync({
        title: `Novo contato: ${formData.subject}`,
        content: `De: ${formData.name} (${formData.email})\n\n${formData.message}`,
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      alert("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
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
            Fale Conosco
          </h2>
          <p className="text-xl text-gray-600">
            Dúvidas, sugestões ou problemas? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Informações de Contato */}
          <div className="space-y-6">
            {/* Email */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Mail className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:support@flayve.com"
                    className="text-blue-600 hover:underline break-all"
                  >
                    support@flayve.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Resposta em até 24 horas
                  </p>
                </div>
              </div>
            </Card>

            {/* WhatsApp */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    +55 (11) 99999-9999
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Resposta em até 2 horas
                  </p>
                </div>
              </div>
            </Card>

            {/* Horário */}
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Horário</h3>
                  <p className="text-gray-600 text-sm">
                    Segunda a Sexta
                    <br />
                    09:00 - 18:00 (Brasília)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Formulário */}
          <div className="md:col-span-2">
            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Envie uma Mensagem
              </h3>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    ✓ Mensagem enviada com sucesso!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Responderemos em breve.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome *
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Assunto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Assunto *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Dúvida sobre comissão"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    placeholder="Descreva sua dúvida ou sugestão..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    rows={6}
                  />
                </div>

                {/* Botão */}
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3"
                  size="lg"
                >
                  {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t-2 border-gray-200"></div>

        {/* FAQ Rápido */}
        <section className="max-w-3xl mx-auto space-y-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center">
            Respostas Rápidas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Como faço para me cadastrar?",
                a: "Clique em 'Cadastrar' na página inicial e escolha seu tipo de conta (Streamer ou Cliente).",
              },
              {
                q: "Qual é a comissão?",
                a: "Streamers recebem 70% de cada chamada (até 85% com bônus). Veja nossa Política de Comissão.",
              },
              {
                q: "Quando posso sacar?",
                a: "Saques são em D+30 sem taxa, ou antecipado com 5% de taxa. Máximo R$ 10.000/saque.",
              },
              {
                q: "É seguro?",
                a: "Sim! Criptografia end-to-end, conformidade LGPD, e proteção contra fraude. Veja Segurança.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-12 text-white text-center space-y-4">
          <h3 className="text-3xl font-bold">Ainda tem dúvida?</h3>
          <p className="text-lg text-indigo-100">
            Consulte nossas páginas informativas ou fale conosco
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/faq")}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3"
              size="lg"
            >
              Ver FAQ
            </Button>
            <Button
              onClick={() => setLocation("/how-it-works")}
              className="bg-indigo-700 hover:bg-indigo-800 font-semibold px-8 py-3"
              size="lg"
            >
              Como Funciona
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
