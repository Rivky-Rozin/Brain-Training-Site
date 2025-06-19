// server/routes/streakRoutes.js
import express from 'express';
import { updateStreakController, getUserStreaksController } from '../controllers/streakController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// POST /api/streaks
router.post('/', verifyToken, updateStreakController);

// GET /api/streaks/user/:userId
router.get('/user/:userId', verifyToken, getUserStreaksController);

export default router;
