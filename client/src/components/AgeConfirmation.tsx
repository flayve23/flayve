import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AgeConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export function AgeConfirmation({ isOpen, onConfirm, onReject }: AgeConfirmationProps) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay para evitar clique acidental
      const timer = setTimeout(() => setShowButtons(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <DialogTitle>Confirmação de Idade</DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-700">
            Este site contém conteúdo adulto. Você confirma que tem 18 anos ou mais?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <p className="text-sm text-red-900 font-medium">
            ⚠️ Acesso restrito a maiores de 18 anos
          </p>
          <p className="text-xs text-red-700 mt-2">
            Este site contém conteúdo sexual explícito. Ao continuar, você confirma que é maior de idade e aceita nossos Termos de Serviço.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onReject}
            variant="outline"
            className="flex-1"
          >
            Não, sair
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!showButtons}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
          >
            {showButtons ? "Sim, tenho 18+" : "Aguarde..."}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Sua confirmação será salva por 30 dias
        </p>
      </DialogContent>
    </Dialog>
  );
}
