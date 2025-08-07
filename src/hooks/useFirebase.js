import { useState, useEffect } from 'react';
import { onAuthChange, signInAnonymous } from '../firebase/auth';
import { subscribeToCategories } from '../firebase/services';

export const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (user) => {
      console.log('Auth state changed:', user ? `User ID: ${user.uid}` : 'No user');
      setUser(user);
      setLoading(false);

      if (!user) {
        // Auto sign in anonymously for demo
        try {
          console.log('Signing in anonymously...');
          await signInAnonymous();
        } catch (error) {
          console.error('Sign in error:', error);
          setError(error.message);
          setLoading(false);
        }
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeCategories = null;

    if (user) {
      console.log('Setting up categories subscription for user:', user.uid);
      // Subscribe to categories updates
      unsubscribeCategories = subscribeToCategories(
        user.uid,
        (updatedCategories) => {
          console.log('Categories updated:', updatedCategories.length, 'categories');
          setCategories(updatedCategories);
        }
      );
    }

    return () => {
      if (unsubscribeCategories) {
        unsubscribeCategories();
      }
    };
  }, [user]);

  return {
    user,
    categories,
    loading,
    error
  };
};
