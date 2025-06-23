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
  const [showInstructions, setShowInstructions] = useState(false);
  const startRef = useRef(Date.now());
  const instructions = `Goal: Follow changing rules.\nHow to play:\n- At first, there is a rule (e.g., click red).\n- Suddenly, the rule changes (e.g., click green).\n- Pay attention to the change and respond accordingly.`;

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
    }).catch(console.error);
  };

  // next pattern
  const next = () => setRound(r => (r + 1) % patterns.length);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Rule Shift</h1>
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
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 mb-8 max-w-md mx-auto">
        <table className="mx-auto table-auto border-collapse">
          <tbody>
            {patterns[round].grid.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border-2 border-teal-200 p-4 text-center text-xl font-bold bg-teal-50 rounded-lg">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6 flex flex-col items-center gap-4">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="border-2 border-teal-300 rounded-lg px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">Select rule...</option>
          {guesses.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button
          onClick={handleGuess}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow"
        >
          Check
        </button>
      </div>
      {message && <p className={`mb-6 font-bold text-lg ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <button
        onClick={next}
        className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow"
      >
        Next Pattern
      </button>
    </div>
  );
}
