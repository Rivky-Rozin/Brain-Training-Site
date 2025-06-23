// src/pages/allgames/StroopTest.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Stroop Test: name the font color of conflicting color words over multiple rounds
const colorsList = ['Red', 'Green', 'Blue', 'Yellow'];
const roundsCount = 10;  // number of rounds per session
const colorClasses = {
  Red: 'text-red-500',
  Green: 'text-green-500',
  Blue: 'text-blue-500',
  Yellow: 'text-yellow-500'
};

export default function StroopTest() {
  const [round, setRound] = useState(1);
  const [word, setWord] = useState('');
  const [fontColor, setFontColor] = useState('');
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const startRef = useRef(null);

  const instructions = `Goal: Test reactivity and focus against cognitive conflict.\nHow to play:\n- A color name (e.g., "Blue") is shown in a non-matching color (e.g., red).\n- Click according to the color, not the text.`;

  // initialize first round
  useEffect(() => {
    startRound();
  }, []);

  // setup a new round
  const startRound = () => {
    const w = colorsList[Math.floor(Math.random() * colorsList.length)];
    let c = colorsList[Math.floor(Math.random() * colorsList.length)];
    while (c === w) {
      c = colorsList[Math.floor(Math.random() * colorsList.length)];
    }
    setWord(w);
    setFontColor(c);
    startRef.current = Date.now();
  };

  // handle a user's choice
  const handleChoice = choice => {
    const reaction = Date.now() - startRef.current;
    setTimes(prev => [...prev, reaction]);
    if (choice === fontColor) {
      setScore(s => s + 1);
    }

    if (round < roundsCount) {
      setRound(r => r + 1);
      startRound();
    } else {
      // session finished
      const totalTime = times.reduce((a, b) => a + b, 0) + reaction;
      const token = sessionStorage.getItem('token');
      // ניצחון אם ענו נכון לפחות 7
      const winScore = score >= 7 ? 1 : 0;
      axios.post('/api/results', {
        gameId: 6,
        score: winScore,
        timeSpent: Math.floor(totalTime / 1000)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  };

  // render final results
  if (round > roundsCount) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Stroop Test Results</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 px-8 py-8 mb-6 max-w-md w-full text-center">
          <p className="mb-2 text-lg font-semibold text-teal-800">Score: <span className="text-teal-600">{score}/{roundsCount}</span></p>
          <p className="mb-4 text-lg font-semibold text-teal-800">Average Reaction Time: <span className="text-blue-600">{avg} ms</span></p>
          <button
            onClick={() => {
              setRound(1);
              setScore(0);
              setTimes([]);
              startRound();
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow mt-2"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  // render active round
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Stroop Test</h1>
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
      <div className={`text-6xl font-extrabold mb-8 px-12 py-8 bg-white rounded-2xl shadow-lg border border-teal-100 text-center ${colorClasses[fontColor]}`}>{word}</div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {colorsList.map(col => (
          <button
            key={col}
            onClick={() => handleChoice(col)}
            className="px-8 py-4 bg-white rounded-full shadow-lg border-2 border-teal-200 text-xl font-bold hover:bg-teal-50 hover:border-teal-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {col}
          </button>
        ))}
      </div>
      <div className="flex flex-row gap-8 mb-2">
        <span className="text-gray-700 font-semibold">Round <span className="text-teal-700">{round}</span> of {roundsCount}</span>
        <span className="text-gray-700 font-semibold">Score: <span className="text-teal-700">{score}</span></span>
      </div>
    </div>
  );
}
