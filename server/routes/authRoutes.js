// server/routes/authRoutes.js
import express from 'express';
import { checkAuth, login, register } from '../controllers/authController.js';
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


export default router;
