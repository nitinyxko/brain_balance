import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import BreathingExercise from '../components/BreathingExercise';
import TaskService, { Task, DailyProgress } from '../services/TaskService';

interface MoodChipProps {
  mood: string;
  selected: boolean;
  onSelect: (mood: string) => void;
}

const MoodChip: React.FC<MoodChipProps> = ({ mood, selected, onSelect }) => (
  <TouchableOpacity onPress={() => onSelect(mood)}>
    <LinearGradient
      colors={selected ? [colors.primary, colors.primaryDark] : ['#f0f0f0', '#e0e0e0']}
      style={[styles.moodChip, selected && styles.moodChipSelected]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.moodChipText, selected && styles.moodChipTextSelected]}>
        {mood}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isBreathingVisible, setIsBreathingVisible] = useState(false);

  useEffect(() => {
    loadTasks();
    loadProgress();
  }, []);

  const loadTasks = async () => {
    const dailyTasks = await TaskService.getTodaysTasks();
    setTasks(dailyTasks);
  };

  const loadProgress = async () => {
    const dailyProgress = await TaskService.getProgress();
    setProgress(dailyProgress);
  };

  const handleTaskComplete = async (taskId: string) => {
    await TaskService.completeTask(taskId);
    await loadTasks();
    await loadProgress();
  };

  const handleBreathingComplete = async () => {
    if (selectedTask) {
      await handleTaskComplete(selectedTask.id);
    }
    setIsBreathingVisible(false);
    setSelectedTask(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.greeting]}>Welcome Back!</Text>
        <Text style={[typography.body1, styles.subGreeting]}>How are you feeling today?</Text>
      </View>

      <View style={styles.moodContainer}>
        <MoodChip
          mood="Good"
          selected={selectedMood === 'Good'}
          onSelect={setSelectedMood}
        />
        <MoodChip
          mood="Meh"
          selected={selectedMood === 'Meh'}
          onSelect={setSelectedMood}
        />
        <MoodChip
          mood="Low"
          selected={selectedMood === 'Low'}
          onSelect={setSelectedMood}
        />
      </View>

      <View style={styles.card}>
        <Text style={[typography.h3, styles.cardTitle]}>Today's Focus</Text>
        {tasks.map((task) => (
          <View key={task.id} style={styles.challengeCard}>
            <Ionicons name={task.icon as any} size={24} color={colors.primary} />
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{task.title}</Text>
              <Text style={styles.challengeDescription}>{task.description}</Text>
              {task.completed && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>
            {!task.completed && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  if (task.type === 'breathing') {
                    setSelectedTask(task);
                    setIsBreathingVisible(true);
                  } else {
                    handleTaskComplete(task.id);
                  }
                }}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={[typography.h3, styles.cardTitle]}>My Progress</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress?.mindfulMinutes || 0}</Text>
            <Text style={styles.statLabel}>Minutes Mindful</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.completed).length || 0}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>
      </View>

      {selectedTask && (
        <BreathingExercise
          visible={isBreathingVisible}
          duration={selectedTask.duration}
          onComplete={handleBreathingComplete}
          onClose={() => {
            setIsBreathingVisible(false);
            setSelectedTask(null);
          }}
        />
      )}
    </ScrollView>
  );
};

interface Style {
  [key: string]: any;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  greeting: {
    ...typography.h2,
    color: colors.onPrimary,
  },
  subGreeting: {
    ...typography.body1,
    color: colors.onPrimary,
    marginTop: spacing.xs,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    marginTop: -spacing.xl,
  },
  moodChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  moodChipSelected: {
    elevation: 4,
  },
  moodChipText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  moodChipTextSelected: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  card: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  challengeContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  challengeTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  challengeDescription: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  startButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  completedText: {
    ...typography.caption,
    color: colors.secondary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
});

export default HomeScreen;