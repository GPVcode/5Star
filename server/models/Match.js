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