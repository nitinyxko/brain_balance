import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';

interface OnboardingStep {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to BrainBalance",
    description: "Your journey to digital wellness starts here. Let's create a healthier relationship with technology together.",
    icon: "phone-portrait-outline",
  },
  {
    title: "Identity Verification",
    description: "We keep your data secure and private. Choose how you'd like to verify your identity.",
    icon: "shield-checkmark-outline",
  },
  {
    title: "Pick Your Interests",
    description: "Select topics that matter to you. We'll customize your experience based on your choices.",
    icon: "heart-outline",
  },
  {
    title: "Choose Your Style",
    description: "Set your engagement preferences and notification settings for a personalized experience.",
    icon: "notifications-outline",
  },
];

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await completeOnboarding();
        navigation.navigate('Verification');
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.stepContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={steps[currentStep].icon}
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.description}>{steps[currentStep].description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.onPrimary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.body1.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: typography.body1.fontSize,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.onPrimary,
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
  },
});

export default OnboardingScreen;