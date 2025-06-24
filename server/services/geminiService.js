import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY;
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const askGemini = async (question) => {
  const model = 'gemini-2.5-flash';  
  const url = `${BASE}/models/${model}:generateContent?key=${API_KEY}`;

  try {
    const { data } = await axios.post(url, {
      contents: [{ parts: [{ text: question }] }]
    });
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'אין תשובה';
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    throw new Error('Error communicating with Gemini API');
  }
};



export default { askGemini };
