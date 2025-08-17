import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GameTable from './GameTable';
import PlayerHand from './PlayerHand';
import GameHUD from './GameHUD';
import { useUnoGame } from '@/hooks/useUnoGame';
import { cn } from '@/lib/utils';

interface GameRoomProps {
  playerName: string;
  playerBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBackToLobby: () => void;
  className?: string;
}

const GameRoom: React.FC<GameRoomProps> = ({
  playerName,
  playerBalance,
  onUpdateBalance,
  onBackToLobby,
  className
}) => {
  const { gameState, initializeGame, drawCard, playCard, setBetAmount, endRound, canPlayCard } = useUnoGame();

  // Initialize game when component mounts
  useEffect(() => {
    if (gameState.gamePhase === 'lobby') {
      initializeGame(playerName, playerBalance);
    }
  }, [initializeGame, playerName, playerBalance, gameState.gamePhase]);

  // Handle game end and balance updates
  useEffect(() => {
    if (gameState.gamePhase === 'roundEnd' && gameState.winner) {
      const humanPlayer = gameState.players.find(p => !p.isAI);
      if (humanPlayer) {
        const isWinner = gameState.winner === humanPlayer.id;
        const betAmount = gameState.currentBet;
        
        if (isWinner) {
          // Winner gets bet amount from each losing player
          const winnings = betAmount * (gameState.players.length - 1);
          onUpdateBalance(playerBalance + winnings);
        } else {
          // Loser loses bet amount
          onUpdateBalance(Math.max(0, playerBalance - betAmount));
        }

        // Show result for a moment then offer new round
        setTimeout(() => {
          endRound();
        }, 3000);
      }
    }
  }, [gameState.gamePhase, gameState.winner, gameState.players, gameState.currentBet, playerBalance, onUpdateBalance, endRound]);

  // AI move simulation
  useEffect(() => {
    if (gameState.gamePhase === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer?.isAI) {
        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        const playableCard = currentPlayer.cards.find(card => canPlayCard(card, topCard));
        
        setTimeout(() => {
          if (playableCard) {
            playCard(playableCard.id);
          } else {
            drawCard();
          }
        }, 1500); // AI thinks for 1.5 seconds
      }
    }
  }, [gameState.currentPlayerIndex, gameState.gamePhase, gameState.players, gameState.discardPile, canPlayCard, playCard, drawCard]);

  const currentPlayer = gameState.players[0]; // Human player is always index 0
  const isCurrentTurn = gameState.currentPlayerIndex === 0;
  const topCard = gameState.discardPile[gameState.discardPile.length - 1];

  const handleCardPlay = (cardId: string) => {
    if (!isCurrentTurn) return;
    playCard(cardId);
  };

  const handleDrawCard = () => {
    if (!isCurrentTurn) return;
    drawCard();
  };

  const canCallUno = currentPlayer?.cards.length === 1;

  if (gameState.gamePhase === 'lobby') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gold mb-4">Preparing Game...</div>
          <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen p-4 flex flex-col",
      className
    )}>
      {/* Top HUD */}
      <div className="mb-4">
        <GameHUD
          currentBet={gameState.currentBet}
          playerBalance={playerBalance}
          potSize={gameState.currentBet * gameState.players.length}
          gamePhase={gameState.gamePhase}
          canCallUno={canCallUno}
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Game Layout */}
      <div className="flex-1 relative">
        {/* Opponent players */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {gameState.players[2] && (
            <PlayerHand
              cards={gameState.players[2].cards}
              playerName={gameState.players[2].name}
              balance={gameState.players[2].balance}
              position="top"
              isCurrentPlayer={gameState.currentPlayerIndex === 2}
            />
          )}
        </div>

        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {gameState.players[1] && (
            <PlayerHand
              cards={gameState.players[1].cards}
              playerName={gameState.players[1].name}
              balance={gameState.players[1].balance}
              position="left"
              isCurrentPlayer={gameState.currentPlayerIndex === 1}
            />
          )}
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {gameState.players[3] && (
            <PlayerHand
              cards={gameState.players[3].cards}
              playerName={gameState.players[3].name}
              balance={gameState.players[3].balance}
              position="right"
              isCurrentPlayer={gameState.currentPlayerIndex === 3}
            />
          )}
        </div>

        {/* Game table in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <GameTable
            drawPile={gameState.drawPile.length}
            discardPile={gameState.discardPile}
            onDrawCard={handleDrawCard}
          />
          
          {/* Current turn indicator */}
          <div className="text-center mt-4">
            <div className="text-sm text-muted-foreground">
              {isCurrentTurn ? (
                <span className="text-gold font-bold animate-pulse">Your Turn</span>
              ) : (
                <span>{gameState.players[gameState.currentPlayerIndex]?.name}'s Turn</span>
              )}
            </div>
          </div>
        </div>

        {/* Player hand at bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {currentPlayer && (
            <PlayerHand
              cards={currentPlayer.cards}
              playerName={currentPlayer.name}
              balance={currentPlayer.balance}
              position="bottom"
              isCurrentPlayer={isCurrentTurn}
              onCardPlay={handleCardPlay}
            />
          )}
        </div>
      </div>

      {/* Game over overlay */}
      {gameState.gamePhase === 'roundEnd' && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-6 bg-card p-8 rounded-xl border-gold/30 border-2">
            <div className="text-4xl font-bold text-gradient-gold">
              Round Complete!
            </div>
            
            {gameState.winner && (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {gameState.players.find(p => p.id === gameState.winner)?.name} Wins!
                </div>
                
                {gameState.winner === currentPlayer?.id ? (
                  <div className="text-win text-xl">
                    +${gameState.currentBet * (gameState.players.length - 1)}
                  </div>
                ) : (
                  <div className="text-lose text-xl">
                    -${gameState.currentBet}
                  </div>
                )}
              </div>
            )}
            
            <div className="text-muted-foreground">
              Starting new round in 3 seconds...
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Button
          onClick={onBackToLobby}
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/10"
        >
          ← Back to Lobby
        </Button>
      </div>
    </div>
  );
};

export default GameRoom;