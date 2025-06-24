// בדיקות לפני שמעבירים לראוטס, למשל בדיקה אם המשתמש מחובר לפני שפונים לבסיס נתונים
import { loginUser, registerUser, updatePassword, getUserResults } from '../services/userService.js';

export const checkAuth = async (req, res) => {
    try {
        res.json({ message: 'Auth routes working' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Attempt login
        const userData = await loginUser(email, password);
        
        // Send response with token
        res.json({
            message: 'Login successful',
            token: userData.token,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profile_image: userData.profile_image || null // Include profile image if available
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ 
            message: error.message || 'Login failed'
        });
    }
};

export const register = async (req, res) => {
    try {        
        const { username, email, password } = req.body;
        // Attempt registration
        const userData = await registerUser(username, email, password);
        
        // Send response with token
        res.status(201).json({
            message: 'Registration successful',
            token: userData.token,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            message: error.message || 'Registration failed'
        });
    }
};
