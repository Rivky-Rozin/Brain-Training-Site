// src/pages/allgames/AlternateUses.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const objects = ['Paperclip', 'Brick', 'Shoe', 'Bottle', 'Sock', 'Book'];

export default function AlternateUses() {
  const startRef = useRef(Date.now());
  const [obj, setObj] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [uses, setUses] = useState([]);
  const inputRef = useRef();

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
      axios.post('/api/results', {
        gameId: 13,
        score: uses.length,
        timeSpent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
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
      <h1 className="text-3xl font-bold mb-4">Alternate Uses</h1>
      <p className="mb-2">Object: <strong>{obj}</strong></p>
      <p className="mb-4">Time Left: {timeLeft}s</p>

      {timeLeft > 0 ? (
        <form onSubmit={addUse} className="mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a use and press Enter"
            className="px-3 py-2 border rounded w-64"
            autoFocus
          />
        </form>
      ) : (
        <p className="text-lg text-green-600 mb-4">Time's up! You listed {uses.length} unique uses.</p>
      )}

      <ul className="list-disc list-inside w-3/4 max-w-md mb-6">
        {uses.map((u, i) => (
          <li key={i} className="mb-1">{u}</li>
        ))}
      </ul>

      {timeLeft === 0 && (
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
