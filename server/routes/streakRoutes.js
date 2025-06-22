// server/routes/streakRoutes.js
import express from 'express';
import { updateStreakController, getUserStreaksController } from '../controllers/streakController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// הסרתי את כל הראוטים של streaks

export default router;
