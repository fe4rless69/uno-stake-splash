import React from 'react';
import UnoCard, { UnoCardData } from './UnoCard';
import { cn } from '@/lib/utils';

interface GameTableProps {
  drawPile: number;
  discardPile: UnoCardData[];
  onDrawCard: () => void;
  className?: string;
}

const GameTable: React.FC<GameTableProps> = ({
  drawPile,
  discardPile,
  onDrawCard,
  className
}) => {
  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className={cn(
      "relative w-80 h-60 md:w-96 md:h-72 table-felt rounded-xl mx-auto",
      "flex items-center justify-center gap-8",
      className
    )}>
      {/* Draw pile */}
      <div className="relative">
        <div className="text-xs text-gold mb-2 text-center font-bold">
          Draw Pile ({drawPile})
        </div>
        <div className="relative">
          {/* Stack effect with multiple cards */}
          {Array.from({ length: Math.min(3, drawPile) }).map((_, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                transform: `translate(${index * 2}px, ${index * -2}px)`,
                zIndex: index
              }}
            >
              <UnoCard
                isBack
                onClick={index === 2 ? onDrawCard : undefined}
                isPlayable={index === 2}
                className={index === 2 ? "cursor-pointer hover:scale-105" : "cursor-default"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* VS indicator */}
      <div className="text-2xl font-bold text-gold animate-pulse">
        VS
      </div>

      {/* Discard pile */}
      <div className="relative">
        <div className="text-xs text-gold mb-2 text-center font-bold">
          Discard Pile
        </div>
        <div className="relative">
          {discardPile.length > 0 ? (
            <>
              {/* Show last few cards for stack effect */}
              {discardPile.slice(-3).map((card, index) => (
                <div
                  key={card.id}
                  className="absolute"
                  style={{
                    transform: `translate(${index * 2}px, ${index * -2}px) rotate(${(index - 1) * 5}deg)`,
                    zIndex: index
                  }}
                >
                  <UnoCard
                    card={card}
                    className={index === 2 ? "shadow-lg shadow-gold/20" : ""}
                  />
                </div>
              ))}
            </>
          ) : (
            <UnoCard className="opacity-50" />
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-2 left-2 w-4 h-4 bg-gold rounded-full opacity-30"></div>
      <div className="absolute top-2 right-2 w-4 h-4 bg-gold rounded-full opacity-30"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-gold rounded-full opacity-30"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-gold rounded-full opacity-30"></div>
      
      {/* Elegant border pattern */}
      <div className="absolute inset-4 rounded-lg border border-gold/20 pointer-events-none"></div>
    </div>
  );
};

export default GameTable;