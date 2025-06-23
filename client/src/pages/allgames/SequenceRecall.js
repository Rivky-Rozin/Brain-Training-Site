// src/pages/allgames/SequenceRecall.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
  const instructions = `Goal: Remember a sequence of actions or sounds.\nHow to play:\n- A sequence of colors, notes, or buttons is shown.\n- Repeat the sequence exactly.\n- Each level adds a new element.`;

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
        .catch(console.error);
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
      <h1 className="text-3xl font-bold mb-4">Sequence Recall</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line' }}>
          {instructions}
        </div>
      )}
      {phase === 'init' && (
        <button
          onClick={start}
          className="bg-blue-500 text-white px-6 py-3 rounded text-lg mt-8"
        >
          Start
        </button>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[0,1,2,3].map(i=>(
          <div key={i}
            className={`w-16 h-16 rounded ${phase==='show' && step>0 && sequence[step-1]===i ? 'bg-green-400' : 'bg-gray-400'}`}
          />
        ))}
      </div>
      {phase==='input'&&(
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[0,1,2,3].map(i=>(
            <button key={i}
              onClick={()=>handleInput(i)}
              className="w-16 h-16 bg-white shadow rounded"
            >{i+1}</button>
          ))}
        </div>
      )}
      {phase==='done'&&(
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">{message}</p>
          <p className="text-lg mb-4">Level: {length}</p>
          <button onClick={()=>{setLength(1); setPhase('init')}}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Restart from Level 1
          </button>
        </div>
      )}
    </div>
  );
}
