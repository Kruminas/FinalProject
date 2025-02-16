/* middlewares/authMiddleware.js */
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'mySecretKey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, secret, (err, userPayload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = userPayload;
    next();
  });
}

module.exports = authenticateToken;
