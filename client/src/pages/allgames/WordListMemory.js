// src/pages/allgames/WordListMemory.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const words = ['apple','book','car','door','elephant','flower','guitar','house'];
export function WordListMemory() {
  const startRef = useRef(Date.now());
  const [list, setList] = useState([]);
  const [phase, setPhase] = useState('show');
  const [inputList, setInputList] = useState('');
  const [correct, setCorrect] = useState(0);

  useEffect(()=>{ start(); }, []);

  const start = () => {
    startRef.current = Date.now();
    const list=words.sort(()=>0.5-Math.random()).slice(0,5);
    setList(list);
    setPhase('show');
    setInputList('');
  };
  useEffect(()=>{
    if(phase==='show'){
      const t=setTimeout(()=>setPhase('input'),3000);
      return ()=>clearTimeout(t);
    }
  },[phase]);

  useEffect(() => {
    if (phase==='done') {
      const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
      // ניצחון אם נזכרו לפחות 3 מילים
      const score = correct >= 3 ? 1 : 0;
      axios.post('/api/results', { gameId: 12, score, timeSpent })
        .catch(console.error);
    }
  }, [phase]);

  const handleSubmit=e=>{
    e.preventDefault();
    const inputs=inputList.split(',').map(s=>s.trim().toLowerCase());
    const corr=list.filter(w=>inputs.includes(w)).length;
    setCorrect(corr);
    setPhase('done');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Word List Memory</h1>
      {phase==='show'&&(
        <ul className="mb-4 list-disc list-inside">
          {list.map((w,i)=><li key={i}>{w}</li>)}
        </ul>
      )}
      {phase==='input'&&(
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            value={inputList}
            onChange={e=>setInputList(e.target.value)}
            placeholder="Enter comma-separated words"
            className="border px-3 py-2 w-64"
          />
          <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Check</button>
        </form>
      )}
      {phase==='done'&&(
        <p className="text-xl">You recalled {correct} of {list.length}</p>
      )}
      <button onClick={start} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Restart</button>
    </div>
  );
}
