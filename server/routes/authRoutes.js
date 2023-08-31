// authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig.js';
import models from '../models/User.js';

const router = express.Router();

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

  console.log("start here")
  try{
    console.log("here 2")
    const user = await models.User.findOne({ email });
    console.log("here 3")
    if(!user){
      return res.status(401).json({ message: 'Invalid credentials'});
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log("here 4")

    const payload = {
      user: {
        id: user.id,
      },
    };

    // Use the promisified jwt.sign for better error handling
    const token = await new Promise((resolve, reject) => {
      console.log("here 5 awaiting token")

      jwt.sign(payload, authConfig.secretKey, { expiresIn: authConfig.expiresIn }, (err, token) => {
        if (err) {
          reject(err);
        } else {    
          console.log("here 3")
          resolve(token);
        }
      });
    });

    res.json({ token });
  } catch (error) {
    console.error("Error:", error);
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