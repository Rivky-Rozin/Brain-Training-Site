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
      <h1 className="text-3xl font-bold mb-4">Simple Logic Grid</h1>
      <ul className="list-disc list-inside mb-4">
        {clues.map((c, idx) => <li key={idx}>{c}</li>)}
      </ul>
      <table className="table-auto mx-auto mb-4 border-collapse">
        <thead>
          <tr>
            <th></th>
            {colors.map(color => (
              <th key={color} className="border p-2 text-center">{color}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((person, i) => (
            <tr key={person}>
              <td className="border p-2 font-semibold">{person}</td>
              {colors.map((_, j) => {
                const state = cells[`${i}-${j}`];
                const mark = state === true ? '✔' : state === false ? '✖' : '';
                return (
                  <td
                    key={j}
                    className="border p-4 text-center cursor-pointer"
                    onClick={() => handleCellClick(i, j)}
                  >{mark}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={validate}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Check
      </button>
      {result === true && (
        <p className="mt-4 text-green-700 font-semibold">Correct!</p>
      )}
      {result === false && (
        <p className="mt-4 text-red-700 font-semibold">Incorrect!</p>
      )}
    </div>
  );
}
