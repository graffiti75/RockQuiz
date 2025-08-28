import React, { useState } from 'react';
import SongSelection from './components/SongSelection';
import Quiz from './components/Quiz';

interface QuizSettings {
  band: string;
}

function App() {
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);

  const handleStartQuiz = (settings: QuizSettings) => {
    setQuizSettings(settings);
  };

  const handleGoBack = () => {
    setQuizSettings(null);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">RockQuiz</h1>
        {quizSettings ? (
          <Quiz settings={quizSettings} onBack={handleGoBack} />
        ) : (
          <SongSelection onStartQuiz={handleStartQuiz} />
        )}
      </div>
    </div>
  );
}

export default App;
