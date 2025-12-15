# 🗄️ Firestore Database Setup

Your app now has **Firestore** integrated! It will save:

- ✅ User profiles (name, email, avatar, streak, hours)
- ✅ Focus goals
- ✅ Blocked apps list
- ✅ Completed sessions history
- ✅ Daily streaks

## Step 1: Enable Firestore

1. Go to: https://console.firebase.google.com/project/flutter-ai-playground-a8bfd/firestore

2. Click **"Create database"**

3. Select **Production mode** (we'll add security rules next)

4. Choose location: **us-central** (or closest to you)

5. Click **"Enable"**

## Step 2: Set Security Rules

1. Go to the **Rules** tab in Firestore

2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading user's sessions
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Users can manage their own blocklist
    match /blocklists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public leaderboard (optional - for future)
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 3: Test It!

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Sign in with Google

3. Complete a focus session

4. Check Firestore console - you'll see:
   - `users/{uid}` - Your profile
   - `users/{uid}/sessions/{id}` - Your completed sessions
   - `blocklists/{uid}` - Your blocked apps

## What Gets Saved Automatically:

### User Collection (`users/{uid}`)
```json
{
  "uid": "abc123...",
  "name": "Your Name",
  "email": "you@gmail.com",
  "avatar": "https://...",
  "streak": 5,
  "totalHours": 12.5,
  "goals": ["Study", "Work"],
  "focusLevel": "Focus Warrior",
  "lastSessionDate": "2025-12-13T10:30:00Z",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Sessions Sub-collection (`users/{uid}/sessions/{sessionId}`)
```json
{
  "durationMinutes": 25,
  "completedAt": Timestamp,
  "focusScore": 100,
  "createdAt": Timestamp
}
```

### Blocklists Collection (`blocklists/{uid}`)
```json
{
  "apps": [
    {
      "id": "1",
      "name": "Instagram",
      "isBlocked": true,
      "category": "social"
    }
  ],
  "updatedAt": Timestamp
}
```

## Features:

### ✅ Auto-Sync
- Every change to user data is automatically saved
- Loads data on login
- Works offline (changes sync when back online)

### ✅ Demo Mode Fallback
- If Firebase isn't configured, uses localStorage
- No errors - just works!

### ✅ Multi-Device Sync
- Sign in on phone → see your data
- Complete session on laptop → updates everywhere

## Viewing Your Data:

1. Go to Firestore console
2. Click on "Data" tab
3. Browse collections:
   - **users** → Your profile
   - **users/{yourId}/sessions** → Your sessions
   - **blocklists** → Your blocked apps

## Next Steps:

Want to add more features?
- 📊 **Analytics** - Track trends over time
- 🏆 **Leaderboard** - Compare with friends
- 📈 **Charts** - Visualize progress
- 🔔 **Notifications** - Daily reminders

All of this is already set up! Just enable Firestore and you're good to go! 🚀
