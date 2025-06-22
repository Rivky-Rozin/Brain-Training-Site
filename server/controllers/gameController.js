// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { getAllGames, getGameById, getGamesByCategory } from '../services/gameService.js';

export const getGames = async (req, res) => {
    try {
        console.log('Controller: getGames called');
        const games = await getAllGames();
        console.log('Controller: games retrieved:', games);
        res.json({ 
            message: 'Games retrieved successfully',
            games: games
        });
    } catch (err) {
        console.error('Controller: Error in getGames:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message 
        });
    }
};

export const getGame = async (req, res) => {
    try {
        const game = await getGameById(req.params.id);
        res.json({ 
            message: 'Game retrieved successfully',
            game: game
        });
    } catch (err) {
        console.error('Controller: Error in getGame:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message 
        });
    }
};

export const getGamesByCategoryController = async (req, res) => {
    try {
        const games = await getGamesByCategory(req.params.category);
        res.json({ 
            message: 'Games retrieved successfully',
            games: games
        });
    } catch (err) {
        console.error('Controller: Error in getGamesByCategory:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message 
        });
    }
};
