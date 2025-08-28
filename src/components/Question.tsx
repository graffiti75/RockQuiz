import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';

interface QuestionProps {
  song: Song;
  onAnswer: (isCorrect: boolean) => void;
}

// This global declaration is still needed for the YT object
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const Question: React.FC<QuestionProps> = ({ song, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [isPlayerFullyLoaded, setIsPlayerFullyLoaded] = useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const playerContainerId = `player-${song.id}`;

  useEffect(() => {
    const onPlayerReady = () => {
      setIsPlayerReady(true);
    };

    const onPlayerStateChange = (event: any) => {
      // When the player has loaded the video data, it's fully ready
      if (event.data === window.YT.PlayerState.CUED || event.data === window.YT.PlayerState.PAUSED) {
        setIsPlayerFullyLoaded(true);
      }
    };
    
    const setupPlayer = () => {
        if (playerRef.current) {
            playerRef.current.destroy();
        }
        setIsPlayerReady(false);
        setIsPlayerFullyLoaded(false);
        playerRef.current = new window.YT.Player(playerContainerId, {
            height: '0',
            width: '0',
            videoId: song.youtubeId,
            playerVars: {
                playsinline: 1,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
            },
        });
    };

    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = setupPlayer;
    } else {
      setupPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [song.id, playerContainerId]);

  const handlePlaySnippet = () => {
    if (playerRef.current && isPlayerReady && playerRef.current.seekTo && playerRef.current.playVideo) {
      // First, seek to the position
      playerRef.current.seekTo(song.playPosition, true);
      
      // Wait a bit longer for the seek to complete, especially on first play
      const delay = isPlayerFullyLoaded ? 150 : 500;
      
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.playVideo();
          
          // Pause after 1 second of playback
          setTimeout(() => {
            if (playerRef.current && playerRef.current.pauseVideo) {
              playerRef.current.pauseVideo();
            }
          }, 1000);
        }
      }, delay);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = userAnswer.toLowerCase() === song.name.toLowerCase();
    onAnswer(isCorrect);
    setUserAnswer('');
  };

  return (
    <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full flex flex-col items-center">
      <img
        src={`https://img.youtube.com/vi/${song.youtubeId}/0.jpg`}
        alt="Song thumbnail"
        className="w-64 h-64 object-cover rounded-lg shadow-md mb-6"
      />
      <div id={playerContainerId}></div>
      <button 
        onClick={handlePlaySnippet} 
        disabled={!isPlayerReady} 
        className="mb-4 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold text-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Play Snippet
      </button>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Guess the song name"
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button type="submit" className="mt-4 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold text-lg transition duration-300">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Question;