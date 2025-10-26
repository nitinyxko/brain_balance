import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService, { UserData } from '../services/StorageService';
import ApiService from '../services/ApiService';

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  userData: UserData | null;
  streakData: {
    currentStreak: number;
    longestStreak: number;
  } | null;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  checkInForStreak: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [streakData, setStreakData] = useState<AuthContextType['streakData']>(null);

  useEffect(() => {
    checkAuthState();
    // Force reset auth state on app start
    StorageService.clearAllData();
  }, []);

  const checkAuthState = async () => {
    try {
      const [onboardingStatus, userToken, userData, streakData] = await Promise.all([
        StorageService.getOnboardingStatus(),
        StorageService.getUserToken(),
        StorageService.getUserData(),
        StorageService.getStreakData()
      ]);
      
      setHasCompletedOnboarding(false); // Force to false
      setIsAuthenticated(false); // Force to false
      setUserData(null);
      setStreakData(null);
      
      if (!!userToken) {
        await StorageService.updateLastActive();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await StorageService.setOnboardingCompleted(true);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await ApiService.login(email, password);
      await StorageService.saveUserToken(token);
      await StorageService.saveUserData(user);
      await StorageService.updateLastActive();
      
      setUserData(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { user, token } = await ApiService.register(name, email, password);
      await StorageService.saveUserToken(token);
      await StorageService.saveUserData(user);
      await StorageService.updateLastActive();
      
      setUserData(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    try {
      const updatedUser = await ApiService.updateProfile(data);
      await StorageService.saveUserData(updatedUser);
      setUserData(updatedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const checkInForStreak = async () => {
    try {
      const { streak } = await ApiService.updateStreak();
      setStreakData(streak);
      await StorageService.updateStreak(); // Keep local storage in sync
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await StorageService.clearAllData();
      setIsAuthenticated(false);
      setUserData(null);
      setStreakData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedOnboarding,
        isLoading,
        userData,
        streakData,
        completeOnboarding,
        updateUserData,
        checkInForStreak,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export hook for game progress
export const useGameProgress = () => {
  const { isAuthenticated } = useAuth();

  const saveProgress = async (gameProgress: {
    game: string;
    score: number;
    timeSpent: number;
  }) => {
    if (!isAuthenticated) return;

    const currentProgress = await StorageService.getGameProgress();
    const existingGame = currentProgress.find(p => p.game === gameProgress.game);

    const now = new Date().toISOString();
    if (existingGame) {
      const newAverage = (existingGame.averageScore * existingGame.timesPlayed + gameProgress.score) / (existingGame.timesPlayed + 1);
      await StorageService.updateGameProgress({
        ...existingGame,
        highScore: Math.max(existingGame.highScore, gameProgress.score),
        lastPlayed: now,
        timesPlayed: existingGame.timesPlayed + 1,
        averageScore: newAverage,
      });
    } else {
      await StorageService.updateGameProgress({
        game: gameProgress.game,
        highScore: gameProgress.score,
        lastPlayed: now,
        timesPlayed: 1,
        averageScore: gameProgress.score,
      });
    }
  };

  const getProgress = async (game: string) => {
    if (!isAuthenticated) return null;
    const progress = await StorageService.getGameProgress();
    return progress.find(p => p.game === game) || null;
  };

  return {
    saveProgress,
    getProgress,
  };
};