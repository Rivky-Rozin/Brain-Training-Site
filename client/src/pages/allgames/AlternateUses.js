// src/pages/allgames/AlternateUses.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const objects = ['Paperclip', 'Brick', 'Shoe', 'Bottle', 'Sock', 'Book'];

export default function AlternateUses() {
  const startRef = useRef(Date.now());
  const [obj, setObj] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [uses, setUses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const inputRef = useRef();

  const instructions = `Goal: Think of as many creative uses as possible for a common object.
How to play:
- You will see a random object.
- In 60 seconds, type as many different uses for the object as you can.
- Try to be original and creative!
- List at least 5 unique uses to succeed.`;

  // pick a random object on mount
  useEffect(() => {
    setObj(objects[Math.floor(Math.random() * objects.length)]);
    startRef.current = Date.now();
  }, []);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      const token = sessionStorage.getItem('token');
      // ניצחון אם יש לפחות 5 שימושים שונים
      const score = uses.length >= 5 ? 1 : 0;
      axios.post('/api/results', {
        gameId: 13,
        score,
        timeSpent
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .catch(console.error);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, uses.length]);

  const addUse = e => {
    e.preventDefault();
    const text = inputRef.current.value.trim();
    if (text && !uses.includes(text.toLowerCase())) {
      setUses(prev => [...prev, text]);
    }
    inputRef.current.value = '';
  };

  const reset = () => {
    setUses([]);
    setTimeLeft(60);
    setObj(objects[Math.floor(Math.random() * objects.length)]);
    startRef.current = Date.now();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 bg-gray-100">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Alternate Uses</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line', transition: 'all 0.3s' }}>
          {instructions}
        </div>
      )}
      <p className="mb-2 text-lg">Object: <strong className="text-teal-700">{obj}</strong></p>
      <p className="mb-4 text-base">Time Left: <span className="font-semibold">{timeLeft}s</span></p>
      {timeLeft > 0 ? (
        <form onSubmit={addUse} className="mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a use and press Enter"
            className="px-3 py-2 border rounded-lg shadow w-64 focus:ring-2 focus:ring-teal-400"
            autoFocus
          />
        </form>
      ) : (
        <p className="text-lg text-green-600 mb-4">Time's up! You listed {uses.length} unique uses.</p>
      )}
      <ul className="list-disc list-inside w-3/4 max-w-md mb-6">
        {uses.map((u, i) => (
          <li key={i} className="mb-1 text-base">{u}</li>
        ))}
      </ul>
      {timeLeft === 0 && (
        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
