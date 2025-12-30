# Firebase Setup Instructions

To enable user authentication and result saving, you need to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Click **Save**

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose a location for your database
5. Click **Enable**

## 4. Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the web icon (`</>`) to add a web app
4. Register your app (you can skip hosting setup)
5. Copy the `firebaseConfig` object

## 5. Update Your Config File

Open `src/firebase/config.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## 6. Set Up Firestore Security Rules (Optional but Recommended)

In Firestore, go to **Rules** and update them:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /results/{resultId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Test the Setup

1. Start your app: `npm start`
2. Click the settings gear icon
3. Click "Sign In / Sign Up"
4. Create an account or sign in
5. Play a game and verify results are saved

## Troubleshooting

- **"Firebase: Error (auth/invalid-api-key)"**: Make sure you copied the correct API key
- **"Permission denied"**: Check your Firestore security rules
- **Results not saving**: Check the browser console for errors

