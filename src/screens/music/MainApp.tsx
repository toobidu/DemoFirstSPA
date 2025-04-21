// screens/music/MainApp.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import SearchingScreen from './SearchingScreen';
import PlaylistScreen from './PlaylistScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#1DB954',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = '';
          if (route.name === 'HomeScreen') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'SearchingScreen') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'PlaylistScreen') iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: 'white',
      })}
      initialRouteName="HomeScreen"
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="SearchingScreen" component={SearchingScreen} options={{ title: 'Tìm kiếm' }} />
      <Tab.Screen name="PlaylistScreen" component={PlaylistScreen} options={{ title: 'Thư viện' }} />
    </Tab.Navigator>
  );
};

export default MainApp;
