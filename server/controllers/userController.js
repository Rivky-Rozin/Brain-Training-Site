// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { getTables as getTablesFromService } from '../services/userService.js';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
        res.json({ users });
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

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = role;
        await user.save();
        res.json({ message: 'Role updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
