import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

async function createFeedback(userId, content) {
  try {
    return await Feedback.create({ userId, content });
  } catch (error) {
    throw new Error('Failed to create feedback: ' + error.message);
  }
}

async function getAllFeedbacks() {
  try {
    return await Feedback.findAll({ include: [{ model: User, attributes: ['id', 'username'] }] });
  } catch (error) {
    throw new Error('Failed to fetch feedbacks: ' + error.message);
  }
}

export default { createFeedback, getAllFeedbacks };