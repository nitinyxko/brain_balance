import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';

const VerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [verificationMethod, setVerificationMethod] = useState<'facescan' | 'id' | null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          Choose your preferred verification method to continue
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.optionCard,
          verificationMethod === 'facescan' && styles.selectedCard,
        ]}
        onPress={() => setVerificationMethod('facescan')}
      >
        <Ionicons name="scan-outline" size={32} color={colors.primary} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Face Scan</Text>
          <Text style={styles.optionDescription}>
            Quick and secure verification using your camera
          </Text>
        </View>
        <Ionicons
          name={verificationMethod === 'facescan' ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={verificationMethod === 'facescan' ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionCard,
          verificationMethod === 'id' && styles.selectedCard,
        ]}
        onPress={() => setVerificationMethod('id')}
      >
        <Ionicons name="card-outline" size={32} color={colors.primary} />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>ID Verification</Text>
          <Text style={styles.optionDescription}>
            Upload your ID and take a selfie
          </Text>
        </View>
        <Ionicons
          name={verificationMethod === 'id' ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={verificationMethod === 'id' ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !verificationMethod && styles.continueButtonDisabled,
          ]}
          disabled={!verificationMethod}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
          <Text style={styles.skipDescription}>
            Some features will be limited
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body1.fontSize,
    color: colors.textSecondary,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  optionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  optionTitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.onPrimary,
    fontSize: typography.body1.fontSize,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: typography.body1.fontSize,
  },
  skipDescription: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
});

export default VerificationScreen;