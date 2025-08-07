import React, { useState } from 'react';
import TaskRow from './TaskRow';
import './TaskGroup.css';

const TaskGroup = ({ group, categories, onToggleComplete, onQuickEdit, onTaskAction, onTaskClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(group.title);
  
  const completedTasks = group.tasks.filter(task => task.completed).length;
  const totalTasks = group.tasks.length;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleComplete = (taskId) => {
    if (onToggleComplete) {
      onToggleComplete(group.id, taskId);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onQuickEdit && editTitle.trim() !== group.title) {
      onQuickEdit(group.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(group.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="task-group">
      <div className="task-group-header" onClick={!isEditing ? toggleExpanded : undefined}>
        <div className="group-header-content">
          <div className="expand-icon">
            {isExpanded ? '⌄' : '▶'}
          </div>
          {isEditing ? (
            <div className="edit-title-container">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveEdit}
                className="edit-title-input"
                autoFocus
              />
            </div>
          ) : (
            <h3 className="group-title">{group.title}</h3>
          )}
          <div className="group-actions">
            {!isEditing && (
              <button 
                className="edit-category-btn"
                onClick={handleEditClick}
                title="Edit category name"
              >
                ✏️
              </button>
            )}
            <div className="group-progress">
              {completedTasks}/{totalTasks} Tasks
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="task-group-content">
          {totalTasks > 0 && (
            <div className="task-header">
              <div className="header-grid">
                <div className="header-cell"></div>
                <div className="header-cell">Name ▲</div>
                <div className="header-cell">Due Date ▲</div>
                <div className="header-cell">Assignee</div>
                <div className="header-cell">Comments</div>
                <div className="header-cell">Status</div>
                <div className="header-cell"></div>
              </div>
            </div>
          )}
          
          <div className="task-list">
            {group.tasks.map(task => (
              <TaskRow 
                key={task.id} 
                task={{ ...task, categoryId: group.id }}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onTaskAction={onTaskAction}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskGroup;
