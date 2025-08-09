import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { createApiUrl } from '@/lib/backendUrl';

interface SteamUser {
  steamID: string;
  steamName: string;
  avatar?: string;
}

interface SelectedGame {
  appid: number;
  name: string;
}

interface SteamContextType {
  steamUser: SteamUser | null;
  setSteamUser: (user: SteamUser | null) => void;
  selectedGame: SelectedGame | null;
  setSelectedGame: (game: SelectedGame | null) => void;
  isLoading: boolean;
  fetchSteamUser: () => Promise<void>;
}

const SteamContext = createContext<SteamContextType | undefined>(undefined);

export function useSteam() {
  const context = useContext(SteamContext);
  if (context === undefined) {
    throw new Error('useSteam must be used within a SteamProvider');
  }
  return context;
}

interface SteamProviderProps {
  children: ReactNode;
}

export function SteamProvider({ children }: SteamProviderProps) {
  const [steamUser, setSteamUser] = useState<SteamUser | null>(null);
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentAccount = useCurrentAccount();

  const fetchSteamUser = async () => {
    if (!currentAccount?.address) {
      setSteamUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(createApiUrl('/api/user/get_steamid'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: currentAccount.address }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.steamID) {
          // Fetch additional Steam profile data
          const profileResponse = await fetch(createApiUrl('/api/user/get_steam_profile'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ steamid: data.steamID }),
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setSteamUser({
              steamID: data.steamID,
              steamName: profileData.personaName || 'Unknown User',
              avatar: profileData.avatar || profileData.avatarMedium || profileData.avatarFull
            });
          } else {
            setSteamUser({
              steamID: data.steamID,
              steamName: 'Unknown User'
            });
          }
        } else {
          setSteamUser(null);
        }
      } else {
        setSteamUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch Steam user:', error);
      setSteamUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Steam user data when wallet changes
  useEffect(() => {
    fetchSteamUser();
  }, [currentAccount?.address]);

  // Listen for Steam auth completion via URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamId = params.get("steamId");
    const displayName = params.get("displayName");
    
    if (steamId && displayName && currentAccount?.address) {
      setSteamUser({
        steamID: steamId,
        steamName: displayName
      });
    }
  }, [currentAccount?.address]);

  return (
    <SteamContext.Provider value={{ steamUser, setSteamUser, selectedGame, setSelectedGame, isLoading, fetchSteamUser }}>
      {children}
    </SteamContext.Provider>
  );
}
