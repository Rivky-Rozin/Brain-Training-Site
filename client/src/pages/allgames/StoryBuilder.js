// src/pages/allgames/StoryBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const prompts = [
  'A lost cat in a big city',
  'A time-traveling detective',
  'An alien visiting Earth',
  'A hidden treasure map'
];
export function StoryBuilder() {
  const startRef = useRef(Date.now());
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random()*prompts.length)]);
    startRef.current = Date.now();
  }, [submitted]);

  const handleSubmit=e=>{
    e.preventDefault();
    setSubmitted(true);
    const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
    axios.post('/api/results', { gameId: 14, score: text.length, timeSpent })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Story Builder</h1>
      <p className="mb-4">Prompt: <em>{prompt}</em></p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-3/4 max-w-xl">
          <textarea
            rows={6}
            value={text}
            onChange={e=>setText(e.target.value)}
            className="w-full border p-2 mb-4"
            placeholder="Write your story here..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
      ) : (
        <div className="w-3/4 max-w-xl bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Your Story</h2>
          <p>{text}</p>
          <button onClick={()=>setSubmitted(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Try Another</button>
        </div>
      )}
    </div>
);
}
