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
      <h1 className="text-3xl font-bold mb-4">Distractor Challenge</h1>
      <p className="mb-4">Time: {timeLeft}s | Score: {score}/{targets}</p>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {grid.map((cell, idx) => {
          const bgClass =
            cell === 'target' || cell === 'done'
              ? 'bg-green-400'
              : 'bg-gray-400';

          return (
            <div
              key={idx}
              onClick={() => handleClick(idx)}
              className={`${bgClass} h-12 w-12 cursor-pointer rounded`}
            />
          );
        })}
      </div>

      {over && (
        <button
          onClick={reset}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Restart
        </button>
      )}
    </div>
  );
}
