// src/pages/allgames/RuleShift.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Rule Shift: guess the hidden rule each round
const patterns = [
  { grid: [['X','O','X'],['O','X','O'],['X','O','X']], rule: 'alternating' },
  { grid: [['A','A','A'],['B','B','B'],['C','C','C']], rule: 'rows constant' },
  { grid: [['1','2','3'],['2','3','1'],['3','1','2']], rule: 'cyclic shift' },
];
const guesses = ['alternating','rows constant','cyclic shift'];

export default function RuleShift() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const startRef = useRef(Date.now());

  // reset state on new round
  useEffect(() => {
    setSelected('');
    setMessage('');
    startRef.current = Date.now();
  }, [round]);

  // handle guess submission
  const handleGuess = () => {
    const correct = selected === patterns[round].rule;
    setMessage(correct ? '✅ Correct!' : '❌ Try again.');
    // send result
    const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
    const token = sessionStorage.getItem('token');
    axios.post('/api/results', {
      gameId: 16,
      score: correct ? 1 : 0,
      timeSpent
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => alert(err.response?.data?.message || err.message || 'שגיאה בשליחת תוצאה'));
  };

  // next pattern
  const next = () => setRound(r => (r + 1) % patterns.length);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-4">Rule Shift</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <table className="mx-auto table-auto border-collapse">
          <tbody>
            {patterns[round].grid.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border p-3 text-center">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select rule...</option>
          {guesses.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button
          onClick={handleGuess}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check
        </button>
      </div>
      {message && <p className="mb-4 font-semibold">{message}</p>}
      <button
        onClick={next}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Next Pattern
      </button>
    </div>
  );
}
