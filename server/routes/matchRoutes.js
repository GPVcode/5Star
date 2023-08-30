import express from 'express';
import matchController from '../controllers/matchController.js'
// // need to set up auth middleware
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// GET route to view matches and rate them (for users)
router.get('/rate', (req, res) => {
    // Handle fetching and sending matches data
    res.send("View Match.");

});
// POST route to create and present a match (for hosts)
router.post('/present', (req, res) => {
    // Handle fetching and sending matches data
    res.send("Presenting Matches.");
});
// POST route to rate a match
router.post('/:matchId/rate', (req, res) => {
    // Handle fetching and sending matches data
    res.send("Rating Match.");
});

// // GET route to view matches and rate them (for users)
// router.get('/rate', authMiddleware, matchController.viewAndRateMatches);
// // POST route to create and present a match (for hosts)
// router.post('/present', authMiddleware, matchController.presentMatch);
// // POST route to rate a match
// router.post('/:matchId/rate', authMiddleware, matchController.rateMatch);

export default router;