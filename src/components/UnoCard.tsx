import React from 'react';
import { cn } from '@/lib/utils';

export interface UnoCardData {
  id: string;
  color: 'red' | 'yellow' | 'green' | 'blue' | 'wild';
  value: string | number;
  type: 'number' | 'action' | 'wild';
}

interface UnoCardProps {
  card?: UnoCardData;
  isBack?: boolean;
  className?: string;
  onClick?: () => void;
  isPlayable?: boolean;
  isHovered?: boolean;
}

const UnoCard: React.FC<UnoCardProps> = ({
  card,
  isBack = false,
  className,
  onClick,
  isPlayable = false,
  isHovered = false
}) => {
  const getCardColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-unoCard-red';
      case 'yellow': return 'bg-unoCard-yellow';
      case 'green': return 'bg-unoCard-green';
      case 'blue': return 'bg-unoCard-blue';
      case 'wild': return 'bg-unoCard-wild';
      default: return 'bg-card';
    }
  };

  const getTextColor = (color: string) => {
    return color === 'yellow' ? 'text-foreground' : 'text-white';
  };

  return (
    <div
      className={cn(
        "relative w-16 h-24 md:w-20 md:h-32 rounded-lg border-2 border-gold/30 cursor-pointer transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        isPlayable && "card-hover ring-2 ring-gold/50",
        isHovered && "transform -translate-y-2 scale-105",
        className
      )}
      onClick={onClick}
    >
      {isBack ? (
        // Card back design
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-lg border-2 border-gold flex items-center justify-center">
          <div className="text-2xl md:text-4xl font-bold text-primary-foreground">
            UNO
          </div>
          <div className="absolute inset-2 rounded border border-gold/30"></div>
        </div>
      ) : card ? (
        // Card front design
        <div className={cn(
          "w-full h-full rounded-lg flex flex-col items-center justify-center relative overflow-hidden",
          getCardColor(card.color)
        )}>
          {/* Main content area */}
          <div className={cn(
            "flex-1 flex items-center justify-center",
            getTextColor(card.color)
          )}>
            <span className="text-lg md:text-3xl font-bold">
              {card.value}
            </span>
          </div>
          
          {/* Corner decorations */}
          <div className={cn(
            "absolute top-1 left-1 text-xs md:text-sm font-bold",
            getTextColor(card.color)
          )}>
            {card.value}
          </div>
          <div className={cn(
            "absolute bottom-1 right-1 text-xs md:text-sm font-bold transform rotate-180",
            getTextColor(card.color)
          )}>
            {card.value}
          </div>
          
          {/* Inner border */}
          <div className="absolute inset-1 rounded border border-white/20"></div>
        </div>
      ) : (
        // Empty slot
        <div className="w-full h-full bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <div className="text-muted-foreground text-xs">Empty</div>
        </div>
      )}
    </div>
  );
};

export default UnoCard;