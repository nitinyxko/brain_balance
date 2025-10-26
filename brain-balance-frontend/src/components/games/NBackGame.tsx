// app/components/games/NBackGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import { saveGameProgress } from '../../api/gameProgress';

type OnGameOver = (score: number, opts?: { gameName?: string }) => void;

type Props = {
  n?: number; // n-back level
  length?: number; // number of stimuli
  onGameOver?: OnGameOver;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function randomLetter(): string {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

const NBackGame: React.FC<Props> = ({ n = 2, length = 24, onGameOver }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [running, setRunning] = useState<boolean>(false);
  const [correctMatches, setCorrectMatches] = useState<number>(0);
  const [falseAlarms, setFalseAlarms] = useState<number>(0);
  const [userPressedThisStep, setUserPressedThisStep] = useState<boolean>(false);

  // timers
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generateSequence = (len: number) => {
    const seq = Array.from({ length: len }, () => randomLetter());

    // force a few true matches so the game isn't impossible
    const forcedMatches = Math.max(1, Math.floor(len / 8));
    for (let j = 0; j < forcedMatches; j++) {
      const pos = Math.floor(Math.random() * (len - n)) + n;
      seq[pos] = seq[pos - n];
    }

    setSequence(seq);
    setIndex(-1);
    setCorrectMatches(0);
    setFalseAlarms(0);
    setUserPressedThisStep(false);
  };

  const start = () => {
    generateSequence(length);
    setRunning(true);
    startTimeRef.current = Date.now();
    // small delay then start showing
    timerRef.current = setTimeout(() => advance(), 400);
  };

  const stop = async (manual = false) => {
    setRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const endTime = Date.now();
    const timeSpent = startTimeRef.current
      ? Math.round((endTime - startTimeRef.current) / 1000)
      : 0;

    // calculate missed matches
    let totalTrueMatches = 0;
    for (let i = n; i < sequence.length; i++) {
      if (sequence[i] === sequence[i - n]) totalTrueMatches++;
    }
    const missedMatches = Math.max(0, totalTrueMatches - correctMatches);

    const rawScore = correctMatches - falseAlarms;
    const score = Math.max(0, rawScore);

    // attempt to save remotely (non-blocking)
    try {
      await saveGameProgress({ game: 'nback', score, timeSpent });
    } catch (e) {
      // log and continue
      // eslint-disable-next-line no-console
      console.warn('NBackGame: failed to save progress', e);
    }

    if (typeof onGameOver === 'function') {
      try {
        onGameOver(score, { gameName: 'N-Back' });
      } catch (e) {
        // swallow callback error
        // eslint-disable-next-line no-console
        console.warn('NBackGame: onGameOver callback error', e);
      }
    }

    if (!manual) {
      Alert.alert(
        'N-Back finished',
        `Score: ${score}\nCorrect: ${correctMatches}\nFalse: ${falseAlarms}\nMissed: ${missedMatches}\nTime: ${timeSpent}s`
      );
    }
  };

  const advance = () => {
    setUserPressedThisStep(false);
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= sequence.length) {
        // finish after slight delay
        timerRef.current = setTimeout(() => stop(false), 300);
        return prev;
      }

      // schedule next advance
      timerRef.current = setTimeout(() => {
        advance();
      }, 1100); // ms per stimulus

      return next;
    });
  };

  const onPressMatch = () => {
    if (!running || index < 0 || index >= sequence.length) return;
    if (userPressedThisStep) return;
    setUserPressedThisStep(true);

    const isTrue = index >= n && sequence[index] === sequence[index - n];
    if (isTrue) {
      setCorrectMatches((c) => c + 1);
    } else {
      setFalseAlarms((f) => f + 1);
    }
  };

  const displayedLetter =
    index >= 0 && index < sequence.length ? sequence[index] : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>N-Back</Text>

      <View style={styles.controls}>
        <Text style={styles.info}>Level: {n}-back</Text>
        <Text style={styles.info}>Stimuli: {length}</Text>
        <Text style={styles.info}>
          Progress: {Math.max(0, index + 1)}/{sequence.length}
        </Text>
      </View>

      <View style={styles.stimulusBox}>
        <Text style={styles.letter}>
          {displayedLetter || (running ? '...' : '')}
        </Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.matchButton}
          onPress={onPressMatch}
          disabled={!running}
          accessibilityLabel="Press if this matches N back"
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.matchGradient}
          >
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.matchText}>Match</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.surface }]}
          onPress={() => {
            if (running) stop(true);
            else start();
          }}
        >
          <Text style={styles.controlButtonText}>
            {running ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.stat}>Correct: {correctMatches}</Text>
        <Text style={styles.stat}>False: {falseAlarms}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background, flex: 1 },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  info: { color: colors.textSecondary, fontSize: typography.body2.fontSize },
  stimulusBox: {
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
  },
  letter: { fontSize: 64, color: colors.textPrimary, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchButton: { flex: 1, marginRight: spacing.sm, borderRadius: 12, overflow: 'hidden' },
  matchGradient: { padding: spacing.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  matchText: { color: '#fff', marginLeft: spacing.xs, fontWeight: '700' },
  controlButton: { padding: spacing.md, borderRadius: 12, minWidth: 110, alignItems: 'center', justifyContent: 'center' },
  controlButtonText: { color: colors.textPrimary, fontWeight: '700' },
  stats: { marginTop: spacing.md, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { color: colors.textSecondary },
});

export default NBackGame;
