// src/screens/CommunitiesScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios, { AxiosInstance } from 'axios';
import io, { Socket } from 'socket.io-client';
import { colors, spacing, typography } from '../theme';
import SectionHeader from '../components/SectionHeader';

const SOCKET_URL = 'http://localhost:5000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: SOCKET_URL,
  timeout: 15000,
});

interface Community {
  _id: string;
  name: string;
  description: string;
  category: string;
  posts?: any[];
}

const CommunitiesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const s = io(SOCKET_URL, { autoConnect: false, transports: ['websocket'] });
    socketRef.current = s;
    s.connect();
    s.on('connect', () => console.log('socket connected', s.id));
    s.on('connect_error', (e: any) => console.warn('socket connect_error', e?.message || e));
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    const handleNewPost = (post: any) => {
      if (!selectedCommunity) return;
      if (String(post.communityId) === String(selectedCommunity._id)) {
        setSelectedCommunity((prev) => ({ ...prev!, posts: [post, ...(prev!.posts || [])] }));
      }
    };

    const handleNewComment = (data: any) => {
      if (!selectedCommunity) return;
      if (String(data.communityId) !== String(selectedCommunity._id)) return;
      setSelectedCommunity((prev) => {
        if (!prev) return prev;
        const updatedPosts = (prev.posts || []).map((p: any) =>
          String(p._id) === String(data.postId)
            ? { ...p, comments: [...(p.comments || []), data.comment] }
            : p
        );
        return { ...prev, posts: updatedPosts };
      });
    };

    s.on('newPost', handleNewPost);
    s.on('newComment', handleNewComment);

    return () => {
      s.off('newPost', handleNewPost);
      s.off('newComment', handleNewComment);
    };
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/communities');
      setCommunities(res.data || []);
    } catch (err: any) {
      console.error('fetch communities error', err?.message || err);
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const openCommunity = async (community: Community) => {
    try {
      const res = await axiosInstance.get(`/api/communities/${community._id}`);
      setSelectedCommunity(res.data);
      socketRef.current?.emit('joinCommunity', community._id);
    } catch {
      Alert.alert('Error', 'Failed to open community');
    }
  };

  const closeCommunity = () => {
    if (selectedCommunity) socketRef.current?.emit('leaveCommunity', selectedCommunity._id);
    setSelectedCommunity(null);
    setNewPostContent('');
    setCommentContent('');
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedCommunity) return;
    try {
      await axiosInstance.post(`/api/communities/${selectedCommunity._id}/posts`, {
        content: newPostContent,
      });
      setNewPostContent('');
    } catch {
      Alert.alert('Error', 'Could not create post');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentContent.trim() || !selectedCommunity) return;
    try {
      await axiosInstance.post(
        `/api/communities/${selectedCommunity._id}/posts/${postId}/comments`,
        { content: commentContent }
      );
      setCommentContent('');
    } catch {
      Alert.alert('Error', 'Could not add comment');
    }
  };

  return (
    <View style={styles.screenWrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Communities</Text>

        <SectionHeader
          title="Popular Communities"
          description="Connect with like-minded people"
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search communities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCommunities}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
          {communities.map((c) => (
            <TouchableOpacity
              key={c._id}
              style={styles.communityCard}
              onPress={() => openCommunity(c)}
            >
              <View style={styles.communityHeader}>
                <View style={styles.communityIcon}>
                  <Ionicons
                    name={
                      c.category === 'Meditation'
                        ? 'leaf-outline'
                        : c.category === 'Wellness'
                        ? 'heart-outline'
                        : 'rocket-outline'
                    }
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.communityInfo}>
                  <Text style={styles.communityName}>{c.name}</Text>
                  <Text style={styles.communityCategory}>{c.category}</Text>
                </View>
              </View>
              <Text style={styles.communityDescription}>{c.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* community modal */}
      <Modal visible={!!selectedCommunity} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeCommunity}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{selectedCommunity?.name}</Text>

          <FlatList
            data={selectedCommunity?.posts || []}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <Text style={styles.postAuthor}>{item.user?.name || 'Unknown'}</Text>
                <Text style={styles.postContent}>{item.content}</Text>

                {(item.comments || []).map((cm: any) => (
                  <Text key={cm._id} style={styles.commentText}>
                    {cm.user?.name}: {cm.content}
                  </Text>
                ))}

                <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.textSecondary}
                    value={commentContent}
                    onChangeText={setCommentContent}
                  />
                  <TouchableOpacity
                    style={{ marginLeft: spacing.sm }}
                    onPress={() => handleAddComment(item._id)}
                  >
                    <Ionicons name="send" size={22} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TextInput
            style={styles.newPostInput}
            placeholder="Write a new post..."
            placeholderTextColor={colors.textSecondary}
            value={newPostContent}
            onChangeText={setNewPostContent}
          />
          <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md },
  title: { fontSize: typography.h2.fontSize, fontWeight: 'bold' as any, color: colors.textPrimary, marginBottom: spacing.md },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: spacing.sm, marginBottom: spacing.md },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: typography.body1.fontSize, color: colors.textPrimary },
  container: { flex: 1 },

  communityCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: spacing.md },
  communityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  communityIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.primary}20`, justifyContent: 'center', alignItems: 'center' },
  communityInfo: { marginLeft: spacing.md, flex: 1 },
  communityName: { fontSize: typography.body1.fontSize, fontWeight: '600' as any, color: colors.textPrimary },
  communityCategory: { fontSize: typography.caption.fontSize, color: colors.textSecondary, marginTop: 2 },
  communityDescription: { fontSize: typography.body2.fontSize, color: colors.textSecondary, marginBottom: spacing.md },

  modalContainer: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  closeButton: { position: 'absolute', top: spacing.md, right: spacing.md, zIndex: 20 },
  modalTitle: { fontSize: typography.h2.fontSize, fontWeight: 'bold' as any, marginVertical: spacing.md, color: colors.textPrimary },

  postCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md },
  postAuthor: { fontWeight: '600' as any, color: colors.textPrimary, marginBottom: spacing.sm },
  postContent: { color: colors.textPrimary, marginBottom: spacing.sm },
  commentText: { fontSize: typography.caption.fontSize, color: colors.textSecondary, marginLeft: spacing.sm },
  commentInput: { flex: 1, backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.textSecondary },
  newPostInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: spacing.sm, marginBottom: spacing.md },
  postButton: { backgroundColor: colors.primary, padding: spacing.sm, borderRadius: 12, alignItems: 'center', marginBottom: spacing.md },
  postButtonText: { color: colors.onPrimary, fontWeight: '600' },

  // New styles to fix TS error
  center: { padding: spacing.md, alignItems: 'center' },
  errorText: { color: colors.error, fontSize: typography.body1.fontSize, textAlign: 'center', marginBottom: spacing.sm },
  retryButton: { backgroundColor: colors.primary, padding: spacing.sm, borderRadius: 12 },
  retryText: { color: colors.onPrimary, fontWeight: '600' },
  hintText: { marginTop: spacing.sm, color: colors.textSecondary },
});

export default CommunitiesScreen;
