// src/pages/Game.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

export default function Game() {
  const { id } = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Playing Game #{id}</h1>
      {/* כאן תוכלי להניח את הלוגיקה של המשחק עצמו */}
      <p>Game component not yet implemented.</p>
    </div>
  );
}
