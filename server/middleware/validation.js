// server/middleware/validation.js

// Email validation regex
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation
export function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
}

// Middleware for register validation
export function validateRegister(req, res, next) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    next();
}

// Middleware for login validation
export function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    next();
}
