import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const SEARCH_HISTORY_KEY = 'search_history';
  const MAX_HISTORY_ITEMS = 10;

  const mockSearchResults = {
    songs: [
      {
        id: '1',
        title: 'Hãy Trao Cho Anh',
        artist: 'Sơn Tùng M-TP',
        artwork: 'https://picsum.photos/seed/song1/50/50',
        duration: '4:05',
      },
      {
        id: '2',
        title: 'Chúng Ta Của Hiện Tại',
        artist: 'Sơn Tùng M-TP',
        artwork: 'https://picsum.photos/seed/song2/50/50',
        duration: '3:52',
      },
    ],
    artists: [
      {
        id: '1',
        name: 'Sơn Tùng M-TP',
        image: 'https://picsum.photos/seed/artist1/50/50',
        followers: '1.2M',
      },
    ],
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = JSON.parse(
          (await AsyncStorage.getItem(SEARCH_HISTORY_KEY)) || '[]'
        );
        setSearchHistory(history);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };
    loadHistory();
  }, []);

  const saveSearchHistory = async (query: string) => {
    const updatedHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, MAX_HISTORY_ITEMS);
    try {
      await AsyncStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSearchResults(mockSearchResults);
      await saveSearchHistory(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyIcon}>🕒</Text>
      <TouchableOpacity
        style={styles.historyTextContainer}
        onPress={() => handleSearch(item)}
      >
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          const newHistory = searchHistory.filter((h) => h !== item);
          setSearchHistory(newHistory);
          await AsyncStorage.setItem(
            SEARCH_HISTORY_KEY,
            JSON.stringify(newHistory)
          );
        }}
      >
        <Text style={styles.historyIcon}>❌</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSongItem = ({ item }: { item: any }) => (
    <View style={styles.songItem}>
      <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.artistName}>{item.artist}</Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </View>
  );

  const renderArtistItem = ({ item }: { item: any }) => (
    <View style={styles.songItem}>
      <Image source={{ uri: item.image }} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.name}</Text>
        <Text style={styles.artistName}>{item.followers} người theo dõi</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsInputFocused(true)}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSearchResults(null);
            }}
          >
            <Text style={styles.clearIcon}>❌</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {isInputFocused && searchHistory.length > 0 ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      ) : loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : searchResults ? (
        <FlatList
          data={[
            { type: 'songs', data: searchResults.songs },
            { type: 'artists', data: searchResults.artists },
          ]}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {item.type === 'songs' ? 'Bài hát' : 'Nghệ sĩ'}
              </Text>
              <FlatList
                data={item.data}
                renderItem={
                  item.type === 'songs' ? renderSongItem : renderArtistItem
                }
                keyExtractor={(subItem) => subItem.id}
                scrollEnabled={false}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : !isInputFocused ? (
        <Text style={styles.emptyState}>
          Tìm kiếm bài hát hoặc nghệ sĩ yêu thích của bạn
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearIcon: { fontSize: 16, padding: 4 },
  historyContainer: { margin: 16 },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: { fontSize: 16, fontWeight: '500', color: '#fff' },
  clearHistoryText: { fontSize: 14, color: '#1DB954' },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyIcon: { fontSize: 16, marginHorizontal: 12 },
  historyTextContainer: { flex: 1 },
  historyText: { fontSize: 16, color: '#fff' },
  section: { marginBottom: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  songArtwork: { width: 50, height: 50, borderRadius: 4, marginRight: 12 },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 16, fontWeight: '500', color: '#fff' },
  artistName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  duration: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  emptyState: {
    textAlign: 'center',
    padding: 32,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  loadingText: { textAlign: 'center', marginTop: 20, color: '#fff' },
});

export default SearchingScreen;