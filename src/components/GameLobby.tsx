import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GameHUD from './GameHUD';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  name: string;
  balance: number;
  isReady: boolean;
}

interface GameLobbyProps {
  playerName: string;
  playerBalance: number;
  players: Player[];
  currentBet: number;
  onBetChange: (amount: number) => void;
  onStartGame: () => void;
  onLogout: () => void;
  className?: string;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  playerName,
  playerBalance,
  players,
  currentBet,
  onBetChange,
  onStartGame,
  onLogout,
  className
}) => {
  const canStartGame = players.length >= 2 && players.every(p => p.isReady);

  return (
    <div className={cn(
      "min-h-screen p-4 flex flex-col items-center justify-center gap-6",
      className
    )}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient-gold">
          Uno Gamble Online
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-gold font-bold">{playerName}</span>!
        </p>
      </div>

      {/* Game HUD */}
      <GameHUD
        currentBet={currentBet}
        playerBalance={playerBalance}
        potSize={currentBet * players.length}
        gamePhase="lobby"
        onBetChange={onBetChange}
        className="w-full max-w-2xl"
      />

      {/* Players Grid */}
      <Card className="w-full max-w-4xl border-gold/30 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Game Lobby</CardTitle>
          <CardDescription>
            {players.length}/4 players ready • Bet: ${currentBet} per round
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Player slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const player = players[index];
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-300",
                    player
                      ? "border-gold/50 bg-casino-green/20"
                      : "border-dashed border-muted-foreground/30 bg-muted/10"
                  )}
                >
                  {player ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">
                          {player.name}
                          {player.name === playerName && " (You)"}
                        </div>
                        <div className="text-sm text-gold">
                          Balance: ${player.balance}
                        </div>
                      </div>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        player.isReady ? "bg-win animate-pulse" : "bg-muted-foreground"
                      )}></div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm">Waiting for player...</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={onStartGame}
              disabled={!canStartGame}
              className={cn(
                "px-8 py-3 text-lg font-bold",
                canStartGame
                  ? "bg-win hover:bg-win/80 text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {canStartGame ? "Start Game" : "Waiting for Players"}
            </Button>
            
            <Button
              onClick={onLogout}
              variant="outline"
              className="px-8 py-3 text-lg border-gold/30 text-gold hover:bg-gold/10"
            >
              Logout
            </Button>
          </div>

          {/* Game rules reminder */}
          <div className="pt-4 border-t border-gold/20">
            <div className="text-center space-y-2">
              <div className="text-sm font-bold text-foreground">Quick Rules</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Match color or number to play a card</div>
                <div>• Winner takes ${currentBet} from each losing player</div>
                <div>• Call "UNO" when you have one card left!</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-win/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default GameLobby;