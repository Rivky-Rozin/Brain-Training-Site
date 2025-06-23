// src/pages/allgames/CardPairs.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Card Pairs: find matching pairs with as few moves as possible
const symbols = ['🍎','🍌','🍇','🍓','🍍','🥝']; // 6 symbols → 12 cards total

export default function CardPairs() {
  const startRef = useRef(Date.now());
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);  // indices of currently flipped cards
  const [matched, setMatched] = useState([]);  // indices of matched cards
  const [moves, setMoves] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Find matching pairs.\nHow to play:\n- Click cards to reveal them.\n- Find matching pairs from memory.\n- Game ends when all pairs are found.`;

  // initialize deck on mount
  useEffect(() => {
    const deck = [...symbols, ...symbols]
      .map((symbol, i) => ({ id: i, symbol }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
    startRef.current = Date.now();
  }, []);

  // watch for completion and send result
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      // ניצחון אם כל הזוגות נמצאו בפחות מ-20 מהלכים
      const winScore = moves < 20 ? 1 : 0;
      const token = sessionStorage.getItem('token');
      axios.post('/api/results', {
        gameId: 10,
        score: winScore,
        timeSpent
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .catch(console.error);
    }
  }, [matched, cards.length, moves]);

  // handle card click
  const handleClick = index => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [i, j] = newFlipped;
      if (cards[i].symbol === cards[j].symbol) {
        setMatched(m => [...m, i, j]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Card Pairs</h1>
        <button
          onClick={() => setShowInstructions(s => !s)}
          style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8' }}
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>
        {showInstructions && (
          <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line' }}>
            {instructions}
          </div>
        )}
        <p className="mb-4 text-lg font-semibold text-teal-800">Moves: <span className="text-teal-600">{moves}</span></p>
        <div className="grid grid-cols-4 gap-6 justify-center max-w-lg mx-auto mb-8">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <div
                key={card.id}
                onClick={() => handleClick(idx)}
                className={`w-24 h-24 flex items-center justify-center text-4xl rounded-2xl shadow-lg cursor-pointer border-2 transition-all duration-200 font-bold select-none
                  ${isFlipped ? 'bg-white border-teal-300 scale-105' : 'bg-blue-400 border-blue-400 hover:bg-blue-500 hover:scale-105'}`}
                style={{boxShadow: isFlipped ? '0 2px 12px #b2d8d8' : '0 1px 4px #b2d8d8'}}
              >
                {isFlipped ? card.symbol : ''}
              </div>
            );
          })}
        </div>
        {matched.length === cards.length && (
          <p className="text-green-600 font-bold text-xl mt-6">
            🎉 You matched all pairs in {moves} moves!
          </p>
        )}
      </div>
    </div>
  );
}
