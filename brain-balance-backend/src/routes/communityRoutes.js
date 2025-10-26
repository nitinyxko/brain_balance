// backend/src/routes/communityRoutes.js
import express from 'express';
import Community from '../models/Community.js';
import { ioInstance } from '../index.js'; // Make sure index.js has: export const ioInstance = ...

import {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  createPost,
  addComment
} from '../controllers/communityController.js';

const router = express.Router();

// Community routes
router.post('/', createCommunity); // create community
router.get('/', getCommunities); // list communities
router.get('/:id', getCommunity); // get community details (with posts)
router.post('/:id/join', joinCommunity); // join community
router.post('/:id/posts', createPost); // create post in community
router.post('/:communityId/posts/:postId/comments', addComment); // add comment

export default router;
