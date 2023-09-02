import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login } from "./authSlice";
import { Link, useNavigate } from 'react-router-dom';
import { clearError } from './authSlice';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    
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
            if(isAuthenticated) {
                navigate('/');
            }
        } catch (error){
            console.error('Error: ', error)
        }
    }

    const handleRegisterClick = () => {
        dispatch(clearError());
    }

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
                <div className="forgot-password">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                {!isLoading && (
                    <div className="register-section">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="register-link" onClick={handleRegisterClick}>
                            Register here
                        </Link>
                    </div>
                )}
            </form>
           
        </div>
    )
}


export default Login;