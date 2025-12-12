import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export function BalanceFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Falhou</CardTitle>
          <CardDescription>Não conseguimos processar seu pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              ✗ Verifique seus dados de pagamento
            </p>
            <p className="text-sm text-red-800 mt-2">
              ✗ Tente novamente ou use outro método
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/viewer-dashboard">
              <Button variant="outline" className="flex-1">
                Voltar
              </Button>
            </Link>
            <Link href="/viewer-dashboard">
              <Button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                Tentar Novamente
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
