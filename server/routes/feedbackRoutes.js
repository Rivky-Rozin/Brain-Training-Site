import express from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', verifyToken, feedbackController.createFeedback);
router.get('/', verifyToken, feedbackController.getAllFeedbacks);

export default router;