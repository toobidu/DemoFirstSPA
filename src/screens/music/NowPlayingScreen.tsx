import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Slider,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <Text>↓</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đang phát</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text>⋮</Text>
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
          <Text style={styles.title}>{currentTrack.title}</Text>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Text>{isLiked ? '❤️' : '♡'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.artist}>{currentTrack.artist}</Text>
      </View>
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          value={position}
          minimumValue={0}
          maximumValue={currentTrack.duration || 1}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#888"
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
          <Text>{isShuffle ? '🔀' : '🔀'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlay}>
          <Text>{isPlaying ? '⏸' : '▶️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text>⏭</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            const modes = ['none', 'all', 'one'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          }}
        >
          <Text>
            {repeatMode === 'one'
              ? '🔂1'
              : repeatMode === 'all'
              ? '🔁'
              : '🔁'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomActions}>
        <View style={styles.deviceButton}>
          <Text>📱</Text>
          <Text style={styles.deviceText}>This device</Text>
        </View>
        <Text>📜</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  headerButton: { padding: 8 },
  headerTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
  },
  artworkContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginVertical: 24,
  },
  artwork: { width: '100%', height: 300, borderRadius: 12 },
  trackInfoContainer: { paddingHorizontal: 24, marginTop: 32 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 16 },
  artist: { fontSize: 16, color: 'rgba(255,255,255,0.6)' },
  progressContainer: { paddingHorizontal: 24, marginTop: 16 },
  progressBar: { width: '100%' },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  controlButton: { padding: 8 },
  playPauseButton: { fontSize: 50 },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    marginBottom: 16,
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  deviceText: { fontSize: 12, color: '#fff' },
  emptyText: { textAlign: 'center', fontSize: 18, color: '#fff' },
});

export default NowPlayingScreen;