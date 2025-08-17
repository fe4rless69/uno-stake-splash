import React, { useState, useEffect } from 'react';
import { usePlayerData } from '@/hooks/usePlayerData';
import PlayerLogin from '@/components/PlayerLogin';
import GameLobby from '@/components/GameLobby';
import GameRoom from '@/components/GameRoom';

type GameScreen = 'login' | 'lobby' | 'game';

const Index = () => {
  const { playerData, isLoaded, createPlayer, updateBalance, clearPlayerData } = usePlayerData();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('login');
  const [currentBet, setCurrentBet] = useState(50);

  // Mock players for lobby (in a real app, this would come from server)
  const [mockPlayers, setMockPlayers] = useState([
    { id: 'player-1', name: playerData?.username || 'Player', balance: playerData?.balance || 500, isReady: true }
  ]);

  useEffect(() => {
    if (isLoaded) {
      if (playerData) {
        setCurrentScreen('lobby');
        setMockPlayers([
          { id: 'player-1', name: playerData.username, balance: playerData.balance, isReady: true }
        ]);
      } else {
        setCurrentScreen('login');
      }
    }
  }, [isLoaded, playerData]);

  const handleLogin = (username: string) => {
    createPlayer(username);
    setCurrentScreen('lobby');
  };

  const handleLogout = () => {
    clearPlayerData();
    setCurrentScreen('login');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToLobby = () => {
    setCurrentScreen('lobby');
  };

  const handleBetChange = (amount: number) => {
    setCurrentBet(amount);
  };

  const handleUpdateBalance = (newBalance: number) => {
    updateBalance(newBalance);
    // Update mock player balance
    setMockPlayers(prev => 
      prev.map(p => 
        p.id === 'player-1' 
          ? { ...p, balance: newBalance }
          : p
      )
    );
  };

  // Show loading screen while checking cookies
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <div className="text-gold font-bold text-lg">Loading Casino...</div>
        </div>
      </div>
    );
  }

  // Render appropriate screen
  switch (currentScreen) {
    case 'login':
      return <PlayerLogin onLogin={handleLogin} />;
    
    case 'lobby':
      return (
        <GameLobby
          playerName={playerData?.username || 'Player'}
          playerBalance={playerData?.balance || 500}
          players={mockPlayers}
          currentBet={currentBet}
          onBetChange={handleBetChange}
          onStartGame={handleStartGame}
          onLogout={handleLogout}
        />
      );
    
    case 'game':
      return (
        <GameRoom
          playerName={playerData?.username || 'Player'}
          playerBalance={playerData?.balance || 500}
          onUpdateBalance={handleUpdateBalance}
          onBackToLobby={handleBackToLobby}
        />
      );
    
    default:
      return <PlayerLogin onLogin={handleLogin} />;
  }
};

export default Index;
