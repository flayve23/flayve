import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: any) => {
      console.log("✅ Login successful:", data);
      
      if (!data.user.emailVerified) {
        console.log("❌ Email not verified");
        setError("Por favor, verifique seu email antes de fazer login");
        setLoading(false);
        return;
      }

      console.log("✅ Email verified, role:", data.user.role);

      // Redirect based on role - IMMEDIATE without onboarding
      setTimeout(() => {
        if (data.user.role === "admin") {
          console.log("→ Redirecting to /admin-dashboard");
          setLocation("/admin-dashboard");
        } else if (data.user.role === "streamer") {
          console.log("→ Redirecting to /dashboard");
          setLocation("/dashboard");
        } else {
          console.log("→ Redirecting to /feed");
          setLocation("/feed");
        }
      }, 100);
    },
    onError: (err: any) => {
      console.log("❌ Login error:", err);
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("🔄 Login attempt with:", email);

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err: any) {
      console.log("❌ Error:", err);
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-3 sm:p-4">
      <Card className="w-full max-w-md border-2 border-pink-200 shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl text-pink-600">Flayve</CardTitle>
          <CardDescription className="text-pink-500 text-sm sm:text-base">Faça login na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-cyan-300 focus:border-cyan-500 h-12 sm:h-10 text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-2">Senha</label>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-cyan-300 focus:border-cyan-500 h-12 sm:h-10 text-base"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold h-12 sm:h-10 text-base sm:text-sm rounded-lg"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3 sm:space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Não tem conta?{" "}
              <a href="/signup" className="text-pink-600 hover:text-pink-700 font-semibold">
                Criar conta
              </a>
            </p>
            <p>
              <a href="/forgot-password" className="text-pink-600 hover:text-pink-700 font-semibold text-xs sm:text-sm">
                Esqueci minha senha
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
