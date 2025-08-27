import React, { useState } from 'react';
import songs from '../data/songs.json';

interface SongSelectionProps {
    onStartQuiz: (settings: {
        band: string;
        difficulty: string;
        mode: string;
    }) => void;
}

const SongSelection: React.FC<SongSelectionProps> = ({ onStartQuiz }) => {
    const [band, setBand] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [mode, setMode] = useState<string>('quick');

    const bands = [...new Set(songs.map((song) => song.band))];
    const difficulties = [...new Set(songs.map((song) => song.difficulty))];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (band && difficulty) {
            onStartQuiz({ band, difficulty, mode });
        }
    };

    return (
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Song Selection
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-2">
                        Band:
                        <select
                            value={band}
                            onChange={(e) => setBand(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a band</option>
                            {bands.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2">
                        Difficulty:
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a difficulty</option>
                            {difficulties.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="flex items-center justify-center space-x-8">
                    <label className="flex items-center text-lg">
                        <input
                            type="radio"
                            value="quick"
                            checked={mode === 'quick'}
                            onChange={(e) => setMode(e.target.value)}
                            className="form-radio h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Quick Mode (5 songs)</span>
                    </label>
                    <label className="flex items-center text-lg">
                        <input
                            type="radio"
                            value="full"
                            checked={mode === 'full'}
                            onChange={(e) => setMode(e.target.value)}
                            className="form-radio h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2">Full Mode (10 songs)</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold text-lg transition duration-300"
                >
                    Start Quiz
                </button>
            </form>
        </div>
    );
};

export default SongSelection;
