import { supabase } from './supabase';
import { User, BlockApp } from '../types';

// User data structure in Supabase
interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  focus_level: string;
  streak: number;
  total_hours: number;
  goals: string[];
  last_session_date?: string;
  is_pro: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

// Save or update user data
export const saveUserData = async (user: User, uid: string): Promise<boolean> => {
  if (!supabase) {
    console.log('💾 Demo mode - data saved to localStorage only');
    localStorage.setItem('focusbubble_user', JSON.stringify(user));
    return false;
  }

  try {
    const userData: Partial<UserData> = {
      id: uid,
      name: user.name,
      username: user.username || '',
      email: user.email,
      avatar: user.avatar,
      focus_level: user.focusLevel,
      streak: user.streak,
      total_hours: user.totalHours,
      goals: user.goals,
      last_session_date: user.lastSessionDate,
      is_pro: user.isPro || false,
      is_verified: user.isVerified,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' });

    if (error) throw error;

    console.log('✅ User data saved to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    // Fallback to localStorage
    localStorage.setItem('focusbubble_user', JSON.stringify(user));
    return false;
  }
};

// Load user data from Supabase
export const loadUserData = async (uid: string): Promise<User | null> => {
  if (!supabase) {
    console.log('💾 Demo mode - loading from localStorage');
    const stored = localStorage.getItem('focusbubble_user');
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't exist yet
        console.log('ℹ️ No user data found in Supabase');
        return null;
      }
      throw error;
    }

    if (data) {
      console.log('✅ User data loaded from Supabase');
      
      return {
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        focusLevel: data.focus_level,
        streak: data.streak,
        totalHours: data.total_hours,
        goals: data.goals || [],
        lastSessionDate: data.last_session_date,
        isPro: data.is_pro,
        isVerified: data.is_verified,
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    return null;
  }
};

// Save user's blocked apps
export const saveBlockedApps = async (uid: string, apps: BlockApp[]): Promise<boolean> => {
  if (!supabase) {
    localStorage.setItem('focusbubble_blocklist', JSON.stringify(apps));
    return false;
  }

  try {
    const { error } = await supabase
      .from('blocklists')
      .upsert({
        user_id: uid,
        apps: apps,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;

    console.log('✅ Blocked apps saved to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error saving blocked apps:', error);
    localStorage.setItem('focusbubble_blocklist', JSON.stringify(apps));
    return false;
  }
};

// Load user's blocked apps
export const loadBlockedApps = async (uid: string): Promise<BlockApp[] | null> => {
  if (!supabase) {
    const stored = localStorage.getItem('focusbubble_blocklist');
    return stored ? JSON.parse(stored) : null;
  }

  try {
    const { data, error } = await supabase
      .from('blocklists')
      .select('apps')
      .eq('user_id', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (data) {
      console.log('✅ Blocked apps loaded from Supabase');
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
  if (!supabase) {
    console.log('💾 Demo mode - session not saved to database');
    return false;
  }

  try {
    const { error } = await supabase
      .from('sessions')
      .insert({
        user_id: uid,
        duration_minutes: sessionData.durationMinutes,
        completed_at: sessionData.completedAt.toISOString(),
        focus_score: sessionData.focusScore,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
    
    console.log('✅ Session saved to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Error saving session:', error);
    return false;
  }
};

export { supabase };
