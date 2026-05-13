import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type DetailRouteProp = RouteProp<RootStackParamList, 'ArticleDetail'>;

const ArticleDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const { article } = route.params;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const handleOpenUrl = useCallback(async () => {
    const supported = await Linking.canOpenURL(article.url);
    if (supported) {
      await Linking.openURL(article.url);
    } else {
      Alert.alert('Error', 'Unable to open this article URL.');
    }
  }, [article.url]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {article.urlToImage ? (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.heroPlaceholder}>
          <Text style={styles.heroPlaceholderIcon}>📰</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.sourceName}>{article.source.name}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        {article.author ? (
          <Text style={styles.author}>By {article.author}</Text>
        ) : null}

        {article.description ? (
          <Text style={styles.description}>{article.description}</Text>
        ) : null}

        {article.content ? (
          <Text style={styles.articleContent}>
            {/* Strip the "[+N chars]" truncation marker NewsAPI adds */}
            {article.content.replace(/\s?\[\+\d+ chars\]$/, '')}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleOpenUrl}
          activeOpacity={0.85}>
          <Text style={styles.readMoreText}>Read Full Article →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E1A',
  },
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#1E2030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 56,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  sourceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B8CDE',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EAEDF5',
    lineHeight: 30,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 13,
    color: '#7B8CDE',
    marginBottom: 18,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#C5C9D6',
    lineHeight: 25,
    marginBottom: 16,
    fontWeight: '500',
  },
  articleContent: {
    fontSize: 15,
    color: '#9DA3B4',
    lineHeight: 24,
    marginBottom: 28,
  },
  readMoreButton: {
    backgroundColor: '#7B8CDE',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#7B8CDE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ArticleDetailScreen;
