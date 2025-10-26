import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  BRAIN_GYM_PROGRESS: 'brainGymProgress',
  JOURNAL_ENTRIES: 'journalEntries',
  USER_SETTINGS: 'userSettings',
  STREAK_DATA: 'streakData',
  LAST_ACTIVE: 'lastActive',
};

export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    reminders: boolean;
    reminderTime?: string;
  };
}

interface GameProgress {
  game: string;
  highScore: number;
  lastPlayed: string;
  timesPlayed: number;
  averageScore: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string;
}

class StorageService {
  // User Authentication
  static async saveUserToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  }

  static async getUserToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  }

  static async saveUserData(userData: UserData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  static async getUserData(): Promise<UserData | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  // Onboarding Status
  static async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, String(completed));
  }

  static async getOnboardingStatus(): Promise<boolean> {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return status === 'true';
  }

  // Brain Gym Progress
  static async saveGameProgress(progress: GameProgress[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.BRAIN_GYM_PROGRESS, JSON.stringify(progress));
  }

  static async getGameProgress(): Promise<GameProgress[]> {
    const progress = await AsyncStorage.getItem(STORAGE_KEYS.BRAIN_GYM_PROGRESS);
    return progress ? JSON.parse(progress) : [];
  }

  static async updateGameProgress(newProgress: GameProgress): Promise<void> {
    const progress = await this.getGameProgress();
    const index = progress.findIndex(p => p.game === newProgress.game);
    
    if (index !== -1) {
      progress[index] = newProgress;
    } else {
      progress.push(newProgress);
    }
    
    await this.saveGameProgress(progress);
  }

  // Streak Management
  static async getStreakData(): Promise<StreakData> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    return data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: '',
    };
  }

  static async updateStreak(): Promise<void> {
    const streakData = await this.getStreakData();
    const now = new Date();
    const lastCheckIn = streakData.lastCheckIn ? new Date(streakData.lastCheckIn) : null;
    
    // Check if this is a consecutive day
    if (lastCheckIn) {
      const timeDiff = now.getTime() - lastCheckIn.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        streakData.currentStreak += 1;
        streakData.longestStreak = Math.max(streakData.currentStreak, streakData.longestStreak);
      } else if (daysDiff > 1) {
        // Streak broken
        streakData.currentStreak = 1;
      }
    } else {
      // First check-in
      streakData.currentStreak = 1;
      streakData.longestStreak = 1;
    }
    
    streakData.lastCheckIn = now.toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
  }

  // Activity Tracking
  static async updateLastActive(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, new Date().toISOString());
  }

  static async getLastActive(): Promise<Date | null> {
    const lastActive = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
    return lastActive ? new Date(lastActive) : null;
  }

  // Settings Management
  static async saveUserSettings(settings: UserData['preferences']): Promise<void> {
    const userData = await this.getUserData();
    if (userData) {
      userData.preferences = settings;
      await this.saveUserData(userData);
    }
  }

  // Complete Reset (Logout)
  static async clearAllData(): Promise<void> {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  }
}

export default StorageService;