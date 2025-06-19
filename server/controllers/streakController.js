import { updateStreak, getUserStreaks } from '../services/streakService.js';

// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת

export const getStreaks = async (req, res) => {
    try {
        // TODO: Implement get streaks logic
        res.json({ streaks: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateStreakController = async (req, res) => {
    try {
        const { userId, gameId, isSuccess } = req.body;
        const streak = await updateStreak(userId, gameId, isSuccess);
        res.json(streak);
    } catch (error) {
        console.error('Error updating streak:', error);
        res.status(400).json({ error: error.message });
    }
};

export const getUserStreaksController = async (req, res) => {
    try {
        const { userId } = req.params;
        const streaks = await getUserStreaks(userId);
        res.json(streaks);
    } catch (error) {
        console.error('Error fetching user streaks:', error);
        res.status(400).json({ error: error.message });
    }
};
