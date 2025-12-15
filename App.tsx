import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { signInWithGoogle, signOutUser, getCurrentUser, onAuthStateChange } from './services/supabase';
import { saveUserData, loadUserData, saveSession, saveBlockedApps, loadBlockedApps } from './services/supabaseDb';
import { EmailSignUp } from './components/EmailSignUp';
import { EmailLogin } from './components/EmailLogin';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetLinkSent } from './components/ResetLinkSent';
import { NewPassword } from './components/NewPassword';
import { PasswordResetSuccess } from './components/PasswordResetSuccess';
import { EmailVerification } from './components/EmailVerification';
import { VerificationSuccess } from './components/VerificationSuccess';
import { AvatarSelection } from './components/AvatarSelection';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ActiveSession } from './components/ActiveSession';
import { SessionSummary } from './components/SessionSummary';
import { Blocklist } from './components/Blocklist';
import { AICoach } from './components/AICoach';
import { Stats } from './components/Stats';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { AppScreen, User, BlockApp } from './types';
import { Lock, X } from 'lucide-react';
import { notificationManager } from './services/notificationManager';

const defaultUser: User = {
  name: "Guest User",
  username: "@guest",
  email: "guest@example.com",
  avatar: "https://ui-avatars.com/api/?name=Guest+User&background=0ea5e9&color=fff",
  focusLevel: "Focus Beginner",
  streak: 0,
  totalHours: 0,
  goals: [],
  lastSessionDate: undefined,
  isPro: false,
  isVerified: false, 
};

const defaultApps: BlockApp[] = [
  { id: '1', name: 'Instagram', icon: 'camera', isBlocked: true, category: 'social', usage: '2h 15m avg' },
  { id: '2', name: 'TikTok', icon: 'music', isBlocked: true, category: 'social', usage: '1h 45m avg' },
  { id: '3', name: 'YouTube', icon: 'video', isBlocked: false, category: 'entertainment', usage: '45m avg' },
  { id: '4', name: 'Mail', icon: 'mail', isBlocked: false, category: 'productivity', usage: '20m avg' },
  { id: '5', name: 'WhatsApp', icon: 'message', isBlocked: true, category: 'social', usage: '1h 10m avg' },
  { id: '6', name: 'Netflix', icon: 'tv', isBlocked: true, category: 'entertainment', usage: 'Last used: Yesterday' },
  { id: '7', name: 'Amazon', icon: 'shopping-bag', isBlocked: false, category: 'shopping', usage: '15m avg' },
  { id: '8', name: 'Clash Royale', icon: 'gamepad-2', isBlocked: true, category: 'games', usage: '30m avg' },
  { id: '9', name: 'Roblox', icon: 'box', isBlocked: true, category: 'games', usage: '1h avg' },
  { id: '10', name: 'Slack', icon: 'hash', isBlocked: false, category: 'productivity', usage: '3h avg' },
  { id: '11', name: 'Snapchat', icon: 'ghost', isBlocked: true, category: 'social', usage: '55m avg' },
  { id: '12', name: 'Chrome', icon: 'globe', isBlocked: false, category: 'other', usage: '2h avg' },
];

// Screen Depth Map for Animations
const screenDepth: Record<string, number> = {
  [AppScreen.SPLASH]: 0,
  [AppScreen.ONBOARDING]: 1,
  [AppScreen.LOGIN]: 2,
  [AppScreen.EMAIL_LOGIN]: 3,
  [AppScreen.EMAIL_SIGNUP]: 3, // Sibling
  [AppScreen.FORGOT_PASSWORD]: 4,
  [AppScreen.RESET_LINK_SENT]: 5,
  [AppScreen.NEW_PASSWORD]: 6,
  [AppScreen.PASSWORD_RESET_SUCCESS]: 7,
  [AppScreen.EMAIL_VERIFICATION]: 4,
  [AppScreen.VERIFICATION_SUCCESS]: 5,
  [AppScreen.AVATAR_SELECTION]: 6,
  // Tabs are high depth
  [AppScreen.HOME]: 10,
  [AppScreen.STATS]: 10,
  [AppScreen.LEADERBOARD]: 10,
  [AppScreen.SETTINGS]: 10,
};

