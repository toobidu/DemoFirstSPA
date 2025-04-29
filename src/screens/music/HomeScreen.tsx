import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../../components/Sidebar';
import MusicPlayerBar from '../../components/MusicPlayerBar';
import { getSongs } from '../../service/apiSong';
import { getFullMinioUrl } from '../../service/minioUrl';
import AuthService from '../../service/auth';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notification } from 'iconsax-react-nativejs';
import Notice from '../../components/Notice';

const MOCK_DATA = {
  user: {
    id: 'user123',
    name: 'Nguyễn Văn A',
    avatarUrl: 'https://picsum.photos/seed/user123/100/100',
    email: 'nguyenvana@example.com',
    premium: true,
  },
  featuredPlaylists: [
    {
      id: 'featured1',
      title: 'New Releases',
      description: 'Những bản phát hành mới nhất',
      coverImage: 'https://picsum.photos/seed/featured1/200/200',
      totalSongs: 30,
      totalDuration: '2h 05m',
    },
    {
      id: 'featured2',
      title: 'Top 50 Vietnam',
      description: 'Những bài hát được nghe nhiều nhất',
      coverImage: 'https://picsum.photos/seed/featured2/200/200',
      totalSongs: 50,
      totalDuration: '3h 15m',
    },
    {
      id: 'featured3',
      title: 'Indie Vietnam',
      description: 'Những nghệ sĩ indie Việt nổi bật',
      coverImage: 'https://picsum.photos/seed/featured3/200/200',
      totalSongs: 25,
      totalDuration: '1h 42m',
    },
    {
      id: 'featured4',
      title: 'Chill Weekend',
      description: 'Thư giãn cuối tuần',
      coverImage: 'https://picsum.photos/seed/featured4/200/200',
      totalSongs: 20,
      totalDuration: '1h 20m',
    },
    {
      id: 'featured5',
      title: 'Throwback Hits',
      description: 'Nhạc hay một thời',
      coverImage: 'https://picsum.photos/seed/featured5/200/200',
      totalSongs: 35,
      totalDuration: '2h 25m',
    },
  ],
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState(MOCK_DATA.user);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState(MOCK_DATA.featuredPlaylists);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const [noticeAnchor, setNoticeAnchor] = useState({ x: 0, y: 0 });
  const translateX = useRef(new Animated.Value(1000)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songsData = await getSongs();
        const formattedSongs = songsData.map((song) => ({
          id: song.song_id,
          title: song.song_title,
          artist: song.Artist?.artist_name || 'Unknown Artist',
          song_audio_url: getFullMinioUrl(song.song_audio_url),
          song_image_url: song.song_image_url,
          albumCover: song.song_image_url ? getFullMinioUrl(song.song_image_url) : 'https://picsum.photos/seed/song/200/200',
          duration: song.song_duration || '4:00',
          url: getFullMinioUrl(song.song_audio_url),
          lastPlayed: song.song_createAt,
        }));
        setRecentlyPlayed(formattedSongs);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        setRecentlyPlayed([]);
        if (error.response?.status === 401) {
          await AuthService.logout();
          await logout();
          navigation.navigate('LoginScreen');
        }
      }
    };

    fetchData();
  }, [navigation, logout]);

  useEffect(() => {
    const getGreetingByTime = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) return 'Chào buổi sáng';
      if (currentHour >= 12 && currentHour < 18) return 'Chào buổi chiều';
      if (currentHour >= 18 && currentHour < 22) return 'Chào buổi tối';
      return 'Muộn rồi nhỉ';
    };

    setGreeting(getGreetingByTime());
    const intervalId = setInterval(() => setGreeting(getGreetingByTime()), 60000);

    return () => clearInterval(intervalId);
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
    console.log('TrackPlayer event:', event);
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const queue = await TrackPlayer.getQueue();
      const nextTrackIndex = queue.findIndex((track) => track.id === event.nextTrack);
      if (nextTrackIndex !== -1) {
        setCurrentTrack(queue[nextTrackIndex]);
        console.log('Current track updated:', queue[nextTrackIndex]);
      }
    } else if (event.type === Event.PlaybackQueueEnded) {
      setCurrentTrack(null);
      console.log('Queue ended, cleared current track');
    }
  });

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 1000,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blurOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsSidebarVisible(false));
    } else {
      setIsSidebarVisible(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blurOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const toggleNotice = (event) => {
    // Lấy vị trí của nút thông báo
    if (event) {
      event.target.measure((x, y, width, height, pageX, pageY) => {
        setNoticeAnchor({ x: pageX, y: pageY + height });
      });
    }
    setIsNoticeVisible(!isNoticeVisible);
  };

  const handleSongPress = async (song: any) => {
    console.log('Playing song:', song.title);
    const track = {
      id: song.id,
      url: song.song_audio_url,
      title: song.title,
      artist: song.artist,
      artwork: song.song_image_url ? getFullMinioUrl(song.song_image_url) : undefined,
    };

    if (!track.url) {
      Alert.alert('Lỗi', 'Không tìm thấy URL bài hát');
      return;
    }

    try {
      console.log('Resetting player...');
      await TrackPlayer.reset();
      console.log('Adding tracks...');
      // Thêm toàn bộ recentlyPlayed vào queue
      const tracks = recentlyPlayed.map((item) => ({
        id: item.id,
        url: item.song_audio_url,
        title: item.title,
        artist: item.artist,
        artwork: item.song_image_url ? getFullMinioUrl(item.song_image_url) : undefined,
      }));
      await TrackPlayer.add(tracks);
      // Tìm index của bài hát được chọn
      const trackIndex = tracks.findIndex((t) => t.id === track.id);
      if (trackIndex !== -1) {
        console.log('Skipping to track index:', trackIndex);
        await TrackPlayer.skip(trackIndex);
      }
      console.log('Playing...');
      await TrackPlayer.play();
      console.log('Setting current track...');
      setCurrentTrack(track);
      console.log('Navigating to NowPlayingScreen...');
      navigation.navigate('NowPlayingScreen', { song: track });
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Lỗi', 'Không thể phát bài hát');
    }
  };

  const handlePlaylistPress = (item: any) => {
    console.log('Playlist pressed:', item);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      await logout();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    }
  };

  const SidebarBackdrop = () => (
    <Animated.View style={[styles.backdrop, { opacity: blurOpacity }]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={toggleSidebar} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={toggleNotice}
                style={styles.iconButton}
              >
                <Notification size={24} color="#ffffff" variant="Bold"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
                <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phát gần đây</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {recentlyPlayed.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.musicCard}
                    onPress={() => handleSongPress(item)}
                  >
                    <Image source={{ uri: item.albumCover }} style={styles.albumCover} />
                    <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Có thể bạn sẽ thích</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {recentlyPlayed.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.playlistCard}
                    onPress={() => handlePlaylistPress(item)}
                  >
                    <Image source={{ uri: item.albumCover }} style={styles.playlistCover} />
                    <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.playlistDescription} numberOfLines={2}>
                      {item.description || 'No description'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SoundCLone lựa chọn cho bạn</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {featuredPlaylists.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.playlistCard}
                    onPress={() => handlePlaylistPress(item)}
                  >
                    <Image source={{ uri: item.coverImage }} style={styles.playlistCover} />
                    <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.playlistDescription} numberOfLines={2}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        <MusicPlayerBar currentTrack={currentTrack} />

        {isSidebarVisible && <SidebarBackdrop />}
        {isSidebarVisible && (
          <Sidebar
            isVisible={isSidebarVisible}
            onClose={toggleSidebar}
            userData={userData}
            translateX={translateX}
          />
        )}

        {isNoticeVisible && (
          <>
            <Animated.View
              style={[styles.backdrop, { opacity: blurOpacity }]}
            >
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => setIsNoticeVisible(false)}
              />
            </Animated.View>
            <View style={[
              styles.noticeContainer,
              {
                top: noticeAnchor.y,
                right: 16,
              }
            ]}>
              <Notice onClose={() => setIsNoticeVisible(false)} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    lineHeight: 30,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  musicCard: {
    width: 150,
    marginRight: 16,
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  playlistCard: {
    width: 180,
    marginRight: 16,
  },
  playlistCover: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  noticeContainer: {
    position: 'absolute',
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#282828',
    borderRadius: 8,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;
