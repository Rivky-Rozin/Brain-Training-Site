// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { Result, User, Game } from '../models/index.js';
import { getUserResults as getUserResultsService } from '../services/resultService.js';


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
