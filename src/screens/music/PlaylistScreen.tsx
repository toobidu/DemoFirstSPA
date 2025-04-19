import React, { useState } from 'react';

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

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#121212', color: '#fff' },
    header: {
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    title: { fontSize: '24px', fontWeight: 'bold', flex: 1 },
    searchBarContainer: { flex: 1, display: 'flex', alignItems: 'center' },
    searchBar: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '0 12px',
      height: '40px',
    },
    searchInput: { flex: 1, margin: '0 8px', fontSize: '16px', color: '#000', border: 'none', outline: 'none' },
    iconButton: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    content: { padding: '16px' },
    playlistItem: { display: 'flex', alignItems: 'center', padding: '8px 0', marginBottom: '8px' },
    playlistCover: { width: '56px', height: '56px', borderRadius: '4px', marginRight: '12px' },
    playlistInfo: { flex: 1 },
    playlistName: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' },
    playlistDetails: { fontSize: '14px', color: 'rgba(255,255,255,0.6)' },
    emptyState: { textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '16px' },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#121212',
      borderRadius: '20px',
      padding: '20px',
      width: '90%',
      maxWidth: '400px',
    },
    modalHeader: { position: 'relative', textAlign: 'center', marginBottom: '30px' },
    closeButton: { position: 'absolute', left: 0, top: 0, padding: '5px', cursor: 'pointer' },
    modalTitle: { fontSize: '18px', fontWeight: 'bold' },
    inputContainer: { marginBottom: '30px' },
    inputLabel: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' },
    playlistNameInput: {
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '15px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.05)',
      width: '100%',
      boxSizing: 'border-box',
    },
    privacyContainer: { marginBottom: '30px' },
    privacyHeader: { display: 'flex', alignItems: 'center', marginBottom: '16px' },
    privacyTitle: { fontSize: '16px', fontWeight: '600', marginLeft: '8px' },
    privacyOption: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: '16px',
      borderRadius: '8px',
    },
    privacyText: { fontSize: '16px', marginBottom: '4px' },
    privacyDescription: { fontSize: '13px', color: 'rgba(255,255,255,0.6)' },
    createButton: {
      backgroundColor: '#1DB954',
      padding: '16px',
      borderRadius: '25px',
      textAlign: 'center',
      cursor: 'pointer',
    },
    createButtonDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
    createButtonText: { fontSize: '16px', fontWeight: 'bold', color: '#000' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {!isSearchVisible ? (
          <>
            <span style={styles.title}>Thư viện</span>
            <div style={styles.iconButton} onClick={toggleSearch}>🔍</div>
            <div style={styles.iconButton} onClick={handleCreatePlaylist}>➕</div>
          </>
        ) : (
          <div style={styles.searchBarContainer}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Tìm kiếm trong thư viện"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <span style={{ cursor: 'pointer' }} onClick={toggleSearch}>❌</span>
            </div>
          </div>
        )}
      </div>
      <div style={styles.content}>
        {playlists.length > 0 ? (
          playlists.map((item) => (
            <div key={item.id} style={styles.playlistItem}>
              <img src={item.coverImage} alt={item.name} style={styles.playlistCover} />
              <div style={styles.playlistInfo}>
                <span style={styles.playlistName}>{item.name}</span>
                <p style={styles.playlistDetails}>
                  {item.songCount} bài hát • {item.isPublic ? 'Công khai' : 'Riêng tư'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.emptyState}>Chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn!</p>
        )}
      </div>
      {isModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.closeButton} onClick={() => setIsModalVisible(false)}>❌</div>
              <span style={styles.modalTitle}>Tạo playlist mới</span>
            </div>
            <div style={styles.inputContainer}>
              <span style={styles.inputLabel}>Tên playlist</span>
              <input
                style={styles.playlistNameInput}
                placeholder="Nhập tên playlist của bạn"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                autoFocus
              />
            </div>
            <div style={styles.privacyContainer}>
              <div style={styles.privacyHeader}>
                <span>🔒</span>
                <span style={styles.privacyTitle}>Quyền riêng tư</span>
              </div>
              <div style={styles.privacyOption}>
                <div>
                  <span style={styles.privacyText}>{isPublic ? 'Công khai' : 'Riêng tư'}</span>
                  <p style={styles.privacyDescription}>
                    {isPublic ? 'Mọi người có thể tìm thấy playlist này' : 'Chỉ bạn mới có thể xem playlist này'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </div>
            </div>
            <div
              style={{
                ...styles.createButton,
                ...(playlistName.trim() ? {} : styles.createButtonDisabled),
              }}
              onClick={handleSubmitPlaylist}
            >
              <span style={styles.createButtonText}>Tạo playlist</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistScreen;