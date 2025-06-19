// src/pages/allgames/NumberFlash.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Number Flash: memorize a sequence of numbers then input them
export default function NumberFlash() {
  const len = 5;
  const [phase, setPhase] = useState('show');        // 'show' → display numbers, 'input' → enter sequence, 'result' → feedback
  const [seq, setSeq] = useState([]);                // the generated sequence
  const [idx, setIdx] = useState(0);                 // current index in display phase
  const [inp, setInp] = useState('');                // user input
  const [res, setRes] = useState(null);              // boolean result
  const startRef = useRef(null);                     // timestamp when round starts

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

  // on mount, kick off first round
  useEffect(() => {
    start();
  }, []);

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
            onClick={start}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
