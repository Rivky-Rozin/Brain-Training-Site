// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { getUserResults as getUserResultsService, saveResult as saveResultService, getAllResults as getAllResultsService } from '../services/resultService.js';


export const getAllResults = async (req, res) => {
    try {
        const results = await getAllResultsService();
        res.json({ results });
    } catch (error) {
        console.error('Error getting all results:', error);
        res.status(500).json({ error: error.message });
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
