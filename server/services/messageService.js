import Message from '../models/Message.js';
import User from '../models/User.js';

export const getMessages = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return await Message.findAll({
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'profile_image'] }],
        order: [['created_at', 'DESC']], // שליפה מהחדשות לישנות
        limit,
        offset
    });
};

export const addMessage = async (user_id, content, media_url, options = {}) => {
    const message = await Message.create({ user_id, content, media_url });
    if (options.includeUser) {
        // שליפה מחדש עם include מלא של המשתמש
        return await Message.findByPk(message.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'profile_image'] }]
        });
    }
    return message;
};
