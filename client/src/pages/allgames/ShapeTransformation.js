// src/pages/allgames/ShapeTransformation.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ShapeTransformation() {
  const startRef = useRef(Date.now());
  const shapes = ['◆','■','▲','●'];
  const [canvas, setCanvas] = useState([]);
  const [selection, setSelection] = useState(shapes[0]);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = `Goal: Create a sequence of shapes by selecting and adding them to the canvas.\nHow to play:\n- Choose a shape from the dropdown.\n- Click 'Add Shape' to add it to your canvas.\n- Try to create a sequence of at least 4 shapes.\n- You can use this to practice visual memory or creativity!`;

  const addShape = () => {
    const updated = [...canvas, { id: Date.now(), shape: selection }];
    setCanvas(updated);
    const timeSpent = Math.floor((Date.now() - startRef.current)/1000);
    // ניצחון אם נוספו לפחות 4 צורות
    const score = updated.length >= 4 ? 1 : 0;
    axios.post('/api/results', { gameId: 15, score, timeSpent })
      .catch(err => alert(err.response?.data?.message || err.message || 'שגיאה בשליחת תוצאה'));
  };

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-teal-700 drop-shadow">Shape Transformation</h1>
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
      <div className="mb-4 flex items-center">
        <select value={selection} onChange={e=>setSelection(e.target.value)} className="border p-2 mr-4 rounded-lg shadow focus:ring-2 focus:ring-teal-400">
          {shapes.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={addShape} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-colors">Add Shape</button>
      </div>
      <div className="flex flex-wrap gap-2 bg-white p-4 rounded-2xl shadow-lg min-h-[64px] min-w-[200px] justify-center">
        {canvas.map(item=>(
          <div key={item.id} className="text-4xl transition-transform duration-200 hover:scale-110 cursor-pointer" title="Shape">{item.shape}</div>
        ))}
      </div>
    </div>
  );
}