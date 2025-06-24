import { Result, User, Game } from '../models/index.js';

// שמירת תוצאה חדשה
export const saveResult = async (userId, gameId, score, timeSpent) => {
    try {
        return await Result.create({
            userId,
            gameId,
            score,
            timeSpent,
            completedAt: new Date()
        });
    } catch (error) {
        throw error;
    }
};

// קבלת תוצאות של משתמש
export const getUserResults = async (userId) => {
    try {
        const results = await Result.findAll({
            where: { userId },
            include: [{
                model: Game,
                attributes: ['name']
            }],
            order: [['completedAt', 'DESC']]
        });

        return results;
    } catch (error) {
        throw error;
    }
};

// קבלת כל התוצאות של כל המשתמשים
export const getAllResults = async () => {
    try {
        return await Result.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Game, attributes: ['name'] }
            ],
            order: [['completedAt', 'DESC']]
        });
    } catch (error) {
        throw error;
    }
};

// קבלת תוצאות של משחק
export const getGameResults = async (gameId) => {
    try {
        return await Result.findAll({
            where: { gameId },
            include: [{
                model: User,
                attributes: ['username']
            }],
            order: [['score', 'DESC']]
        });
    } catch (error) {
        throw error;
    }
};