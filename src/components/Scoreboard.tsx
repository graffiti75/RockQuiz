import React from 'react';

interface ScoreboardProps {
    score: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
    return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg mb-4 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center">Score: {score}</h3>
        </div>
    );
};

export default Scoreboard;
