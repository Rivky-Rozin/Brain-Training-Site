// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת

export const getResults = async (req, res) => {
    try {
        // TODO: Implement get results logic
        res.json({ results: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
