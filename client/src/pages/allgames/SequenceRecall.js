// src/pages/allgames/SequenceRecall.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Sequence Recall: watch a sequence of lights then repeat it
export function SequenceRecall() {
  const startRef = useRef(Date.now());
  const length = 4;
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('show');
  const [message, setMessage] = useState('');

  useEffect(() => { start(); }, []);

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
    if (phase==='show'&&step<sequence.length) {
      const t=setTimeout(()=>setStep(s=>s+1), 800);
      return ()=>clearTimeout(t);
    }
    if (step>=sequence.length) setPhase('input');
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Sequence Recall</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[0,1,2,3].map(i=>(
          <div key={i}
            className={`w-16 h-16 rounded ${phase==='show'&&step>i?'bg-green-400':'bg-gray-400'}`}
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
      {phase==='done'&&<p className="text-xl font-semibold mb-4">{message}</p>}
      <button onClick={start} className="bg-blue-500 text-white px-4 py-2 rounded">Restart</button>
    </div>
  );
}
