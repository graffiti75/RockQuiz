import React, { useState, useEffect } from 'react';
import songs from '../data/songs.json';
import Question from './Question';
import Scoreboard from './Scoreboard';
import { Song } from '../types';

interface QuizProps {
  settings: {
    band: string;
    difficulty: string;
    mode: string;
  };
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ settings, onBack }) => {
  const { band, difficulty, mode } = settings;
  const [questions, setQuestions] = useState<Song[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isQuizOver, setIsQuizOver] = useState<boolean>(false);

  useEffect(() => {
    const filteredSongs: Song[] = songs.filter(
      (song) => song.band === band && song.difficulty === difficulty
    );

    const numberOfQuestions = mode === 'quick' ? 5 : 10;
    const shuffledSongs = filteredSongs.sort(() => 0.5 - Math.random());
    setQuestions(shuffledSongs.slice(0, numberOfQuestions));
  }, [band, difficulty, mode]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setIsQuizOver(true);
    }
  };
  
  const handlePlayAgain = () => {
    window.location.reload();
  }

  if (isQuizOver) {
    return (
      <div>
        <h2>Quiz Over!</h2>
        <p>Your final score is: {score}</p>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Scoreboard score={score} />
        <button onClick={onBack} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-bold transition duration-300">
          Back
        </button>
      </div>
      {currentQuestion && (
        <Question
          song={currentQuestion}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default Quiz;
