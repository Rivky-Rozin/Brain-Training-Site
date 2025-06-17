// server/routes/userRoutes.js
import express from 'express';
import { getTables, getUsers, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/tables - בדיקת כל הטבלאות
router.get('/tables', getTables);

// GET /api/users
router.get('/', getUsers);

// עדכון תפקיד משתמש
router.put('/:userId/role', updateUserRole);

export default router;
