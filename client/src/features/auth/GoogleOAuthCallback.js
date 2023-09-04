// GoogleOAuthCallback.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { googleSignIn } from './authSlice'; // Import your Google OAuth action

const GoogleOAuthCallback = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the current URL contains the OAuth callback code
        if (location.search.includes('code=')) {
            // Handle the OAuth callback by dispatching the googleSignIn action
            dispatch(googleSignIn())
                .unwrap()
                .then(() => {
                    // Redirect to the homepage or another route after successful OAuth
                    navigate('/');
                })
                .catch((error) => {
                    // Handle errors if needed
                    console.error('Google OAuth error:', error);
                    // Redirect to an error page or login page
                    navigate('/login');
                });
        }
    }, [dispatch, location.search, navigate]);

    // Render loading or redirecting message while handling OAuth callback
    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export default GoogleOAuthCallback;