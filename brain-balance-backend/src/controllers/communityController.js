import Community from '../models/Community.js';

export const createCommunity = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const community = new Community({
      name,
      description,
      image,
      members: [{
        user: req.user._id,
        role: 'admin',
      }],
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

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const isMember = community.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ error: 'Already a member' });
    }

    community.members.push({
      user: req.user._id,
      role: 'member',
    });

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
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const isMember = community.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ error: 'Must be a member to post' });
    }

    community.posts.unshift({
      user: req.user._id,
      content,
    });

    await community.save();
    
    const populatedCommunity = await Community.findById(community._id)
      .populate('posts.user', 'name avatar')
      .populate('posts.comments.user', 'name avatar');

    res.json(populatedCommunity.posts[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const post = community.posts.id(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isMember = community.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ error: 'Must be a member to comment' });
    }

    post.comments.push({
      user: req.user._id,
      content,
    });

    await community.save();
    
    const populatedCommunity = await Community.findById(community._id)
      .populate('posts.user', 'name avatar')
      .populate('posts.comments.user', 'name avatar');

    const updatedPost = populatedCommunity.posts.id(post._id);
    res.json(updatedPost.comments[updatedPost.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};