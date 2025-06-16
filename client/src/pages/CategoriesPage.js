// client/src/pages/CategoriesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, title: 'Analytical Thinking', subtitle: 'Prefrontal Cortex',      icon: '🧠' },
  { id: 2, title: 'Concentration',        subtitle: 'Anterior Cingulate Cortex', icon: '🎯' },
  { id: 3, title: 'Processing Speed',     subtitle: 'White Matter Pathways',       icon: '⚡' },
  { id: 4, title: 'Memory',               subtitle: 'Hippocampus',                 icon: '🧩' },
  { id: 5, title: 'Creativity',           subtitle: 'Default Mode Network',        icon: '✨' },
  { id: 6, title: 'Adaptive Thinking',    subtitle: 'Dorsolateral PFC',            icon: '🔄' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Start Training
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(cat => (
            <Link key={cat.id} to={`/games/${cat.id}`}>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {cat.title}
                </h2>
                <p className="text-gray-600">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
