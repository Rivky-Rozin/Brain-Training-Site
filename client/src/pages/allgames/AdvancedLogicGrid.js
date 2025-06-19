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
      <h1 className="text-3xl font-bold mb-4">Advanced Logic Grid</h1>
      <div className="mb-4 bg-white p-4 rounded shadow">
        <ul className="list-disc list-inside text-gray-700">
          {clues.map((c,i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      {/* Pet Table */}
      <table className="table-auto border-collapse mx-auto mb-4">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {pets.map(x => <th key={x} className="border p-2 text-center">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border p-2 font-semibold">{p}</td>
              {pets.map(x => {
                const key = `${p}-pet-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                return (
                  <td key={key} className="border p-4 text-center cursor-pointer" onClick={() => toggle(key)}>{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drink Table */}
      <table className="table-auto border-collapse mx-auto mb-4">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {drinks.map(x => <th key={x} className="border p-2 text-center">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border p-2 font-semibold">{p}</td>
              {drinks.map(x => {
                const key = `${p}-drink-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                return (
                  <td key={key} className="border p-4 text-center cursor-pointer" onClick={() => toggle(key)}>{disp}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Color Table */}
      <table className="table-auto border-collapse mx-auto mb-4">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {colors.map(x => <th key={x} className="border p-2 text-center">{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map(p => (
            <tr key={p}>
              <td className="border p-2 font-semibold">{p}</td>
              {colors.map(x => {
                const key = `${p}-color-${x}`;
                const st = cells[key];
                const disp = st===true?'✔':st===false?'✖':'';
                return (
                  <td key={key} className="border p-4 text-center cursor-pointer" onClick={() => toggle(key)}>{disp}</td>
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
