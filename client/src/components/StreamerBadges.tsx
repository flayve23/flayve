import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Star, Flame, Crown, Shield, Zap } from "lucide-react";

interface Badge {
  type: "verified" | "new" | "top_rated" | "top_earner" | "most_active" | "trusted" | "premium" | "vip";
  earnedAt: Date;
  expiresAt?: Date;
  reason?: string;
}

interface StreamerBadgesProps {
  badges: Badge[];
  size?: "sm" | "md" | "lg";
}

export function StreamerBadges({ badges, size = "md" }: StreamerBadgesProps) {
  if (!badges || badges.length === 0) {
    return null;
  }

  const getBadgeConfig = (type: string) => {
    const configs: Record<string, any> = {
      verified: {
        icon: <CheckCircle2 className="w-full h-full" />,
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "Verificado",
        description: "Identidade verificada pela Flayve",
      },
      new: {
        icon: <Zap className="w-full h-full" />,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Novo",
        description: "Streamer novo na plataforma",
      },
      top_rated: {
        icon: <Star className="w-full h-full" />,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        label: "Top Avaliado",
        description: "Classificação média acima de 4.8 estrelas",
      },
      top_earner: {
        icon: <Flame className="w-full h-full" />,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Top Ganho",
        description: "Um dos streamers com maior ganho mensal",
      },
      most_active: {
        icon: <Zap className="w-full h-full" />,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Mais Ativo",
        description: "Streamer mais ativo este mês",
      },
      trusted: {
        icon: <Shield className="w-full h-full" />,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Confiável",
        description: "Histórico limpo e taxa de aceitação alta",
      },
      premium: {
        icon: <Crown className="w-full h-full" />,
        color: "text-purple-600",
        bg: "bg-purple-100",
        label: "Premium",
        description: "Membro premium da plataforma",
      },
      vip: {
        icon: <Crown className="w-full h-full" />,
        color: "text-pink-600",
        bg: "bg-pink-100",
        label: "VIP",
        description: "Streamer VIP com benefícios exclusivos",
      },
    };

    return configs[type] || configs.verified;
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const badgeSizeClasses = {
    sm: "w-5 h-5 p-0.5",
    md: "w-6 h-6 p-1",
    lg: "w-8 h-8 p-1.5",
  };

  return (
    <TooltipProvider>
      <div className="flex gap-1 flex-wrap">
        {badges.map((badge, index) => {
          const config = getBadgeConfig(badge.type);
          const isExpired = badge.expiresAt && new Date(badge.expiresAt) < new Date();

          if (isExpired) return null;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={`${badgeSizeClasses[size]} ${config.bg} rounded-full flex items-center justify-center cursor-help hover:opacity-80 transition-opacity`}
                >
                  <div className={`${config.color}`}>
                    {config.icon}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-900 text-white">
                <div className="text-sm">
                  <p className="font-semibold">{config.label}</p>
                  <p className="text-xs opacity-90">{config.description}</p>
                  {badge.reason && (
                    <p className="text-xs opacity-75 mt-1">{badge.reason}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

/**
 * Componente para exibir badges em card de streamer
 */
export function StreamerBadgesCompact({ badges }: { badges: Badge[] }) {
  if (!badges || badges.length === 0) {
    return null;
  }

  const activeBadges = badges.filter(
    (b) => !b.expiresAt || new Date(b.expiresAt) >= new Date()
  );

  if (activeBadges.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {activeBadges.slice(0, 3).map((badge, index) => {
        const config = getBadgeConfig(badge.type);
        return (
          <span
            key={index}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
          >
            {config.icon}
            {config.label}
          </span>
        );
      })}
      {activeBadges.length > 3 && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          +{activeBadges.length - 3} mais
        </span>
      )}
    </div>
  );
}

function getBadgeConfig(type: string) {
  const configs: Record<string, any> = {
    verified: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-blue-600",
      bg: "bg-blue-100",
      label: "Verificado",
    },
    new: {
      icon: <Zap className="w-4 h-4" />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      label: "Novo",
    },
    top_rated: {
      icon: <Star className="w-4 h-4" />,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      label: "Top Avaliado",
    },
    top_earner: {
      icon: <Flame className="w-4 h-4" />,
      color: "text-red-600",
      bg: "bg-red-100",
      label: "Top Ganho",
    },
    most_active: {
      icon: <Zap className="w-4 h-4" />,
      color: "text-green-600",
      bg: "bg-green-100",
      label: "Mais Ativo",
    },
    trusted: {
      icon: <Shield className="w-4 h-4" />,
      color: "text-green-600",
      bg: "bg-green-100",
      label: "Confiável",
    },
    premium: {
      icon: <Crown className="w-4 h-4" />,
      color: "text-purple-600",
      bg: "bg-purple-100",
      label: "Premium",
    },
    vip: {
      icon: <Crown className="w-4 h-4" />,
      color: "text-pink-600",
      bg: "bg-pink-100",
      label: "VIP",
    },
  };

  return configs[type] || configs.verified;
}
