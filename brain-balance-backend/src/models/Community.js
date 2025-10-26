import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  attachments: [{ url: String, mime: String }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['admin', 'member', 'mod'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  members: [MemberSchema],
  posts: [PostSchema],
}, { timestamps: true });

export default mongoose.model('Community', CommunitySchema);
