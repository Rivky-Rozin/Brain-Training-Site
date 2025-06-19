// src/pages/allgames/ShapeTransformation.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export function ShapeTransformation() {
  const startRef = useRef(Date.now());
  const shapes = ['◆','■','▲','●'];
  const [canvas, setCanvas] = useState([]);
  const [selection, setSelection] = useState(shapes[0]);

  const addShape = () => {
    const updated = [...canvas, { id: Date.now(), shape: selection }];
    setCanvas(updated);
    const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
    axios.post('/api/results', { gameId: 15, score: updated.length, timeSpent })
      .catch(console.error);
  };

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Shape Transformation</h1>
      <div className="mb-4 flex items-center">
        <select value={selection} onChange={e=>setSelection(e.target.value)} className="border p-2 mr-4">
          {shapes.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={addShape} className="bg-blue-500 text-white px-4 py-2 rounded">Add Shape</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {canvas.map(item=>(
          <div key={item.id} className="text-4xl">{item.shape}</div>
        ))}
      </div>
    </div>
  );
}