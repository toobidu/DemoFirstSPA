import React, { createContext, useContext, useState, useEffect } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

// Tạo context cho trình phát nhạc
const AudioPlayerContext = createContext();

// Provider cho trình phát nhạc
export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // Bài hát hiện tại
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát/tạm dừng
  const [position, setPosition] = useState(0); // Vị trí phát (ms)
  const [duration, setDuration] = useState(0); // Thời lượng bài hát (ms)
  const [queue, setQueue] = useState([]); // Hàng đợi bài hát
  const [isShuffle, setIsShuffle] = useState(false); // Chế độ xáo trộn
  const [repeatMode, setRepeatMode] = useState('none'); // Chế độ lặp: 'none', 'one', 'all'
  const [error, setError] = useState(null); // Lỗi nếu có
  const [isMinimized, setIsMinimized] = useState(true); // Trạng thái thu nhỏ

  // Khởi tạo trình phát khi component mount
const AudioPlayerContext = () => {
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        // Các cấu hình khác nếu có, ví dụ: set options, add tracks...
        setIsPlayerInitialized(true); // Đánh dấu trình phát đã sẵn sàng
      } catch (err) {
        console.error('Lỗi khi khởi tạo trình phát:', err);
      }
    };
    setupPlayer();

    // Cleanup khi component unmount
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  const playTrack = async (track) => {
    if (!isPlayerInitialized) {
      console.error('Trình phát chưa được khởi tạo!');
      return;
    }
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  };

  return { playTrack };
};

  // Lắng nghe các sự kiện từ TrackPlayer
  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState, Event.PlaybackQueueEnded, Event.PlaybackProgressUpdated],
    async (event) => {
      if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        setCurrentTrack(track);
      }
      if (event.type === Event.PlaybackState) {
        const state = await TrackPlayer.getState();
        setIsPlaying(state === TrackPlayer.STATE_PLAYING);
      }
      if (event.type === Event.PlaybackQueueEnded) {
        if (repeatMode === 'one') {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
        } else if (repeatMode === 'all') {
          await TrackPlayer.skip(0);
          await TrackPlayer.play();
        }
      }
      if (event.type === Event.PlaybackProgressUpdated) {
        setPosition(event.position * 1000);
        setDuration(event.duration * 1000);
      }
    }
  );

  // Phát một bài hát với hàng đợi mới
  const playTrack = async (track, newQueue) => {
    try {
      if (!newQueue.length) {
        setError('Hàng đợi rỗng!');
        return;
      }
      setQueue(newQueue);
      setCurrentTrack(track);

      await TrackPlayer.reset();
      await TrackPlayer.add(newQueue);

      const index = newQueue.findIndex((item) => item.id === track.id);
      if (index === -1) {
        setError('Bài hát không có trong hàng đợi!');
        return;
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (err) {
      const errorMessage = 'Không thể phát bài hát: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err.stack);
    }
  };

  // Chuyển đổi trạng thái phát/tạm dừng
  const togglePlay = async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state === TrackPlayer.STATE_PLAYING) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else if (state === TrackPlayer.STATE_PAUSED || state === TrackPlayer.STATE_STOPPED) {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (err) {
      const errorMessage = 'Không thể chuyển đổi phát/tạm dừng: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err.stack);
    }
  };

  // Tua đến vị trí cụ thể
  const seekToPosition = async (value) => {
    try {
      await TrackPlayer.seekTo(value / 1000);
      setPosition(value);
    } catch (err) {
      const errorMessage = 'Không thể tua bài hát: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err.stack);
    }
  };

  // Chuyển sang bài tiếp theo
  const nextTrack = async () => {
    try {
      if (!queue.length) {
        setError('Hàng đợi rỗng!');
        return;
      }
      const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') nextIndex = 0;
          else return;
        }
      }
      await TrackPlayer.skip(nextIndex);
      await TrackPlayer.play();
      setCurrentTrack(queue[nextIndex]);
    } catch (err) {
      const errorMessage = 'Không thể chuyển bài tiếp theo: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err.stack);
    }
  };

  // Chuyển về bài trước đó
  const previousTrack = async () => {
    try {
      if (!queue.length) {
        setError('Hàng đợi rỗng!');
        return;
      }
      const currentIndex = queue.findIndex((item) => item.id === currentTrack.id);
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) return;
      await TrackPlayer.skip(prevIndex);
      await TrackPlayer.play();
      setCurrentTrack(queue[prevIndex]);
    } catch (err) {
      const errorMessage = 'Không thể chuyển bài trước đó: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err.stack);
    }
  };

  // Thu nhỏ trình phát
  const minimize = () => {
    setIsMinimized(true);
  };

  // Cung cấp các giá trị và hàm cho context
  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        togglePlay,
        minimize,
        seekToPosition,
        nextTrack,
        previousTrack,
        playTrack,
        isShuffle,
        setIsShuffle,
        repeatMode,
        setRepeatMode,
        error,
        isMinimized,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Hook để sử dụng context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer phải được sử dụng trong AudioPlayerProvider');
  }
  return context;
};