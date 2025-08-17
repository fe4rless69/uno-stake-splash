import { useState, useEffect } from 'react';

interface PlayerData {
  username: string;
  balance: number;
  gamesPlayed: number;
  gamesWon: number;
}

const COOKIE_NAME = 'unoGamblePlayerData';
const DEFAULT_BALANCE = 500;

export const usePlayerData = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load player data from cookie
  useEffect(() => {
    const loadPlayerData = () => {
      try {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${COOKIE_NAME}=`))
          ?.split('=')[1];

        if (cookieValue) {
          const data = JSON.parse(decodeURIComponent(cookieValue));
          setPlayerData(data);
        }
      } catch (error) {
        console.error('Failed to load player data from cookie:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPlayerData();
  }, []);

  // Save player data to cookie
  const savePlayerData = (data: PlayerData) => {
    try {
      const cookieValue = encodeURIComponent(JSON.stringify(data));
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
      
      document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      setPlayerData(data);
    } catch (error) {
      console.error('Failed to save player data to cookie:', error);
    }
  };

  // Create new player
  const createPlayer = (username: string) => {
    const newPlayer: PlayerData = {
      username,
      balance: DEFAULT_BALANCE,
      gamesPlayed: 0,
      gamesWon: 0
    };
    savePlayerData(newPlayer);
    return newPlayer;
  };

  // Update balance
  const updateBalance = (newBalance: number) => {
    if (playerData) {
      const updatedData = { ...playerData, balance: newBalance };
      savePlayerData(updatedData);
    }
  };

  // Record game result
  const recordGameResult = (won: boolean) => {
    if (playerData) {
      const updatedData = {
        ...playerData,
        gamesPlayed: playerData.gamesPlayed + 1,
        gamesWon: won ? playerData.gamesWon + 1 : playerData.gamesWon
      };
      savePlayerData(updatedData);
    }
  };

  // Update username
  const updateUsername = (newUsername: string) => {
    if (playerData) {
      const updatedData = { ...playerData, username: newUsername };
      savePlayerData(updatedData);
    }
  };

  // Clear player data (logout)
  const clearPlayerData = () => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setPlayerData(null);
  };

  return {
    playerData,
    isLoaded,
    createPlayer,
    updateBalance,
    recordGameResult,
    updateUsername,
    clearPlayerData,
    savePlayerData
  };
};