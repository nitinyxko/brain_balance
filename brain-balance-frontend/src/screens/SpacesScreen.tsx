import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import SectionHeader from '../components/SectionHeader';

interface Space {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  saved: boolean;
  tags: string[];
  imageUrl?: string;
}

const SAMPLE_SPACES: Space[] = [
  {
    id: '1',
    title: 'Building Better Digital Habits',
    content: 'Discover practical strategies to develop healthier relationships with technology...',
    author: 'Dr. Sarah Chen',
    likes: 342,
    saved: false,
    tags: ['Digital Wellness', 'Habits'],
    imageUrl: 'https://example.com/placeholder1.jpg',
  },
  {
    id: '2',
    title: 'Mindful Content Consumption',
    content: 'Learn how to be more conscious about the content you consume online...',
    author: 'Marcus Thompson',
    likes: 256,
    saved: true,
    tags: ['Mindfulness', 'Content'],
  },
  {
    id: '3',
    title: '5-Minute Focus Exercises',
    content: 'Quick exercises to improve your concentration and mental clarity...',
    author: 'Emma Rodriguez',
    likes: 189,
    saved: false,
    tags: ['Focus', 'Exercises'],
    imageUrl: 'https://example.com/placeholder2.jpg',
  },
];

const SpaceCard: React.FC<{ space: Space }> = ({ space }) => {
  const [isSaved, setIsSaved] = useState(space.saved);
  
  return (
    <View style={styles.spaceCard}>
      {space.imageUrl && (
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
          </View>
        </View>
      )}
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          {space.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.spaceTitle}>{space.title}</Text>
        <Text style={styles.spaceContent} numberOfLines={3}>
          {space.content}
        </Text>
        <View style={styles.authorRow}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>
                {space.author[0]}
              </Text>
            </View>
            <Text style={styles.authorName}>{space.author}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.actionText}>{space.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const SpacesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spaces</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spaces..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.topicsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Digital Wellness', 'Mindfulness', 'Focus', 'Productivity'].map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.topicChip,
                index === 0 && styles.topicChipActive,
              ]}
            >
              <Text
                style={[
                  styles.topicText,
                  index === 0 && styles.topicTextActive,
                ]}
              >
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SectionHeader
        title="Featured Spaces"
        description="Curated content for your digital wellness"
      />

      {SAMPLE_SPACES.map(space => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.body1.fontSize,
    color: colors.textPrimary,
  },
  topicsContainer: {
    paddingLeft: spacing.md,
    marginBottom: spacing.lg,
  },
  topicChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  topicChipActive: {
    backgroundColor: colors.primary,
  },
  topicText: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
  },
  topicTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  spaceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    backgroundColor: `${colors.textSecondary}10`,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: spacing.md,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  tagText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
  spaceTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  spaceContent: {
    fontSize: typography.body2.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: typography.body2.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  authorName: {
    marginLeft: spacing.sm,
    fontSize: typography.body2.fontSize,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  actionText: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
});

export default SpacesScreen;