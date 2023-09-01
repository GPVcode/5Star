import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';
import { invalidatedTokens } from '../routes/authRoutes.js' // importing invalidatedTokens set

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token || invalidatedTokens.has(token)){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token, authConfig.secretKey);
        req.user = decoded.user; // Attach user info to the request
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
          } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
          } else {
            return res.status(401).json({ message: 'Invalid token' });
          }    
    }
}

export default authMiddleware;