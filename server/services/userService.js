import { User, Password, Result } from '../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authentication.js';
import sequelize from '../db/connection.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; // תיקון: ייבוא Op

const SECRETKEY = process.env.SECRETKEY || 'your-secret-key';

// פונקציה ליצירת משתמש חדש
export const registerUser = async (username, email, password) => {
    try {
        // בדיקה אם המשתמש או האימייל כבר קיימים
        const existingUser = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } }); // שימוש ב-Op
        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // יצירת משתמש חדש
        const user = await User.create({ username, email });

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
            email: user.email,
            role: user.role
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        };
    } catch (error) {
        throw error;
    }
};

// פונקציה להתחברות משתמש
export const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ 
            where: { email },
            include: [Password]
        });

        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.Password.hashedPassword);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            SECRETKEY,
            { expiresIn: '24h' }
        );

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
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
        // Get current user with password
        const user = await User.findOne({
            where: { id: userId },
            include: [Password]
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.Password.hashedPassword);
        if (!validPassword) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await user.Password.update({
            hashedPassword,
            salt
        });

        return { message: 'Password updated successfully' };
    } catch (error) {
        throw error;
    }
};


// קבלת תוצאות משתמש
export const getUserResults = async (userId) => {
    try {
        const results = await Result.findAll({
            where: { userId },
            include: [{
                model: Game,
                attributes: ['name', 'category']
            }],
            order: [['completedAt', 'DESC']]
        });

        return results;
    } catch (error) {
        throw error;
    }
};
