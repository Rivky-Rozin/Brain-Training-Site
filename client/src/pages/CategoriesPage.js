// client/src/pages/CategoriesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesPage.css';

const categoryImages = [
  require('../assets/styles/analytic.png'),
  require('../assets/styles/Concentration.png'),
  require('../assets/styles/speed.png'),
  require('../assets/styles/memory.png'),
  require('../assets/styles/cognetive.png'),
  require('../assets/styles/12.png'),
];

const categories = [
  {
    id: 1,
    title: 'Analytical Thinking',
    subtitle: 'Prefrontal Cortex',
    desc: 'Games that develop your ability to analyze information, draw conclusions, and solve complex problems. Sharpening analytical thinking helps with decision-making and tackling daily challenges.'
  },
  {
    id: 2,
    title: 'Concentration',
    subtitle: 'Anterior Cingulate Cortex',
    desc: 'Games that train your ability to focus on a single task for a long time, ignore distractions, and improve attention and concentration.'
  },
  {
    id: 3,
    title: 'Processing Speed',
    subtitle: 'White Matter Pathways',
    desc: 'Games that challenge your brain to react quickly, process new information, and make fast and accurate decisions.'
  },
  {
    id: 4,
    title: 'Memory',
    subtitle: 'Hippocampus',
    desc: 'Games that strengthen your short- and long-term memory, improving your ability to remember details, names, numbers, and lists.'
  },
  {
    id: 5,
    title: 'Creativity',
    subtitle: 'Default Mode Network',
    desc: 'Games that encourage out-of-the-box thinking, developing new ideas, and mental flexibility.'
  },
  {
    id: 6,
    title: 'Adaptive Thinking',
    subtitle: 'Dorsolateral PFC',
    desc: 'Games that train your ability to adapt to changes, learn new things, and solve problems in different ways.'
  },
];

export default function CategoriesPage() {
  return (
    <div className="categories-container">
      <div className="brain-intro">
        <h1 className="categories-title">Boost Your Brain with Games!</h1>
        <p className="brain-intro-text">
          Welcome to the brain training arena! Here you can challenge, develop, and improve your cognitive abilities through fun and engaging games. Each category focuses on a different brain skill – choose the area you want to strengthen and start playing!
        </p>
      </div>
      <div className="categories-list">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="category-card-new">
            <div className="category-card-img-wrap">
              <img src={categoryImages[idx % categoryImages.length]} alt="category icon" className="category-card-img-new" />
            </div>
            <div className="category-card-content">
              <h2 className="category-card-title-new">{cat.title}</h2>
              <div className="category-card-subtitle">{cat.subtitle}</div>
              <p className="category-card-desc-new">{cat.desc}</p>
              <Link to={`/games/${cat.id}`} className="category-card-btn">Play Now</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
