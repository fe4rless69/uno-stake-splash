import React from 'react';
import UnoCard, { UnoCardData } from './UnoCard';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  cards: UnoCardData[];
  isCurrentPlayer?: boolean;
  playerName: string;
  balance: number;
  onCardPlay?: (cardId: string) => void;
  className?: string;
  position: 'bottom' | 'top' | 'left' | 'right';
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  isCurrentPlayer = false,
  playerName,
  balance,
  onCardPlay,
  className,
  position
}) => {
  const getHandLayout = () => {
    switch (position) {
      case 'bottom':
        return 'flex-row justify-center items-end';
      case 'top':
        return 'flex-row justify-center items-start';
      case 'left':
        return 'flex-col justify-center items-start';
      case 'right':
        return 'flex-col justify-center items-end';
    }
  };

  const getCardSpacing = () => {
    if (position === 'left' || position === 'right') {
      return '-space-y-4';
    }
    return '-space-x-4';
  };

  return (
    <div className={cn("relative", className)}>
      {/* Player info */}
      <div className={cn(
        "absolute z-10 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-gold/30",
        position === 'bottom' && "-top-16 left-1/2 transform -translate-x-1/2",
        position === 'top' && "-bottom-16 left-1/2 transform -translate-x-1/2",
        position === 'left' && "-right-24 top-1/2 transform -translate-y-1/2",
        position === 'right' && "-left-24 top-1/2 transform -translate-y-1/2"
      )}>
        <div className="text-sm font-bold text-foreground">{playerName}</div>
        <div className="text-xs text-gold">Balance: {balance}</div>
        <div className="text-xs text-muted-foreground">Cards: {cards.length}</div>
      </div>

      {/* Cards */}
      <div className={cn(
        "flex",
        getHandLayout(),
        getCardSpacing()
      )}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              "transition-all duration-300",
              isCurrentPlayer && "hover:z-10"
            )}
            style={{
              zIndex: index,
              transform: isCurrentPlayer ? `translateY(${index * -2}px)` : undefined
            }}
          >
            <UnoCard
              card={isCurrentPlayer ? card : undefined}
              isBack={!isCurrentPlayer}
              onClick={isCurrentPlayer && onCardPlay ? () => onCardPlay(card.id) : undefined}
              isPlayable={isCurrentPlayer}
              className={cn(
                "transition-transform duration-200",
                position === 'left' && "rotate-90",
                position === 'right' && "-rotate-90"
              )}
            />
          </div>
        ))}
      </div>

      {/* Turn indicator */}
      {isCurrentPlayer && (
        <div className={cn(
          "absolute animate-pulse",
          position === 'bottom' && "-top-2 left-1/2 transform -translate-x-1/2",
          position === 'top' && "-bottom-2 left-1/2 transform -translate-x-1/2",
          position === 'left' && "-right-2 top-1/2 transform -translate-y-1/2",
          position === 'right' && "-left-2 top-1/2 transform -translate-y-1/2"
        )}>
          <div className="w-3 h-3 bg-gold rounded-full shadow-lg"></div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;