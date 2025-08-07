import { 
  signInAnonymously, 
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './config';
import { initializeUserData } from './services';

// Sign in anonymously (for demo purposes)
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    
    // Initialize user data if this is a new user
    if (result.user) {
      await initializeUserData(result.user.uid);
    }
    
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen to authentication state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
