// client/src/pages/GameList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const categoryNames = {
  1: 'Analytical Thinking',
  2: 'Concentration',
  3: 'Processing Speed',
  4: 'Memory',
  5: 'Creativity',
  6: 'Adaptive Thinking'
};

// Generic icon for games
const gameIcon = '🎮';

export default function GameList() {
  const { category } = useParams();
  const [games, setGames]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = category
          ? `/api/games/category/${category}`
          : '/api/games';
        const { data } = await axios.get(url);
        setGames(data.games);
      } catch {
        setError('Error loading games');
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  if (loading) return <p className="text-center py-8">Loading games…</p>;
  if (error)   return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link to="/games"
              className="text-blue-600 underline mb-4 inline-block">
          ← Back to categories
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {category
            ? `Games in ${categoryNames[category]}`
            : 'All Games'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map(game => (
            <div key={game.id}
                 className="group relative perspective-[1000px] w-full h-64">
              <div className="relative w-full h-full transition-transform duration-500"
                   style={{ transformStyle: 'preserve-3d' }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'rotateY(180deg)'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'rotateY(0deg)'; }}>
                {/* Front Face */}
                <div
                  className="absolute inset-0 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-5xl mb-4">{gameIcon}</div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {game.name}
                  </h3>
                </div>

                {/* Back Face */}
                <div
                  className="absolute inset-0 bg-gray-800 text-white rounded-xl shadow-lg flex flex-col p-6"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <h4 className="text-xl font-semibold mb-2">Description</h4>
                  <p className="flex-1 text-gray-200 mb-4 text-sm">
                    {game.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Difficulty:</span>
                    <span>{game.difficulty === 1
                      ? 'Easy'
                      : game.difficulty === 2
                        ? 'Medium'
                        : 'Hard'}</span>
                  </div>
                  <Link
                    to={`/game/${game.id}`}
                    className="mt-4 bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Start Game
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
