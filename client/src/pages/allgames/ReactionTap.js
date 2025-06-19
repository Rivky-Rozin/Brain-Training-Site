import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Reaction Tap: tap as soon as the circle changes color
export default function ReactionTap() {
  const [status, setStatus] = useState('waiting'); // 'waiting', 'ready', 'tapped'
  const [message, setMessage] = useState('');
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startRef = useRef(null);

  // Initialize round
  useEffect(() => {
    startRound();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Start a new round with random delay
  const startRound = () => {
    setStatus('waiting');
    setMessage('Get ready...');
    const delay = 1000 + Math.random() * 2000; // 1-3 seconds
    timeoutRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setStatus('ready');
      setMessage('Tap now!');
    }, delay);
  };

  // Handle user tap
  const handleTap = () => {
    if (status === 'waiting') {
      // Too early
      clearTimeout(timeoutRef.current);
      setMessage('Too soon! Try again.');
      setStatus('tapped');
      setTimeout(startRound, 1000);
    } else if (status === 'ready') {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      setMessage(`Your time: ${time} ms`);
      setStatus('tapped');
      // send result
      const token = sessionStorage.getItem('token');
      axios.post('/api/results', {
        gameId: 7,
        score: time,
        timeSpent: time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
      setTimeout(startRound, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Reaction Tap</h1>
      <div
        onClick={handleTap}
        className={`w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300
          ${status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`}
      >
        <span className="text-4xl text-white">{message}</span>
      </div>
      {reactionTime !== null && (
        <p className="mt-4 text-lg">Last reaction: {reactionTime} ms</p>
      )}
    </div>
  );
}
