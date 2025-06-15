// בדיקות לפני שמעבירים לראוטס, למשל בדיקה אם המשתמש מחובר לפני שפונים לבסיס נתונים
import { loginUser, registerUser, updatePassword, getUserResults, getUserStreaks } from '../services/userService.js';

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
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                message: 'Username and password are required' 
            });
        }

        // Attempt login
        const userData = await loginUser(username, password);
        
        // Send response with token
        res.json({
            message: 'Login successful',
            token: userData.token,
            user: {
                id: userData.id,
                username: userData.username,
                role: userData.role
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
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        if (!req.body) {
            return res.status(400).json({ 
                message: 'No request body received' 
            });
        }

        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                message: 'Username and password are required' 
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Attempt registration
        const userData = await registerUser(username, password);
        
        // Send response with token
        res.status(201).json({
            message: 'Registration successful',
            token: userData.token,
            user: {
                id: userData.id,
                username: userData.username,
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

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // This comes from the auth middleware

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'נדרשות סיסמה נוכחית וסיסמה חדשה' 
            });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים' 
            });
        }

        // Update password
        const result = await updatePassword(userId, currentPassword, newPassword);
        
        res.json(result);

    } catch (error) {
        console.error('Password update error:', error);
        res.status(400).json({ 
            message: error.message || 'שגיאה בעדכון הסיסמה'
        });
    }
};

// Get user results
export const getUserResultsController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const results = await getUserResults(userId);
        res.json({ results });
    } catch (error) {
        console.error('Error getting user results:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to get user results'
        });
    }
};

// Get user streaks
export const getUserStreaksController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const streaks = await getUserStreaks(userId);
        res.json(streaks);
    } catch (error) {
        console.error('Error getting user streaks:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to get user streaks'
        });
    }
};