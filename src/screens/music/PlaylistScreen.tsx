import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchNormal1, Add, CloseCircle, CloseSquare, Lock1, ToggleOnCircle, ToggleOffCircle } from 'iconsax-react-nativejs';

const PlaylistScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleCreatePlaylist = () => {
    setIsModalVisible(true);
  };

  const handleSubmitPlaylist = () => {
    if (playlistName.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: playlistName.trim(),
        isPublic,
        songCount: 0,
        coverImage: 'https://picsum.photos/200/200',
        createdAt: new Date().toISOString(),
      };
      setPlaylists([...playlists, newPlaylist]);
      setIsModalVisible(false);
      setPlaylistName('');
      setIsPublic(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          {!isSearchVisible ? (
            <>
              <Text style={styles.title}>Thư viện</Text>
              <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
                <SearchNormal1 color="#ffffff"/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleCreatePlaylist}>
                <Add color="#ffffff" variant="Bold"/>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <SearchNormal1 color="#000000"/>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm trong thư viện"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={toggleSearch}>
                  <CloseSquare color="black"/>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <ScrollView style={styles.content}>
          {playlists.length > 0 ? (
            playlists.map((item) => (
              <View key={item.id} style={styles.playlistItem}>
                <Image source={{ uri: item.coverImage }} style={styles.playlistCover} />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName}>{item.name}</Text>
                  <Text style={styles.playlistDetails}>
                    {item.songCount} bài hát • {item.isPublic ? 'Công khai' : 'Riêng tư'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyState}>Chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn!</Text>
          )}
        </ScrollView>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <CloseCircle color="red"/>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Tạo playlist mới</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tên playlist</Text>
                <TextInput
                  style={styles.playlistNameInput}
                  placeholder="Nhập tên playlist của bạn"
                  value={playlistName}
                  onChangeText={setPlaylistName}
                  autoFocus
                />
              </View>
              <View style={styles.privacyContainer}>
                <View style={styles.privacyHeader}>
                  <Lock1 color="white"/>
                  <Text style={styles.privacyTitle}>Quyền riêng tư</Text>
                </View>
                <View style={styles.privacyOption}>
                  <View>
                    <Text style={styles.privacyText}>{isPublic ? 'Công khai' : 'Riêng tư'}</Text>
                    <Text style={styles.privacyDescription}>
                      {isPublic ? 'Mọi người có thể tìm thấy playlist này' : 'Chỉ bạn mới có thể xem playlist này'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsPublic(!isPublic)}
                    style={styles.checkbox}
                  >
                    {isPublic ? (
                        <ToggleOffCircle color="white" size={24} />
                    ) : (
                        <ToggleOnCircle color="white" size={24} variant="Bold" />

                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  playlistName.trim() ? {} : styles.createButtonDisabled,
                ]}
                onPress={handleSubmitPlaylist}
                disabled={!playlistName.trim()}
              >
                <Text style={styles.createButtonText}>Tạo playlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  playlistCover: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  playlistDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  emptyState: {
    textAlign: 'center',
    padding: 20,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    right: 0, // Thay đổi từ left thành right
    top: 0,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  playlistNameInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  privacyContainer: {
    marginBottom: 30,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PlaylistScreen;
