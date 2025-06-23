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
    }).catch(err => alert(err.response?.data?.message || err.message || 'שגיאה בשליחת תוצאה'));
    setResult(ok);
  };
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#222' }}>
            Simple Logic Grid
          </h1>
          <p style={{ color: '#5E9A92' }}>
            Basic level - Match each person with their favorite color
          </p>
        </div>

        {/* Clues */}
        <div className="rounded-lg shadow p-6 mb-8" style={{ 
          backgroundColor: 'white', 
          border: '1px solid #CDE1DB' 
        }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#5E9A92' }}>
            Clues
          </h2>
          <ul className="space-y-2">
            {clues.map((c, i) => (
              <li key={i} className="flex items-start">
                <span 
                  className="rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 text-white"
                  style={{ backgroundColor: '#7CC3B6' }}
                >
                  {i + 1}
                </span>
                <span style={{ color: '#222' }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grid */}
        <div className="flex justify-center mb-8">
          <div className="rounded-lg shadow p-6" style={{ 
            backgroundColor: 'white', 
            border: '1px solid #CDE1DB' 
          }}>
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: '#5E9A92' }}>
              Color Preferences
            </h3>
            <table className="mx-auto">
              <thead>
                <tr>
                  <th className="p-3"></th>
                  {colors.map(color => (
                    <th 
                      key={color} 
                      className="p-3 text-center font-medium border-b-2" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {color}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map((person, i) => (
                  <tr key={person}>
                    <td 
                      className="p-3 font-medium border-r-2" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {person}
                    </td>
                    {colors.map((_, j) => {
                      const key = `${i}-${j}`;
                      const state = cells[key];
                      const disp = state === true ? '✓' : state === false ? '✗' : '';
                      let cellStyle = {
                        backgroundColor: '#E3F2F1',
                        borderColor: '#CDE1DB',
                        color: '#5E9A92'
                      };
                      
                      if (state === true) {
                        cellStyle = {
                          backgroundColor: '#7CC3B6',
                          borderColor: '#5E9A92',
                          color: 'white'
                        };
                      } else if (state === false) {
                        cellStyle = {
                          backgroundColor: '#EB5757',
                          borderColor: '#EB5757',
                          color: 'white'
                        };
                      }
                      
                      return (
                        <td key={j} className="p-3 text-center">
                          <button
                            onClick={() => handleCellClick(i, j)}
                            className="w-16 h-16 border-2 rounded cursor-pointer transition-all font-bold text-xl flex items-center justify-center hover:opacity-80"
                            style={cellStyle}
                          >
                            {disp}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={validate} 
            className="px-6 py-2 rounded-lg font-medium transition-all text-white hover:opacity-90"
            style={{ backgroundColor: '#7CC3B6' }}
          >
            Check Solution
          </button>
          <button 
            onClick={() => {
              const init = {};
              people.forEach((_, i) =>
                colors.forEach((_, j) => init[`${i}-${j}`] = null)
              );
              setCells(init);
              setResult(null);
              startRef.current = Date.now();
            }}
            className="px-6 py-2 rounded-lg font-medium transition-all text-white hover:opacity-90"
            style={{ backgroundColor: '#5E9A92' }}
          >
            Reset
          </button>
        </div>

        {/* Result Message */}
        {result !== null && (
          <div 
            className="text-center p-4 rounded-lg font-medium border"
            style={{
              backgroundColor: result ? '#7CC3B6' : '#EB5757',
              color: 'white',
              borderColor: result ? '#5E9A92' : '#EB5757'
            }}
          >
            {result ? '✅ Correct! Well done!' : '❌ Try again!'}
          </div>
        )}
      </div>
    </div>
  );
}
