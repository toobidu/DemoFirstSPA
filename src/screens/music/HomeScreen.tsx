import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [greeting, setGreeting] = useState('');
  const [userData] = useState({
    id: 'user123',
    name: 'Nguyễn Văn A',
    avatarUrl: 'https://picsum.photos/seed/user123/100/100',
    email: 'nguyenvana@example.com',
    premium: true,
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const getGreetingByTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Chào buổi sáng';
    if (currentHour >= 12 && currentHour < 18) return 'Chào buổi chiều';
    if (currentHour >= 18 && currentHour < 22) return 'Chào buổi tối';
    return 'Muộn rồi nhỉ';
  };

  useEffect(() => {
    setGreeting(getGreetingByTime());
    const intervalId = setInterval(() => setGreeting(getGreetingByTime()), 60000);

    // Simulate fetching recently played
    setRecentlyPlayed([
      {
        id: '1',
        title: 'Song 1',
        artist: 'Artist 1',
        albumCover: 'https://picsum.photos/seed/song1/200/200',
        duration: '3:30',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
    ]);

    return () => clearInterval(intervalId);
  }, []);

  const handleSongPress = (songId: string) => {
    navigation.navigate('NowPlaying', { songId });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <TouchableOpacity
          onPress={() => setIsSidebarVisible(true)}
          style={styles.iconButton}
        >
          <Image
            source={{ uri: userData.avatarUrl }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mainContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phát gần đây</Text>
          <View style={styles.horizontalScroll}>
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
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.artistName}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isSidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSidebarVisible(false)}
      >
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Image
              source={{ uri: userData.avatarUrl }}
              style={styles.sidebarAvatar}
            />
            <Text style={styles.sidebarName}>{userData.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.sidebarButton}
            onPress={handleLogout}
          >
            <Text style={styles.sidebarButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsSidebarVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  mainContent: { flex: 1, paddingBottom: 80 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1DB954' },
  iconButton: { width: 32, height: 32 },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 16 },
  horizontalScroll: { flexDirection: 'row', paddingBottom: 16 },
  musicCard: { width: 150, marginRight: 16 },
  albumCover: { width: 150, height: 150, borderRadius: 8, marginBottom: 8 },
  songTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
  artistName: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  sidebar: {
    flex: 1,
    marginLeft: 60,
    backgroundColor: '#1e1e1e',
    padding: 24,
  },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  sidebarAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  sidebarName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  sidebarButton: {
    padding: 12,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  sidebarButtonText: { color: '#fff', fontSize: 16 },
  closeButton: {
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default HomeScreen;