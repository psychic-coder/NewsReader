export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export type RootStackParamList = {
  Main: undefined;
  ArticleDetail: { article: Article };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
};
