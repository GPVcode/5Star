import mongoose from "mongoose";

// The matchSchema still includes references to "likes," "comments," and "ratings" because these interactions are relevant to the matches presented by the host. The "host" field within the matchSchema identifies the user who presented the match. 
const matchSchema = new mongoose.Schema({
    title: String,
    description: String,
    media: String,
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Host of the match
    createdAt: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        createdAt: Date
      }
    ],
    createdAt: { type: Date, default: Date.now },
  });

const Match = mongoose.model('Match', matchSchema);

export default Match


// Here's a brief overview of the steps you might want to follow:

// Fetch Matches:
// Create an API endpoint that retrieves a list of matches that the user can rate and comment on.

// Display Matches:
// Use your front-end to display the fetched matches to the user. Each match can be presented with its title, description, and media (such as an image or video).

// Rating System:
// Implement UI components that allow users to rate matches. The rating system could involve stars or a numerical scale. When a user rates a match, send a request to the server to update the match's rating in the database.

// Comment Section:
// Provide a comment section for each match. Users can view existing comments and leave new ones. Implement UI components for adding and displaying comments.

// Submit Rating and Comment:
// Create API endpoints for submitting ratings and comments for specific matches. When a user submits a rating or comment, the data should be stored in the database associated with the respective match.

// Real-time Updates (Optional):
// Consider implementing real-time updates to notify users when new comments are posted or when a match's rating changes.

// Remember to implement proper validation and error handling throughout the process to ensure a smooth user experience. Also, ensure that the security measures, such as authentication and authorization, are in place to protect the integrity of your match rating and commenting system.