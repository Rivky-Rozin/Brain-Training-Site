// src/pages/allgames/SequenceRecall.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';

// Sequence Recall: watch a sequence of lights then repeat it
export function SequenceRecall() {
  const startRef = useRef(Date.now());
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('init'); // 'init' | 'show' | 'input' | 'done'
  const [message, setMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [length, setLength] = useState(1);
  const instructions = `Goal: Remember a sequence of actions or sounds.\nHow to play:\n- A sequence of colors, notes, or buttons is shown.\n- Repeat the sequence exactly.\n- Each level adds a new element.\n- Try to reach the highest level you can!`;

  const start = () => {
    startRef.current = Date.now();
    const seq = Array.from({length}, ()=>Math.floor(Math.random()*4));
    setSequence(seq);
    setPlayerSeq([]);
    setStep(0);
    setPhase('show');
    setMessage('');
  };

  useEffect(() => {
    if (phase==='show' && step < sequence.length) {
      const t = setTimeout(() => setStep(s => s + 1), 800);
      return () => clearTimeout(t);
    }
    if (phase==='show' && step >= sequence.length) {
      setTimeout(() => setPhase('input'), 400);
    }
  }, [phase, step, sequence]);

  useEffect(() => {
    if (phase==='done') {
      const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
      const score = message === '✅ Correct!' ? 1 : 0;
      const token = sessionStorage.getItem('token');
      axios.post('/api/results', { gameId: 11, score, timeSpent }, { headers: { Authorization: `Bearer ${token}` } })
        .catch(err => alert(err.response?.data?.message || err.message || 'שגיאה בשליחת תוצאה'));
    }
  }, [phase]);

  const handleInput = idx => {
    if (phase!=='input') return;
    const newSeq=[...playerSeq,idx];
    setPlayerSeq(newSeq);
    if (newSeq.length===sequence.length) {
      const ok=newSeq.every((v,i)=>v===sequence[i]);
      setMessage(ok?'✅ Correct!':'❌ Incorrect');
      setPhase('done');
      if (ok && length < 10) {
        setLength(l => l + 1);
        setTimeout(start, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Sequence Recall</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <FaInfoCircle style={{ marginRight: 6, fontSize: '1.2em' }} />
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line', transition: 'all 0.3s' }}>
          {instructions}
        </div>
      )}
      {phase === 'init' && (
        <button
          onClick={start}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg mt-8 font-semibold shadow transition-colors"
        >
          Start
        </button>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[0,1,2,3].map(i=>(
          <div key={i}
            className={`w-16 h-16 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold transition-colors duration-300 cursor-pointer ${phase==='show' && step>0 && sequence[step-1]===i ? 'bg-green-400' : 'bg-gray-400'}`}
            title="Watch the sequence and repeat by clicking the buttons below"
          >
            {String.fromCharCode(65+i)}
          </div>
        ))}
      </div>
      {phase==='input'&&(
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[0,1,2,3].map(i=>(
            <button key={i}
              onClick={()=>handleInput(i)}
              className="w-16 h-16 bg-white shadow rounded-xl text-2xl font-bold hover:bg-teal-100 transition-colors"
              title="Click in the correct order"
            >{String.fromCharCode(65+i)}</button>
          ))}
        </div>
      )}
      {phase==='done'&&(
        <div className="text-center">
          <p className={`text-xl font-semibold mb-4 ${message.includes('Correct') ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          <p className="text-lg mb-4">Level: {length}</p>
          <button onClick={()=>{setLength(1); setPhase('init')}}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-colors"
          >
            Restart from Level 1
          </button>
        </div>
      )}
    </div>
  );
}
