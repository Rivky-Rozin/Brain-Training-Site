import { askGemini } from '../services/geminiService.js';

export const handleGeminiQuestion = async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'שאלה חסרה בגוף הבקשה' });
    }

    try {
        const answer = await askGemini(question);
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
