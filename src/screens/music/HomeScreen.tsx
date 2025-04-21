import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../../components/Sidebar';
import SearchingScreen from './SearchingScreen';
import PlaylistScreen from './PlaylistScreen';

// Định nghĩa kiểu dữ liệu
interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  duration: string;
  url?: string;
  lastPlayed?: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  totalSongs: number;
  totalDuration: string;
}

interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  premium: boolean;
}

// Mock data từ phiên bản Expo
const MOCK_DATA = {
  // Thông tin người dùng
  user: {
    id: 'user123',
    name: 'Nguyễn Văn A',
    avatarUrl: 'https://picsum.photos/seed/user123/100/100',
    email: 'nguyenvana@example.com',
    premium: true,
  },

  // Bài hát nghe gần đây
  recentlyPlayed: [
    {
      id: 'song1',
      title: 'Hoa Nở Không Màu',
      artist: 'Hoài Lâm',
      albumCover: 'https://picsum.photos/seed/song1/200/200',
      duration: '4:12',
      lastPlayed: '2025-04-05T18:30:00Z'
    },
    {
      id: 'song2',
      title: 'Chúng Ta Của Hiện Tại',
      artist: 'Sơn Tùng M-TP',
      albumCover: 'https://picsum.photos/seed/song2/200/200',
      duration: '4:33',
      lastPlayed: '2025-04-05T15:12:00Z'
    },
    {
      id: 'song3',
      title: 'Waiting For You',
      artist: 'MONO',
      albumCover: 'https://picsum.photos/seed/song3/200/200',
      duration: '4:25',
      lastPlayed: '2025-04-04T21:45:00Z'
    },
    {
      id: 'song4',
      title: 'Có Chắc Yêu Là Đây',
      artist: 'Sơn Tùng M-TP',
      albumCover: 'https://picsum.photos/seed/song4/200/200',
      duration: '3:50',
      lastPlayed: '2025-04-04T18:20:00Z'
    },
    {
      id: 'song5',
      title: 'Bước Qua Nhau',
      artist: 'Vũ',
      albumCover: 'https://picsum.photos/seed/song5/200/200',
      duration: '4:05',
      lastPlayed: '2025-04-03T22:10:00Z'
    }
  ],

  // Danh sách các playlist đề xuất
  recommendedPlaylists: [
    {
      id: 'playlist1',
      title: 'V-Pop Hits 2025',
      description: 'Dựa trên lịch sử nghe của bạn',
      coverImage: 'https://picsum.photos/seed/playlist1/200/200',
      totalSongs: 25,
      totalDuration: '1h 45m'
    },
    {
      id: 'playlist2',
      title: 'Acoustic Chill',
      description: 'Những bản acoustic nhẹ nhàng',
      coverImage: 'https://picsum.photos/seed/playlist2/200/200',
      totalSongs: 18,
      totalDuration: '1h 12m'
    },
    {
      id: 'playlist3',
      title: 'Rap Việt Tuyển Chọn',
      description: 'Những bản rap Việt hot nhất',
      coverImage: 'https://picsum.photos/seed/playlist3/200/200',
      totalSongs: 20,
      totalDuration: '1h 30m'
    },
    {
      id: 'playlist4',
      title: 'EDM Workout',
      description: 'Năng lượng cho buổi tập của bạn',
      coverImage: 'https://picsum.photos/seed/playlist4/200/200',
      totalSongs: 15,
      totalDuration: '58m'
    },
    {
      id: 'playlist5',
      title: 'Study Focus',
      description: 'Tập trung học tập và làm việc',
      coverImage: 'https://picsum.photos/seed/playlist5/200/200',
      totalSongs: 22,
      totalDuration: '1h 35m'
    }
  ],

  // Danh sách các đề xuất từ SoundClone
  featuredPlaylists: [
    {
      id: 'featured1',
      title: 'New Releases',
      description: 'Những bản phát hành mới nhất',
      coverImage: 'https://picsum.photos/seed/featured1/200/200',
      totalSongs: 30,
      totalDuration: '2h 05m'
    },
    {
      id: 'featured2',
      title: 'Top 50 Vietnam',
      description: 'Những bài hát được nghe nhiều nhất',
      coverImage: 'https://picsum.photos/seed/featured2/200/200',
      totalSongs: 50,
      totalDuration: '3h 15m'
    },
    {
      id: 'featured3',
      title: 'Indie Vietnam',
      description: 'Những nghệ sĩ indie Việt nổi bật',
      coverImage: 'https://picsum.photos/seed/featured3/200/200',
      totalSongs: 25,
      totalDuration: '1h 42m'
    },
    {
      id: 'featured4',
      title: 'Chill Weekend',
      description: 'Thư giãn cuối tuần',
      coverImage: 'https://picsum.photos/seed/featured4/200/200',
      totalSongs: 20,
      totalDuration: '1h 20m'
    },
    {
      id: 'featured5',
      title: 'Throwback Hits',
      description: 'Nhạc hay một thời',
      coverImage: 'https://picsum.photos/seed/featured5/200/200',
      totalSongs: 35,
      totalDuration: '2h 25m'
    }
  ],
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [greeting, setGreeting] = useState<string>('');
  const [userData, setUserData] = useState<UserData>(MOCK_DATA.user);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(MOCK_DATA.recentlyPlayed);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<Playlist[]>(MOCK_DATA.recommendedPlaylists);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>(MOCK_DATA.featuredPlaylists);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const translateX = useRef(new Animated.Value(1000)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // Hide sidebar and blur
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
        })
      ]).start(() => setIsSidebarVisible(false));
    } else {
      // Show sidebar and blur
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
        })
      ]).start();
    }
  };

  const getGreetingByTime = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Chào buổi sáng';
    if (currentHour >= 12 && currentHour < 18) return 'Chào buổi chiều';
    if (currentHour >= 18 && currentHour < 22) return 'Chào buổi tối';
    return 'Muộn rồi nhỉ';
  };

  useEffect(() => {
    setGreeting(getGreetingByTime());
    const intervalId = setInterval(() => setGreeting(getGreetingByTime()), 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSongPress = (songId: string) => {
    console.log(`Song ${songId} selected`);
    navigation.navigate('NowPlayingScreen', { songId });
  };

  const handlePlaylistPress = (playlistId: string) => {
    console.log(`Playlist ${playlistId} selected`);
    // navigation.navigate('PlaylistDetail', { playlistId });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('LoginScreen');
  };

  // Component thay thế cho BlurView của Expo
  const SidebarBackdrop = () => (
    <Animated.View
      style={[
        styles.backdrop,
        { opacity: blurOpacity }
      ]}
    >
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={toggleSidebar}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={styles.iconButton}
          >
            <Image
              source={{ uri: userData.avatarUrl }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
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
                  onPress={() => handleSongPress(item.id)}
                >
                  <Image
                    source={{ uri: item.albumCover }}
                    style={styles.albumCover}
                  />
                  <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Có thể bạn sẽ thích</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {recommendedPlaylists.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.playlistCard}
                  onPress={() => handlePlaylistPress(item.id)}
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    style={styles.playlistCover}
                  />
                  <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.playlistDescription} numberOfLines={2}>{item.description}</Text>
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
                  onPress={() => handlePlaylistPress(item.id)}
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    style={styles.playlistCover}
                  />
                  <Text style={styles.playlistTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.playlistDescription} numberOfLines={2}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Backdrop cho sidebar */}
      {isSidebarVisible && <SidebarBackdrop />}

      {/* Sử dụng component Sidebar đã import */}
      {isSidebarVisible && (
        <Sidebar
          isVisible={isSidebarVisible}
          onClose={toggleSidebar}
          userData={userData}
          translateX={translateX}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    lineHeight: 30,
  },
  iconButton: {
    width: 32,
    height: 32,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
});

export default HomeScreen;