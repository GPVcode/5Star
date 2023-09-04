import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from "./authSlice";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            dispatch(login({ email, password }));
        } catch (error){
            console.error('Error: ', error)
        }
    }

    const handleRegisterClick = () => {
        dispatch(clearError());
    }

    const handleGoogleSignIn = () => {
        // Redirect the user to your server's Google OAuth route
        window.location.href = 'http://localhost:2239/oauth/google';
    };

    // Check if the user is authenticated and redirect
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);



    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-logo">
                    <img src="logo goes here" alt="Logo" />
                </div>
                <h2 className="form-header">Sign into your account</h2>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                {isAuthenticated && (
                    <div className="success-message">
                        Login successful!
                    </div>
                )}
                
                {error && <p className="error-message">{error}</p>}
                {!isLoading && (
                    <div className="register-section">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="register-link" onClick={handleRegisterClick}>
                            Register here
                        </Link>
                    </div>
                )}
                <div className="forgot-password">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>

                 {/* Add the Google sign-in button */}
                 <button type="button" className="google-sign-in-button" onClick={handleGoogleSignIn}>
                    Sign in with Google
                </button>
            </form>
           
        </div>
    )
}


export default Login;