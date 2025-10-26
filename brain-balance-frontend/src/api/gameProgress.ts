// app/api/gameProgress.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavePayload = {
  game: string;
  score: number;
  timeSpent?: number;
};

const API_BASE_URL = 'http://10.0.2.2:3000/api/games'; // update if needed

export async function saveGameProgress(payload: SavePayload): Promise<any> {
  const { game, score, timeSpent = 0 } = payload;
  if (!game || typeof score !== 'number') {
    throw new Error('Missing required fields: game or score');
  }

  const token = await AsyncStorage.getItem('authToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/progress`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ game, score, timeSpent }),
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${body.error || text}`);
  }

  return body;
}
