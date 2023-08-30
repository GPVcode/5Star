import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';

export default function authMiddleware(req, res, next){
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token, authConfig.secretKey);
        req.user = decoded.user; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token'})
    }
}