// src/pages/allgames/NumberFlash.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Number Flash: memorize a sequence of numbers then input them
export default function NumberFlash() {
  const len = 5;
  const [phase, setPhase] = useState('init');        // 'init' → מסך פתיחה, 'show' → הצגת מספרים, 'input' → קלט, 'result' → תוצאה
  const [seq, setSeq] = useState([]);
  const [idx, setIdx] = useState(0);
  const [inp, setInp] = useState('');
  const [res, setRes] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const startRef = useRef(null);
  const instructions = `Goal: Remember a sequence of numbers shown briefly.\nHow to play:\n- Numbers are shown quickly.\n- Then enter what you remember.\n- Difficulty increases with more digits and speed.`;

  // start or restart a round
  const start = () => {
    const s = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setSeq(s);
    setIdx(0);
    setPhase('show');
    setInp('');
    setRes(null);
    startRef.current = Date.now();
  };

  // show each number for 800ms, then transition to input
  useEffect(() => {
    if (phase !== 'show') return;
    if (idx < seq.length) {
      const t = setTimeout(() => setIdx(i => i + 1), 800);
      return () => clearTimeout(t);
    }
    setPhase('input');
  }, [idx, phase, seq]);

  // handle submission: compare and send result
  const submit = e => {
    e.preventDefault();
    const correct = seq.join('') === inp;
    setRes(correct);
    setPhase('result');
    const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
    const token = sessionStorage.getItem('token');
    axios.post('/api/results', {
      gameId: 8,
      score: correct ? 1 : 0,
      timeSpent
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Number Flash</h1>
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

      {phase === 'init' && (
        <button
          onClick={start}
          className="bg-blue-500 text-white px-6 py-3 rounded text-lg mt-8"
        >
          Start
        </button>
      )}

      {phase === 'show' && (
        <div className="text-6xl mb-4">
          {idx < seq.length ? seq[idx] : ''}
        </div>
      )}

      {phase === 'input' && (
        <form onSubmit={submit} className="flex flex-col items-center">
          <input
            value={inp}
            onChange={e => setInp(e.target.value.replace(/\D/g, '').slice(0, len))}
            className="border px-3 py-2 text-center mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Check
          </button>
        </form>
      )}

      {phase === 'result' && (
        <div className="text-center">
          <p className="mb-4 font-semibold">
            {res ? '✅ Correct!' : `❌ Wrong, was ${seq.join('')}`}
          </p>
          <button
            onClick={() => setPhase('init')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
