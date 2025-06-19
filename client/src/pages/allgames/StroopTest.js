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
  const startRef = useRef(null);

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
      axios.post('/api/results', {
        gameId: 6,
        score,
        timeSpent: Math.floor(totalTime / 1000)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
      // show final results
      setRound(roundsCount + 1);
    }
  };

  // render final results
  if (round > roundsCount) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Stroop Test Results</h1>
        <p className="mb-2">Score: {score}/{roundsCount}</p>
        <p className="mb-4">Average Reaction Time: {avg} ms</p>
        <button
          onClick={() => {
            setRound(1);
            setScore(0);
            setTimes([]);
            startRound();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    );
  }

  // render active round
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Stroop Test</h1>
      <div className={`text-6xl font-bold mb-6 ${colorClasses[fontColor]}`}>{word}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {colorsList.map(col => (
          <button
            key={col}
            onClick={() => handleChoice(col)}
            className="px-6 py-3 bg-white shadow rounded hover:bg-gray-200"
          >
            {col}
          </button>
        ))}
      </div>
      <p className="text-gray-700">Round {round} of {roundsCount}</p>
      <p className="text-gray-700">Score: {score}</p>
    </div>
  );
}
