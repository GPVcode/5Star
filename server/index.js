import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/routes.js';
import matchRoutes from './routes/matchRoutes.js'
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import models from './models/User.js';
import session from 'express-session';
import axios from 'axios';
import generateToken from './config/generateToken.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// session middleware should be configures before passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware to track API requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


// Google auth routes must be with passport library
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2239/oauth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
      let user = await models.User.findOne({ googleId: profile.id });
      
      if(user){

        // return the user if user exists
        return done(null, user);
      } else{
          // if user doesn't exist, create new user
          user = new models.User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
        });

        await user.save();
        
        return done(null, user);
      }
    } catch (error){

      return done(error)
    }
  }
)); 


// Serialize user to store their ID in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user based on their ID when the make requests
passport.deserializeUser(async (id, done) => {
  try{
    const user = await models.User.findById(id);

    if(!user){

      return done(new Error('User not found'), null);
    }

    return done(null, user);
  } catch(error){

    return done(error, null)
  }
});

// Google auth routes
app.get('/oauth/google', 
  passport.authenticate("google", { 
    scope: ["profile", "email"] 
  })
);

app.get('/oauth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login'
  }), async (req, res) => {
    try {
      const code = req.query.code; // The authorization code from Google
      // Exchange the code for an access token using a library like `axios`
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:2239/oauth/google/callback',
        grant_type: 'authorization_code',
      });
      console.log("Google OAuth Response:", response.data);

      const { access_token } = response.data;

      // Use the `access_token` to fetch user data from Google
      const userDataResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userData = userDataResponse.data;

      // Generate your application's token and send it to the client
      const appToken = generateToken(userData);

      // Redirect the client to your application's route with the token
      res.redirect(`http://localhost:3000/?token=${appToken}`);
    } catch (error) {
      console.error('Google OAuth Request Error:', error.message);
      res.redirect('/login'); // Redirect to login page on error
    }
  }
);

app.use("/", routes);
app.use('/auth', authRoutes);
app.use('/api', matchRoutes)

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