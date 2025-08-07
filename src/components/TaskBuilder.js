import React, { useState } from 'react';
import './TaskBuilder.css';

const TaskBuilder = ({ categories, onSave, onClose, editingTask = null, editingCategoryId = null }) => {
  const [taskData, setTaskData] = useState({
    name: editingTask?.name || '',
    dueDate: editingTask?.dueDate || '',
    assignee: editingTask?.assignee?.name || 'Alex',
    comments: editingTask?.comments || 0,
    status: editingTask?.status || 'not-started',
    completed: editingTask?.completed || false,
    categoryId: editingCategoryId || editingTask?.categoryId || categories[0]?.id || ''
  });

  const [errors, setErrors] = useState({});

  const assigneeOptions = [
    { name: 'Alex', avatar: '👤' },
    { name: 'Sarah', avatar: '👤' },
    { name: 'Jordan', avatar: '👤' },
    { name: 'Taylor', avatar: '👤' },
    { name: 'Morgan', avatar: '👤' },
    { name: 'Casey', avatar: '👤' },
    { name: 'Riley', avatar: '👤' },
    { name: 'Sam', avatar: '👤' },
    { name: 'Jamie', avatar: '👤' },
    { name: 'Pat', avatar: '👤' },
    { name: 'Avery', avatar: '👤' },
    { name: 'Team', avatar: '👥' }
  ];

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: '#fee2e2' },
    { value: 'in-progress', label: 'In Progress', color: '#fef3c7' },
    { value: 'completed', label: 'Completed', color: '#d1fae5' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!taskData.name.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (!taskData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!taskData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleStatusChange = (status) => {
    setTaskData(prev => ({
      ...prev,
      status,
      completed: status === 'completed'
    }));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const assigneeData = assigneeOptions.find(a => a.name === taskData.assignee);
    
    const newTask = {
      ...taskData,
      assignee: assigneeData
    };

    // Only include ID if editing an existing task
    if (editingTask?.id) {
      newTask.id = editingTask.id;
    }

    onSave(newTask);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  return (
    <div className="task-builder-overlay">
      <div className="task-builder-modal">
        <div className="task-builder-header">
          <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="task-builder-content">
          <div className="form-section">
            <label className="form-label">
              Task Name *
              <input
                type="text"
                value={taskData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                autoFocus
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </label>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">
                Category *
                <select
                  value={taskData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={`form-select ${errors.categoryId ? 'error' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
              </label>
            </div>

            <div className="form-section">
              <label className="form-label">
                Due Date *
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`form-input ${errors.dueDate ? 'error' : ''}`}
                />
                {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">
                Assignee
                <select
                  value={taskData.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  className="form-select"
                >
                  {assigneeOptions.map(assignee => (
                    <option key={assignee.name} value={assignee.name}>
                      {assignee.name} {assignee.avatar}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-section">
              <label className="form-label">
                Status
                <div className="status-options">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`status-option ${taskData.status === option.value ? 'active' : ''}`}
                      style={{ backgroundColor: taskData.status === option.value ? option.color : '#f3f4f6' }}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Priority
              <select
                value={taskData.priority || 'medium'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </label>
          </div>

          <div className="form-section">
            <label className="form-label">
              Description
              <textarea
                value={taskData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add task description (optional)"
                className="form-textarea"
                rows="3"
              />
            </label>
          </div>
        </div>

        <div className="task-builder-footer">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} className="save-btn">
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskBuilder;
