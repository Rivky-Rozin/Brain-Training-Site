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
      const token = sessionStorage.getItem('token');
      // ניצחון אם הגיעו ל-10 נקודות לפחות
      const winScore = score >= 10 ? 1 : 0;
      axios.post('/api/results', {
        gameId: 9,
        score: winScore,
        timeSpent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
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
      <h1 className="text-3xl font-bold mb-4">Color Match Speed</h1>
      <div className="text-6xl mb-4" style={{ color: target.color }}>
        {target.shape}
      </div>
      <p className="mb-4">Time Left: {timeLeft}s | Score: {score}</p>
      {timeLeft > 0 ? (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the color"
            className="px-3 py-2 border rounded text-center"
            disabled={timeLeft <= 0}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </form>
      ) : (
        <p className="text-green-600 font-semibold mt-4">
          Time's up! Final score: {score}
        </p>
      )}
    </div>
  );
}

export default ColorMatchSpeed;
