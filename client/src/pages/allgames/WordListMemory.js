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
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Remember words from a list.\nHow to play:\n- Words are shown quickly.\n- Then you are tested on which words appeared and which did not.`;

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
      // ניצור אם נזכרו לפחות 3 מילים
      const score = correct >= 3 ? 1 : 0;
      const token = sessionStorage.getItem('token');
      axios.post('/api/results', { gameId: 12, score, timeSpent }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
        .catch(err => alert(err.response?.data?.message || err.message || 'שגיאה בשליחת תוצאה'));
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
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Word List Memory</h1>
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
      {phase==='show'&&(
        <ul className="mb-8 list-disc list-inside bg-white rounded-2xl shadow-lg border border-teal-100 px-8 py-6 text-lg font-semibold text-teal-800 max-w-md">
          {list.map((w,i)=><li key={i} className="mb-1">{w}</li>)}
        </ul>
      )}
      {phase==='input'&&(
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col items-center">
          <input
            value={inputList}
            onChange={e=>setInputList(e.target.value)}
            placeholder="Enter comma-separated words"
            className="border-2 border-teal-300 rounded-lg px-6 py-3 w-72 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow">Check</button>
        </form>
      )}
      {phase==='done'&&(
        <p className="text-2xl font-bold text-teal-700 mb-4">You recalled {correct} of {list.length}</p>
      )}
      <button onClick={start} className="mt-4 bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow">Restart</button>
    </div>
  );
}
