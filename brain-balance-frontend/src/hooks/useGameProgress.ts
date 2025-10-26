import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

export const useGameProgress = (game: string) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [game]);

  const loadProgress = async () => {
    try {
      const data = await ApiService.getGameProgress(game);
      setProgress(data);
      setError(null);
    } catch (err) {
      setError('Failed to load game progress');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (score: number, timeSpent: number) => {
    try {
      setLoading(true);
      const updatedProgress = await ApiService.saveGameProgress({
        game,
        score,
        timeSpent,
      });
      setProgress(updatedProgress);
      setError(null);
      return updatedProgress;
    } catch (err) {
      setError('Failed to save game progress');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    progress,
    loading,
    error,
    saveProgress,
    refreshProgress: loadProgress,
  };
};