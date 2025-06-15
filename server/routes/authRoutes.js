// server/routes/authRoutes.js
import express from 'express';
import { checkAuth, login, register, changePassword, getUserResultsController, getUserStreaksController } from '../controllers/authController.js';
import { verifyToken, authenticateToken } from '../middleware/authentication.js';

const router = express.Router();

// Middleware for parsing JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// GET /api/auth
router.get('/', checkAuth);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// Change password route (requires authentication)
router.post('/change-password', verifyToken, changePassword);

// Protected routes
router.get('/results/:userId', authenticateToken, getUserResultsController);
router.get('/streaks/:userId', authenticateToken, getUserStreaksController);

export default router;
