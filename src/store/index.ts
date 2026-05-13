import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice';
import searchReducer from './searchSlice'; // (similar structure)

export const store = configureStore({
  reducer: { articles: articlesReducer, search: searchReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
