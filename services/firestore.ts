import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth } from './firebase';
import { User, BlockApp } from '../types';

// Get Firestore instance
let db: any = null;

try {
  if (auth) {
    db = getFirestore();
    console.log('✅ Firestore initialized');
  }
} catch (error) {
  console.warn('⚠️ Firestore not available:', error);
}

// User data structure in Firestore
interface UserData {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  focusLevel: string;
  streak: number;
  totalHours: number;
  goals: string[];
  lastSessionDate?: string;
  isPro: boolean;
  isVerified: boolean;
  createdAt: any;
  updatedAt: any;
}

// Save or update user data
export const saveUserData = async (user: User, uid: string): Promise<boolean> => {
  if (!db) {
    console.log('💾 Demo mode - data saved to localStorage only');
    localStorage.setItem('focusbubble_user', JSON.stringify(user));
    return false;
  }

  try {
    const userRef = doc(db, 'users', uid);
    
    const userData: UserData = {
      uid,
      name: user.name,
      username: user.username || '',
      email: user.email,
      avatar: user.avatar,
      focusLevel: user.focusLevel,
      streak: user.streak,
      totalHours: user.totalHours,
      goals: user.goals,
      lastSessionDate: user.lastSessionDate,
      isPro: user.isPro || false,
      isVerified: user.isVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, userData, { merge: true });
    console.log('✅ User data saved to Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    // Fallback to localStorage
    localStorage.setItem('focusbubble_user', JSON.stringify(user));
    return false;
  }
};

// Load user data from Firestore
export const loadUserData = async (uid: string): Promise<User | null> => {
  if (!db) {
    console.log('💾 Demo mode - loading from localStorage');
    const stored = localStorage.getItem('focusbubble_user');
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as UserData;
      console.log('✅ User data loaded from Firestore');
      
      return {
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        focusLevel: data.focusLevel,
        streak: data.streak,
        totalHours: data.totalHours,
        goals: data.goals || [],
        lastSessionDate: data.lastSessionDate,
        isPro: data.isPro,
        isVerified: data.isVerified,
      };
    }
    
    console.log('ℹ️ No user data found in Firestore');
    return null;
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    return null;
  }
};

// Update specific user fields
export const updateUserField = async (
  uid: string, 
  field: string, 
  value: any
): Promise<boolean> => {
  if (!db) {
    console.log('💾 Demo mode - updating localStorage');
    const stored = localStorage.getItem('focusbubble_user');
    if (stored) {
      const user = JSON.parse(stored);
      user[field] = value;
      localStorage.setItem('focusbubble_user', JSON.stringify(user));
    }
    return false;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      [field]: value,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ Updated ${field} in Firestore`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${field}:`, error);
    return false;
  }
};

// Save user's blocked apps
export const saveBlockedApps = async (uid: string, apps: BlockApp[]): Promise<boolean> => {
  if (!db) {
    localStorage.setItem('focusbubble_blocklist', JSON.stringify(apps));
    return false;
  }

  try {
    const appsRef = doc(db, 'blocklists', uid);
    await setDoc(appsRef, {
      apps,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Blocked apps saved to Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error saving blocked apps:', error);
    localStorage.setItem('focusbubble_blocklist', JSON.stringify(apps));
    return false;
  }
};

// Load user's blocked apps
export const loadBlockedApps = async (uid: string): Promise<BlockApp[] | null> => {
  if (!db) {
    const stored = localStorage.getItem('focusbubble_blocklist');
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const appsRef = doc(db, 'blocklists', uid);
    const appsSnap = await getDoc(appsRef);

    if (appsSnap.exists()) {
      const data = appsSnap.data();
      console.log('✅ Blocked apps loaded from Firestore');
      return data.apps;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error loading blocked apps:', error);
    return null;
  }
};

// Save a completed session
export const saveSession = async (
  uid: string,
  sessionData: {
    durationMinutes: number;
    completedAt: Date;
    focusScore: number;
  }
): Promise<boolean> => {
  if (!db) {
    console.log('💾 Demo mode - session not saved to database');
    return false;
  }

  try {
    const sessionsRef = collection(db, 'users', uid, 'sessions');
    const sessionDoc = doc(sessionsRef);
    
    await setDoc(sessionDoc, {
      ...sessionData,
      completedAt: Timestamp.fromDate(sessionData.completedAt),
      createdAt: serverTimestamp(),
    });
    
    console.log('✅ Session saved to Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error saving session:', error);
    return false;
  }
};

export { db };
