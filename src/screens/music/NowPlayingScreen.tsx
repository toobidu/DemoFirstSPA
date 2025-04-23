import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TrackPlayer, { usePlaybackState, State, useProgress, useTrackPlayerEvents, Event } from 'react-native-track-player';

const NowPlayingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { song } = route.params || {};
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(500); // Cập nhật mỗi 500ms
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(song);

  useEffect(() => {
    console.log('Playback state:', playbackState);
    setIsPlaying(playbackState === State.Playing);
  }, [playbackState]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const queue = await TrackPlayer.getQueue();
      const nextTrackIndex = queue.findIndex((track) => track.id === event.nextTrack);
      if (nextTrackIndex !== -1) {
        setCurrentTrack(queue[nextTrackIndex]);
        console.log('Current track updated:', queue[nextTrackIndex]);
      }
    }
  });

  const togglePlay = async () => {
    console.log('Toggle play pressed, current state:', playbackState);
    try {
      if (playbackState === State.Playing) {
        await TrackPlayer.pause();
        console.log('Paused');
      } else {
        await TrackPlayer.play();
        console.log('Playing');
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const previousTrack = async () => {
    console.log('Previous track pressed');
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getCurrentTrack();
      if (currentIndex > 0) {
        await TrackPlayer.skipToPrevious();
        console.log('Skipped to previous track');
      } else {
        console.log('No previous track available');
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  const nextTrack = async () => {
    console.log('Next track pressed');
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getCurrentTrack();
      if (currentIndex < queue.length - 1) {
        await TrackPlayer.skipToNext();
        console.log('Skipped to next track');
      } else {
        console.log('No next track available');
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Không có bài hát nào đang phát</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => {
          console.log('Back button pressed');
          navigation.goBack();
        }}>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ĐANG PHÁT</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log('More button pressed')}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
      </View>

      <View style={styles.trackInfoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        </View>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={(value) => {
            console.log('Seeking to:', value);
            TrackPlayer.seekTo(value);
          }}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#555"
          thumbTintColor="#fff"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={previousTrack}>
          <Ionicons name="play-skip-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlay}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={nextTrack}>
          <Ionicons name="play-skip-forward" size={28} color="#fff" />
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
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});

export default NowPlayingScreen;