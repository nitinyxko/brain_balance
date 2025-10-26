import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const JournalScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity style={styles.newEntryButton}>
          <Ionicons name="add" size={24} color={colors.onPrimary} />
          <Text style={styles.newEntryText}>New Entry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          placeholder="Search entries..."
          style={styles.searchInput}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>October 14, 2025</Text>
          <Text style={styles.entryTime}>2:30 PM</Text>
        </View>
        <Text style={styles.entryTitle}>Morning Reflection</Text>
        <Text style={styles.entryPreview}>
          Today I feel more focused after completing the brain training exercises. 
          I noticed that my attention span has improved...
        </Text>
        <View style={styles.entryFooter}>
          <View style={styles.moodTag}>
            <Ionicons name="happy-outline" size={16} color={colors.primary} />
            <Text style={styles.moodText}>Positive</Text>
          </View>
        </View>
      </View>

      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>October 13, 2025</Text>
          <Text style={styles.entryTime}>7:45 PM</Text>
        </View>
        <Text style={styles.entryTitle}>Evening Check-in</Text>
        <Text style={styles.entryPreview}>
          Completed all my daily goals today. The meditation session was particularly 
          helpful in managing screen time...
        </Text>
        <View style={styles.entryFooter}>
          <View style={styles.moodTag}>
            <Ionicons name="sunny-outline" size={16} color={colors.primary} />
            <Text style={styles.moodText}>Calm</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  newEntryText: {
    color: colors.onPrimary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.body1.fontSize,
    color: colors.textPrimary,
  },
  entryCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  entryDate: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
  entryTime: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
  entryTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  entryPreview: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    marginLeft: spacing.xs,
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
});

export default JournalScreen;