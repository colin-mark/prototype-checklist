import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <nav className="top-bar">
      <div className="nav-container">
        <div className="nav-tabs">
          <button className="nav-tab active">Home</button>
        </div>
        <div className="user-profile">
          <div className="notification-icon">🔔</div>
          <div className="user-avatar">👤</div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
