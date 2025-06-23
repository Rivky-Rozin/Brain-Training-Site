// src/pages/allgames/ColorMatchSpeed.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Color Match Speed: quickly match shapes to their colors under a ticking timer
const shapes = ['■','▲','●','◆'];
const colors = ['red','green','blue','yellow'];

export function ColorMatchSpeed() {
  const startRef = useRef(Date.now());
  const [target, setTarget] = useState({ shape: '', color: '' });
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Test reactivity and focus against cognitive conflict.\nHow to play:\n- A color name (e.g., "Blue") is shown in a non-matching color (e.g., red).\n- Click according to the color, not the text.`;

  // kick off the first round and timer
  useEffect(() => {
    startRef.current = Date.now();
    nextRound();
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // when time runs out, send result
  useEffect(() => {
    if (timeLeft === 0) {
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      // הגדרת token פעם אחת בלבד
      const token = sessionStorage.getItem('token');
      // נצחון אם השיגו 10 נקודות
      const winScore = score >= 10 ? 1 : 0;
      axios.post('/api/results', {
        gameId: 9,
        score: winScore,
        timeSpent
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .catch(console.error);
    }
  }, [timeLeft, score]);

  const nextRound = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setTarget({ shape, color });
    setInput('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (input.trim().toLowerCase() === target.color) {
      setScore(s => s + 1);
    }
    nextRound();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Color Match Speed</h1>
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
      <div className="text-7xl mb-8 bg-white rounded-2xl shadow-lg border border-teal-100 px-16 py-8 font-mono tracking-widest" style={{ color: target.color }}>
        {target.shape}
      </div>
      <p className="mb-6 text-lg font-semibold text-teal-800">Time Left: <span className="text-blue-600">{timeLeft}s</span> | Score: <span className="text-teal-600">{score}</span></p>
      {timeLeft > 0 ? (
        <form onSubmit={handleSubmit} className="flex flex-row gap-4 items-center mb-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the color"
            className="border-2 border-teal-300 rounded-lg px-6 py-3 text-center text-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={timeLeft <= 0}
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow"
          >
            OK
          </button>
        </form>
      ) : (
        <p className="text-green-600 font-bold text-xl mt-4">
          Time's up! Final score: {score}
        </p>
      )}
    </div>
  );
}

export default ColorMatchSpeed;
