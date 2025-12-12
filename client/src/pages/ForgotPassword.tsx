import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data: any) => {
      setMessage(data.message);
      setSent(true);
      setLoading(false);
    },
    onError: (err: any) => {
      setError(err.message || "Erro ao enviar email");
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md border-pink-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-pink-900">Flayve</CardTitle>
          <CardDescription className="text-pink-700 mt-2">
            {sent ? "Email enviado!" : "Recuperar sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                {message}
              </div>
              <p className="text-sm text-pink-700">
                Verifique seu email para o link de recuperação de senha. O link expira em 1 hora.
              </p>
              <Button
                onClick={() => setLocation("/login")}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Voltar para Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-pink-900">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-pink-200 focus:border-pink-600"
                />
              </div>

              <p className="text-xs text-pink-600">
                Digite o email associado à sua conta e enviaremos um link para recuperar sua senha.
              </p>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/login")}
                className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
