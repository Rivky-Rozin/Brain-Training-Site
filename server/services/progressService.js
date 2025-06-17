// server/services/progressService.js
import UserGameProgress from '../models/UserGameProgress.js';

export const saveProgress = async ({ userId, gameId, difficulty, timeSpent, attempts }) => {
  // דוגמה לנוסחת חישוב ציון:
  const score = Math.max(0, 1000 - timeSpent * 2 - attempts * 50);

  const [entry, created] = await UserGameProgress.upsert({
    userId, gameId, difficulty, timeSpent, attempts, score
  }, { returning: true });

  return entry;
};

export const getUserProgress = async (userId) => {
  return await UserGameProgress.findAll({ where: { userId } });
};
