// src/screens/BreathingExercise.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors, spacing, typography } from '../theme';

interface BreathingExerciseProps {
  visible: boolean;
  duration: number; // minutes
  onComplete?: () => void; // optional now
  onClose?: () => void;    // optional now
  title?: string;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  visible,
  duration,
  onComplete,
  onClose,
  title = 'Mindful Breathing',
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
  }, [duration, visible]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
          { shouldPlay: false }
        );
        if (mounted) soundRef.current = sound;
      } catch (e) {
        console.warn('Failed to load sound', e);
      }
    })();

    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    }

    if (isActive && timeLeft > 0) {
      intervalRef.current = (setInterval(() => {
        setTimeLeft((prev) => {
          // play sound at 4s boundaries (inhale/exhale)
          try {
            if (soundRef.current && prev % 4 === 0) {
              soundRef.current.replayAsync().catch(() => {});
            }
          } catch (e) {}

          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current as unknown as number);
              intervalRef.current = null;
            }
            setIsActive(false);
            // call optional onComplete and then auto-close
            try { onComplete?.(); } catch (e) {}
            // small delay for UX, then close if onClose provided
            setTimeout(() => { try { onClose?.(); } catch (e) {} }, 200);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown) as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
    };
  }, [isActive, timeLeft, onComplete, onClose]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isActive) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      breatheAnim.stopAnimation();
      breatheAnim.setValue(0);
      if (animation) animation.stop();
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isActive, breatheAnim]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const scale = breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });

  const handleClose = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    try { onClose?.(); } catch (e) {}
  };

  const primaryLight = (colors as any).primaryLight ? (colors as any).primaryLight : `${colors.primary}20`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

          <Animated.View style={[styles.breathCircle, { transform: [{ scale }], backgroundColor: primaryLight }]} />

          <Text style={styles.instruction}>
            {isActive ? (timeLeft % 8 < 4 ? 'Breathe In...' : 'Breathe Out...') : 'Ready to begin?'}
          </Text>

          {!isActive && timeLeft > 0 && (
            <TouchableOpacity style={styles.startButton} onPress={() => setIsActive(true)}>
              <Text style={styles.startButtonText}>{timeLeft === duration * 60 ? 'Start' : 'Resume'}</Text>
            </TouchableOpacity>
          )}

          {isActive && (
            <TouchableOpacity style={[styles.startButton, styles.pauseButton]} onPress={() => setIsActive(false)}>
              <Text style={styles.startButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.lg, width: '90%', alignItems: 'center', minHeight: 400 },
  closeButton: { position: 'absolute', right: spacing.md, top: spacing.md, padding: spacing.sm },
  title: { fontSize: typography.h2.fontSize, fontWeight: 'bold' as any, color: colors.textPrimary, marginBottom: spacing.md },
  timer: { fontSize: 48, fontWeight: 'bold' as any, color: colors.primary, marginVertical: spacing.lg },
  breathCircle: { width: 150, height: 150, borderRadius: 75, marginVertical: spacing.lg },
  instruction: { fontSize: 20, color: colors.textPrimary, marginVertical: spacing.lg },
  startButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 25, marginTop: spacing.lg },
  pauseButton: { backgroundColor: colors.secondary },
  startButtonText: { color: colors.onPrimary, fontSize: 18, fontWeight: 'bold' as any },
});

export default BreathingExercise;
