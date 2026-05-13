import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { setupAppStateListener } from './src/utils/lifecycle';
import { loadArticles, saveArticles } from './src/utils/storage';
import { hydrateFromCache, loadHeadlines } from './src/store/articlesSlice';
import useAppDispatch from './src/hooks/useAppDispatch';

const AppWrapper = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate from cache on mount
    loadArticles().then(cached => {
      dispatch(hydrateFromCache(cached));
    });
    // Fetch fresh data
    dispatch(loadHeadlines(1));

    // App lifecycle
    const unsub = setupAppStateListener(
      () => dispatch(loadHeadlines(1)), // foreground: refresh
      () => saveArticles(store.getState().articles.items), // background: persist
    );
    return unsub;
  }, [dispatch]);

  return <RootNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}
