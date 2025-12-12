import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EarningsCalculator } from "@/components/EarningsCalculator";
// import { getLoginUrl } from "@/const"; // Removido - usando /login em vez de OAuth
import { Video, DollarSign, Shield, Clock, ArrowRight, CheckCircle2, Users, Eye, Zap, Heart, Star, Gem, LogOut, Lock, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    const confirmed = localStorage.getItem("flayve_age_confirmed");
    if (confirmed) {
      setAgeConfirmed(true);
    }
  }, []);

  // Redirecionar automaticamente para dashboard baseado no role
  useEffect(() => {
    if (user && !loading) {
      if (user.role === "admin") {
        setLocation("/admin-dashboard");
      } else if (user.role === "streamer") {
        setLocation("/dashboard");
      } else if (user.role === "viewer") {
        setLocation("/feed");
      } else if (user.role === "user" && ageConfirmed && !showRoleSelection) {
        setShowRoleSelection(true);
      }
    }
  }, [user, loading, ageConfirmed, showRoleSelection, setLocation]);

  const handleAgeConfirm = () => {
    localStorage.setItem("flayve_age_confirmed", "true");
    setAgeConfirmed(true);
    setShowAgeModal(true);
  };

  const handleStreamerClick = () => {
    setShowRoleSelection(false);
    if (user) {
      setLocation("/onboarding");
    } else {
      setLocation("/login");
    }
  };

  const handleViewerClick = () => {
    setShowRoleSelection(false);
    if (user) {
      setLocation("/viewer-onboarding");
    } else {
      setLocation("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Mostrar seleção de papel apenas se role é 'user'
  if (showRoleSelection && user && user.role === "user") {
    return (
      <Dialog open={showRoleSelection} onOpenChange={setShowRoleSelection}>
        <DialogContent className="sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto bg-white border-pink-200">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center mb-2 text-pink-900">Bem-vindo ao Flayve! 🎉</DialogTitle>
            <DialogDescription className="text-center pt-2 text-pink-700">
              Escolha como você quer começar
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            {/* Card Streamer */}
            <Card className="border-2 border-pink-600 hover:shadow-lg transition-shadow cursor-pointer bg-pink-50" onClick={handleStreamerClick}>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-pink-100 p-4 rounded-full">
                    <Video className="w-8 h-8 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-pink-900">Sou Streamer</h3>
                <p className="text-pink-700 mb-4">
                  Ganhe dinheiro fazendo chamadas privadas. Até R$ 100/minuto!
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-pink-800">Ganhe até R$ 100/minuto</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-pink-800">Controle seu horário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-pink-800">Saque mensal via Pix</span>
                  </li>
                </ul>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  Começar como Streamer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Card Viewer */}
            <Card className="border-2 border-purple-600 hover:shadow-lg transition-shadow cursor-pointer bg-purple-50" onClick={handleViewerClick}>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-purple-900">Sou Viewer</h3>
                <p className="text-purple-700 mb-4">
                  Conecte-se com modelos verificadas para chamadas privadas
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-purple-800">Modelos verificadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-purple-800">Privacidade garantida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-purple-800">Presentes e tipping</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Começar como Viewer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de Confirmação +18
  if (!ageConfirmed) {
    return (
      <Dialog open={!ageConfirmed} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md mx-auto bg-white border-pink-200">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center font-bold text-pink-900">Flayve</DialogTitle>
            <DialogDescription className="text-center pt-4 text-base text-pink-700">
              Este site contém conteúdo adulto. Você confirma que tem 18 anos ou mais?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleAgeConfirm}
              size="lg" 
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Sim, tenho 18+ anos
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-white border-pink-300 text-pink-900 hover:bg-pink-50"
              onClick={() => (window.location.href = "https://www.google.com")}
            >
              Não, sair
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Landing Page Principal - PINK/PURPLE COLORS
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 overflow-y-auto">
      {/* Header com Logo, Login e Usuário */}
      <header className="border-b border-pink-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Flayve
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-pink-900">{user.name || user.email}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-pink-300 text-pink-900 hover:bg-pink-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
                <Button 
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => {
                    setLocation("/login");
                  }}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-32 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-pink-100 border border-pink-300 rounded-full">
              <p className="text-sm font-semibold text-pink-700">🚀 Plataforma #1 em Crescimento</p>
            </div>

            <h2 className="text-5xl sm:text-7xl font-black text-pink-900 mb-6 leading-tight">
              Ganhe Até <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">R$ 100/min</span> Fazendo Chamadas
            </h2>
            
            <p className="text-xl sm:text-2xl text-pink-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              10.000+ modelos ganham dinheiro na Flayve. Você controla o horário, define o preço e recebe via Pix. <strong>Sem compromisso.</strong>
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 text-lg font-semibold"
                  onClick={() => {
                    setLocation("/login");
                  }}
                >
                  Começar Agora <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-pink-300 text-pink-900 hover:bg-pink-50 px-8 text-lg font-semibold"
                  onClick={() => {
                    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ver Como Funciona
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 text-lg font-semibold"
                  onClick={handleStreamerClick}
                >
                  Sou Streamer <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 text-lg font-semibold"
                  onClick={handleViewerClick}
                >
                  Sou Viewer <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Números de Prova Social */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 pt-12 border-t border-pink-200">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">10K+</div>
                <p className="text-pink-700 text-sm mt-2">Modelos Ativas</p>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">50K+</div>
                <p className="text-purple-700 text-sm mt-2">Usuários Ativos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">R$ 5M+</div>
                <p className="text-pink-700 text-sm mt-2">Já Pagos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Ganhos */}
      <section className="py-16 bg-white/50 border-t border-pink-200">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-4 text-pink-900">
            💰 Calcule seus Ganhos Potenciais
          </h3>
          <p className="text-center text-pink-700 mb-12 max-w-2xl mx-auto">
            Veja quanto você pode faturar com base no seu preço por minuto e horas online
          </p>
          <EarningsCalculator />
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-4 text-pink-900">
            Como Funciona
          </h3>
          <p className="text-center text-pink-700 mb-12 max-w-2xl mx-auto">
            3 passos simples para começar a ganhar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <Card className="bg-pink-50 border-pink-200 h-full">
                <CardContent className="pt-6 text-center">
                  <div className="bg-gradient-to-br from-pink-600 to-pink-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-pink-900">Cadastro em 5 Min</h4>
                  <p className="text-pink-700">
                    Preencha seu perfil com foto, bio, tags e defina seu preço por minuto.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-600 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <Card className="bg-purple-50 border-purple-200 h-full">
                <CardContent className="pt-6 text-center">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-purple-900">Receba Chamadas</h4>
                  <p className="text-purple-700">
                    Clientes se conectam com você. Você controla seu horário e disponibilidade.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div>
              <Card className="bg-pink-50 border-pink-200 h-full">
                <CardContent className="pt-6 text-center">
                  <div className="bg-gradient-to-br from-pink-600 to-pink-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-pink-900">Ganhe & Saque</h4>
                  <p className="text-pink-700">
                    Ganhe 70% de cada chamada. Saque todo mês via Pix, sem burocracia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-white/50 border-t border-pink-200">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12 text-pink-900">
            Por Que Escolher Flayve?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4 p-6 bg-pink-50 rounded-lg border border-pink-200">
              <TrendingUp className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-pink-900">Ganhe Mais</h4>
                <p className="text-pink-700">Até R$ 100/minuto. Você define o preço. Sem limite de ganhos.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <Clock className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-purple-900">Flexibilidade Total</h4>
                <p className="text-purple-700">Trabalhe quando quiser. Sem compromisso. Pause quando precisar.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-pink-50 rounded-lg border border-pink-200">
              <Shield className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-pink-900">100% Seguro</h4>
                <p className="text-pink-700">Verificação de usuários. Privacidade garantida. Criptografia end-to-end.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <DollarSign className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-purple-900">Saque Rápido</h4>
                <p className="text-purple-700">Via Pix. Sem burocracia. Saque todo mês no dia 05.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12 text-pink-900">
            O Que Dizem Sobre Flayve
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Mariana Silva",
                role: "Streamer",
                text: "Comecei há 3 meses e já ganhei R$ 12 mil. A plataforma é segura e os clientes são verificados.",
                rating: 5
              },
              {
                name: "Juliana Costa",
                role: "Streamer Premium",
                text: "Cobro R$ 50/min e ganho R$ 7 mil por semana. Melhor decisão que tomei!",
                rating: 5
              },
              {
                name: "Amanda Oliveira",
                role: "Streamer",
                text: "Trabalho 4 horas por dia e ganho R$ 5.600/mês. Sem estresse, sem chefe.",
                rating: 5
              }
            ].map((depoimento, idx) => (
              <Card key={idx} className="bg-white border-pink-200">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(depoimento.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-pink-700 mb-4 italic">"{depoimento.text}"</p>
                  <div>
                    <p className="font-bold text-pink-900">{depoimento.name}</p>
                    <p className="text-sm text-pink-600">{depoimento.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 border-t border-pink-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6 text-pink-900">
            Pronto para Começar a Ganhar?
          </h3>
          <p className="text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
            Junte-se a 10.000+ modelos que já ganham dinheiro na Flayve. Sem risco, sem compromisso.
          </p>
          
          {!user ? (
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-12 text-lg font-semibold"
              onClick={() => {
                setLocation("/signup");
              }}
            >
              Criar Conta Grátis <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-12 text-lg font-semibold"
                onClick={handleStreamerClick}
              >
                Sou Streamer
              </Button>
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 text-lg font-semibold"
                onClick={handleViewerClick}
              >
                Sou Viewer
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-pink-700 text-sm">
          <p>© 2024 Flayve. Todos os direitos reservados.</p>
          <p className="mt-2">Plataforma 100% segura, verificada e criptografada</p>
        </div>
      </footer>
    </div>
  );
}
