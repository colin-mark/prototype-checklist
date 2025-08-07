import React, { useState, useRef, useEffect } from 'react';
import './TaskActions.css';

const TaskActions = ({ task, categories, onEdit, onDelete, onDuplicate, onMove, onToggleStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowMoveMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 200 + window.scrollX // 200px is the min-width of dropdown
      });
    }
    
    setIsOpen(!isOpen);
    setShowMoveMenu(false);
  };

  const handleAction = (action, data = null) => {
    setIsOpen(false);
    setShowMoveMenu(false);
    
    switch (action) {
      case 'edit':
        onEdit(task);
        break;
      case 'duplicate':
        onDuplicate(task);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
          onDelete(task);
        }
        break;
      case 'move':
        onMove(task, data.categoryId);
        break;
      case 'toggle-status':
        onToggleStatus(task, data.status);
        break;
      default:
        break;
    }
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    
    if (!showMoveMenu) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 4
      });
    }
    
    setShowMoveMenu(!showMoveMenu);
  };

  const getStatusOptions = () => {
    const statuses = [
      { value: 'not-started', label: 'Not Started', icon: '⭕' },
      { value: 'in-progress', label: 'In Progress', icon: '🔄' },
      { value: 'completed', label: 'Completed', icon: '✅' }
    ];
    
    return statuses.filter(status => status.value !== task.status);
  };

  return (
    <div className="task-actions" ref={dropdownRef}>
      <button 
        ref={triggerRef}
        className="actions-trigger"
        onClick={handleToggleDropdown}
        aria-label="Task actions"
      >
        Actions ▼
      </button>
      
      {isOpen && (
        <div 
          className="actions-dropdown"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <button 
            className="action-item"
            onClick={() => handleAction('edit')}
          >
            <span className="action-icon">✏️</span>
            Edit Task
          </button>
          
          <button 
            className="action-item"
            onClick={() => handleAction('duplicate')}
          >
            <span className="action-icon">📋</span>
            Duplicate Task
          </button>
          
          <div className="action-item submenu-parent">
            <button 
              className="submenu-trigger"
              onClick={handleMoveClick}
            >
              <span className="action-icon">📁</span>
              Move to Category
              <span className="submenu-arrow">▶</span>
            </button>
            
            {showMoveMenu && (
              <div 
                className="submenu"
                style={{
                  top: `${submenuPosition.top}px`,
                  left: `${submenuPosition.left}px`
                }}
              >
                {categories
                  .filter(cat => cat.id !== task.categoryId)
                  .map(category => (
                    <button
                      key={category.id}
                      className="submenu-item"
                      onClick={() => handleAction('move', { categoryId: category.id })}
                    >
                      {category.title}
                    </button>
                  ))
                }
                {categories.filter(cat => cat.id !== task.categoryId).length === 0 && (
                  <div className="submenu-item disabled">
                    No other categories
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="action-divider"></div>
          
          <div className="action-group">
            <div className="action-group-label">Change Status</div>
            {getStatusOptions().map(status => (
              <button
                key={status.value}
                className="action-item status-action"
                onClick={() => handleAction('toggle-status', { status: status.value })}
              >
                <span className="action-icon">{status.icon}</span>
                {status.label}
              </button>
            ))}
          </div>
          
          <div className="action-divider"></div>
          
          <button 
            className="action-item danger"
            onClick={() => handleAction('delete')}
          >
            <span className="action-icon">🗑️</span>
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskActions;
