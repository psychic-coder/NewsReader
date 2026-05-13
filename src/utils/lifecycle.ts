import { AppState, AppStateStatus } from 'react-native';

export const setupAppStateListener = (
  onForeground: () => void,
  onBackground: () => void,
) => {
  let prevState: AppStateStatus = AppState.currentState;

  const subscription = AppState.addEventListener('change', nextState => {
    if (prevState.match(/inactive|background/) && nextState === 'active') {
      onForeground(); // app came to foreground — refresh data
    } else if (nextState.match(/inactive|background/)) {
      onBackground(); // app going to background — persist data
    }
    prevState = nextState;
  });

  return () => subscription.remove(); // call this to unsubscribe
};
