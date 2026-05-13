import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { loadHeadlines } from '../store/articlesSlice';
import ArticleCard from '../components/ArticleCard';
import LoadingFooter from '../components/LoadingFooter';
import { Article, RootStackParamList } from '../types';
import { RootState } from '../store';

type NavProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavProp>();
  const { items, page, loading, loadingMore, error, hasMore } = useAppSelector(
    (state: RootState) => state.articles,
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      dispatch(loadHeadlines(page + 1));
    }
  }, [loadingMore, loading, hasMore, page, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(loadHeadlines(1));
  }, [dispatch]);

  const handlePress = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation],
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7B8CDE" />
        <Text style={styles.loadingText}>Loading headlines…</Text>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Headlines</Text>
        <Text style={styles.headerSubtitle}>US · Today</Text>
      </View>
      <FlatList<Article>
        data={items}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={({ item }) => (
          <ArticleCard article={item} onPress={handlePress} />
        )}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListFooterComponent={loadingMore ? <LoadingFooter /> : null}
        refreshing={loading && page === 1}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No articles available</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E1A',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0D0E1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#0D0E1A',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EAEDF5',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#9DA3B4',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#9DA3B4',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#7B8CDE',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default HomeScreen;