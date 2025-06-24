// התפקיד של הקונטרולר הוא לפנות לפונקציות בסרוויס שמדברות עם בסיס הנתונים ולהתמודד עם הנתונים שהוא מקבל מהשרת
import { getAllUsers, updateUserRole as updateUserRoleService, updateUserProfileImage as updateUserProfileImageService } from '../services/userService.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const user = await updateUserRoleService(userId, role);
        res.json({ message: 'Role updated', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfileImage = async (req, res) => {
    try {
        const { userId } = req.params;
        const { profile_image } = req.body;
        const user = await updateUserProfileImageService(userId, profile_image);
        res.json({ message: 'Profile image updated', user });
    } catch (error) {
        console.error('Error updating profile image:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};
