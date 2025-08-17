import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  currentBet: number;
  playerBalance: number;
  potSize: number;
  gamePhase: 'lobby' | 'playing' | 'roundEnd';
  onBetChange?: (amount: number) => void;
  onUnoCall?: () => void;
  canCallUno?: boolean;
  className?: string;
}

const GameHUD: React.FC<GameHUDProps> = ({
  currentBet,
  playerBalance,
  potSize,
  gamePhase,
  onBetChange,
  onUnoCall,
  canCallUno = false,
  className
}) => {
  const betOptions = [25, 50, 100, 200];

  return (
    <Card className={cn(
      "bg-card/90 backdrop-blur-sm border-gold/30 p-4",
      className
    )}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Balance Display */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="text-lg font-bold text-gold chip-glow">
            ${playerBalance}
          </div>
        </div>

        {/* Current Bet */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Current Bet</div>
          <div className="text-lg font-bold text-foreground">
            ${currentBet}
          </div>
        </div>

        {/* Pot Size */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Pot</div>
          <div className="text-lg font-bold text-win">
            ${potSize}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          {canCallUno && (
            <Button
              onClick={onUnoCall}
              className="bg-lose hover:bg-lose/80 text-white animate-pulse"
              size="sm"
            >
              UNO!
            </Button>
          )}
        </div>
      </div>

      {/* Betting Controls */}
      {gamePhase === 'lobby' && onBetChange && (
        <div className="mt-4 pt-4 border-t border-gold/20">
          <div className="text-xs text-muted-foreground mb-2 text-center">
            Select Bet Amount
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {betOptions.map((amount) => (
              <Button
                key={amount}
                onClick={() => onBetChange(amount)}
                variant={currentBet === amount ? "default" : "outline"}
                size="sm"
                className={cn(
                  "min-w-16",
                  currentBet === amount && "bg-gold text-primary-foreground hover:bg-gold/80"
                )}
                disabled={amount > playerBalance}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Game Status */}
      <div className="mt-4 pt-4 border-t border-gold/20 text-center">
        <div className="text-xs text-muted-foreground">
          {gamePhase === 'lobby' && "Waiting for players..."}
          {gamePhase === 'playing' && "Game in progress"}
          {gamePhase === 'roundEnd' && "Round completed"}
        </div>
      </div>
    </Card>
  );
};

export default GameHUD;