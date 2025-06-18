import express from 'express';
import { fetchMessages, createMessage } from '../controllers/messageController.js';

const router = express.Router();

// GET /api/messages?page=1
router.get('/', fetchMessages);

// POST /api/messages
router.post('/', createMessage);

export default router;
