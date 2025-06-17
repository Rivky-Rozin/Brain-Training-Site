// client/src/pages/LogicGrid.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// דוגמאות פריטים לפאזל לוגיק גריד
const people = ['Alice', 'Bob', 'Carol', 'Dave'];
const pets   = ['Dog', 'Cat', 'Bird', 'Fish'];

// רמזים למשתמש
const clues = [
  'Alice does not own the Cat.',
  'Bob does not own the Fish.',
  'Carol owns the Bird.',
  'Dave does not own the Dog.'
];

// מפתח תשובות לבדיקת נכונות
const answerKey = {
  Alice: 'Dog',
  Bob:   'Cat',
  Carol: 'Bird',
  Dave:  'Fish'
};

// מצבים אפשריים לכל תא: null = לא ידוע, true = ✓, false = ✖
const STATES = [null, true, false];

export default function LogicGrid() {
  // סטייט של התאים
  const [cells, setCells] = useState(() => {
    const init = {};
    people.forEach((_, i) =>
      pets.forEach((_, j) => (init[`${i}-${j}`] = null))
    );
    return init;
  });
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);
  const timerRef = useRef();
  const [timeSpent, setTimeSpent] = useState(0);

  // מפעיל טיימר ברגע הטעינה
  useEffect(() => {
    timerRef.current = Date.now();
  }, []);

  // לולאת מצב על לחיצה
  const handleCellClick = (i, j) => {
    const key = `${i}-${j}`;
    const current = cells[key];
    const next = STATES[(STATES.indexOf(current) + 1) % STATES.length];
    setCells(prev => ({ ...prev, [key]: next }));
    setResult(null);
  };

  // איפוס הפאזל
  const resetGrid = () => {
    const cleared = {};
    Object.keys(cells).forEach(k => (cleared[k] = null));
    setCells(cleared);
    setAttempts(0);
    setResult(null);
    timerRef.current = Date.now();
  };

  // בדיקת תשובות ושליחה ל־API
  const validateGrid = async () => {
    let ok = true;
    for (let i = 0; i < people.length; i++) {
      const person = people[i];
      const matchIdx = pets.findIndex((_, j) => cells[`${i}-${j}`] === true);
      if (matchIdx === -1 || pets[matchIdx] !== answerKey[person]) {
        ok = false;
        break;
      }
    }
    if (!ok) {
      setAttempts(a => a + 1);
      setResult(false);
      return;
    }
    setResult(true);
    const timeSec = Math.floor((Date.now() - timerRef.current) / 1000);
    setTimeSpent(timeSec);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/progress',
        { gameId: 1, difficulty: 1, timeSpent: timeSec, attempts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Progress save error', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Logic Grid: Match People to Pets
        </h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Clues:</h2>
          <ul className="list-disc list-inside text-gray-700">
            {clues.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        <div className="overflow-auto">
          <table className="table-auto border-collapse mx-auto">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-200"></th>
                {pets.map(p => (
                  <th key={p} className="border p-2 bg-gray-200 text-center">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((person, i) => (
                <tr key={person}>
                  <td className="border p-2 bg-gray-200 font-semibold">
                    {person}
                  </td>
                  {pets.map((_, j) => {
                    const state = cells[`${i}-${j}`];
                    let bg = 'bg-white', content = '';
                    if (state === true)  { bg = 'bg-green-200'; content = '✔'; }
                    if (state === false) { bg = 'bg-red-200';   content = '✖'; }
                    return (
                      <td
                        key={`${i}-${j}`}
                        className={`${bg} border p-4 text-center cursor-pointer hover:bg-gray-100`}
                        onClick={() => handleCellClick(i, j)}
                      >
                        <span className="text-xl">{content}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={resetGrid}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Reset
          </button>
          <button
            onClick={validateGrid}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Check Answer
          </button>
        </div>

        {result === true && (
          <p className="text-center text-green-700 font-semibold mt-4">
            All correct! Time: {timeSpent}s, Attempts: {attempts}
          </p>
        )}
        {result === false && (
          <p className="text-center text-red-700 font-semibold mt-4">
            Some answers are incorrect. Try again!
          </p>
        )}
      </div>
    </div>
  );
}
