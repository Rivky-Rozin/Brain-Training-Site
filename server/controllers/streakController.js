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
