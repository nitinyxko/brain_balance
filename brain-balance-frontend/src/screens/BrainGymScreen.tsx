// app/screens/BrainGymScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../theme';

// ✅ Ensure these exist and are default exports
import NBackGame from '../components/games/NBackGame';
import SequenceMemoryGame from '../components/games/SequenceMemoryGame';

// --------------------
// TYPES
// --------------------
type GameType = 'nback' | 'sequence' | null;

interface GameOverOptions {
  gameName?: string;
}

// --------------------
// COMPONENT
// --------------------
const BrainGymScreen: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const onGameOver = (score: number | string | null, opts: GameOverOptions = {}) => {
    const gameName = opts.gameName || 'Game';
    const displayScore = score != null ? score : 'N/A';

    setSelectedGame(null);
    Alert.alert(
      `${gameName} Completed`,
      `Your Score: ${displayScore}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderGameContent = () => {
    switch (selectedGame) {
      case 'nback':
        return (
          <NBackGame
            n={2}
            length={24}
            onGameOver={(score: number) =>
              onGameOver(score, { gameName: 'N-Back' })
            }
          />
        );

      case 'sequence':
        return (
          <SequenceMemoryGame
            onGameOver={(score: number) =>
              onGameOver(score, { gameName: 'Pattern Path' })
            }
          />
        );

      default:
        return (
          <>
            <Text style={styles.title}>Brain Gym</Text>

            <View style={styles.dailyPlan}>
              <Text style={styles.sectionTitle}>Today's Training Plan</Text>
              <Text style={styles.duration}>Estimated time: 15 minutes</Text>
            </View>

            <View style={styles.gamesContainer}>
              {/* N-Back Game */}
              <TouchableOpacity
                style={styles.gameCard}
                onPress={() => setSelectedGame('nback')}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.gameIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="grid-outline" size={24} color="white" />
                </LinearGradient>

                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>N-Back</Text>
                  <Text style={styles.gameDescription}>Train working memory</Text>
                  <Text style={styles.gameDuration}>5 min</Text>
                </View>
              </TouchableOpacity>

              {/* Pattern Path Game */}
              <TouchableOpacity
                style={styles.gameCard}
                onPress={() => setSelectedGame('sequence')}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  style={styles.gameIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="git-branch-outline" size={24} color="white" />
                </LinearGradient>

                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>Pattern Path</Text>
                  <Text style={styles.gameDescription}>
                    Sequence recall challenge
                  </Text>
                  <Text style={styles.gameDuration}>5 min</Text>
                </View>
              </TouchableOpacity>

              {/* Stroop Test (Coming Soon) */}
              <TouchableOpacity
                style={styles.gameCard}
                onPress={() =>
                  Alert.alert('Coming Soon', 'Stroop Test is coming soon!')
                }
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.gameIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="color-palette-outline" size={24} color="white" />
                </LinearGradient>

                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>Stroop Test</Text>
                  <Text style={styles.gameDescription}>
                    Color-word challenge
                  </Text>
                  <Text style={styles.gameDuration}>Coming soon</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {selectedGame ? (
        <View style={styles.gameContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedGame(null)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          {renderGameContent()}
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
          {renderGameContent()}
        </ScrollView>
      )}
    </View>
  );
};

// --------------------
// STYLES
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gameContainer: {
    flex: 1,
  },
  backButton: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textPrimary,
    margin: spacing.md,
  },
  dailyPlan: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  duration: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  gamesContainer: {
    padding: spacing.md,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.md,
    elevation: 2,
    alignItems: 'center',
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  gameName: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  gameDescription: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gameDuration: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});

export default BrainGymScreen;
