import React, { useMemo } from 'react';
import './CommentsFeed.css';

const CommentsFeed = ({ taskGroups, onCommentClick }) => {
  // Aggregate all comments from all tasks across all categories
  const allComments = useMemo(() => {
    const comments = [];
    
    taskGroups.forEach(category => {
      category.tasks.forEach(task => {
        if (task.taskComments && task.taskComments.length > 0) {
          task.taskComments.forEach(comment => {
            comments.push({
              ...comment,
              taskId: task.id,
              taskName: task.name,
              categoryId: category.id,
              categoryName: category.title,
              task: { ...task, categoryId: category.id }
            });
          });
        }
      });
    });
    
    // Sort by newest first (timestamp descending)
    return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [taskGroups]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleCommentClick = (comment) => {
    if (onCommentClick) {
      onCommentClick(comment.task, comment);
    }
  };

  if (allComments.length === 0) {
    return (
      <div className="comments-feed">
        <div className="comments-header">
          <h2>Comments & Notifications</h2>
          <p className="comments-subtitle">Stay updated on all task discussions</p>
        </div>
        <div className="no-comments-state">
          <div className="no-comments-icon">💬</div>
          <h3>No comments yet</h3>
          <p>Comments from tasks will appear here when team members start discussing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-feed">
      <div className="comments-header">
        <h2>Comments & Notifications</h2>
        <p className="comments-subtitle">
          {allComments.length} comment{allComments.length !== 1 ? 's' : ''} across all tasks
        </p>
      </div>

      <div className="comments-list">
        {allComments.map((comment, index) => (
          <div 
            key={`${comment.taskId}-${comment.id}-${index}`}
            className="comment-item"
            onClick={() => handleCommentClick(comment)}
          >
            <div className="comment-header">
              <div className="comment-author-info">
                <span className="comment-avatar">{comment.avatar}</span>
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                </div>
              </div>
              <div className="comment-task-info">
                <span className="task-category">{comment.categoryName}</span>
                <span className="task-name">{comment.taskName}</span>
              </div>
            </div>
            
            <div className="comment-content">
              <p className="comment-text">{comment.text}</p>
            </div>
            
            <div className="comment-actions">
              <button className="reply-hint">
                Click to view task and reply →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsFeed;
