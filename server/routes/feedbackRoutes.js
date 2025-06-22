import express from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { verifyToken, isAdmin} from '../middleware/authentication.js';

const router = express.Router();

router.post('/', verifyToken, feedbackController.createFeedback);
router.get('/', verifyToken,isAdmin, feedbackController.getAllFeedbacks);

export default router;