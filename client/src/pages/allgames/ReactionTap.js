import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Reaction Tap: tap as soon as the circle changes color
export default function ReactionTap() {
  const [status, setStatus] = useState('waiting'); // 'waiting', 'ready', 'tapped'
  const [message, setMessage] = useState('');
  const [reactionTime, setReactionTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const timeoutRef = useRef(null);
  const startRef = useRef(null);

  const instructions = `Goal: Test reaction speed.\nHow to play:\n- Click as soon as a sign (e.g., green circle) appears.\n- Clicking too early is a fail.\n- Goal: fast and accurate reaction.`;

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
      // ניצחון אם זמן התגובה קטן מ-500ms
      const score = time < 500 ? 1 : 0;
      axios.post('/api/results', {
        gameId: 7,
        score,
        timeSpent: time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
      setTimeout(startRound, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Reaction Tap</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line' }}>
          {instructions}
        </div>
      )}
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