const tabScreens = [AppScreen.HOME, AppScreen.STATS, AppScreen.LEADERBOARD, AppScreen.SETTINGS];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [prevScreen, setPrevScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<User>(defaultUser);
  const [apps, setApps] = useState<BlockApp[]>(defaultApps);
  const [lastSessionMinutes, setLastSessionMinutes] = useState(0);
  const [activeSessionMinutes, setActiveSessionMinutes] = useState(25);
  const [sessionCount, setSessionCount] = useState(0);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [currentUid, setCurrentUid] = useState<string>('');

  const isGuest = user.name === "Guest User";

  // Setup notification listeners on app start
  useEffect(() => {
    notificationManager.setupNotificationListeners();
  }, []);

  // Load user data from Supabase on mount and listen to auth changes
  useEffect(() => {
    const loadUserFromDB = async () => {
      const supabaseUser = await getCurrentUser();
      if (supabaseUser) {
        const userData = await loadUserData(supabaseUser.id);
        if (userData) {
          setUser(userData);
          setCurrentUid(supabaseUser.id);
          console.log('✅ User data loaded from database');
        }
      }
    };
    
    loadUserFromDB();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange(async (supabaseUser) => {
      if (supabaseUser) {
        const userData = await loadUserData(supabaseUser.id);
        if (userData) {
          setUser(userData);
          setCurrentUid(supabaseUser.id);
        }
      } else {
        setUser(defaultUser);
        setCurrentUid('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto-save user data to Firestore when it changes
  useEffect(() => {
    if (currentUid && !isGuest) {
      saveUserData(user, currentUid);
    }
  }, [user, currentUid, isGuest]);

  // Auto-save blocked apps when they change
  useEffect(() => {
    if (currentUid && !isGuest) {
      saveBlockedApps(currentUid, apps);
    }
  }, [apps, currentUid, isGuest]);

  // Navigation Handler with Direction Tracking
  const handleNavigate = (target: AppScreen) => {
    // Intercept restricted screens for Guest Users
    if (isGuest && (target === AppScreen.STATS)) {
      setShowGuestModal(true);
      return;
    }
    setPrevScreen(screen);
    setScreen(target);
  };

  const getAnimationClass = () => {
    // No animation for first load or same screen
    if (screen === prevScreen) return 'animate-fade-in';
    
    // Check depths
    const currentDepth = screenDepth[screen] || 10;
    const prevDepth = screenDepth[prevScreen] || 10;

    // Tabs have their own internal transition in Layout.tsx
    if (tabScreens.includes(screen) && tabScreens.includes(prevScreen)) {
       return ''; 
    }

    if (currentDepth > prevDepth) return 'animate-page-next';
    if (currentDepth < prevDepth) return 'animate-page-back';
    
    // Same depth (siblings) -> default fade
    return 'animate-fade-in';
  };

  const handleSplashFinish = () => {
    const hasOnboarded = localStorage.getItem('focusbubble_onboarded');
    if (hasOnboarded) {
      handleNavigate(AppScreen.HOME);
    } else {
      handleNavigate(AppScreen.ONBOARDING);
    }
  };

  const handleOnboardingFinish = () => {
    localStorage.setItem('focusbubble_onboarded', 'true');
    handleNavigate(AppScreen.LOGIN);
  };

  const handleAuthSuccess = (registeredName: string, registeredUsername?: string, registeredEmail?: string, skipVerification = false) => {
    const newName = registeredName || (user.name === "Guest User" ? "Focus Member" : user.name);
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newUsername = registeredUsername || (user.username === "@guest" ? `@user${randomId}` : user.username);
    const newEmail = registeredEmail || user.email;
    const needsVerification = !skipVerification && !!registeredEmail && registeredEmail !== "guest@example.com";

    setUser(prev => ({
      ...prev,
      name: newName,
      username: newUsername,
      email: newEmail,
      isVerified: !needsVerification
    }));

    if (needsVerification) {
        handleNavigate(AppScreen.EMAIL_VERIFICATION);
    } else {
        handleNavigate(AppScreen.AVATAR_SELECTION);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await signInWithGoogle();
      
      // Try to load existing user data from Firestore
      const existingData = await loadUserData(googleUser.uid);
      
      if (existingData) {
        // Existing user - load their data
        setUser(existingData);
        setCurrentUid(googleUser.uid);
        
        // Load their blocked apps
        const blockedApps = await loadBlockedApps(googleUser.uid);
        if (blockedApps) setApps(blockedApps);
        
        handleNavigate(AppScreen.HOME);
      } else {
        // New user - set up account
        setCurrentUid(googleUser.uid);
        handleAuthSuccess(
          googleUser.name, 
          googleUser.username, 
          googleUser.email, 
          true // Skip email verification for Google sign-in
        );
      }
    } catch (error: any) {
      alert('Google Sign-In failed: ' + (error.message || 'Please try again'));
      console.error('Google auth error:', error);
    }
  };

  const handleAppleLogin = () => {
    // Mock Apple Login response
    const mockUser = {
      name: "Alex A.",
      username: "@alex_apple",
      email: "alex@icloud.com"
    };
    handleAuthSuccess(mockUser.name, mockUser.username, mockUser.email, true);
  };

  const handleLoginSuccess = (email: string) => {
      setUser({
          ...defaultUser,
          name: "Welcome Back User",
          username: "@existing_user",
          email: email,
          isVerified: true
      });
      handleNavigate(AppScreen.HOME);
  };

  const handleForgotPasswordSubmit = (email: string) => {
      setTempEmail(email);
      handleNavigate(AppScreen.RESET_LINK_SENT);
  };

  const handleResetLinkSimulate = () => {
      handleNavigate(AppScreen.NEW_PASSWORD);
  };

  const handleNewPasswordSubmit = (password: string) => {
      handleNavigate(AppScreen.PASSWORD_RESET_SUCCESS);
  };

  const handleGuestContinue = () => {
    handleNavigate(AppScreen.AVATAR_SELECTION);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(defaultUser);
      setCurrentUid('');
      setApps(defaultApps);
      localStorage.removeItem('focusbubble_user');
      handleNavigate(AppScreen.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(defaultUser);
      setCurrentUid('');
      handleNavigate(AppScreen.LOGIN);
    }
  };

  const handleResendVerification = () => {
      alert(`Verification email resent to ${user.email}`);
  };

  const handleSimulateVerify = () => {
      setUser(prev => ({ ...prev, isVerified: true }));
      handleNavigate(AppScreen.VERIFICATION_SUCCESS);
  };

  const handleSkipVerification = () => {
      handleNavigate(AppScreen.AVATAR_SELECTION);
  };

  const handleAvatarSelected = (avatarUrl: string, name?: string) => {
    setUser(prev => ({
        ...prev,
        avatar: avatarUrl,
        name: name || prev.name
    }));
    handleNavigate(AppScreen.HOME);
  };

  const startSession = (minutes: number) => {
    setActiveSessionMinutes(minutes);
    handleNavigate(AppScreen.FOCUS_SESSION);
  };

  const endSession = (minutesCompleted: number) => {
    setLastSessionMinutes(minutesCompleted);
    setSessionCount(prev => prev + 1);
    
    setUser(prevUser => {
        const now = new Date();
        const todayStr = now.toDateString();
        const lastSession = prevUser.lastSessionDate ? new Date(prevUser.lastSessionDate) : null;
        let newStreak = prevUser.streak;

        if (lastSession) {
            const lastSessionStr = lastSession.toDateString();
            if (todayStr !== lastSessionStr) {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastSessionStr === yesterday.toDateString()) {
                    newStreak += 1;
                } else {
                    newStreak = 1; 
                }
            }
        } else {
            newStreak = 1;
        }

        return { 
            ...prevUser, 
            totalHours: prevUser.totalHours + (minutesCompleted / 60),
            streak: newStreak,
            lastSessionDate: now.toISOString()
        };
    });

    // Save session to database
    if (currentUid && !isGuest) {
      saveSession(currentUid, {
        durationMinutes: minutesCompleted,
        completedAt: new Date(),
        focusScore: 100, // Can calculate based on distractions later
      });
    }

    handleNavigate(AppScreen.SESSION_SUMMARY);
  };

  const handleSessionSummaryFinish = () => {
    if (sessionCount === 2 && isGuest) {
       handleNavigate(AppScreen.LOGIN);
    } else {
       handleNavigate(AppScreen.HOME);
    }
  };

  const updateGoals = (goals: string[]) => {
    setUser({ ...user, goals });
  };

  const handleGuestSignup = () => {
    setShowGuestModal(false);
    handleNavigate(AppScreen.LOGIN);
  };

  // Render logic split for efficiency and Layout persistence
  const renderContent = () => {
    // If we are in a tab screen, we render the persistent Layout
    if (tabScreens.includes(screen)) {
      return (
        <Layout 
            currentScreen={screen} 
            onNavigate={handleNavigate} 
            isGuest={isGuest}
            onSignup={handleGuestSignup}
            homeScreen={
              <Home 
                user={user} 
                onStartSession={startSession} 
                onNavigate={handleNavigate}
                onSignup={handleGuestSignup} 
                isActive={screen === AppScreen.HOME}
              />
            }
            statsScreen={<Stats user={user} />}
            leaderboardScreen={<Leaderboard currentUser={user} />}
            settingsScreen={
              <Settings 
                user={user} 
                onLogin={() => handleNavigate(AppScreen.LOGIN)}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                onUpdateUser={(updatedUser) => setUser(updatedUser)}
              />
            }
        />
      );
    }

    // For other screens, we wrap them in an animation container
    return (
      <div key={screen} className={`flex-1 flex flex-col h-full ${getAnimationClass()}`}>
        {(() => {
          switch (screen) {
            case AppScreen.SPLASH:
              return <SplashScreen onFinish={handleSplashFinish} />;
            case AppScreen.ONBOARDING:
              return <Onboarding onFinish={handleOnboardingFinish} onLogin={() => handleNavigate(AppScreen.LOGIN)} />;
            case AppScreen.LOGIN:
              return (
                <Auth 
                  onAuthSuccess={(user) => {
                    // Map Supabase user to app user format
                    const appUser = {
                      uid: user.id,
                      name: user.user_metadata?.name || user.user_metadata?.full_name || 'User',
                      email: user.email || '',
                      avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.name || 'User')}`,
                      username: user.user_metadata?.username || '@' + (user.email?.split('@')[0] || 'user'),
                      isVerified: !!user.email_confirmed_at
                    };
                    setUser(appUser);
                    handleNavigate(AppScreen.HOME);
                  }}
                  onGuestContinue={handleGuestContinue}
                />
              );
            case AppScreen.EMAIL_LOGIN:
              return (
                <EmailLogin 
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={() => handleNavigate(AppScreen.FORGOT_PASSWORD)}
                  onSignUpClick={() => handleNavigate(AppScreen.EMAIL_SIGNUP)}
                  onBack={() => handleNavigate(AppScreen.LOGIN)}
                />
              );
            case AppScreen.EMAIL_SIGNUP:
              return (
                <EmailSignUp 
                  onSuccess={(name, username, email) => handleAuthSuccess(name, username, email)}
                  onLoginClick={() => handleNavigate(AppScreen.EMAIL_LOGIN)}
                />
              );
            case AppScreen.FORGOT_PASSWORD:
              return (
                  <ForgotPassword 
                    onSubmit={handleForgotPasswordSubmit}
                    onBack={() => handleNavigate(AppScreen.EMAIL_LOGIN)}
                  />
              );
            case AppScreen.RESET_LINK_SENT:
              return (
                  <ResetLinkSent 
                    email={tempEmail}
                    onOpenEmail={() => window.open(`mailto:`)}
                    onResend={() => alert(`Reset email resent to ${tempEmail}`)}
                    onBackToLogin={() => handleNavigate(AppScreen.EMAIL_LOGIN)}
                    onSimulateLinkClick={handleResetLinkSimulate}
                  />
              );
            case AppScreen.NEW_PASSWORD:
              return <NewPassword onSubmit={handleNewPasswordSubmit} />;
            case AppScreen.PASSWORD_RESET_SUCCESS:
              return <PasswordResetSuccess onBackToLogin={() => handleNavigate(AppScreen.EMAIL_LOGIN)} />;
            case AppScreen.EMAIL_VERIFICATION:
              return (
                <EmailVerification 
                  email={user.email} 
                  onResend={handleResendVerification} 
                  onSkip={handleSkipVerification}
                  onSimulateVerify={handleSimulateVerify}
                />
              );
            case AppScreen.VERIFICATION_SUCCESS:
              return <VerificationSuccess onContinue={() => handleNavigate(AppScreen.AVATAR_SELECTION)} />;
            case AppScreen.AVATAR_SELECTION:
              return <AvatarSelection onContinue={handleAvatarSelected} />;
            case AppScreen.FOCUS_SESSION:
              return <ActiveSession initialMinutes={activeSessionMinutes} onEnd={endSession} />;
            case AppScreen.SESSION_SUMMARY:
              return <SessionSummary minutes={lastSessionMinutes} onHome={handleSessionSummaryFinish} />;
            case AppScreen.BLOCKLIST:
              return <Blocklist apps={apps} setApps={setApps} onBack={() => handleNavigate(AppScreen.HOME)} />;
            case AppScreen.AI_COACH:
              return <AICoach user={user} onBack={() => handleNavigate(AppScreen.HOME)} onUpdateGoals={updateGoals} />;
            default:
              return <div>Screen not found</div>;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-gray-50 dark:bg-slate-950 dark:text-gray-100 overflow-hidden relative transition-colors duration-300 flex flex-col">
      {renderContent()}
      
      {/* Guest Restriction Modal */}
      {showGuestModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-white/20 relative animate-pop-in">
             <button 
                onClick={() => setShowGuestModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
             >
                <X className="w-5 h-5" />
             </button>

             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600 dark:text-blue-400">
                <Lock className="w-8 h-8" />
             </div>
             
             <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Unlock Full Access</h2>
             <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                Sign up to view detailed stats, compete on the leaderboard, and customize your app themes.
             </p>

             <div className="space-y-3">
                <button 
                  onClick={handleGuestSignup}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-transform active:scale-95"
                >
                  Create Account
                </button>
                <button 
                  onClick={() => setShowGuestModal(false)}
                  className="w-full bg-transparent text-gray-500 dark:text-gray-400 font-semibold py-2 text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Maybe Later
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}