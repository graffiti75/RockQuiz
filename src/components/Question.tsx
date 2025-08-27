import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';

interface QuestionProps {
  song: Song;
  onAnswer: (isCorrect: boolean) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const Question: React.FC<QuestionProps> = ({ song, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const onPlayerReady = () => {
      setIsPlayerReady(true);
    };

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      // Reset player ready state for the new song
      setIsPlayerReady(false);
      playerRef.current = new window.YT.Player('player', {
        height: '0',
        width: '0',
        videoId: song.youtubeId,
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    const checkForApi = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        setTimeout(checkForApi, 100);
      }
    };

    checkForApi();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [song]);

  const handlePlaySnippet = () => {
    if (playerRef.current && isPlayerReady && playerRef.current.seekTo && playerRef.current.playVideo) {
      playerRef.current.seekTo(song.playPosition);
      playerRef.current.playVideo();
      setTimeout(() => {
        if (playerRef.current && playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo();
        }
      }, 1000);
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
      <div id="player"></div>
      <button onClick={handlePlaySnippet} disabled={!isPlayerReady} className="mb-4 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold text-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
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
