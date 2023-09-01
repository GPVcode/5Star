import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/routes.js';
import matchRoutes from './routes/matchRoutes.js'

dotenv.config();
const app = express();
app.use(express.json());

app.use(morgan('dev'));
app.use("/", routes);
app.use('/auth', authRoutes);
app.use('/api', matchRoutes)
// gives idea of api request being called.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}) 
// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle specific errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Generic error response
  res.status(500).json({ message: "An error occurred" });
};
// Apply the error handling middleware
app.use(errorHandler);

// Connect to the MongoDB database using the MONGO_URI from environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');

  // Start the server once the database connection is established
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
  });
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});