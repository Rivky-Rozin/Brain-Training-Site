// src/pages/allgames/LogicGrid.js
import React, { useState, useRef } from 'react';
import axios from 'axios';

// Medium Logic Grid: 3x3 with People, Pets, and Favorite Drinks
const people = ['Alice', 'Bob', 'Carol'];
const pets = ['Dog', 'Cat', 'Bird'];
const drinks = ['Tea', 'Coffee', 'Juice'];

// Clues for medium puzzle
const clues = [
  'Alice does not own the Bird and does not drink Tea.',
  'The person who owns the Cat drinks Coffee.',
  'Bob owns a Dog.',
  'Carol does not drink Juice.'
];

// Solution key
const solution = {
  Alice: { pet: 'Cat', drink: 'Juice' },
  Bob:   { pet: 'Dog', drink: 'Tea' },
  Carol: { pet: 'Bird', drink: 'Coffee' }
};

// States: null = undecided, true = yes, false = no
const STATES = [null, true, false];

export default function LogicGrid() {
  const startRef = useRef(Date.now());

  // Initialize cells state: person-pet and person-drink
  const init = {};
  people.forEach(p => {
    pets.forEach(pt => init[`${p}-pet-${pt}`] = null);
    drinks.forEach(d => init[`${p}-drink-${d}`] = null);
  });

  const [cells, setCells] = useState(init);
  const [message, setMessage] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Use logic to match each person with one pet and one drink.\nHow to play:\n- Each row is a person. Each column is a possible pet or drink.\n- Click a cell to cycle: blank → ✔ (yes) → ✖ (no) → blank.\n- Only one ✔ per row and per column for pets and drinks.\n- Use the clues to figure out the correct matches.\n- When you think you solved it, press 'Check'.`;

  // Handle cell toggle
  const toggle = key => {
    setCells(prev => ({
      ...prev,
      [key]: STATES[(STATES.indexOf(prev[key]) + 1) % STATES.length]
    }));
    setMessage(null);
  };

  // Validate and send result to server
  const check = () => {
    let correct = true;
    people.forEach(p => {
      const sol = solution[p];
      pets.forEach(pt => {
        const val = cells[`${p}-pet-${pt}`];
        if ((sol.pet === pt) !== (val === true)) correct = false;
      });
      drinks.forEach(d => {
        const val = cells[`${p}-drink-${d}`];
        if ((sol.drink === d) !== (val === true)) correct = false;
      });
    });
    setMessage(correct ? '✅ Correct!' : '❌ Try again.');
    const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
    const token = sessionStorage.getItem('token');
    axios.post('/api/results', { gameId: 3, score: correct ? 1 : 0, timeSpent }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .catch(console.error);
  };

  // Reset grid and timer
  const reset = () => {
    setCells({ ...init });
    setMessage(null);
    startRef.current = Date.now();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Medium Logic Grid</h1>      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ marginRight: 6, fontSize: '1.2em' }}>ℹ️</span>
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line', transition: 'all 0.3s' }}>
          {instructions}
        </div>
      )}
      <div className="mb-4 bg-white p-6 rounded-2xl shadow-lg border border-teal-100 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-2 text-teal-800">Clues</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {clues.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* Pets Grid */}
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {pets.map(pt => <th key={pt} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{pt}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{p}</td>
              {pets.map(pt => {
                const key = `${p}-pet-${pt}`;
                const st = cells[key];
                const disp = st === true ? '✔' : st === false ? '✖' : '';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (st === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (st === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td
                    key={key}
                    className={`p-4 text-center cursor-pointer transition-colors duration-300 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`}
                    onClick={() => toggle(key)}
                    title="Click to cycle: blank → ✔ (yes) → ✖ (no) → blank"
                    style={{ transition: 'background 0.3s, border 0.3s' }}
                  >{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Divider */}
      <div className="w-full flex items-center justify-center mb-6">
        <div className="border-t-2 border-dashed border-teal-200 w-2/3"></div>
      </div>

      {/* Drinks Grid */}
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {drinks.map(d => <th key={d} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{p}</td>
              {drinks.map(d => {
                const key = `${p}-drink-${d}`;
                const st = cells[key];
                const disp = st === true ? '✔' : st === false ? '✖' : '';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (st === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (st === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td
                    key={key}
                    className={`p-4 text-center cursor-pointer transition-colors duration-300 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`}
                    onClick={() => toggle(key)}
                    title="Click to cycle: blank → ✔ (yes) → ✖ (no) → blank"
                    style={{ transition: 'background 0.3s, border 0.3s' }}
                  >{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button onClick={check} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow">Check</button>
        <button onClick={reset} className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow">Reset</button>
      </div>
      {message && (
        <div className={`flex items-center justify-center mt-6 text-lg font-bold rounded-xl shadow-md px-6 py-3 max-w-md mx-auto ${message.includes('Correct') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
          style={{ gap: '10px' }}>
          {message.includes('Correct') ? (
            <span style={{ fontSize: '1.7em' }}>🎉</span>
          ) : (
            <span style={{ fontSize: '1.7em' }}>❌</span>
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
