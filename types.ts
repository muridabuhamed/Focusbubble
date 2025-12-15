export enum AppScreen {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN', // The Auth Options Screen
  EMAIL_SIGNUP = 'EMAIL_SIGNUP', // The detailed form
  EMAIL_LOGIN = 'EMAIL_LOGIN', // New: Login with Password
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION', // Check your email (signup)
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS', // Email Verified (signup)
  FORGOT_PASSWORD = 'FORGOT_PASSWORD', // New: Reset Password Step 1
  RESET_LINK_SENT = 'RESET_LINK_SENT', // New: Check your email (reset)
  NEW_PASSWORD = 'NEW_PASSWORD', // New: Create New Password
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS', // New: Reset Success
  AVATAR_SELECTION = 'AVATAR_SELECTION', // Avatar picker
  HOME = 'HOME',
  FOCUS_SESSION = 'FOCUS_SESSION',
  SESSION_SUMMARY = 'SESSION_SUMMARY',
  BLOCKLIST = 'BLOCKLIST',
  AI_COACH = 'AI_COACH',
  STATS = 'STATS',
  LEADERBOARD = 'LEADERBOARD',
  SETTINGS = 'SETTINGS',
}

export interface User {
  name: string;
  username?: string;
  email: string;
  avatar: string;
  focusLevel: string; // 'Deep Diver', 'Warrior', etc.
  streak: number;
  totalHours: number;
  goals: string[];
  lastSessionDate?: string; // ISO string of the last completed session
  isPro?: boolean;
  isVerified: boolean; // Email verification status
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SessionData {
  durationMinutes: number;
  distractions: number;
  completedAt: Date;
  focusScore: number;
}

export interface BlockApp {
  id: string;
  name: string;
  icon: string; // url or lucide icon name
  isBlocked: boolean;
  category: 'social' | 'games' | 'entertainment' | 'productivity' | 'shopping' | 'other';
  usage?: string; // e.g. "2h 15m daily"
}