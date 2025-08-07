import React, { useState } from 'react';
import Tabs from './Tabs';
import TaskGroup from './TaskGroup';
import CommentsFeed from './CommentsFeed';
import './ChecklistSection.css';

const ChecklistSection = ({ taskGroups, tabs, onUpdateTaskGroups, onToggleComplete, onQuickEdit, onTaskAction, onTaskClick, onCommentClick }) => {
  const [activeTab, setActiveTab] = useState('onboarding');

  const handleToggleComplete = (groupId, taskId) => {
    if (onToggleComplete) {
      onToggleComplete(groupId, taskId);
    }
  };

  const handleQuickEdit = (groupId, newTitle) => {
    if (onQuickEdit) {
      onQuickEdit(groupId, newTitle);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="checklist-section">
      <Tabs tabs={tabs} onTabChange={handleTabChange} />
      
      <div className="checklist-content">
        {activeTab === 'onboarding' && (
          <div className="task-groups">
            {taskGroups.map(group => (
              <TaskGroup 
                key={group.id} 
                group={group}
                categories={taskGroups}
                onToggleComplete={handleToggleComplete}
                onQuickEdit={handleQuickEdit}
                onTaskAction={onTaskAction}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        )}
        
        {activeTab === 'comments' && (
          <CommentsFeed 
            taskGroups={taskGroups}
            onCommentClick={onCommentClick}
          />
        )}
      </div>
    </div>
  );
};

export default ChecklistSection;
