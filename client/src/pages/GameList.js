// src/pages/GameList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './GameList.css';

const categoryNames = {
  1: 'Analytical Thinking',
  2: 'Concentration',
  3: 'Processing Speed',
  4: 'Memory',
  5: 'Creativity',
  6: 'Adaptive Thinking'
};

const cardColors = [
  '#C9E5E5'  // Light Aqua Turquoise
];

const gameImages = [
  require('../assets/styles/game.png'),

];

export default function GameList() {
  const { category } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = category
          ? `/api/games/category/${category}`
          : '/api/games';
        const token = sessionStorage.getItem('token');
        const { data } = await axios.get(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.games)
            ? data.games
            : [];
        setGames(list);
      } catch (err) {
        setError('Error loading games');
        alert(err.response?.data?.message || err.message || 'Error loading games');
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  if (loading) return <p className="text-center py-8">Loading games…</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="game-list-container">
      <div className="container mx-auto px-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 bg-white text-teal-700 border border-teal-300 rounded-full px-5 py-2 mb-4 shadow hover:bg-teal-50 hover:text-teal-900 transition-colors font-semibold text-base"
          style={{ textDecoration: 'none' }}
        >
          <span style={{ fontSize: '1.2em', lineHeight: 1 }}>⟵</span>
          Back to categories
        </Link>
        <h1 className="game-list-title">
          {category
            ? `Games in ${categoryNames[category]}`
            : 'All Games'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, idx) => (
            <div
              key={game.id}
              className="game-card"
              style={{ backgroundColor: cardColors[idx % cardColors.length] }}
            >

              <img
                src={gameImages[idx % gameImages.length]}
                alt="game icon"
                className="game-card-img"
              />
              <h3 className="game-card-title">{typeof game.name === 'string' ? game.name : 'Alternate Uses'}</h3>
              <div className="game-card-desc">
                {typeof game.description === 'string'
                  ? (game.description && game.description.trim() !== ''
                    ? game.description
                    : `No description available for this game. Try it out and discover how it can boost your brain skills!`)
                  : 'Think of as many creative uses as possible for a common object. You have 60 seconds!'}
              </div>
              <div className="game-card-difficulty">
                Difficulty: {['Easy','Medium','Hard'][game.difficulty - 1]}
              </div>
              <Link
                to={`/play/${game.id}`}
                className="game-card-btn"
              >
                Start Game
              </Link>
            </div>
          ))}
      </div>
    </div>
    </div >
  );
}
