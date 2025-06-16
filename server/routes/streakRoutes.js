// server/routes/streakRoutes.js
import express from 'express';
import { updateStreak, getUserStreaks } from '../services/streakService.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// GET /api/streaks
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Streaks routes working' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/streaks
router.post('/', verifyToken, async (req, res) => {
    try {
        const { userId, gameId, isSuccess } = req.body;
        const streak = await updateStreak(userId, gameId, isSuccess);
        res.json(streak);
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET /api/streaks/user/:userId
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        const streaks = await getUserStreaks(req.params.userId);
        res.json(streaks);
    } catch (error) {
        console.error('Error getting user streaks:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
