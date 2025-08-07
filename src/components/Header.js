import React from 'react';
import './Header.css';

const Header = ({ userName = "Kelsie", onManageCategories, onAddNewTask }) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="greeting-section">
          <h1 className="greeting">Hi, {userName} 👋</h1>
          <p className="subtext">Organize your work and improve your productivity with our onboarding flow.</p>
        </div>
        <div className="header-actions">
          <button className="manage-categories-btn" onClick={onManageCategories}>
            ⚙️ Manage Categories
          </button>
          <button className="add-task-btn" onClick={onAddNewTask}>
            + Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
