import React, { useState } from 'react';
import './TaskDetails.css';

const TaskDetails = ({ task, category, assigneeOptions, onUpdateTask, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: '#fee2e2', textColor: '#991b1b' },
    { value: 'in-progress', label: 'In Progress', color: '#fef3c7', textColor: '#92400e' },
    { value: 'completed', label: 'Completed', color: '#d1fae5', textColor: '#065f46' }
  ];

  const priorityDisplay = {
    low: { label: '🟢 Low Priority', color: '#d1fae5' },
    medium: { label: '🟡 Medium Priority', color: '#fef3c7' },
    high: { label: '🔴 High Priority', color: '#fee2e2' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleStatusChange = (newStatus) => {
    const completed = newStatus === 'completed';
    onUpdateTask(task.id, { status: newStatus, completed });
  };

  const handleAssigneeChange = (newAssignee) => {
    const assigneeData = assigneeOptions.find(a => a.name === newAssignee);
    onUpdateTask(task.id, { assignee: assigneeData });
  };

  const handleCompletionToggle = () => {
    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'completed' : 'not-started';
    onUpdateTask(task.id, { completed: newCompleted, status: newStatus });
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      // Add comment to task
      const updatedComments = [
        ...(task.taskComments || []),
        {
          id: Date.now().toString(),
          text: newComment.trim(),
          author: 'Current User',
          timestamp: new Date().toISOString(),
          avatar: '👤'
        }
      ];

      await onUpdateTask(task.id, { 
        taskComments: updatedComments,
        comments: updatedComments.length 
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleCommentSubmit();
    }
  };

  const currentStatus = statusOptions.find(s => s.value === task.status) || statusOptions[0];
  const currentPriority = priorityDisplay[task.priority] || priorityDisplay.medium;

  return (
    <div className="task-details-overlay">
      <div className="task-details-modal">
        <div className="task-details-header">
          <div className="header-content">
            <h1 className="task-title">{task.name}</h1>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="task-meta">
            <span className="category-badge">{category?.title || 'Unknown Category'}</span>
            <div 
              className="priority-badge"
              style={{ backgroundColor: currentPriority.color }}
            >
              {currentPriority.label}
            </div>
          </div>
        </div>

        <div className="task-details-content">
          <div className="task-info-grid">
            <div className="info-section">
              <h3>Task Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Due Date</label>
                  <div className="info-value">
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
                  </div>
                </div>
                
                <div className="info-item">
                  <label>Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="status-select"
                    style={{ 
                      backgroundColor: currentStatus.color,
                      color: currentStatus.textColor 
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="info-item">
                  <label>Assignee</label>
                  <select
                    value={task.assignee?.name || 'Alex'}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="assignee-select"
                  >
                    {assigneeOptions.map(assignee => (
                      <option key={assignee.name} value={assignee.name}>
                        {assignee.avatar} {assignee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="info-item">
                  <label>Completion</label>
                  <label className="completion-toggle">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={handleCompletionToggle}
                      className="completion-checkbox"
                    />
                    <span className="completion-text">
                      {task.completed ? 'Task Completed' : 'Mark as Complete'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {task.description && (
              <div className="description-section">
                <h3>Description</h3>
                <div className="description-content">
                  {task.description}
                </div>
              </div>
            )}

            <div className="comments-section">
              <h3>Comments ({task.comments || 0})</h3>
              
              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a comment... (Cmd+Enter to submit)"
                  className="comment-input"
                  rows="3"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="submit-comment-btn"
                >
                  {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </div>

              <div className="comments-list">
                {(task.taskComments || []).length > 0 ? (
                  task.taskComments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.avatar} {comment.author}
                        </span>
                        <span className="comment-time">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-comments">
                    No comments yet. Be the first to add one!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="task-details-footer">
          <div className="footer-info">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <button onClick={onClose} className="close-footer-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
