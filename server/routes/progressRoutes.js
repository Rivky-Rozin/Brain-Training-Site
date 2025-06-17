// server/routes/progressRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authentication.js';
import { postProgress, fetchProgress } from '../controllers/progressController.js';

const router = express.Router();
router.post('/', verifyToken, postProgress);
router.get('/',  verifyToken, fetchProgress);
export default router;
