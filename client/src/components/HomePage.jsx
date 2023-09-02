import React from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {

    const user = useSelector((state) => state.auth.user);

    return (
        <div>
            {user ? (
                <div>
                <p>Welcome, {user.username}!</p>
                {/* Add the rest of your home page content here */}
                </div>
            ) : (
                <p>Please log in to access this page.</p>
            )}
        </div>
    );
    }

export default HomePage;