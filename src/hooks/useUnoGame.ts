import { useState, useCallback } from 'react';
import { UnoCardData } from '@/components/UnoCard';

// Card generation utilities
const COLORS = ['red', 'yellow', 'green', 'blue'] as const;
const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ACTIONS = ['skip', 'reverse', '+2'];
const WILDS = ['wild', '+4'];

interface Player {
  id: string;
  name: string;
  balance: number;
  cards: UnoCardData[];
  isAI: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  drawPile: UnoCardData[];
  discardPile: UnoCardData[];
  direction: 1 | -1;
  gamePhase: 'lobby' | 'playing' | 'roundEnd';
  currentBet: number;
  winner: string | null;
}

const generateDeck = (): UnoCardData[] => {
  const deck: UnoCardData[] = [];
  let cardId = 0;

  // Number cards (0-9, two of each 1-9, one 0 per color)
  COLORS.forEach(color => {
    NUMBERS.forEach(number => {
      const count = number === 0 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        deck.push({
          id: `card-${cardId++}`,
          color,
          value: number,
          type: 'number'
        });
      }
    });

    // Action cards (two of each per color)
    ACTIONS.forEach(action => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: `card-${cardId++}`,
          color,
          value: action,
          type: 'action'
        });
      }
    });
  });

  // Wild cards (4 of each)
  WILDS.forEach(wild => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: `card-${cardId++}`,
        color: 'wild',
        value: wild,
        type: 'wild'
      });
    }
  });

  return shuffleDeck(deck);
};

const shuffleDeck = (deck: UnoCardData[]): UnoCardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const useUnoGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    drawPile: [],
    discardPile: [],
    direction: 1,
    gamePhase: 'lobby',
    currentBet: 50,
    winner: null
  });

  const initializeGame = useCallback((playerName: string, playerBalance: number) => {
    const deck = generateDeck();
    const players: Player[] = [
      {
        id: 'player-0',
        name: playerName,
        balance: playerBalance,
        cards: [],
        isAI: false
      },
      {
        id: 'player-1',
        name: 'AI Player 1',
        balance: 1000,
        cards: [],
        isAI: true
      },
      {
        id: 'player-2',
        name: 'AI Player 2',
        balance: 1000,
        cards: [],
        isAI: true
      },
      {
        id: 'player-3',
        name: 'AI Player 3',
        balance: 1000,
        cards: [],
        isAI: true
      }
    ];

    // Deal 7 cards to each player
    let cardIndex = 0;
    players.forEach(player => {
      player.cards = deck.slice(cardIndex, cardIndex + 7);
      cardIndex += 7;
    });

    const remainingDeck = deck.slice(cardIndex);
    const firstCard = remainingDeck.pop()!;

    setGameState({
      players,
      currentPlayerIndex: 0,
      drawPile: remainingDeck,
      discardPile: [firstCard],
      direction: 1,
      gamePhase: 'playing',
      currentBet: 50,
      winner: null
    });
  }, []);

  const canPlayCard = useCallback((card: UnoCardData, topCard: UnoCardData): boolean => {
    if (card.type === 'wild') return true;
    if (card.color === topCard.color) return true;
    if (card.value === topCard.value) return true;
    return false;
  }, []);

  const drawCard = useCallback(() => {
    setGameState(prev => {
      if (prev.drawPile.length === 0) return prev;

      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (currentPlayer.isAI) return prev; // AI drawing handled separately

      const newCard = prev.drawPile[prev.drawPile.length - 1];
      const newDrawPile = prev.drawPile.slice(0, -1);
      
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        cards: [...currentPlayer.cards, newCard]
      };

      // Move to next player
      const nextPlayerIndex = (prev.currentPlayerIndex + prev.direction + prev.players.length) % prev.players.length;

      return {
        ...prev,
        players: newPlayers,
        drawPile: newDrawPile,
        currentPlayerIndex: nextPlayerIndex
      };
    });
  }, []);

  const playCard = useCallback((cardId: string) => {
    setGameState(prev => {
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      const card = currentPlayer.cards.find(c => c.id === cardId);
      const topCard = prev.discardPile[prev.discardPile.length - 1];

      if (!card || !canPlayCard(card, topCard)) return prev;

      // Remove card from player's hand
      const newCards = currentPlayer.cards.filter(c => c.id !== cardId);
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        cards: newCards
      };

      // Add card to discard pile
      const newDiscardPile = [...prev.discardPile, card];

      // Check for win condition
      if (newCards.length === 0) {
        return {
          ...prev,
          players: newPlayers,
          discardPile: newDiscardPile,
          gamePhase: 'roundEnd',
          winner: currentPlayer.id
        };
      }

      // Handle special cards
      let nextPlayerIndex = prev.currentPlayerIndex;
      let direction = prev.direction;

      if (card.value === 'skip') {
        nextPlayerIndex = (nextPlayerIndex + direction * 2 + prev.players.length) % prev.players.length;
      } else if (card.value === 'reverse') {
        direction *= -1;
        nextPlayerIndex = (nextPlayerIndex + direction + prev.players.length) % prev.players.length;
      } else if (card.value === '+2' || card.value === '+4') {
        // Next player draws cards and skips turn
        const nextPlayer = (nextPlayerIndex + direction + prev.players.length) % prev.players.length;
        const drawCount = card.value === '+2' ? 2 : 4;
        
        if (prev.drawPile.length >= drawCount) {
          const drawnCards = prev.drawPile.slice(-drawCount);
          newPlayers[nextPlayer] = {
            ...newPlayers[nextPlayer],
            cards: [...newPlayers[nextPlayer].cards, ...drawnCards]
          };
        }
        
        nextPlayerIndex = (nextPlayer + direction + prev.players.length) % prev.players.length;
      } else {
        nextPlayerIndex = (nextPlayerIndex + direction + prev.players.length) % prev.players.length;
      }

      return {
        ...prev,
        players: newPlayers,
        discardPile: newDiscardPile,
        currentPlayerIndex: nextPlayerIndex,
        direction
      };
    });
  }, [canPlayCard]);

  const setBetAmount = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      currentBet: amount
    }));
  }, []);

  const endRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'lobby',
      winner: null,
      players: prev.players.map(p => ({ ...p, cards: [] })),
      drawPile: [],
      discardPile: [],
      currentPlayerIndex: 0
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    drawCard,
    playCard,
    setBetAmount,
    endRound,
    canPlayCard
  };
};