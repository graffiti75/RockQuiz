import React, { useState } from 'react';
import SongSelection from './components/SongSelection';
import Quiz from './components/Quiz';

interface QuizSettings {
    band: string;
    difficulty: string;
    mode: string;
}

function App() {
    const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);

    const handleStartQuiz = (settings: QuizSettings) => {
        setQuizSettings(settings);
    };

    return (
        <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    YouTube Music Quiz
                </h1>
                {quizSettings ? (
                    <Quiz settings={quizSettings} />
                ) : (
                    <SongSelection onStartQuiz={handleStartQuiz} />
                )}
            </div>
        </div>
    );
}

export default App;
