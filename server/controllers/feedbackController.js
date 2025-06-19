import feedbackService from '../services/feedbackService.js';

export const createFeedback = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const feedback = await feedbackService.createFeedback(userId, content);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    // בדוק אם המשתמש הוא מנהל לפי role === 1
    if (!req.user || req.user.role !== 1) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export all functions for use in routes
export default {
  createFeedback,
  getAllFeedbacks
};