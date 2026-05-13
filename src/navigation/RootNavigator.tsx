import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { RootStackParamList, TabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#13141F',
        borderTopColor: '#1E2030',
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarActiveTintColor: '#7B8CDE',
      tabBarInactiveTintColor: '#4B5162',
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Home: '🗞️',
          Search: '🔍',
        };
        return (
          <Text style={{ fontSize: size - 4, color }}>{icons[route.name]}</Text>
        );
      },
    })}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: 'Top Headlines' }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{ tabBarLabel: 'Search' }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#13141F' },
        headerTintColor: '#EAEDF5',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        cardStyle: { backgroundColor: '#0D0E1A' },
      }}>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
