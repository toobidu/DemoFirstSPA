import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/music/HomeScreen';
import SearchingScreen from '../screens/music/SearchingScreen';
import PlaylistScreen from '../screens/music/PlaylistScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: 'rgba(255,255,255,0.1)' },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#1DB954',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = '';
          if (route.name === 'HomeScreen') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'SearchingScreen') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'PlaylistScreen') iconName = focused ? 'musical-notes' : 'musical-notes-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="SearchingScreen" component={SearchingScreen} options={{ title: 'Tìm kiếm' }} />
      <Tab.Screen name="PlaylistScreen" component={PlaylistScreen} options={{ title: 'Thư viện' }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
