import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import Sidebar from './Components/sidebar';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Sidebar />
      {/* Header with Login/Sign Up buttons */}
      <header className="homepage-header">
        <div className="header-buttons">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/signup" className="btn signup-btn">Sign Up</Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="homepage-content">
        <h1 className="homepage-title">UNI Connect</h1>
        <p className="homepage-tagline">Connect Our university seamlessly.</p>
        <p className="homepage-description">
          Welcome to UNI Connect – your one-stop platform to engage with fellow students, faculty, and staff. Whether you’re looking to collaborate on projects, join dynamic discussions, or stay updated on campus events, UNI Connect provides a seamless digital experience for our university community. Join us today and be a part of the revolution in campus connectivity!
        </p>
      </div>
    </div>
  );
};

export default HomePage;