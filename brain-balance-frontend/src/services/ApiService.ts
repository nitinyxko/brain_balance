import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  ios: 'http://192.168.29.221:5000/api',
  android: 'http://192.168.29.221:5000/api',
  web: 'http://192.168.29.221:5000/api',
});

class ApiService {
  static async getHeaders() {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Auth APIs
  static async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    await AsyncStorage.setItem('userToken', data.token);
    return data;
  }

  static async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    await AsyncStorage.setItem('userToken', data.token);
    return data;
  }

  static async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  }

  // Game APIs
  static async saveGameProgress(gameData: {
    game: string;
    score: number;
    timeSpent: number;
  }) {
    const response = await fetch(`${API_URL}/games/progress`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error('Failed to save game progress');
    }

    return response.json();
  }

  static async getGameProgress(game: string) {
    const response = await fetch(`${API_URL}/games/progress/${game}`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok && response.status !== 404) {
      throw new Error('Failed to get game progress');
    }

    return response.status === 404 ? null : response.json();
  }

  // Journal APIs
  static async createJournalEntry(entryData: {
    title: string;
    content: string;
    mood: string;
    tags?: string[];
  }) {
    const response = await fetch(`${API_URL}/journal/entries`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create journal entry');
    }

    return response.json();
  }

  static async getJournalEntries() {
    const response = await fetch(`${API_URL}/journal/entries`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get journal entries');
    }

    return response.json();
  }

  // Community APIs
  static async getCommunities() {
    const response = await fetch(`${API_URL}/communities`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get communities');
    }

    return response.json();
  }

  static async joinCommunity(communityId: string) {
    const response = await fetch(`${API_URL}/communities/${communityId}/join`, {
      method: 'POST',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to join community');
    }

    return response.json();
  }

  static async createPost(communityId: string, content: string) {
    const response = await fetch(`${API_URL}/communities/${communityId}/posts`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return response.json();
  }

  // User Data & Settings
  static async updateProfile(userData: {
    name?: string;
    avatar?: string;
    preferences?: any;
  }) {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  static async updateStreak() {
    const response = await fetch(`${API_URL}/auth/streak`, {
      method: 'POST',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to update streak');
    }

    return response.json();
  }
}

export default ApiService;