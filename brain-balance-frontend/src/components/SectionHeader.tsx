// src/components/SectionHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

type SectionHeaderProps = {
  title: string;
  description?: string;
  /**
   * Optional right-side action:
   * - icon: Ionicons name
   * - label: optional text shown next to icon
   * - onPress: callback when pressed
   */
  actionIcon?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  containerStyle?: object;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actionIcon,
  actionLabel,
  onActionPress,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {actionIcon && onActionPress ? (
        <TouchableOpacity style={styles.action} onPress={onActionPress}>
          <Ionicons name={actionIcon as any} size={20} color={colors.primary} />
          {actionLabel ? <Text style={styles.actionLabel}>{actionLabel}</Text> : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600' as any,
    color: colors.textPrimary,
  },
  description: {
    marginTop: spacing.xs,
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  actionLabel: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontWeight: '600' as any,
  },
});

export default SectionHeader;
