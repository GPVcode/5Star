// config/authConfig.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    secretKey: process.env.SECRET_KEY,
    expiresIn: '1h', // Token expiration time
  };