# 🚀 Production Setup Guide

## Issue: Production showing mock data instead of Firebase data

Your production deployment is showing the original mock data because Firebase environment variables aren't configured in your production environment.

## 🔧 Solution: Configure Environment Variables

### For Netlify:
1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Go to "Site settings" > "Environment variables"
4. Add these environment variables:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyAZ3DCcmH3vLsm5ZGN-HCoGxU8FlESdpkA
REACT_APP_FIREBASE_AUTH_DOMAIN=colin-mark-website.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=colin-mark-website
REACT_APP_FIREBASE_STORAGE_BUCKET=colin-mark-website.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=414832445983
REACT_APP_FIREBASE_APP_ID=1:414832445983:web:389786e19e367e3b86e32a
REACT_APP_FIREBASE_MEASUREMENT_ID=G-JNN5K5KRXC
```

### For Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the same variables as above

### For Other Platforms:
Add the environment variables in your platform's settings using the same names and values.

## 🔄 After Adding Environment Variables:

1. **Redeploy your site** - Most platforms require a redeploy after adding environment variables
2. **Check the browser console** for Firebase initialization logs
3. **Verify connection** by checking if data loads from Firebase

## 🐛 Debugging Steps:

1. Open browser console on your production site
2. Look for these log messages:
   - "Initializing Firebase with config:"
   - "Firebase initialized successfully"
   - "Auth state changed:"
   - "Categories updated:"

3. If you see errors, they'll help identify the issue

## 📝 Local Development:

For local development, create a `.env.local` file in your project root with the same environment variables.

## ✅ Quick Fix for Immediate Deploy:

Since your Firebase config now has fallbacks, it should work even without environment variables. If you're still seeing issues:

1. Check Firebase Console > Authentication to ensure anonymous auth is enabled
2. Check Firestore Database > Rules to ensure they allow anonymous access
3. Verify your Firestore security rules match the ones in FIREBASE_SETUP.md

## 🔒 Security Note:

These Firebase config values are safe to expose in client-side code. Firebase security is handled by Firestore security rules, not by hiding config values.
