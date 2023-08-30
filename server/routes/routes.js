import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello Wrestling World.");
});

router.get('/comments', (req, res) => {
    // Handle fetching and sending comments data
    res.send("Hello Comments.");
})

export default router;
