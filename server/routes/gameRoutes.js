// server/routes/gameRoutes.js
import express from 'express';
import { getGames, getGame, getGamesByCategoryController, createGameController } from '../controllers/gameController.js';

const router = express.Router();

router.get('/', getGames);
router.get('/:id', getGame);
router.get('/category/:category', getGamesByCategoryController);
router.post('/', createGameController);

export default router;
