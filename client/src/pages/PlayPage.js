// src/pages/PlayPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// import the game components
import SimpleLogicGrid from './allgames/SimpleLogicGrid';      // id = 1
import LogicGrid from './allgames/LogicGrid';            // id = 2
import AdvancedLogicGrid from './allgames/AdvancedLogicGrid';    // id = 3
import FocusSquares from './allgames/FocusSquares';         // id = 4
import StroopTest from './allgames/StroopTest';           // id = 5
import DistractorChallenge from './allgames/DistractorChallenge';  // id = 6
import ReactionTap from './allgames/ReactionTap';          // id = 7
import NumberFlash from './allgames/NumberFlash';          // id = 8
import { ColorMatchSpeed } from './allgames/ColorMatchSpeed';      // id = 9
import CardPairs from './allgames/CardPairs';            // id = 10
import SequenceRecall from './allgames/SequenceRecall';       // id = 11
import WordListMemory from './allgames/WordListMemory';       // id = 12
import AlternateUses from './allgames/AlternateUses';        // id = 13
import StoryBuilder from './allgames/StoryBuilder';         // id = 14
import ShapeTransformation from './allgames/ShapeTransformation';  // id = 15
import RuleShift from './allgames/RuleShift';            // id = 16
import PatternAlternator from './allgames/PatternAlternator';  // id = 17
import DynamicMaze from './allgames/DynamicMaze';        // id = 18


export default function PlayPage() {
    const { id } = useParams();
    const gameId = Number(id);

    useEffect(() => {
        console.log('PlayPage mounted with gameId:', gameId);
    }, [gameId]);

    switch (gameId) {
        case 1:
            return <SimpleLogicGrid key={gameId} />;
        case 2:
            return <LogicGrid key={gameId} />;
        case 3:
            return <AdvancedLogicGrid key={gameId} />;
        case 4:
            return <FocusSquares key={gameId} />;
        case 5:
            return <StroopTest key={gameId} />;
        case 6:
            return <DistractorChallenge key={gameId} />;
        case 7:
            return <ReactionTap key={gameId} />;
        case 8:
            return <NumberFlash key={gameId} />;
        case 9:
            return <ColorMatchSpeed key={gameId} />;
        case 10:
            return <CardPairs key={gameId} />;
        case 11:
            return <SequenceRecall key={gameId} />;
        case 12:
            return <WordListMemory key={gameId} />;
        case 13:
            return <AlternateUses key={gameId} />;
        case 14:
            return <StoryBuilder key={gameId} />;
        case 15:
            return <ShapeTransformation key={gameId} />;
        case 16:
            return <RuleShift key={gameId} />;
        case 17:
            return <PatternAlternator key={gameId} />;
        case 18:
            return <DynamicMaze key={gameId} />;
        default:
            return (
                <div className="container mx-auto py-8">
                    <h2 className="text-xl font-bold">Unknown game ID: {gameId}</h2>
                    <p>Please check the URL or go back to the games list.</p>
                </div>
            );
    }
}