import express from 'express';
import * as communityController from '../controllers/communityController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All community routes require authentication

router.post('/', communityController.createCommunity);
router.get('/', communityController.getCommunities);
router.get('/:id', communityController.getCommunity);
router.post('/:id/join', communityController.joinCommunity);
router.post('/:id/posts', communityController.createPost);
router.post('/:communityId/posts/:postId/comments', communityController.addComment);

export default router;