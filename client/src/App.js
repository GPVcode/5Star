import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from './features/auth/LoginPage.js';
import Register from './features/auth/RegisterPage.js';
import GoogleOAuthCallback from './features/auth/GoogleOAuthCallback.js'
import MatchList from './components/MatchList/MatchList.jsx';
import EventList from './components/EventList/EventList.jsx'
const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/google/callback" element={<GoogleOAuthCallback />} />
        <Route path="/events" element={<EventList />} /> {/* Display a list of events */}
        <Route path="/events/:eventId" element={<MatchList />} /> {/* Display matches for a selected event */}
      </Routes>
    </Router>

  );
}

export default App;
