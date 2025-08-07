import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  writeBatch,
  serverTimestamp,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from './config';

// Collection references
const CATEGORIES_COLLECTION = 'categories';
const TASKS_COLLECTION = 'tasks';

// ===== CATEGORY SERVICES =====

// Get all categories for a user
export const getCategories = async (userId) => {
  try {
    const categoriesRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}`);
    const q = query(categoriesRef, orderBy('position', 'asc'));
    const snapshot = await getDocs(q);
    
    const categories = [];
    for (const docSnap of snapshot.docs) {
      const categoryData = { id: docSnap.id, ...docSnap.data() };
      
      // Get tasks for this category
      const tasks = await getTasks(userId, docSnap.id);
      categoryData.tasks = tasks;
      
      categories.push(categoryData);
    }
    
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Listen to real-time category updates with task subscriptions
export const subscribeToCategories = (userId, callback) => {
  const categoriesRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}`);
  const q = query(categoriesRef, orderBy('position', 'asc'));
  
  let taskUnsubscribers = new Map(); // Track task subscriptions
  
  const unsubscribeCategories = onSnapshot(q, async (snapshot) => {
    try {
      // Clean up old task subscriptions
      taskUnsubscribers.forEach(unsubscribe => unsubscribe());
      taskUnsubscribers.clear();
      
      const categories = [];
      let pendingUpdates = snapshot.docs.length;
      
      if (pendingUpdates === 0) {
        callback([]);
        return;
      }
      
      const updateCategories = () => {
        // Sort categories by position and trigger callback
        categories.sort((a, b) => (a.position || 0) - (b.position || 0));
        callback([...categories]);
      };
      
      snapshot.docs.forEach((docSnap) => {
        const categoryData = { id: docSnap.id, ...docSnap.data(), tasks: [] };
        categories.push(categoryData);
        
        // Subscribe to tasks for this category
        const tasksRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}/${docSnap.id}/${TASKS_COLLECTION}`);
        const tasksQuery = query(tasksRef, orderBy('createdAt', 'asc'));
        
        const unsubscribeTasks = onSnapshot(tasksQuery, (tasksSnapshot) => {
          // Update tasks for this category
          const tasks = tasksSnapshot.docs.map(taskDoc => ({
            id: taskDoc.id,
            ...taskDoc.data()
          }));
          
          // Find and update the category in our array
          const categoryIndex = categories.findIndex(cat => cat.id === docSnap.id);
          if (categoryIndex !== -1) {
            categories[categoryIndex].tasks = tasks;
            updateCategories();
          }
        });
        
        taskUnsubscribers.set(docSnap.id, unsubscribeTasks);
        
        // Decrease pending count
        pendingUpdates--;
        if (pendingUpdates === 0) {
          // Initial load complete, but tasks might still be loading
          setTimeout(updateCategories, 100); // Small delay to let task subscriptions set up
        }
      });
    } catch (error) {
      console.error('Error in category subscription:', error);
    }
  });
  
  // Return a cleanup function that unsubscribes from everything
  return () => {
    unsubscribeCategories();
    taskUnsubscribers.forEach(unsubscribe => unsubscribe());
    taskUnsubscribers.clear();
  };
};

// Add a new category
export const addCategory = async (userId, categoryData) => {
  try {
    const categoriesRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}`);
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (userId, categoryId, updates) => {
  try {
    const categoryRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}`, categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category and all its tasks
export const deleteCategory = async (userId, categoryId) => {
  try {
    const batch = writeBatch(db);
    
    // Delete all tasks in the category
    const tasksRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryId}/${TASKS_COLLECTION}`);
    const tasksSnapshot = await getDocs(tasksRef);
    tasksSnapshot.docs.forEach(taskDoc => {
      batch.delete(taskDoc.ref);
    });
    
    // Delete the category
    const categoryRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}`, categoryId);
    batch.delete(categoryRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ===== TASK SERVICES =====

// Get all tasks for a category
export const getTasks = async (userId, categoryId) => {
  try {
    const tasksRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryId}/${TASKS_COLLECTION}`);
    const q = query(tasksRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Add a new task
export const addTask = async (userId, categoryId, taskData) => {
  try {
    const tasksRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryId}/${TASKS_COLLECTION}`);
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (userId, categoryId, taskId, updates) => {
  try {
    const taskRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryId}/${TASKS_COLLECTION}`, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (userId, categoryId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryId}/${TASKS_COLLECTION}`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (userId, categoryId, taskId, completed) => {
  try {
    const status = completed ? 'completed' : 'not-started';
    await updateTask(userId, categoryId, taskId, { 
      completed, 
      status 
    });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

// Duplicate a task
export const duplicateTask = async (userId, categoryId, taskData) => {
  try {
    const { id, ...taskWithoutId } = taskData;
    const duplicatedTask = {
      ...taskWithoutId,
      name: `${taskWithoutId.name} (Copy)`,
      completed: false,
      status: 'not-started'
    };
    
    return await addTask(userId, categoryId, duplicatedTask);
  } catch (error) {
    console.error('Error duplicating task:', error);
    throw error;
  }
};

// Move task to different category
export const moveTask = async (userId, fromCategoryId, toCategoryId, taskId) => {
  try {
    // Get the task data first
    const taskRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}/${fromCategoryId}/${TASKS_COLLECTION}`, taskId);
    const taskSnapshot = await getDoc(taskRef);
    
    if (!taskSnapshot.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = taskSnapshot.data();
    
    // Add task to new category
    await addTask(userId, toCategoryId, taskData);
    
    // Delete task from old category
    await deleteTask(userId, fromCategoryId, taskId);
  } catch (error) {
    console.error('Error moving task:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (userId, categoryId, taskId, status) => {
  try {
    const completed = status === 'completed';
    await updateTask(userId, categoryId, taskId, { 
      status,
      completed
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// ===== BATCH OPERATIONS =====

// Reorder categories
export const reorderCategories = async (userId, categories) => {
  try {
    const batch = writeBatch(db);
    
    categories.forEach((category, index) => {
      const categoryRef = doc(db, `users/${userId}/${CATEGORIES_COLLECTION}`, category.id);
      batch.update(categoryRef, { 
        position: index,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering categories:', error);
    throw error;
  }
};

// Initialize user with sample data (only if no data exists)
export const initializeUserData = async (userId) => {
  try {
    // Check if user already has data
    const categoriesRef = collection(db, `users/${userId}/${CATEGORIES_COLLECTION}`);
    const existingData = await getDocs(categoriesRef);
    
    if (!existingData.empty) {
      console.log('User already has data, skipping initialization');
      return; // User already has data, don't overwrite
    }
    
    const batch = writeBatch(db);
    
    // Sample categories with tasks (complete dataset from mockData.js)
    const sampleCategories = [
      {
        title: "Project Setup",
        position: 0,
        tasks: [
          {
            name: "Define Project Objectives",
            dueDate: "07/01/24",
            assignee: { name: "Alex", avatar: "👤" },
            comments: 6,
            status: "completed",
            completed: true
          },
          {
            name: "Gather Requirements",
            dueDate: "07/07/24",
            assignee: { name: "Sarah", avatar: "👤" },
            comments: 6,
            status: "completed",
            completed: true
          },
          {
            name: "Get Stakeholder Approval",
            dueDate: "07/07/24",
            assignee: { name: "Jordan", avatar: "👤" },
            comments: 2,
            status: "not-started",
            completed: false,
            isOverdue: true
          },
          {
            name: "Create Project Timeline",
            dueDate: "07/14/24",
            assignee: { name: "Alex", avatar: "👤" },
            comments: 0,
            status: "in-progress",
            completed: false
          },
          {
            name: "Allocate Resources",
            dueDate: "07/14/24",
            assignee: { name: "Taylor", avatar: "👤" },
            comments: 0,
            status: "not-started",
            completed: false
          }
        ]
      },
      {
        title: "Planning & Design",
        position: 1,
        tasks: [
          {
            name: "Complete Research Phase",
            dueDate: "07/01/24",
            assignee: { name: "Morgan", avatar: "👤" },
            comments: 3,
            status: "completed",
            completed: true
          },
          {
            name: "Create Wireframes",
            dueDate: "07/14/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "completed",
            completed: true
          },
          {
            name: "Design Mockups",
            dueDate: "07/14/24",
            assignee: { name: "Casey", avatar: "👤" },
            comments: 2,
            status: "completed",
            completed: true
          },
          {
            name: "Conduct User Testing",
            dueDate: "07/26/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "not-started",
            completed: false
          }
        ]
      },
      {
        title: "Implementation & Testing",
        position: 2,
        tasks: [
          {
            name: "Setup Development Environment",
            dueDate: "07/01/24",
            assignee: { name: "Riley", avatar: "👤" },
            comments: 3,
            status: "completed",
            completed: true
          },
          {
            name: "Build Core Features",
            dueDate: "07/14/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "completed",
            completed: true
          },
          {
            name: "Quality Assurance Testing",
            dueDate: "07/14/24",
            assignee: { name: "Sam", avatar: "👤" },
            comments: 2,
            status: "completed",
            completed: true
          },
          {
            name: "Performance Testing",
            dueDate: "07/26/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "not-started",
            completed: false
          },
          {
            name: "Security Review",
            dueDate: "07/14/24",
            assignee: { name: "Jamie", avatar: "👤" },
            comments: 0,
            status: "not-started",
            completed: false
          },
          {
            name: "Get Final Approval",
            dueDate: "07/26/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "not-started",
            completed: false
          },
          {
            name: "Complete Documentation",
            dueDate: "07/14/24",
            assignee: { name: "Pat", avatar: "👤" },
            comments: 0,
            status: "not-started",
            completed: false
          },
          {
            name: "Create Training Materials",
            dueDate: "07/26/24",
            assignee: { name: "Team", avatar: "👥" },
            comments: 0,
            status: "not-started",
            completed: false
          },
          {
            name: "Implement Backup Strategy",
            dueDate: "07/14/24",
            assignee: { name: "Avery", avatar: "👤" },
            comments: 0,
            status: "not-started",
            completed: false
          }
        ]
      },
      {
        title: "Deployment",
        position: 3,
        tasks: []
      },
      {
        title: "Launch & Go-Live",
        position: 4,
        tasks: []
      },
      {
        title: "Post-Launch Support",
        position: 5,
        tasks: []
      }
    ];
    
    // Add categories and their tasks
    for (const categoryData of sampleCategories) {
      const { tasks, ...category } = categoryData;
      
      // Add category
      const categoryRef = doc(collection(db, `users/${userId}/${CATEGORIES_COLLECTION}`));
      batch.set(categoryRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Add tasks for this category
      tasks.forEach(task => {
        const taskRef = doc(collection(db, `users/${userId}/${CATEGORIES_COLLECTION}/${categoryRef.id}/${TASKS_COLLECTION}`));
        batch.set(taskRef, {
          ...task,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};
