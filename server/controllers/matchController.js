import Match from '../models/Match.js';

const matchController = {

    // Controller method to create and present a match (for hosts)
    async getMatches(req, res) {
        try {
          // Fetch all matches from the database
          const matches = await Match.find() 
            .populate('host', 'username') // Populate host's username
            .populate('likes', 'userId')   // Populate likes' userId
            .populate('comments', 'userId text createdAt') // Populate comments' userId, text, createdAt
            .populate('ratings', 'userId rating createdAt'); // Populate ratings' userId, rating, createdAt
            
        res.json(matches);
        
        } catch (error) {
          console.error('Error fetching matches:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    // Controller method to create and present a match (for hosts)
    async presentMatch(req, res) {
        const { title, description, media } = req.body;
        const hostId = req.user.id; // Assuming the authenticated user is the host

        try {
        const newMatch = new Match({
            title,
            description,
            media,
            host: hostId,
        });

        await newMatch.save();

        res.json({ message: 'Match presented successfully' });
        } catch (error) {
        console.error('Error presenting match:', error);
        res.status(500).json({ message: 'Error presenting match' });
        }
    },

    // Controller method to rate a match
    async rateMatch(req, res) {
        const { matchId } = req.params;
        const { rating } = req.body;

        try {
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Here you can add the user's rating to the match's ratings array
        match.ratings.push({ userId: req.user.id, rating });
        await match.save();

        res.json({ message: 'Match rated successfully' });
        } catch (error) {
        console.error('Error rating match:', error);
        res.status(500).json({ message: 'Error rating match' });
        }
    }
}

export default matchController;