// server/controllers/progressController.js
import { saveProgress, getUserProgress } from '../services/progressService.js';

export const postProgress = async (req, res) => {
  try {
    const { gameId, difficulty, timeSpent, attempts } = req.body;
    const userId = req.user.id;
    const entry = await saveProgress({ userId, gameId, difficulty, timeSpent, attempts });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const fetchProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await getUserProgress(userId);
    res.json({ success: true, entries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
