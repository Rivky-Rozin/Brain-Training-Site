// src/pages/allgames/SimpleLogicGrid.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

// Simple Logic Grid: 2x2 grid for basic analytical reasoning
const people = ['Alice', 'Bob'];
const colors = ['Red', 'Blue'];
const clues = ['Alice does not like Blue.', 'Bob does not like Red.'];
const answerKey = { Alice: 'Red', Bob: 'Blue' };

export default function SimpleLogicGrid() {
  const startRef = useRef(Date.now());
  const [cells, setCells] = useState(() => {
    const init = {};
    people.forEach((_, i) =>
      colors.forEach((_, j) => init[`${i}-${j}`] = null)
    );
    return init;
  });
  const [result, setResult] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Solve a simple logic puzzle using clues.\nHow to play:\n- An empty table and a list of clues appear.\n- Drag or mark √ or ✗ in the appropriate cells according to logic.\n- The goal: place each item in the correct spot in the table.`;

  const STATES = [null, true, false];

  const handleCellClick = (i, j) => {
    const key = `${i}-${j}`;
    const next = STATES[(STATES.indexOf(cells[key]) + 1) % STATES.length];
    setCells(prev => ({ ...prev, [key]: next }));
    setResult(null);
  };

  const validate = () => {
    let ok = true;
    people.forEach((person, i) => {
      const sel = colors.find((_, j) => cells[`${i}-${j}`] === true);
      if (sel !== answerKey[person]) ok = false;
    });
    const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
    const token = sessionStorage.getItem('token');
    axios.post('/api/results', { gameId: 1, score: ok ? 1 : 0, timeSpent }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(console.error);
    setResult(ok);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Simple Logic Grid</h1>
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
      <ul className="list-disc list-inside mb-6 bg-white rounded-2xl shadow-lg border border-teal-100 px-8 py-6 text-lg font-semibold text-teal-800 max-w-md mx-auto">
        {clues.map((c, idx) => <li key={idx} className="mb-1">{c}</li>)}
      </ul>
      <div className="overflow-x-auto mb-6">
      <table className="table-auto border-separate border-spacing-0 mx-auto rounded-xl shadow-md bg-white">
        <thead>
          <tr>
            <th className="border-b-2 border-teal-300 p-2 bg-teal-50"></th>
            {colors.map(color => (
              <th key={color} className="border-b-2 border-teal-300 p-2 text-center bg-teal-50 text-teal-800 font-bold">{color}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person, i) => (
            <tr key={person}>
              <td className="border-r-2 border-teal-200 p-2 font-semibold bg-teal-50 text-teal-700">{person}</td>
              {colors.map((_, j) => {
                const state = cells[`${i}-${j}`];
                const mark = state === true ? '✔' : state === false ? '✖' : '';
                let bg = 'bg-gray-100';
                let border = 'border border-gray-200';
                if (state === true) { bg = 'bg-green-200'; border = 'border-2 border-green-400'; }
                else if (state === false) { bg = 'bg-red-100'; border = 'border-2 border-red-300'; }
                return (
                  <td
                    key={j}
                    className={`p-4 text-center cursor-pointer transition-colors duration-200 font-bold text-xl ${bg} ${border} rounded-lg hover:ring-2 hover:ring-teal-300`}
                    onClick={() => handleCellClick(i, j)}
                  >{mark}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button
        onClick={validate}
        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow mt-6"
      >
        Check
      </button>
      {result === true && (
        <p className="mt-6 text-green-700 font-bold text-xl">Correct!</p>
      )}
      {result === false && (
        <p className="mt-6 text-red-700 font-bold text-xl">Incorrect!</p>
      )}
    </div>
  );
}
