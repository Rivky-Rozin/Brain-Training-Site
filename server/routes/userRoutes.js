// server/routes/userRoutes.js
import express from 'express';
import { getUsers, updateUserRole, updateUserProfileImage } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authentication.js';
import { deleteOldProfileImageIfExists } from '../middleware/imageUpload.js';
import upload from '../middleware/imageUpload.js';

const router = express.Router();

// GET /api/users
router.get('/', verifyToken,isAdmin,  getUsers);

// עדכון תפקיד משתמש
router.put('/:userId/role', verifyToken, isAdmin, updateUserRole);

// עדכון תמונת פרופיל (כולל מחיקת ישנה)
router.put('/:userId/profile-image', verifyToken, deleteOldProfileImageIfExists, upload.single('image'), updateUserProfileImage);

export default router;
