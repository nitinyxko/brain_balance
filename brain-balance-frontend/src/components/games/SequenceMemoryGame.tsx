// app/components/games/SequenceMemoryGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { saveGameProgress } from '../../api/gameProgress';

type OnGameOver = (score: number, opts?: { gameName?: string }) => void;

type Props = {
  onGameOver?: OnGameOver;
};

const TILES = [
  { id: 0, color: '#FF6B6B', label: 'A' },
  { id: 1, color: '#FFD93D', label: 'B' },
  { id: 2, color: '#6BCB77', label: 'C' },
  { id: 3, color: '#4D96FF', label: 'D' },
];

const SequenceMemoryGame: React.FC<Props> = ({ onGameOver }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [round, setRound] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function randomTile(): number {
    return Math.floor(Math.random() * TILES.length);
  }

  function startGame() {
    setSequence([]);
    setRound(0);
    setPlayerIndex(0);
    setStartedAt(Date.now());
    // small delay then add first tile
    timeoutRef.current = setTimeout(() => {
      setSequence([randomTile()]);
      setRound(1);
    }, 150);
  }

  // whenever sequence length changes, play it
  useEffect(() => {
    if (sequence.length > 0) playSequence(sequence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence.length]);

  function playSequence(seq: number[]) {
    setIsPlayingSequence(true);
    setActiveTile(null);
    let i = 0;

    const playNext = () => {
      if (i >= seq.length) {
        setIsPlayingSequence(false);
        setPlayerIndex(0);
        return;
      }

      setActiveTile(seq[i]);
      timeoutRef.current = setTimeout(() => {
        setActiveTile(null);
        i++;
        timeoutRef.current = setTimeout(playNext, 250);
      }, 600);
    };

    playNext();
  }

  async function handleTilePress(id: number) {
    if (isPlayingSequence) return;
    if (sequence.length === 0) return;

    const expected = sequence[playerIndex];
    if (id !== expected) {
      // game over
      const endTime = Date.now();
      const timeSpent = startedAt ? Math.round((endTime - startedAt) / 1000) : 0;
      const score = Math.max(0, (round - 1) * 10);

      try {
        await saveGameProgress({ game: 'sequence', score, timeSpent });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('SequenceMemoryGame: save error', e);
      }

      if (typeof onGameOver === 'function') {
        try {
          onGameOver(score, { gameName: 'Pattern Path' });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('onGameOver callback error', e);
        }
      }

      Alert.alert('Game over', `You reached round ${Math.max(0, round - 1)}. Score: ${score}`);

      // reset local state
      setSequence([]);
      setRound(0);
      setPlayerIndex(0);
      setStartedAt(null);
      return;
    }

    // correct press
    const nextPlayerIndex = playerIndex + 1;
    setPlayerIndex(nextPlayerIndex);

    if (nextPlayerIndex >= sequence.length) {
      // completed the round
      setRound((r) => r + 1);
      // add a new tile after short delay
      timeoutRef.current = setTimeout(() => {
        setSequence((s) => [...s, randomTile()]);
      }, 500);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pattern Path</Text>
      <Text style={styles.subtitle}>Round: {Math.max(0, round - 1)}</Text>

      <View style={styles.grid}>
        {TILES.map((t) => {
          const active = activeTile === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              disabled={isPlayingSequence}
              onPress={() => handleTilePress(t.id)}
              style={[
                styles.tile,
                { backgroundColor: t.color, opacity: active ? 1 : 0.85 },
              ]}
            >
              <Text style={styles.tileLabel}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={startGame}>
          <Text style={styles.controlText}>New Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background, flex: 1 },
  title: { fontSize: typography.h3.fontSize, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.sm },
  tile: { width: '48%', height: 140, borderRadius: 12, marginBottom: spacing.sm, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  tileLabel: { color: '#fff', fontWeight: '800', fontSize: 22 },
  controls: { marginTop: spacing.md, alignItems: 'center' },
  controlButton: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, elevation: 2 },
  controlText: { color: colors.textPrimary, fontWeight: '700' },
});

export default SequenceMemoryGame;
