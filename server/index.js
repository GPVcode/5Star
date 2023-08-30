import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/routes.js';
import matchRoutes from './routes/matchRoutes.js'

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use("/", routes);
app.use('/auth', authRoutes);
app.use('/match', matchRoutes)
// gives idea of api request being called.
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}) 

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