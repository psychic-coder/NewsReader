import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingFooter: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="small" color="#7B8CDE" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingFooter;
