// src/pages/allgames/LogicGridMedium.js
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
    axios.post('/api/results', {
      gameId: 2,
      score: correct ? 1 : 0,
      timeSpent
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(console.error);
  };

  // Reset grid and timer
  const reset = () => {
    setCells({ ...init });
    setMessage(null);
    startRef.current = Date.now();
  };  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#222' }}>
            Logic Grid
          </h1>
          <p style={{ color: '#5E9A92' }}>
            Match each person with their pet and drink using the clues
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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                      className="p-2 text-center font-medium border-b-2" 
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
                      className="p-2 font-medium border-r-2" 
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
                        <td key={key} className="p-2 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className="w-12 h-12 border-2 rounded cursor-pointer transition-all font-bold text-lg flex items-center justify-center hover:opacity-80"
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
                      className="p-2 text-center font-medium border-b-2" 
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
                      className="p-2 font-medium border-r-2" 
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
                        <td key={key} className="p-2 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className="w-12 h-12 border-2 rounded cursor-pointer transition-all font-bold text-lg flex items-center justify-center hover:opacity-80"
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
