// src/pages/allgames/StoryBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const prompts = [
  'A lost cat in a big city',
  'A time-traveling detective',
  'An alien visiting Earth',
  'A hidden treasure map'
];
export default function StoryBuilder() {
  const startRef = useRef(Date.now());
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Build a creative story based on a prompt.\nHow to play:\n- Read the prompt at the top.\n- Write a short story inspired by the prompt (at least 30 words).\n- Submit your story to see your result.\n- Try another prompt to practice your creativity!`;

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random()*prompts.length)]);
    startRef.current = Date.now();
  }, [submitted]);

  const handleSubmit=e=>{
    e.preventDefault();
    setSubmitted(true);
    const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
    // ניצחון אם כתבו לפחות 30 תווים
    const score = text.length >= 30 ? 1 : 0;
    axios.post('/api/results', { gameId: 14, score, timeSpent })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Story Builder</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 2px 8px #b2d8d8' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line', transition: 'all 0.3s' }}>
          {instructions}
        </div>
      )}
      <p className="mb-4 text-lg">Prompt: <em className="text-teal-700 font-semibold">{prompt}</em></p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-3/4 max-w-xl">
          <textarea
            rows={6}
            value={text}
            onChange={e=>setText(e.target.value)}
            className="w-full border p-2 mb-4 rounded-lg shadow focus:ring-2 focus:ring-teal-400"
            placeholder="Write your story here..."
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-colors">Submit</button>
        </form>
      ) : (
        <div className="w-3/4 max-w-xl bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-teal-800">Your Story</h2>
          <p className="mb-2 whitespace-pre-line">{text}</p>
          <button onClick={()=>setSubmitted(false)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-colors">Try Another</button>
        </div>
      )}
    </div>
  );
}
