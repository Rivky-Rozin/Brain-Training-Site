import express from 'express';
import upload from '../middleware/imageUpload.js';
import path from 'path';

const router = express.Router();

// POST /api/upload-image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // החזר את הנתיב היחסי של התמונה
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

export default router;
