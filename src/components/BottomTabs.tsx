import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMusic } from '../context/MusicContext';
import { playTrack, pauseTrack } from '../services/TrackPlayerService';
import NowPlayingScreen from '../screens/music/NowPlayingScreen';
import PlaylistScreen from '../screens/PlaylistScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else {
      await playTrack();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Playlist" component={PlaylistScreen} />
        <Tab.Screen name="NowPlaying" component={NowPlayingScreen} />
      </Tab.Navigator>
      {currentTrack && (
        <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text>{currentTrack.title} - {currentTrack.artist}</Text>
          <TouchableOpacity onPress={handlePlayPause}>
            <Text>{isPlaying ? 'Tạm dừng' : 'Phát'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BottomTabs;
