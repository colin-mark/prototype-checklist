# Firebase Setup Guide

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "checklist-builder")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔧 Step 2: Set up Firestore Database

1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

## 🔐 Step 3: Enable Authentication

1. Click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" sign-in (for demo purposes)
5. Click "Save"

## ⚙️ Step 4: Get Firebase Configuration

1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the "</>" (Web) icon
5. Register your app with a nickname
6. Copy the configuration object

## 📝 Step 5: Update Your App Configuration

Replace the placeholder values in `src/firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 🔒 Step 6: Set up Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Step 7: Test Your Setup

1. Start your development server: `npm start`
2. The app should automatically sign in anonymously
3. You should see sample categories and tasks loaded
4. Check the Firestore Database in Firebase Console to see the data

## 📊 Firestore Data Structure

Your data will be organized as:

```
users/
  └── {userId}/
      └── categories/
          └── {categoryId}/
              ├── title: "Project Setup"
              ├── position: 0
              ├── createdAt: timestamp
              └── tasks/
                  └── {taskId}/
                      ├── name: "Define Project Objectives"
                      ├── completed: true
                      ├── status: "completed"
                      ├── dueDate: "2024-07-01"
                      ├── assignee: {...}
                      └── comments: 6
```

## 🛠️ Available Features

- ✅ Real-time data sync
- ✅ Anonymous authentication (auto sign-in)
- ✅ Category management (add, edit, delete, reorder)
- ✅ Task completion toggling
- ✅ Automatic sample data initialization
- ✅ Offline support (coming with Firestore)

## 🔄 Next Steps

1. **Add proper authentication**: Replace anonymous auth with email/password or OAuth
2. **Add task creation**: Implement adding new tasks to categories
3. **Add comments**: Build the comments system for tasks
4. **Add file attachments**: Use Firebase Storage for file uploads
5. **Add notifications**: Use Firebase Cloud Messaging for push notifications
6. **Add sharing**: Allow users to share checklists with team members

## 🚨 Important Notes

- **Test Mode**: Your Firestore is currently in test mode. Remember to update security rules for production
- **Anonymous Auth**: Users will lose data if they clear browser storage. Consider implementing proper auth
- **Billing**: Firebase has a generous free tier, but monitor usage as you scale

## 📞 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
