import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from './features/auth/LoginPage.js';
import Register from './features/auth/RegisterPage.js';

const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>

  );
}

export default App;
