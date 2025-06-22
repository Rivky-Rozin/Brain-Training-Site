import express from 'express';
import { fetchMessages, createMessage, updateMessage, deleteMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// GET /api/messages?page=1
router.get('/', verifyToken, fetchMessages);

// POST /api/messages
router.post('/', verifyToken, createMessage);

// PUT /api/messages/:id
router.put('/:id', verifyToken, updateMessage);

// DELETE /api/messages/:id
router.delete('/:id', verifyToken, deleteMessage);

export default router;
