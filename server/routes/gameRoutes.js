// server/routes/gameRoutes.js
import express from 'express';
import { getGames, getGame, getGamesByCategoryController, createGameController } from '../controllers/gameController.js';

const router = express.Router();

console.log('Setting up game routes...');

// GET /api/games - מחזיר את כל המשחקים
router.get('/', (req, res) => {
    console.log('Game route hit!');
    try {
        getGames(req, res);
    } catch (error) {
        console.error('Error in game route:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// GET /api/games/:id - מחזיר משחק ספציפי
router.get('/:id', (req, res) => {
    try {
        getGame(req, res);
    } catch (error) {
        console.error('Error in game route:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// GET /api/games/category/:category - מחזיר משחקים לפי קטגוריה
router.get('/category/:category', (req, res) => {
    try {
        getGamesByCategoryController(req, res);
    } catch (error) {
        console.error('Error in game route:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// POST /api/games - יוצר משחק חדש
router.post('/', (req, res) => {
    try {
        createGameController(req, res);
    } catch (error) {
        console.error('Error in game route:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

console.log('Game routes set up!');

export default router;
