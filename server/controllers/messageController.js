import { getMessages, addMessage } from '../services/messageService.js';

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
        // ניצור הודעה חדשה ונחזיר אותה עם include מלא דרך ה-service
        const message = await addMessage(user_id, content, media_url, { includeUser: true });
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
