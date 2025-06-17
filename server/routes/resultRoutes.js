// server/routes/resultRoutes.js
import express from 'express';
import { getAllResults, getUserResultsController } from '../controllers/resultController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// GET /api/results
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Results routes working' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/results/user/:userId
router.get('/user/:userId', verifyToken, getUserResultsController);

// GET /api/results/all - כל התוצאות של כל המשתמשים
router.get('/all', getAllResults);

export default router;
