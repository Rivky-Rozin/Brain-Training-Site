import { User, Password, Result, Streak } from '../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authentication.js';
import sequelize from '../db/connection.js';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// פונקציה ליצירת משתמש חדש
export const registerUser = async (username, password) => {
    try {
        // בדיקה אם המשתמש כבר קיים
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // יצירת משתמש חדש
        const user = await User.create({ username });

        // יצירת סיסמה מוצפנת
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // שמירת הסיסמה המוצפנת
        await Password.create({
            userId: user.id,
            hashedPassword,
            salt
        });

        // יצירת טוקן
        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role
        });

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            token
        };
    } catch (error) {
        throw error;
    }
};

// פונקציה להתחברות משתמש
export const loginUser = async (username, password) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            token
        };
    } catch (error) {
        throw error;
    }
};

export const getTables = async () => {
    const [results] = await sequelize.query('SHOW TABLES');
    return results.map(result => Object.values(result)[0]);
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
    try {
        // Get current user
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        return { message: 'Password updated successfully' };
    } catch (error) {
        throw error;
    }
};

// קבלת תוצאות משתמש
export const getUserResults = async (userId) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                g.name as game_name,
                g.category,
                r.score,
                r.reaction_time,
                r.success_rate,
                r.created_at
            FROM results r
            JOIN games g ON r.game_id = g.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC`,
            [userId]
        );

        return rows;
    } catch (error) {
        throw error;
    }
};

// קבלת רצפים של משתמש
export const getUserStreaks = async (userId) => {
    try {
        // Get all results for the user
        const [rows] = await pool.query(
            `SELECT DATE(created_at) as date
            FROM results
            WHERE user_id = ?
            GROUP BY DATE(created_at)
            ORDER BY date DESC`,
            [userId]
        );

        if (rows.length === 0) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastTrainingDate: null
            };
        }

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < rows.length; i++) {
            const date = new Date(rows[i].date);
            date.setHours(0, 0, 0, 0);

            if (i === 0) {
                // Check if the last training was today or yesterday
                const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
                if (diffDays <= 1) {
                    currentStreak = 1;
                    tempStreak = 1;
                }
            } else {
                const prevDate = new Date(rows[i - 1].date);
                prevDate.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((prevDate - date) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                    if (i === 0 || i === 1) {
                        currentStreak = tempStreak;
                    }
                } else {
                    tempStreak = 1;
                }
            }

            longestStreak = Math.max(longestStreak, tempStreak);
        }

        return {
            currentStreak,
            longestStreak,
            lastTrainingDate: rows[0].date
        };
    } catch (error) {
        throw error;
    }
};
