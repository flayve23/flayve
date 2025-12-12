import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, DollarSign } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onSelectStreamer: () => void;
  onSelectViewer: () => void;
}

export function WelcomeModal({ open, onSelectStreamer, onSelectViewer }: WelcomeModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-2xl mx-auto bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-pink-900">
            Bem-vindo ao Flayve! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Escolha como você quer usar a plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Streamer Option */}
          <button
            onClick={onSelectStreamer}
            className="group relative overflow-hidden rounded-lg border-2 border-pink-200 p-6 transition-all hover:border-pink-600 hover:shadow-lg hover:bg-pink-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 group-hover:bg-pink-200 transition-colors">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-pink-900">
                  Ganhar Dinheiro
                </h3>
                <p className="text-sm text-pink-700 mt-1">
                  Faça chamadas de vídeo e ganhe dinheiro
                </p>
              </div>

              <ul className="text-sm text-pink-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-0.5">✓</span>
                  <span>Receba chamadas de usuários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-0.5">✓</span>
                  <span>Defina seu próprio preço</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-0.5">✓</span>
                  <span>Ganhe até 70% por minuto</span>
                </li>
              </ul>

              <div className="text-xs text-pink-600 font-medium">
                ⏱️ Setup: ~2 minutos
              </div>
            </div>
          </button>

          {/* Viewer Option */}
          <button
            onClick={onSelectViewer}
            className="group relative overflow-hidden rounded-lg border-2 border-purple-200 p-6 transition-all hover:border-purple-600 hover:shadow-lg hover:bg-purple-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-purple-900">
                  Chamar Streamers
                </h3>
                <p className="text-sm text-purple-700 mt-1">
                  Faça chamadas privadas com streamers
                </p>
              </div>

              <ul className="text-sm text-purple-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Escolha entre streamers verificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Chamadas privadas e seguras</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Avalie e deixe comentários</span>
                </li>
              </ul>

              <div className="text-xs text-purple-600 font-medium">
                ⏱️ Setup: ~1 minuto
              </div>
            </div>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Dica:</strong> Você pode mudar de role a qualquer momento nas configurações da sua conta.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onSelectViewer}
            variant="outline"
            className="flex-1"
          >
            Chamar Streamers
          </Button>
          <Button
            onClick={onSelectStreamer}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
          >
            Ganhar Dinheiro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
