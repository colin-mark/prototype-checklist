import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Header from './components/Header';
import ChecklistSection from './components/ChecklistSection';
import CategoryManager from './components/CategoryManager';
import TaskBuilder from './components/TaskBuilder';
import TaskDetails from './components/TaskDetails';
import LoadingSpinner from './components/LoadingSpinner';
import { useFirebase } from './hooks/useFirebase';
import { 
  updateCategory, 
  toggleTaskCompletion, 
  reorderCategories, 
  addCategory, 
  deleteCategory,
  addTask,
  updateTask,
  deleteTask,
  duplicateTask,
  moveTask,
  updateTaskStatus
} from './firebase/services';
import { tabs, userData } from './data/mockData';
import './App.css';

function App() {
  const { user, categories: taskGroups, loading, error } = useFirebase();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showTaskBuilder, setShowTaskBuilder] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleManageCategories = () => {
    setShowCategoryManager(true);
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setSelectedCategoryId(taskGroups[0]?.id || null);
    setShowTaskBuilder(true);
  };

  const handleTaskAction = async (action, task, data = {}) => {
    if (!user) return;

    try {
      switch (action) {
        case 'edit':
          setEditingTask(task);
          setSelectedCategoryId(task.categoryId);
          setShowTaskBuilder(true);
          break;

        case 'delete':
          await deleteTask(user.uid, task.categoryId, task.id);
          break;

        case 'duplicate':
          await duplicateTask(user.uid, task.categoryId, task);
          break;

        case 'move':
          await moveTask(user.uid, task.categoryId, data.categoryId, task.id);
          break;

        case 'toggleStatus':
          await updateTaskStatus(user.uid, task.categoryId, task.id, data.status);
          break;

        default:
          console.warn('Unknown task action:', action);
      }
    } catch (error) {
      console.error(`Error with task action ${action}:`, error);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (!user) return;

    try {
      if (editingTask && taskData.id) {
        // Update existing task
        const { id, categoryId, ...updateData } = taskData;
        await updateTask(user.uid, categoryId, id, updateData);
      } else {
        // Create new task - remove any id field and extract categoryId
        const { id, categoryId, ...newTaskData } = taskData;
        await addTask(user.uid, categoryId, newTaskData);
      }
      
      setShowTaskBuilder(false);
      setEditingTask(null);
      setSelectedCategoryId(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCloseTaskBuilder = () => {
    setShowTaskBuilder(false);
    setEditingTask(null);
    setSelectedCategoryId(null);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleCloseTaskDetails = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  const handleUpdateTaskDetails = async (taskId, updates) => {
    if (!user || !selectedTask) return;

    try {
      await updateTask(user.uid, selectedTask.categoryId, taskId, updates);
      // Update the selected task state for immediate UI feedback
      setSelectedTask(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating task details:', error);
    }
  };

  const handleCommentClick = (task, comment) => {
    // Open the task details for the task that contains the clicked comment
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleSaveCategories = async (updatedCategories) => {
    if (!user) return;
    
    try {
      // Find categories that were deleted
      const currentCategoryIds = taskGroups.map(cat => cat.id);
      const updatedCategoryIds = updatedCategories.map(cat => cat.id).filter(id => !id.startsWith('category-'));
      const deletedCategoryIds = currentCategoryIds.filter(id => !updatedCategoryIds.includes(id));
      
      // Delete removed categories
      for (const deletedId of deletedCategoryIds) {
        await deleteCategory(user.uid, deletedId);
      }
      
      // Separate new categories from existing ones
      const existingCategories = updatedCategories.filter(cat => !cat.id.startsWith('category-'));
      const newCategories = updatedCategories.filter(cat => cat.id.startsWith('category-'));
      
      // Add new categories
      for (const newCat of newCategories) {
        const { id, tasks, ...categoryData } = newCat;
        await addCategory(user.uid, {
          ...categoryData,
          position: updatedCategories.indexOf(newCat)
        });
      }
      
      // Update existing categories (names and positions)
      for (const existingCat of existingCategories) {
        const originalCat = taskGroups.find(cat => cat.id === existingCat.id);
        const newPosition = updatedCategories.indexOf(existingCat);
        
        // Update if title or position changed
        if (originalCat.title !== existingCat.title || originalCat.position !== newPosition) {
          await updateCategory(user.uid, existingCat.id, {
            title: existingCat.title,
            position: newPosition
          });
        }
      }
      
      setShowCategoryManager(false);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const handleUpdateTaskGroups = async (updatedGroups) => {
    // This will be handled by real-time listeners
    // No need to manually update state
  };

  const handleToggleComplete = async (categoryId, taskId) => {
    if (!user) return;
    
    try {
      // Find the current task to get its completion status
      const category = taskGroups.find(cat => cat.id === categoryId);
      const task = category?.tasks.find(t => t.id === taskId);
      
      if (task) {
        await toggleTaskCompletion(user.uid, categoryId, taskId, !task.completed);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleQuickEdit = async (categoryId, newTitle) => {
    if (!user) return;
    
    try {
      await updateCategory(user.uid, categoryId, { title: newTitle });
    } catch (error) {
      console.error('Error updating category title:', error);
    }
  };

  const handleCloseCategoryManager = () => {
    setShowCategoryManager(false);
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <TopBar />
      <Header 
        userName={userData.name} 
        onManageCategories={handleManageCategories}
        onAddNewTask={handleAddNewTask}
      />
      <ChecklistSection 
        taskGroups={taskGroups} 
        tabs={tabs} 
        onUpdateTaskGroups={handleUpdateTaskGroups}
        onToggleComplete={handleToggleComplete}
        onQuickEdit={handleQuickEdit}
        onTaskAction={handleTaskAction}
        onTaskClick={handleTaskClick}
        onCommentClick={handleCommentClick}
      />
      
      {showCategoryManager && (
        <CategoryManager
          categories={taskGroups}
          onSave={handleSaveCategories}
          onClose={handleCloseCategoryManager}
        />
      )}
      
      {showTaskBuilder && (
        <TaskBuilder
          categories={taskGroups}
          editingTask={editingTask}
          editingCategoryId={selectedCategoryId}
          onSave={handleSaveTask}
          onClose={handleCloseTaskBuilder}
        />
      )}
      
      {showTaskDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          category={taskGroups.find(cat => cat.id === selectedTask.categoryId) || { title: 'Unknown Category', id: 'unknown' }}
          assigneeOptions={[
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
          ]}
          onUpdateTask={handleUpdateTaskDetails}
          onClose={handleCloseTaskDetails}
        />
      )}
    </div>
  );
}

export default App;
