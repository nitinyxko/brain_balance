import express from 'express';
import * as gameController from '../controllers/gameController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All game routes require authentication

router.post('/progress', gameController.saveGameProgress);
router.get('/progress/:game', gameController.getGameProgress);
router.get('/progress', gameController.getAllGameProgress);

export default router;