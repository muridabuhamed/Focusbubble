import { createClient, SupabaseClient, User, AuthError } from '@supabase/supabase-js';

// Supabase configuration using Vite environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    console.log('✅ Supabase initialized successfully');
    console.log('🔗 URL:', supabaseUrl);
    console.log('🔑 Key configured:', !!supabaseAnonKey);
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
  }
} else {
  console.error('❌ Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  console.error('Check your .env.local file and ensure variables start with VITE_');
}

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  // Real Supabase authentication
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'com.focusbubble.app://auth/callback', // Use app scheme for mobile
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    // For OAuth, this will redirect to Google
    // The actual user data will be available after redirect
    console.log('Redirecting to Google OAuth...');
    return null; // OAuth redirect, no immediate return
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOutUser = async () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured');
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Test Supabase connection (for debugging)
export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key Present:', !!supabaseAnonKey);
  console.log('Configured:', isSupabaseConfigured);
  
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    // Test auth endpoint
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    console.log('Session:', data.session ? 'Active' : 'None');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, metadata: { name: string, username: string }) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name,
          username: metadata.username,
          full_name: metadata.name,
        }
      }
    });

    if (error) throw error;

    return {
      user: data.user,
      needsConfirmation: !data.session, // If no session, email confirmation is required
    };
  } catch (error: any) {
    console.error('Email Sign-Up Error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      return {
        uid: data.user.id,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || 'User',
        email: data.user.email || '',
        avatar: data.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.user_metadata?.name || 'User')}`,
        username: data.user.user_metadata?.username || '@' + (data.user.email?.split('@')[0] || 'user'),
        isVerified: !!data.user.email_confirmed_at
      };
    }

    throw new Error('Login failed - no user returned');
  } catch (error: any) {
    console.error('Email Sign-In Error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
};

export { supabase };
