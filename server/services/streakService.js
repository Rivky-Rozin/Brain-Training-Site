import { Streak, User, Game } from '../models/index.js';

// עדכון רצף של משתמש במשחק
export const updateStreak = async (userId, gameId, isSuccess) => {
    try {
        let streak = await Streak.findOne({
            where: { userId, gameId }
        });

        if (!streak) {
            streak = await Streak.create({
                userId,
                gameId,
                currentStreak: 0,
                bestStreak: 0
            });
        }

        if (isSuccess) {
            streak.currentStreak += 1;
            if (streak.currentStreak > streak.bestStreak) {
                streak.bestStreak = streak.currentStreak;
            }
        } else {
            streak.currentStreak = 0;
        }

        streak.lastPlayedAt = new Date();
        await streak.save();
        return streak;
    } catch (error) {
        throw error;
    }
};

// קבלת רצפים של משתמש
export const getUserStreaks = async (userId) => {
    try {
        return await Streak.findAll({
            where: { userId },
            include: [Game]
        });
    } catch (error) {
        throw error;
    }
}; 