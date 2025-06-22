import Message from '../models/Message.js';
import User from '../models/User.js';
import sequelize from '../db/connection.js';

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

export const updateMessage = async (messageId, userId, content, media_url) => {
    try {
        const [result] = await sequelize.query(
            'UPDATE messages SET content = ?, media_url = ? WHERE id = ? AND user_id = ?',
            { replacements: [content, media_url, messageId, userId] }
        );
        if (result.affectedRows === 0) return null;
        // שליפה מחדש עם include מלא של המשתמש
        return await Message.findByPk(messageId, {
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'profile_image'] }]
        });
    } catch (err) {
        return undefined;
    }
};

export const deleteMessage = async (messageId, userId) => {
    try {
        const [result] = await sequelize.query(
            'DELETE FROM messages WHERE id = ? AND user_id = ?',
            { replacements: [messageId, userId] }
        );
        if (result.affectedRows === 0) return null;
        return { success: true };
    } catch (err) {
        return undefined;
    }
};
