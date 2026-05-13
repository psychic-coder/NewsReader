import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTopHeadlines } from '../api/newsApi';
import { Article } from '../types';

interface ArticlesState {
  items: Article[];
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: ArticlesState = {
  items: [],
  page: 1,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
};

export const loadHeadlines = createAsyncThunk(
  'articles/loadHeadlines',
  async (page: number) => ({ articles: await fetchTopHeadlines(page), page }),
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    hydrateFromCache(state, action: PayloadAction<Article[]>) {
      if (state.items.length === 0) state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadHeadlines.pending, (state, action) => {
        if (action.meta.arg === 1) state.loading = true;
        else state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadHeadlines.fulfilled, (state, action) => {
        const { articles, page } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.items = page === 1 ? articles : [...state.items, ...articles];
        state.page = page;
        state.hasMore = articles.length === 20;
      })
      .addCase(loadHeadlines.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { hydrateFromCache } = articlesSlice.actions;
export default articlesSlice.reducer;
