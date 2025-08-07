import React from 'react';
import TaskActions from './TaskActions';
import './TaskRow.css';

const TaskRow = ({ task, categories, onToggleComplete, onTaskAction, onTaskClick }) => {
  const getStatusDisplay = (status, isOverdue) => {
    if (isOverdue) return { text: 'Not Started', className: 'status-overdue' };
    
    switch (status) {
      case 'completed':
        return { text: 'Completed', className: 'status-completed' };
      case 'in-progress':
        return { text: 'In Progress', className: 'status-in-progress' };
      case 'not-started':
        return { text: 'Not Started', className: 'status-not-started' };
      default:
        return { text: 'Not Started', className: 'status-not-started' };
    }
  };

  const statusDisplay = getStatusDisplay(task.status, task.isOverdue);

  const handleCheckboxChange = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  return (
    <div className="task-row">
      <div className="task-main-content">
        <div className="task-checkbox-container">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
          />
        </div>
        
        <div className="task-info">
          <button 
            className={`task-name-button ${task.completed ? 'completed' : ''}`}
            onClick={() => onTaskClick && onTaskClick(task)}
            title="Click to view task details"
          >
            {task.name}
          </button>
        </div>
        
        <div className="task-due-date">
          {task.dueDate}
        </div>
        
        <div className="task-assignee">
          <div className="assignee-avatar">
            {task.assignee.avatar}
          </div>
          {task.assignee.name === 'Team' && (
            <div className="assignee-avatar secondary">
              👤
            </div>
          )}
        </div>
        
        <div className="task-comments">
          <span className={task.comments > 0 ? 'has-comments' : 'no-comments'}>
            {task.comments || 0} Comment{(task.comments || 0) !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="task-status">
          <span className={`status-badge ${statusDisplay.className}`}>
            {statusDisplay.text}
          </span>
        </div>
        
        <div className="task-actions">
          <TaskActions
            task={task}
            categories={categories}
            onEdit={(task) => onTaskAction('edit', task)}
            onDelete={(task) => onTaskAction('delete', task)}
            onDuplicate={(task) => onTaskAction('duplicate', task)}
            onMove={(task, categoryId) => onTaskAction('move', task, { categoryId })}
            onToggleStatus={(task, status) => onTaskAction('toggleStatus', task, { status })}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
