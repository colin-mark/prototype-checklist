import React, { useState } from 'react';
import './CategoryManager.css';

const CategoryManager = ({ categories, onSave, onClose }) => {
  const [editableCategories, setEditableCategories] = useState(
    categories.map(cat => ({ ...cat }))
  );
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCategoryNameChange = (id, newName) => {
    setEditableCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, title: newName } : cat
      )
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `category-${Date.now()}`,
        title: newCategoryName.trim(),
        tasks: []
      };
      setEditableCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (id) => {
    setEditableCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newCategories = [...editableCategories];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      setEditableCategories(newCategories);
    }
  };

  const handleMoveDown = (index) => {
    if (index < editableCategories.length - 1) {
      const newCategories = [...editableCategories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      setEditableCategories(newCategories);
    }
  };

  const handleSave = () => {
    onSave(editableCategories);
    onClose();
  };

  return (
    <div className="category-manager-overlay">
      <div className="category-manager-modal">
        <div className="category-manager-header">
          <h2>Manage Task Categories</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="category-manager-content">
          <div className="add-category-section">
            <h3>Add New Category</h3>
            <div className="add-category-form">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="category-input"
              />
              <button onClick={handleAddCategory} className="add-category-btn">
                Add Category
              </button>
            </div>
          </div>

          <div className="existing-categories-section">
            <h3>Existing Categories</h3>
            <div className="categories-list">
              {editableCategories.map((category, index) => (
                <div key={category.id} className="category-item">
                  <div className="category-item-content">
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                      className="category-name-input"
                    />
                    <div className="category-task-count">
                      {category.tasks.length} task{category.tasks.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="category-actions">
                    <button 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="move-btn"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === editableCategories.length - 1}
                      className="move-btn"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-btn"
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="category-manager-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
