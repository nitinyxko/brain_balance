import Community from '../models/Community.js';

let ioInstance = null;
export const setIO = (io) => {
  ioInstance = io;
};

export const createCommunity = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const community = new Community({
      name,
      description,
      image,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members.user', 'name avatar')
      .populate('posts.user', 'name avatar')
      .populate('posts.comments.user', 'name avatar');

    if (!community) return res.status(404).json({ error: 'Community not found' });
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    const isMember = community.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) return res.status(400).json({ error: 'Already a member' });

    community.members.push({ user: req.user._id, role: 'member' });
    await community.save();

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    const isMember = community.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ error: 'Must be a member to post' });

    const newPost = { user: req.user._id, content };
    community.posts.unshift(newPost);
    await community.save();

    const populated = await Community.findById(community._id)
      .populate('posts.user', 'name avatar')
      .populate('posts.comments.user', 'name avatar');

    const createdPost = populated.posts[0];

    // emit to room
    if (ioInstance) {
      ioInstance.to(community._id.toString()).emit('newPost', { ...createdPost.toObject(), communityId: community._id.toString() });
    }

    res.json(createdPost);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const community = await Community.findById(req.params.communityId);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    const post = community.posts.id(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isMember = community.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ error: 'Must be a member to comment' });

    const newComment = { user: req.user._id, content };
    post.comments.push(newComment);
    await community.save();

    const populated = await Community.findById(community._id)
      .populate('posts.user', 'name avatar')
      .populate('posts.comments.user', 'name avatar');

    const updatedPost = populated.posts.id(post._id);
    const createdComment = updatedPost.comments[updatedPost.comments.length - 1];

    // emit to room
    if (ioInstance) {
      ioInstance.to(community._id.toString()).emit('newComment', {
        comment: createdComment,
        postId: post._id.toString(),
        communityId: community._id.toString()
      });
    }

    res.json(createdComment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
