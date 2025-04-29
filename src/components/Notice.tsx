import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Music, Microphone, Cd, Musicnote, Notification, MusicPlaylist, Clock } from 'iconsax-react-nativejs';


// Interface for notification data
interface Notification {
    id: string;
    type: 'new_song' | 'artist_update' | 'album_release' | 'playlist_update';
    title: string;
    content: string;
    artistName: string;
    artistImage: string;
    createdAt: Date;
    isRead: boolean;
}

// Key to store read notification state
const READ_NOTIFICATIONS_KEY = 'READ_NOTIFICATIONS';
// Key to store last notification check time
const LAST_NOTIFICATION_CHECK_KEY = 'LAST_NOTIFICATION_CHECK';

const NotificationsScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [now, setNow] = useState(new Date());
    const [showAll, setShowAll] = useState(false);
    const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
    const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

    // Update current time every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    // Load read state and last check time from AsyncStorage when component mounts
    useEffect(() => {
        const loadReadState = async () => {
            try {
                // Load read notification IDs
                const savedReadIds = await AsyncStorage.getItem(READ_NOTIFICATIONS_KEY);
                if (savedReadIds) {
                    setReadNotificationIds(JSON.parse(savedReadIds));
                }

                // Load last check time
                const lastCheck = await AsyncStorage.getItem(LAST_NOTIFICATION_CHECK_KEY);
                if (lastCheck) {
                    setLastCheckTime(new Date(JSON.parse(lastCheck)));
                }
            } catch (error) {
                console.error('Failed to load read notifications state:', error);
            }
        };

        loadReadState();
    }, []);

    // Save current check time when component unmounts or when hidden
    useEffect(() => {
        return () => {
            saveLastCheckTime();
        };
    }, []);

    // Save current check time
    const saveLastCheckTime = async () => {
        try {
            const currentTime = new Date().toISOString();
            await AsyncStorage.setItem(LAST_NOTIFICATION_CHECK_KEY, JSON.stringify(currentTime));
        } catch (error) {
            console.error('Failed to save last check time:', error);
        }
    };

    // Save read notification IDs to AsyncStorage
    const saveReadNotifications = async (ids: string[]) => {
        try {
            await AsyncStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error('Failed to save read notifications:', error);
        }
    };

    // Mock data
    const mockNotifications: Notification[] = [
        {
            id: '1',
            type: 'new_song',
            title: 'Bài hát mới',
            content: 'Đã phát hành ca khúc "Chân Ái"',
            artistName: 'Orange',
            artistImage: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2018/01/11/8/a/a/a/1515660718081_600.jpg',
            createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 phút trước
            isRead: false
        },
        {
            id: '2',
            type: 'artist_update',
            title: 'Cập nhật nghệ danh',
            content: 'Đã đổi tên nghệ danh từ "The Weekend" thành "The Weeknd"',
            artistName: 'The Weeknd',
            artistImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Abel_Tesfaye_The_Weeknd_2_2019.jpg/800px-Abel_Tesfaye_The_Weeknd_2_2019.jpg',
            createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 phút trước
            isRead: false
        },
        {
            id: '3',
            type: 'album_release',
            title: 'Album mới',
            content: 'Đã phát hành album "Renaissance"',
            artistName: 'Beyoncé',
            artistImage: 'https://media.vogue.fr/photos/63c7e7f99b4a0a9cd7f4b274/1:1/w_2000,h_2000,c_limit/GettyImages-1392844861.jpg',
            createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 giờ trước
            isRead: false
        },
        {
            id: '4',
            type: 'playlist_update',
            title: 'Cập nhật playlist',
            content: 'Đã thêm bạn vào playlist "This Is BTS"',
            artistName: 'BTS',
            artistImage: 'https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/6/16/bts-10-nam-16869038454541366500685.jpg',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
            isRead: false
        },
        {
            id: '5',
            type: 'new_song',
            title: 'Bài hát mới',
            content: 'Đã phát hành ca khúc "Hẹn Ước Từ Hư Vô"',
            artistName: 'Mỹ Tâm',
            artistImage: 'https://static-images.vnncdn.net/files/publish/2022/12/5/my-tam-1-1-1168.jpg',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
            isRead: false
        }
    ];

    // Comment out API calls and use mock data directly
    /*
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    };
    */

    // Update notification state with read IDs and check time
    useEffect(() => {
        const updatedNotifications = mockNotifications.map(notification => ({
            ...notification,
            isRead: readNotificationIds.includes(notification.id) ||
                (lastCheckTime && new Date(notification.createdAt) < lastCheckTime)
        }));
        setNotifications(updatedNotifications);
    }, [readNotificationIds, lastCheckTime]);

    // Get notifications to display (first 3 or all)
    const getNotificationsToDisplay = () => {
        if (showAll || notifications.length <= 3) {
            return notifications;
        } else {
            return notifications.slice(0, 3);
        }
    };

    // Function to format time
    const formatTime = (date: Date): string => {
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'Vừa xong';
        if (diffMin < 60) return `${diffMin} phút trước`;
        if (diffHour < 24) return `${diffHour} giờ trước`;
        return `${diffDay} ngày trước`;
    };

    const markAsRead = (id: string) => {
        const updatedReadIds = [...readNotificationIds, id];
        setReadNotificationIds(updatedReadIds);
        saveReadNotifications(updatedReadIds);
        setNotifications(prev => prev.map(n =>
            n.id === id ? {...n, isRead: true} : n
        ));
    };

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        const updatedReadIds = [...new Set([...readNotificationIds, ...allIds])];
        setReadNotificationIds(updatedReadIds);
        saveReadNotifications(updatedReadIds);
        setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    };

    const NOTIFICATION_ICONS = {
        'new_song': { icon: Music, color: '#1DB954' },  // Spotify green
        'artist_update': { icon: Microphone, color: '#2E77D0' },  // Blue
        'album_release': { icon: Cd, color: '#9370DB' },  // Purple
        'playlist_update': { icon: MusicPlaylist, color: '#FFCF4B' },  // Yellow
    } as const;

    const getIconConfig = (type: string) => {
        return NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || { icon: Notification, color: '#FFFFFF' };
    };

    // Render item for notification list
    const renderNotificationItem = (item: Notification) => {
        const { icon: IconComponent, color } = getIconConfig(item.type);

        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
                onPress={() => markAsRead(item.id)}
            >
                {!item.isRead && <View style={styles.unreadDot}/>}

                <Image source={{uri: item.artistImage}} style={styles.artistImage}/>

                <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                        <IconComponent size={14} color={color} variant="Bold"/>
                        <Text style={styles.titleText}>{item.title}</Text>
                    </View>

                    <Text style={styles.contentText}>
                        <Text style={styles.artistName}>{item.artistName}</Text> {item.content}
                    </Text>

                    <View style={styles.timeRow}>
                        <Clock size={12} color="#8E8E93" variant="Bold"/>
                        <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Render "See more" button
    const renderSeeMoreButton = () => {
        if (notifications.length > 3 && !showAll) {
            return (
                <TouchableOpacity
                    style={styles.seeMoreButton}
                    onPress={() => setShowAll(true)}
                >
                    <Text style={styles.seeMoreText}>Xem thêm</Text>
                    <Icon name="chevron-down" size={16} color="#1DB954"/>
                </TouchableOpacity>
            );
        }
        return null;
    };

    // Render header for notification list
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            <TouchableOpacity onPress={markAllAsRead}>
                <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={50} color="#8E8E93"/>
            <Text style={styles.emptyText}>Không có thông báo mới</Text>
        </View>
    );

    const notificationsToDisplay = getNotificationsToDisplay();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212"/>

            {/* Cập nhật thời gian lần cuối check thông báo khi component mount */}
            <ScrollView
                contentContainerStyle={notifications.length === 0 ? styles.emptyList : null}
                onLayout={saveLastCheckTime}
            >
                {renderHeader()}

                {notifications.length === 0 ? (
                    renderEmpty()
                ) : (
                    <>
                        {notificationsToDisplay.map((item, index) => (
                            <React.Fragment key={item.id}>
                                {renderNotificationItem(item)}
                                {index < notificationsToDisplay.length - 1 && <View style={styles.separator}/>}
                            </React.Fragment>
                        ))}
                        {renderSeeMoreButton()}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Spotify dark background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    markAllText: {
        fontSize: 14,
        color: '#1DB954', // Spotify green
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        position: 'relative',
    },
    unreadItem: {
        backgroundColor: 'rgba(29, 185, 84, 0.05)', // Slight green tint for unread items
    },
    unreadDot: {
        position: 'absolute',
        left: 6,
        top: '50%',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#1DB954', // Spotify green
    },
    artistImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    titleText: {
        color: '#AAAAAA',
        fontSize: 12,
        marginLeft: 6,
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    artistName: {
        color: '#1DB954', // Spotify green
        fontWeight: 'bold',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        color: '#8E8E93',
        fontSize: 12,
        marginLeft: 4,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#333333',
        marginLeft: 78, // Align with the end of the artist image
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16,
        marginTop: 16,
    },
    emptyList: {
        flex: 1,
    },
    seeMoreButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#333333',
    },
    seeMoreText: {
        color: '#1DB954', // Spotify green
        fontSize: 14,
        fontWeight: '500',
        marginRight: 5,
    },
});

export default NotificationsScreen;
