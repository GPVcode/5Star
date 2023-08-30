// authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try{
    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'User registered successfully.' });
  } catch(error){
    res.status(500).json({ message: 'Error registering user.' });
  }
});

router.post('/login', async (req, res) => {
  // Handle user login
  const { email, password } = req.body;

  try{
    const user = await User.findOne({ email });
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
      },
    };

    jwt.sign(payload, authConfig.secretKey, { expiresIn: authConfig.expiresIn }, (err, token) => {
      if(err) throw err;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// User logout
router.post('/logout', (req, res) => {
  // Invalidate the token by setting it to an empty string or null
  const token = req.header('x-auth-token');
  jwt.verify(token, authConfig.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    // Here, you might want to perform additional actions like logging user out of sessions, etc.
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;