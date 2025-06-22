import { User, Game } from '../models/index.js';

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