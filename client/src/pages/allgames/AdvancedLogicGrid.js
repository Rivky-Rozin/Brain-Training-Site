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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#222' }}>
            Advanced Logic Grid
          </h1>
          <p style={{ color: '#5E9A92' }}>
            Expert level - Match each person with their pet, drink, and favorite color
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

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Pets Grid */}
          <div className="rounded-lg shadow p-6" style={{ 
            backgroundColor: 'white', 
            border: '1px solid #CDE1DB' 
          }}>
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: '#5E9A92' }}>
              Pets
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {pets.map(pt => (
                    <th 
                      key={pt} 
                      className="p-1 text-center font-medium border-b-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {pt}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map(p => (
                  <tr key={p}>
                    <td 
                      className="p-1 font-medium border-r-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {p}
                    </td>
                    {pets.map(pt => {
                      const key = `${p}-pet-${pt}`;
                      const st = cells[key];
                      const disp = st === true ? '✓' : st === false ? '✗' : '';
                      let cellStyle = {
                        backgroundColor: '#E3F2F1',
                        borderColor: '#CDE1DB',
                        color: '#5E9A92'
                      };
                      
                      if (st === true) {
                        cellStyle = {
                          backgroundColor: '#7CC3B6',
                          borderColor: '#5E9A92',
                          color: 'white'
                        };
                      } else if (st === false) {
                        cellStyle = {
                          backgroundColor: '#EB5757',
                          borderColor: '#EB5757',
                          color: 'white'
                        };
                      }
                      
                      return (
                        <td key={pt} className="p-1 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className="w-8 h-8 border rounded cursor-pointer transition-all font-bold text-sm flex items-center justify-center hover:opacity-80"
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

          {/* Drinks Grid */}
          <div className="rounded-lg shadow p-6" style={{ 
            backgroundColor: 'white', 
            border: '1px solid #CDE1DB' 
          }}>
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: '#5E9A92' }}>
              Drinks
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {drinks.map(d => (
                    <th 
                      key={d} 
                      className="p-1 text-center font-medium border-b-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map(p => (
                  <tr key={p}>
                    <td 
                      className="p-1 font-medium border-r-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {p}
                    </td>
                    {drinks.map(d => {
                      const key = `${p}-drink-${d}`;
                      const st = cells[key];
                      const disp = st === true ? '✓' : st === false ? '✗' : '';
                      let cellStyle = {
                        backgroundColor: '#E3F2F1',
                        borderColor: '#CDE1DB',
                        color: '#5E9A92'
                      };
                      
                      if (st === true) {
                        cellStyle = {
                          backgroundColor: '#7CC3B6',
                          borderColor: '#5E9A92',
                          color: 'white'
                        };
                      } else if (st === false) {
                        cellStyle = {
                          backgroundColor: '#EB5757',
                          borderColor: '#EB5757',
                          color: 'white'
                        };
                      }
                      
                      return (
                        <td key={d} className="p-1 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className="w-8 h-8 border rounded cursor-pointer transition-all font-bold text-sm flex items-center justify-center hover:opacity-80"
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

          {/* Colors Grid */}
          <div className="rounded-lg shadow p-6" style={{ 
            backgroundColor: 'white', 
            border: '1px solid #CDE1DB' 
          }}>
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: '#5E9A92' }}>
              Colors
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {colors.map(c => (
                    <th 
                      key={c} 
                      className="p-1 text-center font-medium border-b-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map(p => (
                  <tr key={p}>
                    <td 
                      className="p-1 font-medium border-r-2 text-xs" 
                      style={{ 
                        color: '#5E9A92',
                        borderColor: '#CDE1DB' 
                      }}
                    >
                      {p}
                    </td>
                    {colors.map(c => {
                      const key = `${p}-color-${c}`;
                      const st = cells[key];
                      const disp = st === true ? '✓' : st === false ? '✗' : '';
                      let cellStyle = {
                        backgroundColor: '#E3F2F1',
                        borderColor: '#CDE1DB',
                        color: '#5E9A92'
                      };
                      
                      if (st === true) {
                        cellStyle = {
                          backgroundColor: '#7CC3B6',
                          borderColor: '#5E9A92',
                          color: 'white'
                        };
                      } else if (st === false) {
                        cellStyle = {
                          backgroundColor: '#EB5757',
                          borderColor: '#EB5757',
                          color: 'white'
                        };
                      }
                      
                      return (
                        <td key={c} className="p-1 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className="w-8 h-8 border rounded cursor-pointer transition-all font-bold text-sm flex items-center justify-center hover:opacity-80"
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
            onClick={check} 
            className="px-6 py-2 rounded-lg font-medium transition-all text-white hover:opacity-90"
            style={{ backgroundColor: '#7CC3B6' }}
          >
            Check Solution
          </button>
          <button 
            onClick={reset} 
            className="px-6 py-2 rounded-lg font-medium transition-all text-white hover:opacity-90"
            style={{ backgroundColor: '#5E9A92' }}
          >
            Reset
          </button>
        </div>

        {/* Result Message */}
        {message && (
          <div 
            className="text-center p-4 rounded-lg font-medium border"
            style={{
              backgroundColor: message.includes('Correct') ? '#7CC3B6' : '#EB5757',
              color: 'white',
              borderColor: message.includes('Correct') ? '#5E9A92' : '#EB5757'
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
