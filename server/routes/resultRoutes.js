// server/routes/resultRoutes.js
import express from 'express';
import { getAllResults, getUserResultsController, saveResultController } from '../controllers/resultController.js';
import { verifyToken, isAdmin } from '../middleware/authentication.js';

const router = express.Router();

// GET /api/results/user/:userId
router.get('/user/:userId', verifyToken, getUserResultsController);

// GET /api/results/all - כל התוצאות של כל המשתמשים
router.get('/all', verifyToken, isAdmin, getAllResults);

// POST /api/results - שמירת תוצאה חדשה
router.post('/', verifyToken, saveResultController);

export default router;
