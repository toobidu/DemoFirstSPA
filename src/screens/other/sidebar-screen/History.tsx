import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock data cho lịch sử nghe nhạc, xoá đi sau khi kết nối api
const MOCK_HISTORY_DATA = [
    {
        id: '1',
        title: 'Hãy Trao Cho Anh',
        artist: 'Sơn Tùng M-TP',
        album: 'Sky Tour',
        artwork: 'https://picsum.photos/seed/song1/200/200',
        playedAt: new Date(2023, 5, 10, 14, 30),
        duration: '4:05',
    },
    {
        id: '2',
        title: 'Chúng Ta Của Hiện Tại',
        artist: 'Sơn Tùng M-TP',
        album: 'Chúng Ta Của Hiện Tại',
        artwork: 'https://picsum.photos/seed/song2/200/200',
        playedAt: new Date(2023, 5, 10, 14, 26),
        duration: '3:52',
    },
    {
        id: '3',
        title: 'Có Chắc Yêu Là Đây',
        artist: 'Sơn Tùng M-TP',
        album: 'Có Chắc Yêu Là Đây',
        artwork: 'https://picsum.photos/seed/song3/200/200',
        playedAt: new Date(2023, 5, 10, 14, 22),
        duration: '3:48',
    },
    {
        id: '4',
        title: 'Muộn Rồi Mà Sao Còn',
        artist: 'Sơn Tùng M-TP',
        album: 'Muộn Rồi Mà Sao Còn',
        artwork: 'https://picsum.photos/seed/song4/200/200',
        playedAt: new Date(2023, 5, 9, 21, 15),
        duration: '4:35',
    },
    {
        id: '5',
        title: 'Lạc Trôi',
        artist: 'Sơn Tùng M-TP',
        album: 'Lạc Trôi',
        artwork: 'https://picsum.photos/seed/song5/200/200',
        playedAt: new Date(2023, 5, 9, 21, 10),
        duration: '4:12',
    },
    {
        id: '6',
        title: 'Nơi Này Có Anh',
        artist: 'Sơn Tùng M-TP',
        album: 'Nơi Này Có Anh',
        artwork: 'https://picsum.photos/seed/song6/200/200',
        playedAt: new Date(2023, 5, 9, 21, 5),
        duration: '4:18',
    },
    {
        id: '7',
        title: 'Chạy Ngay Đi',
        artist: 'Sơn Tùng M-TP',
        album: 'Chạy Ngay Đi',
        artwork: 'https://picsum.photos/seed/song7/200/200',
        playedAt: new Date(2023, 5, 8, 18, 45),
        duration: '4:08',
    },
    {
        id: '8',
        title: 'Âm Thầm Bên Em',
        artist: 'Sơn Tùng M-TP',
        album: 'Âm Thầm Bên Em',
        artwork: 'https://picsum.photos/seed/song8/200/200',
        playedAt: new Date(2023, 5, 8, 18, 40),
        duration: '4:22',
    },
];

const History = () => {
    const navigation = useNavigation();
    const [historyData, setHistoryData] = useState(MOCK_HISTORY_DATA);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchListeningHistory();
    }, []);

    const fetchListeningHistory = async () => {
        setIsLoading(true);

        // Sử dụng mock data cho demo
        setTimeout(() => {
            setHistoryData(MOCK_HISTORY_DATA);
            setIsLoading(false);
        }, 500);

        /*
        // TODO: Kết nối với API thực tế
        try {
          const token = await AuthService.getToken();
          const response = await axios.get('http://your-api-url/api/listening-history', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data && response.data.success) {
            // Chuyển đổi dữ liệu từ API sang định dạng cần thiết
            const formattedHistory = response.data.history.map(item => ({
              id: item.song_id,
              title: item.song_title,
              artist: item.artist_name,
              album: item.album_name,
              artwork: item.song_image_url ? getFullMinioUrl(item.song_image_url) : 'https://picsum.photos/seed/default/200/200',
              playedAt: new Date(item.played_at),
              duration: item.song_duration || '0:00',
            }));
            setHistoryData(formattedHistory);
          }
        } catch (error) {
          console.error('Lỗi khi lấy lịch sử nghe nhạc:', error);
          // Xử lý lỗi: hiển thị thông báo, v.v.
        } finally {
          setIsLoading(false);
        }
        */
    };

    const groupHistoryByDate = () => {
        const grouped = {};

        historyData.forEach(item => {
            const dateKey = format(item.playedAt, 'yyyy-MM-dd');
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(item);
        });

        return Object.keys(grouped).map(date => ({
            date,
            data: grouped[date],
            displayDate: format(new Date(date), 'dd/MM/yyyy')
        }));
    };

    const handleSongPress = (song) => {
        // TODO: Xử lý khi người dùng nhấn vào bài hát
        // Ví dụ: Chuyển đến màn hình chi tiết hoặc phát bài hát
        navigation.navigate('NowPlayingScreen', { song });
    };

    const renderSongItem = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => handleSongPress(item)}
        >
            <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
            <Text style={styles.songTime}>{format(item.playedAt, 'HH:mm')}</Text>
            <TouchableOpacity style={styles.moreButton}>
                <Icon name="ellipsis-vertical" size={20} color="#999" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderDateSection = ({ item }) => (
        <View style={styles.dateSection}>
            <Text style={styles.dateSectionTitle}>{item.displayDate}</Text>
            <FlatList
                data={item.data}
                renderItem={renderSongItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử nghe nhạc</Text>
                <View style={styles.headerRight} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Đang tải...</Text>
                </View>
            ) : (
                <FlatList
                    data={groupHistoryByDate()}
                    renderItem={renderDateSection}
                    keyExtractor={(item) => item.date}
                    contentContainerStyle={styles.listContent}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#121212',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    listContent: {
        paddingBottom: 80, // Để tránh bị che bởi thanh player ở dưới
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    dateSection: {
        marginBottom: 24,
    },
    dateSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    songArtwork: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    songInfo: {
        flex: 1,
        marginLeft: 12,
    },
    songTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    songArtist: {
        color: '#b3b3b3',
        fontSize: 14,
        marginTop: 4,
    },
    songTime: {
        color: '#b3b3b3',
        fontSize: 14,
        marginRight: 12,
    },
    moreButton: {
        padding: 8,
    },
});

export default History;
