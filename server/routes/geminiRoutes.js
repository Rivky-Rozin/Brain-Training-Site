import express from 'express';
import { handleGeminiQuestion } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/ask', handleGeminiQuestion);

export default router;
