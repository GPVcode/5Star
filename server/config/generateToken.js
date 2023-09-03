import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Your secret key for signing the token (keep it secret)
const secretKey = process.env.SECRET_KEY;

// Function to generate a JWT with user data
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      // Add any other user-related data you need in the token
    },
  };

  // Sign the token with the secret key and set an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
};

export default generateToken;