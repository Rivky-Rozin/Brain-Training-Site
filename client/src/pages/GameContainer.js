// client/src/pages/GameContainer.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LogicGrid from './allgames/LogicGrid';

// מיפוי מזהה תחום ברשת למרכיב המשחק המתאים
const domainGameMap = {
  '1': LogicGrid,      // חשיבה אנליטית
  // בעתיד:  
  // '2': ConcentrationGame,
  // '3': ProcessingSpeedGame,
  // '4': MemoryGame,
  // '5': CreativityGame,
  // '6': AdaptiveThinkingGame,
};

export default function GameContainer() {
  const { domainId } = useParams();
  const GameComponent = domainGameMap[domainId];

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <Link to="/games" className="text-blue-600 underline mb-4 inline-block">
          ← Back to Brain Training
        </Link>

        {GameComponent ? (
          <GameComponent />
        ) : (
          <div className="text-center text-gray-700 py-20">
            No game available for this brain domain yet.
          </div>
        )}
      </div>
    </div>
  );
}
