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
  require('../assets/styles/7.png'),
  require('../assets/styles/8.png'),
  require('../assets/styles/9.png'),
  require('../assets/styles/10.png'),
  require('../assets/styles/11.png'),
  require('../assets/styles/12.png'),
  require('../assets/styles/1.png'),
  require('../assets/styles/2.png'),
  require('../assets/styles/3.png'),
  require('../assets/styles/4.png'),
  require('../assets/styles/5.png'),
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
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#e6f2f0',
            color: '#2186ae',
            border: '1.5px solid #b2dbe6',
            borderRadius: '2rem',
            padding: '0.45rem 1.2rem 0.45rem 1.1rem',
            fontWeight: 600,
            fontSize: '1.08rem',
            boxShadow: '0 2px 8px #7CC3B622',
            textDecoration: 'none',
            marginBottom: '1.2rem',
            transition: 'background 0.18s, color 0.18s, border 0.18s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#c9e5e5';
            e.currentTarget.style.color = '#176b87';
            e.currentTarget.style.border = '1.5px solid #7CC3B6';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#e6f2f0';
            e.currentTarget.style.color = '#2186ae';
            e.currentTarget.style.border = '1.5px solid #b2dbe6';
          }}
        >
          <span style={{fontSize:'1.25em',marginRight:'-0.2em'}}>←</span>
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
              <h3 className="game-card-title">{game.name}</h3>
              <div className="game-card-desc">
                {game.description && game.description.trim() !== ''
                  ? game.description
                  : `No description available for this game. Try it out and discover how it can boost your brain skills!`}
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
