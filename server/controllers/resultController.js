// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { Result, User, Game } from '../models/index.js';
import { getUserResults as getUserResultsService, saveResult as saveResultService } from '../services/resultService.js';


export const getAllResults = async (req, res) => {
    try {
        const results = await Result.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Game, attributes: ['name'] }
            ],
            order: [['completedAt', 'DESC']]
        });
        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getUserResultsController = async (req, res) => {
    try {
        const results = await getUserResultsService(req.params.userId);
        res.json(results);
    } catch (error) {
        console.error('Error getting user results:', error);
        res.status(500).json({ error: error.message });
    }
};

export const saveResultController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gameId, score, timeSpent } = req.body;
        if (!gameId || score === undefined || timeSpent === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await saveResultService(userId, gameId, score, timeSpent);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: error.message });
    }
};
