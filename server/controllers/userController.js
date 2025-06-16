// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { getTables as getTablesFromService } from '../services/userService.js';

export const getUsers = async (req, res) => {
    try {
        // TODO: במקום החזרה ריקה תטעני מה-DB
        res.json({ users: [] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTables = async (req, res) => {
    try {
        const tables = await getTablesFromService();
        res.json({ 
            message: 'רשימת כל הטבלאות בבסיס הנתונים:',
            tables
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


