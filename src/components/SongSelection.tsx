import React, { useState } from 'react';
import songs from '../data/songs.json';

interface SongSelectionProps {
  onStartQuiz: (settings: { band: string }) => void;
}

const SongSelection: React.FC<SongSelectionProps> = ({ onStartQuiz }) => {
  const [band, setBand] = useState<string>('');

  const bands = [...new Set(songs.map(song => song.band))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (band) {
      onStartQuiz({ band });
    }
  };

  return (
    <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Select a Band</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">
            Band:
            <select value={band} onChange={(e) => setBand(e.target.value)} required className="mt-1 block w-full p-3 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select a band</option>
              {bands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
        </div>
        <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold text-lg transition duration-300">Start Quiz</button>
      </form>
    </div>
  );
};

export default SongSelection;
