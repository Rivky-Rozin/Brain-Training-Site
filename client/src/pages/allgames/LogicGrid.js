// src/pages/allgames/LogicGridMedium.jsx
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

export default function LogicGridMedium() {
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
      <h1 className="text-3xl font-bold mb-4">Medium Logic Grid</h1>
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
      <div className="mb-4 bg-white p-4 rounded shadow">
        <ul className="list-disc list-inside text-gray-700">
          {clues.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* Pets Grid */}
      <table className="table-auto border-collapse mx-auto mb-4">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {pets.map(pt => <th key={pt} className="border p-2 text-center">{pt}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border p-2 font-semibold">{p}</td>
              {pets.map(pt => {
                const key = `${p}-pet-${pt}`;
                const st = cells[key];
                const disp = st === true ? '✔' : st === false ? '✖' : '';
                let bg = 'bg-gray-100';
                if (st === true) bg = 'bg-green-300';
                else if (st === false) bg = 'bg-red-300';
                return (
                  <td
                    key={key}
                    className={`border p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg}`}
                    onClick={() => toggle(key)}
                  >{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drinks Grid */}
      <table className="table-auto border-collapse mx-auto mb-4">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {drinks.map(d => <th key={d} className="border p-2 text-center">{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border p-2 font-semibold">{p}</td>
              {drinks.map(d => {
                const key = `${p}-drink-${d}`;
                const st = cells[key];
                const disp = st === true ? '✔' : st === false ? '✖' : '';
                let bg = 'bg-gray-100';
                if (st === true) bg = 'bg-green-300';
                else if (st === false) bg = 'bg-red-300';
                return (
                  <td
                    key={key}
                    className={`border p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg}`}
                    onClick={() => toggle(key)}
                  >{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex space-x-4 justify-center">
        <button onClick={check} className="bg-green-500 text-white px-4 py-2 rounded">Check</button>
        <button onClick={reset} className="bg-blue-500 text-white px-4 py-2 rounded">Reset</button>
      </div>
      {message && <p className="text-center mt-4 font-semibold">{message}</p>}
    </div>
  );
}
