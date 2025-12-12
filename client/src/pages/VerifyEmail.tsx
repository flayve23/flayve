import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: (data: any) => {
      setStatus("success");
      setMessage("Email verificado com sucesso! Redirecionando...");
      setTimeout(() => {
        setLocation("/onboarding");
      }, 2000);
    },
    onError: (err: any) => {
      setStatus("error");
      setMessage(err.message || "Erro ao verificar email");
    },
  });

  const resendEmailMutation = trpc.auth.resendVerificationEmail.useMutation({
    onSuccess: (data: any) => {
      setResendLoading(false);
      setStatus("resend");
      setMessage("Email de verificação reenviado! Verifique sua caixa de entrada.");
    },
    onError: (err: any) => {
      setResendLoading(false);
      setMessage(err.message || "Erro ao reenviar email");
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailParam = params.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      verifyEmailMutation.mutate({ verificationToken: token });
    } else {
      setStatus("error");
      setMessage("Token de verificação não encontrado");
    }
  }, []);

  const handleResendEmail = async () => {
    if (!email) {
      setMessage("Email não encontrado");
      return;
    }
    setResendLoading(true);
    await resendEmailMutation.mutateAsync({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md border-pink-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-pink-900">Flayve</CardTitle>
          <CardDescription className="text-pink-700 mt-2">
            {status === "loading" && "Verificando seu email..."}
            {status === "success" && "Email verificado!"}
            {status === "error" && "Erro na verificação"}
            {status === "resend" && "Email reenviado"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {status === "loading" && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-12 h-12 text-pink-600 animate-spin" />
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <p className="text-center text-green-700 font-medium">
                  {message}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <p className="text-center text-red-700 font-medium">
                  {message}
                </p>
                {email && (
                  <div className="space-y-3">
                    <p className="text-sm text-pink-700 text-center">
                      O link pode ter expirado. Solicite um novo link de verificação.
                    </p>
                    <Button
                      onClick={handleResendEmail}
                      disabled={resendLoading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Reenviar Email
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => setLocation("/signup")}
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600"
                >
                  Voltar para Cadastro
                </Button>
              </div>
            )}

            {status === "resend" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Mail className="w-16 h-16 text-blue-500" />
                </div>
                <p className="text-center text-blue-700 font-medium">
                  {message}
                </p>
                <Button
                  onClick={() => setLocation("/")}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Voltar para Home
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
