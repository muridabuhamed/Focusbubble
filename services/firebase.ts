import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

// Check if Firebase is configured
const isFirebaseConfigured = 
  process.env.FIREBASE_API_KEY && 
  process.env.FIREBASE_API_KEY !== 'your_firebase_api_key' &&
  !process.env.FIREBASE_API_KEY.includes('XXXX');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

// Initialize Firebase only if configured
let app: any = null;
let auth: any = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error);
  }
}

// Mock user data for demo mode
const mockGoogleUsers = [
  {
    uid: 'demo_user_1',
    name: 'Demo User',
    email: 'demo@focusbubble.com',
    avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0ea5e9&color=fff',
    username: '@demo',
    isVerified: true
  },
  {
    uid: 'demo_user_2',
    name: 'Test User',
    email: 'test@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=10b981&color=fff',
    username: '@testuser',
    isVerified: true
  }
];

// Sign in with Google
export const signInWithGoogle = async () => {
  // Demo mode - no Firebase configured
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    console.log('🎭 Running in DEMO MODE - Firebase not configured');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return random mock user
    const mockUser = mockGoogleUsers[Math.floor(Math.random() * mockGoogleUsers.length)];
    
    // Show a friendly message
    alert('🎭 DEMO MODE\n\nSigned in as: ' + mockUser.name + '\n\nTo use real Google Sign-In:\n1. Create Firebase project\n2. Add credentials to .env.local\n3. See FIREBASE_SETUP.md');
    
    return mockUser;
  }

  // Real Firebase authentication
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email || '',
      avatar: user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User'),
      username: '@' + (user.email?.split('@')[0] || 'user'),
      isVerified: user.emailVerified
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOutUser = async () => {
  if (!isFirebaseConfigured || !auth) {
    console.log('🎭 Demo mode sign out');
    return true;
  }
  
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }
  return auth.currentUser;
};

export { auth, googleProvider };
