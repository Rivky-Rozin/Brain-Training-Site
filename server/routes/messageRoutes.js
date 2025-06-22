import express from 'express';
import { fetchMessages, createMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// GET /api/messages?page=1
router.get('/', verifyToken, fetchMessages);

// POST /api/messages
router.post('/', verifyToken, createMessage);

export default router;
