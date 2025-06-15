

import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRETKEY ?? "SECRETKEY"
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

function verifyToken(req, res, next) {
    const token = req.header('Authorization')!= undefined?req.header('Authorization').split(' ')[1]:null; // Assuming the token
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;
        req.username = decoded.username;
        req.role = decoded.role;
        console.log("decoded.role:", decoded.role);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};


function isAdmin(req, res, next) {  
     console.log("eq.role:", req.role);
    if (req.role != 1) { // Assuming '1' is the role for admin
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}
//https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49

export { verifyToken, generateToken ,isAdmin}