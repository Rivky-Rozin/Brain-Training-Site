import { getMessages, addMessage, updateMessage as updateMessageService, deleteMessage as deleteMessageService } from '../services/messageService.js';

export const fetchMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const messages = await getMessages(page, limit);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { user_id, content, media_url } = req.body;
        if (!user_id || (!content && !media_url)) {
            return res.status(400).json({ error: 'Missing user_id and message content or media' });
        }
        //האינקלוד יוזר אומר לסרוויס לכלול גם את המשתמש שמקושר לההודעה
        const message = await addMessage(user_id, content, media_url, { includeUser: true });
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const userId = req.user.id;
        const { content, media_url } = req.body;
        if (!content && !media_url) {
            return res.status(400).json({ error: 'Missing message content or media' });
        }
        const updated = await updateMessageService(messageId, userId, content, media_url);
        if (updated === undefined) return res.status(500).json({ error: 'Server error' });
        if (updated === null) return res.status(404).json({ error: 'Message not found' });
        if (updated === false) return res.status(403).json({ error: 'Unauthorized' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const userId = req.user.id;
        const result = await deleteMessageService(messageId, userId);
        if (result === undefined) return res.status(500).json({ error: 'Server error' });
        if (result === null) return res.status(404).json({ error: 'Message not found' });
        if (result === false) return res.status(403).json({ error: 'Unauthorized' });
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
