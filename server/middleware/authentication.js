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
        req.user = decoded; // שמור את כל המידע תחת req.user
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

function isAdmin(req, res, next) {  
     console.log("req.user:", req.user);
    if (!req.user || req.user.role != 1) { // בדוק role תחת req.user
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}
//https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49

export { verifyToken, generateToken ,isAdmin }