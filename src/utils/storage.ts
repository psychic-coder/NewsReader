import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types';

const ARTICLES_KEY = '@NewsReader:articles';

export const saveArticles = async (articles: Article[]): Promise<void> => {
  await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};

export const loadArticles = async (): Promise<Article[]> => {
  const raw = await AsyncStorage.getItem(ARTICLES_KEY);
  return raw ? JSON.parse(raw) : [];
};
