import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'mindfulness' | 'exercise' | 'social' | 'learning';
  icon: string;
  duration: number; // in minutes
  completed: boolean;
  timestamp?: string;
}

export interface DailyProgress {
  date: string;
  tasksCompleted: number;
  mindfulMinutes: number;
  journalEntries: number;
  breathingExercises: number;
  streak: number;
}

const STORAGE_KEYS = {
  TASKS: 'daily_tasks',
  PROGRESS: 'daily_progress',
};

class TaskService {
  static dailyTasks: Task[] = [
    {
      id: 'breathing-walk',
      title: '5-min Breathing Walk',
      description: 'Take a mindful walk while focusing on your breath',
      type: 'breathing',
      icon: 'walk-outline',
      duration: 5,
      completed: false,
    },
    {
      id: 'meditation',
      title: 'Morning Meditation',
      description: 'Start your day with a calm mind',
      type: 'mindfulness',
      icon: 'sunny-outline',
      duration: 10,
      completed: false,
    },
    {
      id: 'digital-detox',
      title: 'Digital Detox',
      description: 'Take a break from screens',
      type: 'mindfulness',
      icon: 'phone-off-outline',
      duration: 30,
      completed: false,
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      description: "Write down three things you're grateful for",
      type: 'learning',
      icon: 'journal-outline',
      duration: 5,
      completed: false,
    },
    {
      id: 'brain-game',
      title: 'Brain Training',
      description: 'Complete one brain training exercise',
      type: 'learning',
      icon: 'fitness-outline',
      duration: 15,
      completed: false,
    },
  ];

  static async getTodaysTasks(): Promise<Task[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedTasks = await AsyncStorage.getItem(`${STORAGE_KEYS.TASKS}_${today}`);
      
      if (!storedTasks) {
        // If no tasks are stored for today, initialize with default tasks
        await this.initializeTodaysTasks();
        return this.dailyTasks;
      }
      
      return JSON.parse(storedTasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      return this.dailyTasks;
    }
  }

  static async initializeTodaysTasks(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.TASKS}_${today}`,
      JSON.stringify(this.dailyTasks)
    );
  }

  static async completeTask(taskId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tasks = await this.getTodaysTasks();
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: true, timestamp: new Date().toISOString() }
          : task
      );
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.TASKS}_${today}`,
        JSON.stringify(updatedTasks)
      );
      
      await this.updateProgress(updatedTasks);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  static async updateProgress(tasks: Task[]): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentProgress = await this.getProgress();
      
      const newProgress: DailyProgress = {
        date: today,
        tasksCompleted: tasks.filter(t => t.completed).length,
        mindfulMinutes: tasks
          .filter(t => t.completed && (t.type === 'mindfulness' || t.type === 'breathing'))
          .reduce((acc, t) => acc + t.duration, 0),
        journalEntries: tasks.filter(t => t.completed && t.type === 'learning').length,
        breathingExercises: tasks.filter(t => t.completed && t.type === 'breathing').length,
        streak: this.calculateStreak(currentProgress),
      };
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.PROGRESS}_${today}`,
        JSON.stringify(newProgress)
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  static async getProgress(): Promise<DailyProgress | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progress = await AsyncStorage.getItem(`${STORAGE_KEYS.PROGRESS}_${today}`);
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  private static calculateStreak(currentProgress: DailyProgress | null): number {
    if (!currentProgress) return 1;
    return currentProgress.streak + 1;
  }
}

export default TaskService;