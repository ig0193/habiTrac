import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Screen } from '../types';

interface AppState {
  currentUser: User | null;
  screen: Screen;
  setCurrentUser: (user: User) => void;
  navigate: (screen: Screen) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>({ type: 'join' });

  const navigate = useCallback((s: Screen) => setScreen(s), []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setScreen({ type: 'join' });
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, screen, setCurrentUser, navigate, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
