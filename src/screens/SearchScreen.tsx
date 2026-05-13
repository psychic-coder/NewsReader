import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { searchArticles, setQuery, clearSearch } from '../store/searchSlice';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import LoadingFooter from '../components/LoadingFooter';
import { Article, RootStackParamList } from '../types';
import { RootState } from '../store';

type NavProp = StackNavigationProp<RootStackParamList>;

const DEBOUNCE_MS = 300;

const SearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavProp>();
  const { items, page, loading, loadingMore, error, hasMore, query } =
    useAppSelector((state: RootState) => state.search);

  const debounceTimer = useRef<any>(null);

  // Debounced search trigger
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (query.trim().length === 0) {
      dispatch(clearSearch());
      return;
    }
    debounceTimer.current = setTimeout(() => {
      dispatch(searchArticles({ query: query.trim(), page: 1 }));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, dispatch]);

  const handleChangeText = useCallback(
    (text: string) => {
      dispatch(setQuery(text));
    },
    [dispatch],
  );

  const handleClear = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore && query.trim().length > 0) {
      dispatch(searchArticles({ query: query.trim(), page: page + 1 }));
    }
  }, [loadingMore, loading, hasMore, query, page, dispatch]);

  const handlePress = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation],
  );

  const renderEmptyState = () => {
    if (query.trim().length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Search for news</Text>
          <Text style={styles.emptySubtitle}>
            Type a topic, person, or keyword to find articles
          </Text>
        </View>
      );
    }
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🗂️</Text>
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptySubtitle}>
          Try a different keyword or search term
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E1A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <SearchBar
        value={query}
        onChangeText={handleChangeText}
        onClear={handleClear}
      />
      {loading && items.length === 0 && query.trim().length > 0 && (
        <View style={styles.inlineLoading}>
          <ActivityIndicator size="small" color="#7B8CDE" />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
        </View>
      )}
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState()}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    backgroundColor: '#0D0E1A',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EAEDF5',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingVertical: 4,
    paddingBottom: 24,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#9DA3B4',
    marginLeft: 10,
  },
  errorBanner: {
    backgroundColor: '#2D1B1B',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EAEDF5',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default SearchScreen;
