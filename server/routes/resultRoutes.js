// server/routes/resultRoutes.js
import express from 'express';
import { getUserResults } from '../services/resultService.js';
import { authenticateToken } from '../middleware/authentication.js';

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
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const results = await getUserResults(req.params.userId);
    res.json(results);
  } catch (error) {
    console.error('Error getting user results:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
