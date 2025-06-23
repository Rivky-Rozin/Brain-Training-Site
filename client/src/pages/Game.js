// src/pages/Game.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// הוראות באנגלית לכל משחק לפי id (או לפי שם אם יש)
const instructionsById = {
  1: `Goal: Solve a simple logic puzzle using clues.\nHow to play:\n- An empty table and a list of clues appear.\n- Drag or mark √ or ✗ in the appropriate cells according to logic.\n- The goal: place each item in the correct spot in the table.`,
  2: `Goal: Solve a medium-level logic grid puzzle.\nHow to play:\n- Like the previous game, but with more variables and complex clues.\n- Requires following indirect logical conclusions.`,
  3: `Goal: Solve a challenging logic grid puzzle.\nHow to play:\n- Complex table with 3+ categories and 5+ items in each.\n- Use clues and previous conclusions to complete the table.`,
  4: `Goal: Find squares that reappear after some time.\nHow to play:\n- Several squares are shown on the screen.\n- After a pause, they reappear – identify which stayed the same or changed.`,
  5: `Goal: Test reactivity and focus against cognitive conflict.\nHow to play:\n- A color name (e.g., "Blue") is shown in a non-matching color (e.g., red).\n- Click according to the color, not the text.`,
  6: `Goal: Identify the correct item among distractions.\nHow to play:\n- Many items appear, some confusing.\n- Choose the target (e.g., a unique letter or color).\n- More distractions and items as time goes on.`,
  7: `Goal: Test reaction speed.\nHow to play:\n- Click as soon as a sign (e.g., green circle) appears.\n- Clicking too early is a fail.\n- Goal: fast and accurate reaction.`,
  8: `Goal: Remember a sequence of numbers shown briefly.\nHow to play:\n- Numbers are shown quickly.\n- Then enter what you remember.\n- Difficulty increases with more digits and speed.`,
  9: `Goal: Quickly identify target symbols.\nHow to play:\n- Symbols appear rapidly.\n- Click the correct symbol from a changing sequence.`,
  10: `Goal: Find matching pairs.\nHow to play:\n- Click cards to reveal them.\n- Find matching pairs from memory.\n- Game ends when all pairs are found.`,
  11: `Goal: Remember a sequence of actions or sounds.\nHow to play:\n- A sequence of colors, notes, or buttons is shown.\n- Repeat the sequence exactly.\n- Each level adds a new element.`,
  12: `Goal: Remember words from a list.\nHow to play:\n- Words are shown quickly.\n- Then you are tested on which words appeared and which did not.`,
  13: `Goal: Think of creative uses for a simple object.\nHow to play:\n- You get an object name (e.g., brick).\n- Write as many creative uses as possible in a timed session.`,
  14: `Goal: Build a story using given words.\nHow to play:\n- You get 3–5 words.\n- Write a short story including all of them.\n- Assesses creativity and associative ability.`,
  15: `Goal: Track changes in shapes.\nHow to play:\n- A basic shape appears.\n- Then changes are shown (rotation, color, add/remove).\n- Identify the correct version at the end.`,
  16: `Goal: Follow changing rules.\nHow to play:\n- At first, there is a rule (e.g., click red).\n- Suddenly, the rule changes (e.g., click green).\n- Pay attention to the change and respond accordingly.`,
  17: `Goal: Identify changing patterns.\nHow to play:\n- Sequences (numbers/shapes/colors) with a certain pattern appear.\n- Complete the next element in the sequence.\n- Sometimes the pattern changes – adapt accordingly.`,
  18: `Goal: Escape a dynamic maze.\nHow to play:\n- Navigate the character/dot in a maze.\n- Walls/passages change in real time – requires focus and adaptation.`
};

export default function Game() {
  const { id } = useParams();
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = instructionsById[id] || 'No instructions available for this game.';
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Playing Game #{id}</h1>
      <button
        onClick={() => setShowInstructions(s => !s)}
        style={{ background: '#58A9A5', color: 'white', borderRadius: '20px', fontSize: '1rem', padding: '7px 20px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>
      {showInstructions && (
        <div style={{ background: '#e6f7f7', color: '#222', borderRadius: '12px', padding: '12px', marginBottom: '18px', fontSize: '1.05rem', boxShadow: '0 1px 4px #b2d8d8', whiteSpace: 'pre-line' }}>
          {instructions}
        </div>
      )}
      {/* כאן תוכלי להניח את הלוגיקה של המשחק עצמו */}
      <p>Game component not yet implemented.</p>
    </div>
  );
}
