import React,{ useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const HomePage = () => {

    const user = useSelector((state) => state.auth.user);    
    const dispatch = useDispatch(); // Get access to the Redux dispatch function

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            dispatch(setUser(storedUser));
        }
    }, [dispatch]);
    
    console.log('user: ', user)
    return (
        <div>
            {user && user.username ? ( // Check if user and user.username are not null or undefined
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