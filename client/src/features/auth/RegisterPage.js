import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { register } from "./authSlice";
import { Link, useNavigate } from 'react-router-dom';
import { clearError } from './authSlice';
import './Login.css';

const Register = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    const navigate = useNavigate();

    const [ registrationSuccess, setRegistrationSuccess ] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { username, email, password } = formData;
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try{
            dispatch(register({ username, email, password }));
            setRegistrationSuccess(true);
            navigate('/login');
        } catch (error){
            console.error('Error: ', error)
        }
    }

    const handleLoginClick = () => {
        dispatch(clearError());
    }

    return (
        <div className="login-container">
            <form onSubmit={handleRegister} className="login-form">
                <div className="form-logo">
                    <img src="logo goes here" alt="Logo" />
                </div>
                <h2 className="form-header">Register an account</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleInputChange}
                        className="form-input
                        required"
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
                    {isLoading ? "Registering..." : "Register"}
                </button>

                {registrationSuccess && <p className="success-message">Registration successful! You can now log in.</p>}

                {error && <p className="error-message">{error}</p>}
                {!isLoading && (
                    <div className="register-section">
                        <p>Already registered?</p>
                        <Link to="/login" className="register-link" onClick={handleLoginClick}>
                            Login
                        </Link>
                    </div>
                )}
            </form>
        </div>
    )
}


export default Register;