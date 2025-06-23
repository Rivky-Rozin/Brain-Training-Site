// src/pages/allgames/FocusSquares.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Focus Squares: click only green squares, ignore gray distractors
export default function FocusSquares() {
  const gridSize = 4;           // 4x4 grid
  const totalTargets = 6;       // number of green squares
  const timeLimit = 30;         // seconds
  const startRef = useRef(Date.now());

  const [grid, setGrid]       = useState([]);
  const [score, setScore]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Find squares that reappear after some time.\nHow to play:\n- Several squares are shown on the screen.\n- After a pause, they reappear – identify which stayed the same or changed.`;

  // Initialize grid
  const resetGame = () => {
    const cells = Array(gridSize * gridSize).fill('distractor');
    let count = 0;
    while (count < totalTargets) {
      const idx = Math.floor(Math.random() * cells.length);
      if (cells[idx] === 'distractor') {
        cells[idx] = 'target';
        count++;
      }
    }
    setGrid(cells);
    setScore(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    startRef.current = Date.now();
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Timer and result submission
  useEffect(() => {
    if (timeLeft <= 0 || gameOver) {
      const timeSpent = Math.floor((Date.now() - startRef.current) / 1000);
      const token = sessionStorage.getItem('token');
      // ניצחון אם כל היעדים נמצאו
      const winScore = score === totalTargets ? 1 : 0;
      axios.post('/api/results', {
        gameId: 5,
        score: winScore,
        timeSpent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, score]);

  // Handle cell click
  const handleClick = idx => {
    if (gameOver || timeLeft <= 0) return;
    if (grid[idx] === 'target') {
      setScore(s => s + 1);
      setGrid(g => g.map((c, i) => (i === idx ? 'done' : c)));
      if (score + 1 === totalTargets) {
        setGameOver(true);
      }
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 bg-gray-100">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Focus Squares</h1>
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
      <div className="mb-6 text-lg font-semibold text-teal-800">
        <span className="mr-8">Time: <span className="text-blue-600">{timeLeft}s</span></span>
        <span>Score: <span className="text-teal-600">{score}</span> / {totalTargets}</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {grid.map((cell, idx) => {
          let bg = 'bg-gray-300';
          let border = 'border border-gray-200';
          if (cell === 'target') { bg = 'bg-green-400'; border = 'border-2 border-green-500'; }
          else if (cell === 'done') { bg = 'bg-green-200'; border = 'border-2 border-green-300'; }
          return (
            <div
              key={idx}
              onClick={() => handleClick(idx)}
              className={`w-20 h-20 cursor-pointer rounded-xl shadow-lg transition-all duration-150 ${bg} ${border} hover:ring-2 hover:ring-teal-400`}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-8 text-center">
          {score === totalTargets
            ? <p className="text-green-600 font-bold text-xl mb-4">You won!</p>
            : <p className="text-red-600 font-bold text-xl mb-4">Game Over</p>}
          <button
            onClick={resetGame}
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
