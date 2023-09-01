import express from 'express';
import matchController from '../controllers/matchController.js';
// // need to set up auth middleware
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// GET route to view matches and rate them (for users)
router.get('/matches', authMiddleware, matchController.getMatches);
// POST route to create and present a match (for hosts)
router.post('/matches/present', authMiddleware, matchController.presentMatch);
// POST route to rate a match
router.post('/matches/:matchId/rate', authMiddleware, matchController.rateMatch);

export default router;