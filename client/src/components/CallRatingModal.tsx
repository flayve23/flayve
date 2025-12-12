import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CallRatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamerName: string;
  callDuration: number; // em minutos
  onSubmitRating: (rating: number, comment: string) => Promise<void>;
}

export function CallRatingModal({
  open,
  onOpenChange,
  streamerName,
  callDuration,
  onSubmitRating,
}: CallRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma classificação");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRating(rating, comment);
      toast.success("Avaliação enviada com sucesso! 🎉");
      setRating(0);
      setComment("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao enviar avaliação: " + (error.message || "Tente novamente"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Péssimo";
      case 2:
        return "Ruim";
      case 3:
        return "Bom";
      case 4:
        return "Muito Bom";
      case 5:
        return "Excelente";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-pink-900">
            ⭐ Como foi a chamada?
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Sua avaliação ajuda a melhorar a qualidade da plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Streamer Info */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Você chamou</p>
            <p className="text-xl font-bold text-pink-600">{streamerName}</p>
            <p className="text-xs text-gray-500 mt-2">
              ⏱️ Duração: {callDuration} minuto{callDuration !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Label */}
            {rating > 0 && (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {getRatingLabel(rating)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {rating <= 2 && "Nos ajude a melhorar. Qual foi o problema?"}
                  {rating === 3 && "Há algo que possamos melhorar?"}
                  {rating >= 4 && "Adoramos saber que você gostou!"}
                </p>
              </div>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Deixe um comentário (opcional)
            </label>
            <Textarea
              placeholder={
                rating <= 2
                  ? "Conte-nos o que poderia ter sido melhor..."
                  : rating === 3
                  ? "Há algo que possamos melhorar?"
                  : "Compartilhe sua experiência positiva!"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="text-sm font-semibold text-blue-900">💡 Benefícios da avaliação:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Ajuda streamers a melhorar a qualidade</li>
              <li>✓ Constrói confiança na comunidade</li>
              <li>✓ Você pode ganhar badges especiais por avaliar regularmente</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Pular
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Avaliação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
