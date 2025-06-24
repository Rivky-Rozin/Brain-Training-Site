import { User, Password, Result } from '../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authentication.js';
import sequelize from '../db/connection.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; 

const SECRETKEY = process.env.SECRETKEY || 'your-secret-key';

// פונקציה ליצירת משתמש חדש
export const registerUser = async (username, email, password) => {
    try {
        // בדיקה אם המשתמש או האימייל כבר קיימים
        const existingUser = await User.findOne({ where: { email }}); // שימוש ב-Op
        if (existingUser) {
            throw new Error('Email already exists');
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

// קבלת כל המשתמשים
export const getAllUsers = async () => {
    try {
        return await User.findAll({ attributes: ['id', 'username', 'role'] });
    } catch (error) {
        throw error;
    }
};

// עדכון תפקיד משתמש
export const updateUserRole = async (userId, role) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.role = role;
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// עדכון תמונת פרופיל
export const updateUserProfileImage = async (userId, profileImage) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.profile_image = profileImage;
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

