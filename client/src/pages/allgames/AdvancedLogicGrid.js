// src/pages/allgames/AdvancedLogicGrid.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

// Advanced Logic Grid: 4x4 with People, Pets, Drinks, and Colors
const people = ['Alice', 'Bob', 'Carol', 'Dave'];
const pets = ['Dog', 'Cat', 'Bird', 'Fish'];
const drinks = ['Tea', 'Coffee', 'Juice', 'Water'];
const colors = ['Red', 'Green', 'Blue', 'Yellow'];

// Clues for the 4x4 grid
const clues = [
  'Alice does not have a Red pet and does not drink Water.',
  'The person with the Cat drinks Coffee.',
  'Bob’s pet is not Green.',
  'The person who drinks Tea has a Bird.',
  'Carol does not drink Juice.',
  'Dave’s pet is Fish.'
];

// Solution key
const solution = {
  Alice: { pet: 'Dog', drink: 'Juice', color: 'Blue' },
  Bob:   { pet: 'Cat', drink: 'Water', color: 'Red' },
  Carol: { pet: 'Bird', drink: 'Tea', color: 'Green' },
  Dave:  { pet: 'Fish', drink: 'Coffee', color: 'Yellow' }
};

const STATES = [null, true, false];

export default function AdvancedLogicGrid() {
  const startRef = useRef(Date.now());

  // initialize state for each pairing
  const init = {};
  people.forEach(p => {
    pets.forEach(x => init[`${p}-pet-${x}`] = null);
    drinks.forEach(x => init[`${p}-drink-${x}`] = null);
    colors.forEach(x => init[`${p}-color-${x}`] = null);
  });

  const [cells, setCells] = useState(init);
  const [message, setMessage] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // toggle cell
  const toggle = key => {
    setCells(prev => ({
      ...prev,
      [key]: STATES[(STATES.indexOf(prev[key]) + 1) % STATES.length]
    }));
    setMessage(null);
  };

  // check answer and send to server
  const check = () => {
    let correct = true;
    people.forEach(p => {
      const sol = solution[p];
      pets.forEach(x => {
        const val = cells[`${p}-pet-${x}`];
        if ((sol.pet === x) !== (val === true)) correct = false;
      });
      drinks.forEach(x => {
        const val = cells[`${p}-drink-${x}`];
        if ((sol.drink === x) !== (val === true)) correct = false;
      });
      colors.forEach(x => {
        const val = cells[`${p}-color-${x}`];
        if ((sol.color === x) !== (val === true)) correct = false;
      });
    });
    setMessage(correct ? '✅ Correct!' : '❌ Try again.');
    const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
    const token = sessionStorage.getItem('token');
    axios.post('/api/results', {
      gameId: 3,
      score: correct ? 1 : 0,
      timeSpent
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(console.error);
  };

  // reset grid and timer
  const reset = () => {
    setCells({ ...init });
    setMessage(null);
    startRef.current = Date.now();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Advanced Logic Grid</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line' }}>
          {`Goal: Use logic to match each person with one pet, one drink, and one color.\nHow to play:\n- Each row is a person. Each column is a possible pet, drink, or color.\n- Click a cell to cycle: blank → ✔ (yes) → ✖ (no) → blank.\n- Only one ✔ per row and per column for each category.\n- Use the clues to figure out the correct matches.\n- When you think you solved it, press 'Check'.`}
        </div>
      )}
      <div className="mb-4 bg-white p-6 rounded-2xl shadow-lg border border-teal-100 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-2 text-teal-800">Clues</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {clues.map((c,i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* Pet Table */}
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {pets.map(x => <th key={x} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{p}</td>
              {pets.map(x => {
                const key = `${p}-pet-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (st === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (st === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td key={key} className={`p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`} onClick={() => toggle(key)}>{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Drink Table */}
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {drinks.map(x => <th key={x} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{p}</td>
              {drinks.map(x => {
                const key = `${p}-drink-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (st === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (st === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td key={key} className={`p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`} onClick={() => toggle(key)}>{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Color Table */}
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {colors.map(x => <th key={x} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{p}</td>
              {colors.map(x => {
                const key = `${p}-color-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (st === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (st === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td key={key} className={`p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`} onClick={() => toggle(key)}>{disp}</td>
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
      {message && <p className={`text-center mt-6 text-lg font-bold ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}
