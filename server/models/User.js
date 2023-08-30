import mongoose from 'mongoose';

// The userSchema includes fields like "username," "email," "profile," "friends," and timestamps. 
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profile: {
    firstName: String,
    lastName: String,
    birthdate: Date,
    avatar: String,
    bio: String
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: Date,
  updatedAt: Date
});

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType' }, // Reference to either a match or a comment
    targetType: { type: String, enum: ['Match', 'Comment'] }, // Indicates the type of target
    createdAt: Date
});
  
const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    text: String,
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }], // Array of likes on this comment
    createdAt: Date
});

const User = mongoose.model('User', userSchema);
const Like = mongoose.model('Like', likeSchema);
const Comment = mongoose.model('Comment', commentSchema);

export default { User, Like, Comment };