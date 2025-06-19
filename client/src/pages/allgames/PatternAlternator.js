// src/pages/allgames/PatternAlternator.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const patterns = [ ['★','☆','★','☆'], ['▲','▼','▲','▼'], ['■','□','■','□'] ];
export default function PatternAlternator() {
  const startRef = useRef(Date.now());
  const [sequence, setSequence] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { startRef.current=Date.now(); nextRound(); }, []);

  function nextRound() {
    const pat = patterns[Math.floor(Math.random()*patterns.length)];
    const ex = Math.floor(Math.random()*pat.length);
    setSequence(pat.map((s,i)=>(i===ex?(s===pat[0]?pat[1]:pat[0]):s)));
    setHighlight(ex);
    setMessage('');
  }

  function handleClick(i) {
    const timeSpent=Math.floor((Date.now()-startRef.current)/1000);
    const token=sessionStorage.getItem('token');
    if(i===highlight){
      setMessage('✅ Correct!');
      axios.post('/api/results',{gameId:17,score:1,timeSpent},{headers:{Authorization:`Bearer ${token}`}}).catch(console.error);
    } else {
      setMessage('❌ Wrong, try again.');
      axios.post('/api/results',{gameId:17,score:0,timeSpent},{headers:{Authorization:`Bearer ${token}`}}).catch(console.error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Pattern Alternator</h1>
      <div className="flex space-x-4 mb-4">{sequence.map((symbol,i)=>(
        <button key={i} onClick={()=>handleClick(i)} className="text-5xl p-4 bg-white rounded shadow">{symbol}</button>
      ))}</div>
      {message&&<p className="text-xl font-semibold mb-4">{message}</p>}
      <button onClick={nextRound} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Next Round</button>
    </div>
  );
}