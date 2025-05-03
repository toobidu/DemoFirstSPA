import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { Event } from 'react-native-track-player';

const usePlayerStore = create((set, get) => ({
    currentTrack: null, // Bài hát hiện tại
    isPlaying: false, // Trạng thái phát
    position: 0, // Thời gian hiện tại
    duration: 0, // Thời lượng bài hát
    queue: [], // Hàng đợi bài hát

    // Cập nhật bài hát hiện tại
    setCurrentTrack: (track) => set({ currentTrack: track }),

    // Cập nhật trạng thái phát
    setIsPlaying: (playing) => set({ isPlaying: playing }),

    // Cập nhật tiến trình
    setProgress: ({ position, duration }) =>
        set({ position, duration }),

    // Cập nhật hàng đợi
    setQueue: (queue) => set({ queue }),

    // Khởi tạo trình phát
    initializePlayer: async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                capabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                    TrackPlayer.CAPABILITY_SEEK_TO,
                ],
            });
            console.log('TrackPlayer initialized');
        } catch (error) {
            console.error('Error initializing TrackPlayer:', error);
        }
    },

    // Chuyển đổi play/pause
    togglePlay: async () => {
        const { isPlaying } = get();
        try {
            if (isPlaying) {
                await TrackPlayer.pause();
                set({ isPlaying: false });
            } else {
                await TrackPlayer.play();
                set({ isPlaying: true });
            }
        } catch (error) {
            console.error('Error toggling play:', error);
        }
    },

    // Chuyển bài trước
    previousTrack: async () => {
        try {
            const { queue } = get();
            const currentIndex = await TrackPlayer.getCurrentTrack();
            if (currentIndex > 0) {
                await TrackPlayer.skipToPrevious();
            }
        } catch (error) {
            console.error('Error skipping to previous track:', error);
        }
    },

    // Chuyển bài tiếp theo
    nextTrack: async () => {
        try {
            const { queue } = get();
            const currentIndex = await TrackPlayer.getCurrentTrack();
            if (currentIndex < queue.length - 1) {
                await TrackPlayer.skipToNext();
            }
        } catch (error) {
            console.error('Error skipping to next track:', error);
        }
    },

    // Tìm kiếm đến vị trí
    seekTo: async (position) => {
        try {
            await TrackPlayer.seekTo(position);
        } catch (error) {
            console.error('Error seeking:', error);
        }
    },
}));

// Lắng nghe sự kiện thay đổi bài hát
TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack !== null) {
        const queue = await TrackPlayer.getQueue();
        const nextTrackIndex = queue.findIndex((track) => track.id === event.nextTrack);
        if (nextTrackIndex !== -1) {
            usePlayerStore.setState({ currentTrack: queue[nextTrackIndex] });
            console.log('Updated current track:', queue[nextTrackIndex]);
        }
    }
});

// Lắng nghe trạng thái phát
TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
    usePlayerStore.setState({ isPlaying: state === TrackPlayer.State.Playing });
});

// Lưu trạng thái vào AsyncStorage (tùy chọn)
usePlayerStore.subscribe(async (state) => {
    try {
        await AsyncStorage.setItem('playerState', JSON.stringify({
            currentTrack: state.currentTrack,
            queue: state.queue,
        }));
    } catch (error) {
        console.error('Error saving player state:', error);
    }
});

export default usePlayerStore;
