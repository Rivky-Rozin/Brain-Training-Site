// server/routes/authRoutes.js
import express from 'express';
import { checkAuth, login, register, changePassword, getUserResultsController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authentication.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// Middleware for parsing JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// GET /api/auth
router.get('/', checkAuth);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// POST /api/auth/register
router.post('/register', validateRegister, register);

// Change password route (requires authentication)
router.post('/change-password', verifyToken, changePassword);

// Protected routes
router.get('/results/:userId', verifyToken, getUserResultsController);

export default router;
