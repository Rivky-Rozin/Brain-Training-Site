// src/pages/GamesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function GamesPage() {
  const { categoryId } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/games/category/${categoryId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load games');
        return res.json();
      })
      .then(data => {
        // תמיכה גם ב־Array ישיר וגם באובייקט { games: [...] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.games)
          ? data.games
          : [];
        setGames(list);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return <div className="text-center py-20">Loading games...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }
  if (!games.length) {
    return <div className="text-center py-20">No games found for this category.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Available Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <Link
              key={game.id}
              to={`/play/${game.id}`}
              className="block bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {game.name}
              </h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Difficulty: {['Easy', 'Medium', 'Hard'][game.difficulty - 1]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
