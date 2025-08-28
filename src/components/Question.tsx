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
  const playerRef = useRef<any>(null);
  const playerContainerId = `player-${song.id}`; // Ensure unique ID for the div

  useEffect(() => {
    console.log(`[Effect] Running for song: "${song.name}" (ID: ${song.id})`);

    const onPlayerReady = () => {
      console.log(`[Player] Player is READY for song: "${song.name}"`);
      setIsPlayerReady(true);
    };
    
    const setupPlayer = () => {
        console.log(`[Setup] Destroying old player if it exists.`);
        if (playerRef.current) {
            playerRef.current.destroy();
        }
        setIsPlayerReady(false);
        console.log(`[Setup] Creating new player for videoId: ${song.youtubeId} in div #${playerContainerId}`);
        playerRef.current = new window.YT.Player(playerContainerId, {
            height: '0',
            width: '0',
            videoId: song.youtubeId,
            playerVars: {
                playsinline: 1,
            },
            events: {
                'onReady': onPlayerReady,
            },
        });
    };

    if (!window.YT || !window.YT.Player) {
      console.log('[API] YouTube API not ready. Setting global callback.');
      // If the API is not ready, set the global callback
      // which will be triggered by the script loaded in index.html
      window.onYouTubeIframeAPIReady = setupPlayer;
    } else {
      console.log('[API] YouTube API is ready. Setting up player directly.');
      // If API is already ready, just set up the player.
      setupPlayer();
    }

    return () => {
      console.log(`[Effect Cleanup] Cleaning up for song: "${song.name}"`);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [song.id, playerContainerId]);

  const handlePlaySnippet = () => {
    console.log('[handlePlaySnippet] Clicked!');
    const conditions = {
        playerExists: !!playerRef.current,
        playerIsReady: isPlayerReady,
        loadMethodExists: !!(playerRef.current && playerRef.current.loadVideoById),
    };
    console.log('[handlePlaySnippet] Checking conditions:', conditions);

    if (conditions.playerExists && conditions.playerIsReady && conditions.loadMethodExists) {
      console.log(`[handlePlaySnippet] Conditions met. Calling loadVideoById with startSeconds: ${song.playPosition}`);
      playerRef.current.loadVideoById({
        videoId: song.youtubeId,
        startSeconds: song.playPosition,
        endSeconds: song.playPosition + 1,
      });
    } else {
        console.error('[handlePlaySnippet] Conditions NOT met. Playback prevented.');
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
