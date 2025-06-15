import { Game } from '../models/index.js';

// פונקציה להחזרת כל המשחקים
export const getAllGames = async () => {
    try {
        const games = await Game.findAll();
        return games;
    } catch (error) {
        console.error('Error in getAllGames service:', error);
        throw error;
    }
};

// קבלת משחק לפי מזהה
export const getGameById = async (id) => {
    try {
        const game = await Game.findByPk(id);
        if (!game) {
            throw new Error('Game not found');
        }
        return game;
    } catch (error) {
        console.error('Error in getGameById service:', error);
        throw error;
    }
};

// קבלת משחקים לפי קטגוריה
export const getGamesByCategory = async (category) => {
    try {
        const games = await Game.findAll({
            where: { category }
        });
        return games;
    } catch (error) {
        console.error('Error in getGamesByCategory service:', error);
        throw error;
    }
};

// יצירת משחק חדש
export const createGame = async (gameData) => {
    try {
        const game = await Game.create(gameData);
        return game;
    } catch (error) {
        console.error('Error in createGame service:', error);
        throw error;
    }
}; 