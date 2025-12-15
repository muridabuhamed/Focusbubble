# 🔐 Firebase Google Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **FocusBubble** (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on **Sign-in method** tab
4. Click on **Google** provider
5. Toggle **Enable**
6. Add your project support email
7. Click **Save**

## Step 3: Register Your App

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Give it a nickname: **FocusBubble Web**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 4: Add Firebase Credentials

1. Open `.env.local` file in your project
2. Replace the Firebase values with your actual credentials:

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=focusbubble-xxxxx.firebaseapp.com
FIREBASE_PROJECT_ID=focusbubble-xxxxx
FIREBASE_STORAGE_BUCKET=focusbubble-xxxxx.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

## Step 5: Add Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Go to **Authorized domains** tab
3. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `focusbubble.com`)
   - Your hosting domain if using Firebase Hosting

## Step 6: Test Google Sign-In

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app and click "Continue with Google"
3. You should see the Google account picker
4. Sign in with any Google account
5. User data will be saved automatically

## Step 7: Deploy to Production

1. Update `.env.production` with the same Firebase credentials
2. Build your app:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting service

## Troubleshooting

### Error: "auth/unauthorized-domain"
- Add your domain to Authorized domains in Firebase Console

### Error: "auth/popup-blocked"
- Allow popups in browser settings
- Or switch to redirect method in `firebase.ts`

### Error: "Firebase configuration not found"
- Make sure `.env.local` has all Firebase variables
- Restart the dev server after adding env variables

## Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Add `.env.local` to `.gitignore`
3. ✅ Use Firebase Security Rules for database
4. ✅ Enable App Check for production
5. ✅ Rotate API keys regularly

## Additional Features to Add

- Store user data in Firestore
- Add user profile pictures from Google
- Implement persistent sessions
- Add social features (leaderboard with real users)
