import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Heart, Star, Zap, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  streamerName: string;
  onSendGift: (giftId: number, giftName: string, amount: number) => void;
  balance: number;
}

export function GiftPanel({
  isOpen,
  onClose,
  streamerName,
  onSendGift,
  balance,
}: GiftPanelProps) {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);

  const gifts = [
    {
      id: 1,
      name: "Coração",
      icon: Heart,
      color: "text-red-500",
      amount: 500, // R$ 5
      description: "Mostre seu carinho",
    },
    {
      id: 2,
      name: "Estrela",
      icon: Star,
      color: "text-yellow-500",
      amount: 1000, // R$ 10
      description: "Você é incrível!",
    },
    {
      id: 3,
      name: "Raio",
      icon: Zap,
      color: "text-blue-500",
      amount: 2000, // R$ 20
      description: "Você é demais!",
    },
    {
      id: 4,
      name: "Coroa",
      icon: Crown,
      color: "text-purple-500",
      amount: 5000, // R$ 50
      description: "Rainha/Rei!",
    },
    {
      id: 5,
      name: "Brilho",
      icon: Sparkles,
      color: "text-pink-500",
      amount: 10000, // R$ 100
      description: "Você é uma estrela!",
    },
    {
      id: 6,
      name: "Presente",
      icon: Gift,
      color: "text-green-500",
      amount: 20000, // R$ 200
      description: "Presente especial",
    },
  ];

  const handleSendGift = () => {
    if (!selectedGift) {
      toast.error("Selecione um presente");
      return;
    }

    const gift = gifts.find((g) => g.id === selectedGift);
    if (!gift) return;

    if (balance < gift.amount) {
      toast.error("Saldo insuficiente para enviar este presente");
      return;
    }

    onSendGift(gift.id, gift.name, gift.amount);
    setSelectedGift(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enviar Presente para {streamerName}</DialogTitle>
          <DialogDescription>
            Mostre seu apoio com um presente especial durante a chamada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Saldo */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">Seu saldo disponível</p>
            <p className="text-2xl font-bold text-pink-600">R$ {(balance / 100).toFixed(2)}</p>
          </div>

          {/* Grid de Presentes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gifts.map((gift) => {
              const IconComponent = gift.icon;
              const isAffordable = balance >= gift.amount;
              const isSelected = selectedGift === gift.id;

              return (
                <Card
                  key={gift.id}
                  className={`cursor-pointer transition border-2 ${
                    isSelected
                      ? "border-pink-600 bg-pink-50"
                      : isAffordable
                      ? "border-gray-200 hover:border-pink-300"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => isAffordable && setSelectedGift(gift.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <IconComponent className={`h-8 w-8 ${gift.color}`} />
                    </div>
                    <p className="font-semibold text-sm">{gift.name}</p>
                    <p className="text-xs text-gray-600 mb-2">{gift.description}</p>
                    <p className="text-lg font-bold text-pink-600">
                      R$ {(gift.amount / 100).toFixed(2)}
                    </p>
                    {!isAffordable && (
                      <p className="text-xs text-red-600 mt-2">Saldo insuficiente</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Presentes são uma ótima forma de apoiar seus streamers favoritos
              e mostrar seu carinho durante as chamadas!
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSendGift}
              disabled={!selectedGift}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {selectedGift
                ? `Enviar Presente - R$ ${(
                    gifts.find((g) => g.id === selectedGift)?.amount || 0
                  ) / 100}`
                : "Selecione um Presente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
