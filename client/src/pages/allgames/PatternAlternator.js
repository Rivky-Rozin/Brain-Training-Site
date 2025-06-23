// src/pages/allgames/PatternAlternator.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const patterns = [
  ['★','☆','★','☆'],
  ['▲','▼','▲','▼'],
  ['■','□','■','□']
];
export default function PatternAlternator() {
  const startRef = useRef(Date.now());
  const [pattern, setPattern] = useState([]);
  const [shown, setShown] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Predict the next symbol in the pattern.\nHow to play:\n- You will see a sequence of shapes that follows a simple repeating pattern (for example: ★, ☆, ★, ...).\n- Your task: Choose the next shape that should come next in the sequence.\n- Select the correct symbol from the options below.\n- Press 'Next Round' to try a new sequence.`;

  useEffect(() => { startRef.current=Date.now(); nextRound(); }, []);

  function nextRound() {
    const pat = patterns[Math.floor(Math.random()*patterns.length)];
    // Show 3 symbols, ask for the 4th
    const shownSeq = pat.slice(0, 3);
    setPattern(pat);
    setShown(shownSeq);
    // The correct answer is pat[3]
    setAnswer(pat[3]);
    // Options: shuffle correct + 2 randoms
    const allSymbols = Array.from(new Set(patterns.flat()));
    let opts = [pat[3]];
    while (opts.length < 3) {
      const sym = allSymbols[Math.floor(Math.random()*allSymbols.length)];
      if (!opts.includes(sym)) opts.push(sym);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setMessage('');
  }

  function handleOptionClick(sym) {
    const timeSpent=Math.floor((Date.now()-startRef.current)/1000);
    const token=sessionStorage.getItem('token');
    if(sym===answer){
      setMessage('✅ Correct!');
      axios.post('/api/results',{gameId:17,score:1,timeSpent},{headers:{Authorization:`Bearer ${token}`}}).catch(console.error);
    } else {
      setMessage('❌ Wrong, try again.');
      axios.post('/api/results',{gameId:17,score:0,timeSpent},{headers:{Authorization:`Bearer ${token}`}}).catch(console.error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Pattern Alternator</h1>
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
      <div className="flex space-x-4 mb-8 text-5xl bg-white rounded-2xl shadow-lg border border-teal-100 px-8 py-6 items-center">
        {shown.map((symbol,i)=>(<span key={i} className="mx-2">{symbol}</span>))}
        <span className="text-gray-400 mx-2">?</span>
      </div>
      <div className="flex space-x-6 mb-6">
        {options.map((sym,i)=>(
          <button key={i} onClick={()=>handleOptionClick(sym)}
            className="text-5xl p-6 bg-white rounded-full shadow-lg border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400"
            style={{minWidth:'80px',minHeight:'80px'}}>{sym}</button>
        ))}
      </div>
      {message&&<p className={`text-xl font-bold mb-6 ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <button onClick={nextRound} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow">Next Round</button>
    </div>
  );
}