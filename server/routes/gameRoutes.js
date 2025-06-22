// server/routes/gameRoutes.js
import express from 'express';
import { getGames, getGame, getGamesByCategoryController, createGameController } from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

router.get('/', verifyToken, getGames);
router.get('/:id', verifyToken, getGame);
router.get('/category/:category', verifyToken, getGamesByCategoryController);
router.post('/', verifyToken, createGameController);

export default router;
