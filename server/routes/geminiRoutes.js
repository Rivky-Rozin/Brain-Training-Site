import express from 'express';
import { handleGeminiQuestion } from '../controllers/geminiController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

router.post('/ask', verifyToken, handleGeminiQuestion);

export default router;
