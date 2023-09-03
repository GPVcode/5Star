import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {

    console.log("Made it here")
    if (req.isAuthenticated()) {
      // User is authenticated, render the logged-in view
      res.render('logged-in-homepage', { user: req.user });
    } else {
      // User is not authenticated, redirect to the login page
      res.redirect('/login');
    }
  });;

router.get('/comments', (req, res) => {
    // Handle fetching and sending comments data
    res.send("Hello Comments.");
})

export default router;
