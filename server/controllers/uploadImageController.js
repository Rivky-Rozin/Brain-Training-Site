// server/controllers/uploadImageController.js

export const uploadImageController = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // החזר את הנתיב של התמונה שהועלתה
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};
