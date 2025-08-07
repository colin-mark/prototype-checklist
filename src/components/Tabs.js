import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'onboarding');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-controls">
          <label className="toggle-label">
            <input type="checkbox" className="toggle-checkbox" />
            <span className="toggle-text">Show only my tasks</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
