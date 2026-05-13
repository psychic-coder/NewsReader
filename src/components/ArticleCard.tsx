import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Article } from '../types';

interface Props {
  article: Article;
  onPress: (article: Article) => void;
}

const ArticleCard: React.FC<Props> = ({ article, onPress }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' },
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(article)}
      activeOpacity={0.85}>
      {article.urlToImage ? (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>📰</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.source} numberOfLines={1}>
          {article.source.name}
        </Text>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        {article.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          {article.author ? (
            <Text style={styles.author} numberOfLines={1}>
              {article.author}
            </Text>
          ) : null}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2030',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 190,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#2A2D40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    padding: 14,
  },
  source: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7B8CDE',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EAEDF5',
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#9DA3B4',
    lineHeight: 19,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#7B8CDE',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 11,
    color: '#6B7280',
  },
});

export default ArticleCard;
