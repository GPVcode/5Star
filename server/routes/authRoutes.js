// authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';
import models from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Store invalidated tokens for logout and session management
const invalidatedTokens = new Set();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try{

    // Check if user with same email already exists
    const existingUser = await models.User.findOne({ email });

    if(existingUser){
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new models.User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User registered successfully.' });
  } catch(error){
    console.error("Error:", error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

router.post('/login', async (req, res) => {
  // Handle user login
  const { email, password } = req.body;

  try{
    const user = await models.User.findOne({ email });
    if(!user){
      return res.status(401).json({ message: 'Invalid credentials'});
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    // Use the promisified jwt.sign for better error handling
    const token = await new Promise((resolve, reject) => {

      jwt.sign(payload, authConfig.secretKey, { expiresIn: authConfig.expiresIn }, (err, token) => {
        if (err) {
          reject(err);
        } else {    
          resolve(token);
        }
      });
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// User logout
router.post('/logout', authMiddleware, async (req, res) => {
  // Invalidate the token by setting it to an empty string or null
  const token = req.header('x-auth-token');

  try{
    const decode = jwt.verify(token, authConfig.secretKey);
    // invalidate the token and add it to the invalidatedTokens set
    invalidatedTokens.add(token);
    res.json({ message: 'Logged out successfully' });
  } 
  catch (err){
    if(err.name == 'TokenExpiredError'){
      return res.status(401).json({ message: 'Token has expired' });
  }
    return res.status(401).json({ message: 'Token is not valide' });
  }
 
});

export { invalidatedTokens };
export default router;