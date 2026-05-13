import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchArticles as searchArticlesApi } from '../api/newsApi';
import { Article } from '../types';

interface SearchState {
  items: Article[];
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  query: string;
}

const initialState: SearchState = {
  items: [],
  page: 1,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  query: '',
};

export const searchArticles = createAsyncThunk(
  'search/searchArticles',
  async ({ query, page }: { query: string; page: number }) => ({
    articles: await searchArticlesApi(query, page),
    page,
  }),
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSearch(state) {
      state.items = [];
      state.page = 1;
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.hasMore = true;
      state.query = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchArticles.pending, (state, action) => {
        if (action.meta.arg.page === 1) state.loading = true;
        else state.loadingMore = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        const { articles, page } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.items = page === 1 ? articles : [...state.items, ...articles];
        state.page = page;
        state.hasMore = articles.length === 20;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
