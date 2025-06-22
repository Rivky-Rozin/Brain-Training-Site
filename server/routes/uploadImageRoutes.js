import express from 'express';
import upload from '../middleware/imageUpload.js';
import { uploadImageController } from '../controllers/uploadImageController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = express.Router();

// POST /api/upload-image
router.post('/', verifyToken, upload.single('image'), uploadImageController);

export default router;
