import { Article } from '../types';

const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://newsapi.org/v2';

export const fetchTopHeadlines = async (page: number): Promise<Article[]> => {
  const res = await fetch(
    `${BASE_URL}/top-headlines?country=us&pageSize=20&page=${page}&apiKey=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Network response failed');
  const data = await res.json();
  return data.articles ?? [];
};

export const searchArticles = async (
  query: string,
  page: number,
): Promise<Article[]> => {
  const res = await fetch(
    `${BASE_URL}/everything?q=${encodeURIComponent(
      query,
    )}&pageSize=20&page=${page}&apiKey=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Network response failed');
  const data = await res.json();
  return data.articles ?? [];
};
