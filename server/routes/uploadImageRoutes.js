import express from 'express';
import upload from '../middleware/imageUpload.js';
import { uploadImageController } from '../controllers/uploadImageController.js';

const router = express.Router();

// POST /api/upload-image
router.post('/', upload.single('image'), uploadImageController);

export default router;
