import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Note: To play audio, install `react-native-sound` and implement audio playback.
// This is a mock UI due to the complexity of audio handling.

const NowPlayingScreen = () => {
  const navigation = useNavigation();
  const [currentTrack] = useState({
    id: '1',
    title: 'Sample Track',
    artist: 'Sample Artist',
    artwork: 'https://picsum.photos/seed/track/300/300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180000, // in milliseconds
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');

  const togglePlay = () => {
    // Implement audio playback with react-native-sound
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number) => {
    // Update audio position
    setPosition(value);
  };

  const formatTime = (millis: number) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>
          Không có bài hát nào đang phát
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ĐANG PHÁT</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.artworkContainer}>
        <Image
          source={{ uri: currentTrack.artwork }}
          style={styles.artwork}
        />
      </View>
      <View style={styles.trackInfoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#1DB954' : '#B3B3B3'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          value={position}
          minimumValue={0}
          maximumValue={currentTrack.duration || 1}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#555"
          thumbTintColor="#fff"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>
            {formatTime(currentTrack.duration)}
          </Text>
        </View>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsShuffle(!isShuffle)}
        >
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffle ? '#1DB954' : '#B3B3B3'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            const modes = ['none', 'all', 'one'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          }}
        >
          <Ionicons
            name={
              repeatMode === 'one'
                ? 'repeat-outline'
                : repeatMode === 'all'
                ? 'repeat'
                : 'repeat-outline'
            }
            size={24}
            color={repeatMode !== 'none' ? '#1DB954' : '#B3B3B3'}
          />
          {repeatMode === 'one' && (
            <View style={styles.repeatOneBadge}>
              <Text style={styles.repeatOneText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.deviceButton}>
          <Ionicons name="phone-portrait-outline" size={20} color="#B3B3B3" />
          <Text style={styles.deviceText}>This device</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
  },
  artworkContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  artwork: {
    width: '80%',
    height: 300,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  trackInfoContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 16,
  },
  artist: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  repeatOneBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deviceText: {
    fontSize: 14,
    color: '#B3B3B3',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});

export default NowPlayingScreen;