// server/routes/userRoutes.js
import express from 'express';
import { getTables, getUsers, updateUserRole, updateUserProfileImage } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authentication.js';
import { deleteOldProfileImageIfExists } from '../middleware/imageUpload.js';
import upload from '../middleware/imageUpload.js';

const router = express.Router();

// GET /api/users/tables - בדיקת כל הטבלאות
router.get('/tables', verifyToken, getTables);

// GET /api/users
router.get('/', verifyToken, getUsers);

// עדכון תפקיד משתמש
router.put('/:userId/role', verifyToken, updateUserRole);

// עדכון תמונת פרופיל (כולל מחיקת ישנה)
router.put('/:userId/profile-image', verifyToken, deleteOldProfileImageIfExists, upload.single('image'), updateUserProfileImage);

export default router;
