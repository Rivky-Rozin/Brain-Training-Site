// src/pages/allgames/DistractorChallenge.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Distractor Challenge: click the 8 hidden targets in a 5×5 grid before time or a mistake ends the round
export default function DistractorChallenge() {
  const size = 5;               // grid size
  const targets = 8;            // number of hidden targets
  const timeLimit = 20;         // seconds
  const startRef = useRef(Date.now());

  const [grid, setGrid]     = useState([]);
  const [score, setScore]   = useState(0);
  const [timeLeft, setTime] = useState(timeLimit);
  const [over, setOver]     = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Identify the correct item among distractions.\nHow to play:\n- Many items appear, some confusing.\n- Choose the target (e.g., a unique letter or color).\n- More distractions and items as time goes on.`;

  // reset grid & state
  const reset = () => {
    // place 'targets' randomly in a distractor-filled array
    const cells = Array(size * size).fill('distractor');
    let placed = 0;
    while (placed < targets) {
      const idx = Math.floor(Math.random() * cells.length);
      if (cells[idx] === 'distractor') {
        cells[idx] = 'target';
        placed++;
      }
    }
    setGrid(cells);
    setScore(0);
    setTime(timeLimit);
    setOver(false);
    startRef.current = Date.now();
  };

  // initialize on mount
  useEffect(() => {
    reset();
  }, []);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || over) {
      // send result when time runs out or game over
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      const token = sessionStorage.getItem('token');
      // ניצחון אם כל היעדים נמצאו
      const winScore = score === targets ? 1 : 0;
      axios.post('/api/results', {
        gameId: 6,
        score: winScore,
        timeSpent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
      return;
    }
    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, over, score]);

  // handle cell click
  const handleClick = i => {
    if (over || timeLeft <= 0) return;
    if (grid[i] === 'target') {
      setScore(s => s + 1);
      setGrid(g => g.map((v, j) => j === i ? 'done' : v));

      if (score + 1 === targets) {
        setOver(true);
      }
    } else {
      setOver(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Distractor Challenge</h1>
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
      <p className="mb-6 text-lg font-semibold text-teal-800">Time: <span className="text-blue-600">{timeLeft}s</span> | Score: <span className="text-teal-600">{score}</span> / {targets}</p>
      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {grid.map((cell, idx) => {
          let bgClass = 'bg-gray-300';
          let border = 'border border-gray-200';
          if (cell === 'target' || cell === 'done') { bgClass = 'bg-green-400'; border = 'border-2 border-green-500'; }
          return (
            <div
              key={idx}
              onClick={() => handleClick(idx)}
              className={`h-16 w-16 cursor-pointer rounded-xl shadow-lg transition-all duration-150 ${bgClass} ${border} hover:ring-2 hover:ring-teal-400`}
            />
          );
        })}
      </div>
      {over && (
        <div className="mt-8 text-center">
          <p className={`font-bold text-xl mb-4 ${score === targets ? 'text-green-600' : 'text-red-600'}`}>{score === targets ? 'You won!' : 'Game Over'}</p>
          <button
            onClick={reset}
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
