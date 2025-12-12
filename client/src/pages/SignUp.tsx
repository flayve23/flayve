import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data: any) => {
      // Redirecionar para verificação de email
      if (data.requiresEmailVerification) {
        setTimeout(() => {
          setLocation(`/verify-email?email=${encodeURIComponent(email)}&token=${data.verificationToken}`);
        }, 500);
      } else {
        setTimeout(() => {
          setLocation("/onboarding");
        }, 500);
      }
    },
    onError: (err: any) => {
      setError(err.message || "Erro ao criar conta");
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await registerMutation.mutateAsync({ username, email, password });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-3 sm:p-4">
      <Card className="w-full max-w-md border-2 border-pink-200 shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl text-pink-900">Flayve</CardTitle>
          <CardDescription className="text-pink-700 mt-2 text-sm sm:text-base">
            Crie sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-pink-900 block">Nome de Usuário</label>
              <Input
                type="text"
                placeholder="seu_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="border-pink-200 focus:border-pink-600 h-12 sm:h-10 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-pink-900 block">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-pink-200 focus:border-pink-600 h-12 sm:h-10 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-pink-900 block">Senha</label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-pink-200 focus:border-pink-600 h-12 sm:h-10 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-pink-900 block">Confirmar Senha</label>
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="border-pink-200 focus:border-pink-600 h-12 sm:h-10 text-base"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !username || !email || !password || !confirmPassword}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12 sm:h-10 text-base sm:text-sm font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>

            <div className="text-center text-xs sm:text-sm text-pink-700">
              Já tem conta?{" "}
              <button
                type="button"
                onClick={() => setLocation("/login")}
                className="font-semibold text-pink-600 hover:text-pink-700"
              >
                Faça login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
