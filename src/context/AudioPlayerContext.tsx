import React, { createContext, useContext, useState, useEffect } from 'react';
import TrackPlayer, { Event, State, Capability } from 'react-native-track-player';
import { getSongs } from '../service/apiSong';
import { getFullMinioUrl } from '../service/minioUrl';

export interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork?: string;
}

export interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPlayerReady: boolean;
  position: number;
  duration: number;
  togglePlay(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  playTrack(track: Track): Promise<void>;
  maximize(): void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        console.log('Bắt đầu kiểm tra TrackPlayer trong AudioPlayerContext...');
        let state = await TrackPlayer.getState();
        let attempts = 0;
        const maxAttempts = 30; // Tăng lên 15 giây
        while (state === State.None && attempts < maxAttempts) {
          console.log(`TrackPlayer chưa sẵn sàng, thử lần ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          state = await TrackPlayer.getState();
          attempts++;
        }

        if (state === State.None) {
          console.log('TrackPlayer vẫn chưa sẵn sàng, khởi tạo trong AudioPlayerContext...');
          await TrackPlayer.setupPlayer();
          state = await TrackPlayer.getState();
          console.log('Trạng thái sau khi khởi tạo trong AudioPlayerContext:', state);
        }

        console.log('Lấy danh sách bài hát...');
        const songs = await getSongs();
        const tracks = songs.map((s: any) => {
          console.log('Song image URL:', s.song_image_url);
          return {
            id: s.song_id,
            url: getFullMinioUrl(s.song_url),
            title: s.song_title,
            artist: s.Artist?.artist_name || 'Unknown Artist',
            artwork: s.song_image_url ? getFullMinioUrl(s.song_image_url) : undefined,
          };
        });

        if (isMounted) {
          console.log('Thêm tracks vào TrackPlayer...');
          await TrackPlayer.add(tracks);
          const firstTrack = await TrackPlayer.getTrack(0);
          setCurrentTrack(firstTrack as Track);
          setIsPlayerReady(true);
          console.log('TrackPlayer sẵn sàng!');
        }
      } catch (error) {
        console.error('Lỗi trong AudioPlayerContext:', error);
      }
    })();

    const sub1 = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async () => {
      const idx = await TrackPlayer.getCurrentTrack();
      if (idx !== null && isMounted) {
        setCurrentTrack((await TrackPlayer.getTrack(idx)) as Track);
      }
    });
    const sub2 = TrackPlayer.addEventListener(Event.PlaybackState, async () => {
      const state = await TrackPlayer.getState();
      if (isMounted) setIsPlaying(state === State.Playing);
    });

    const timer = setInterval(async () => {
      const pos = await TrackPlayer.getPosition();
      const dur = await TrackPlayer.getDuration();
      if (isMounted) {
        setPosition(pos * 1000);
        setDuration(dur * 1000);
      }
    }, 1000);

    return () => {
      isMounted = false;
      sub1.remove();
      sub2.remove();
      clearInterval(timer);
      TrackPlayer.destroy();
    };
  }, []);

  const togglePlay = async () => {
    if (isPlaying) await TrackPlayer.pause();
    else await TrackPlayer.play();
    setIsPlaying(!isPlaying);
  };
  const nextTrack = async () => {
    await TrackPlayer.skipToNext();
  };
  const previousTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const playTrack = async (track: Track) => {
    if (!isPlayerReady) {
      console.warn('Player chưa sẵn sàng trong playTrack');
      return;
    }
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      await TrackPlayer.play();
      setIsPlaying(true);
      setCurrentTrack(track);
    } catch (error) {
      console.error('Lỗi khi phát bài hát:', error);
    }
  };
  const maximize = () => {};

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isPlayerReady,
        position,
        duration,
        togglePlay,
        nextTrack,
        previousTrack,
        playTrack,
        maximize,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be within AudioPlayerProvider');
  return ctx;
};
