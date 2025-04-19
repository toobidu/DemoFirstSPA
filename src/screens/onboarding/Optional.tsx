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

const Optional = () => {
  const [artists, setArtists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleItems, setVisibleItems] = useState(20);
  const [error, setError] = useState(null);
  const ITEMS_PER_LOAD = 5;
  const MAX_SELECTIONS = 3;

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayedArtists = filteredArtists.slice(0, visibleItems);

  const handleLoadMore = () => {
    setVisibleItems((prev) =>
      Math.min(prev + ITEMS_PER_LOAD, filteredArtists.length)
    );
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else if (selectedIds.length < MAX_SELECTIONS) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const fetchArtistsData = async () => {
    try {
      // Simulate API call
      const data = [
        {
          id: '1',
          name: 'Artist 1',
          imageUrl: 'https://picsum.photos/seed/artist1/200/200',
        },
        {
          id: '2',
          name: 'Artist 2',
          imageUrl: 'https://picsum.photos/seed/artist2/200/200',
        },
      ];
      setArtists(data);
    } catch (err) {
      setError('Không thể tải danh sách nghệ sĩ.');
      setArtists([]);
    }
  };

  useEffect(() => {
    fetchArtistsData();
  }, []);

  const renderArtistItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.artistCard,
        selectedIds.includes(item.id) && styles.selectedCard,
      ]}
      onPress={() => toggleSelection(item.id)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.artistImage}
      />
      <Text style={styles.artistName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm nghệ sĩ..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.selectionInfo}>
        Đã chọn {selectedIds.length}/{MAX_SELECTIONS}
      </Text>
      <FlatList
        data={displayedArtists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.artistGrid}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListFooterComponent={
          visibleItems < filteredArtists.length ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreText}>Tải thêm</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  searchInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  selectionInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#fff',
  },
  artistGrid: { gap: 16 },
  artistCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCard: { borderWidth: 2, borderColor: '#1DB954' },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  artistName: { fontSize: 14, fontWeight: '600', color: '#fff' },
  loadMoreButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  loadMoreText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  errorText: { color: '#ff4444', textAlign: 'center', marginBottom: 16 },
});

export default Optional;