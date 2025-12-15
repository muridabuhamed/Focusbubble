import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { SplashScreen } from './SplashScreen';
import { EmailVerification } from './EmailVerification';
import { VerificationSuccess } from './VerificationSuccess';
import { EmailSignUp } from './EmailSignUp';
import { EmailLogin } from './EmailLogin';
import { signInWithGoogle } from '../services/supabase';
import { Mail } from 'lucide-react';

interface Props {
  onAuthSuccess: (user: any) => void;
  onGuestContinue: () => void;
}

export const Auth: React.FC<Props> = ({ onAuthSuccess, onGuestContinue }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [justVerified, setJustVerified] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'signup' | 'login' | 'verification' | 'success'>('auth');

  useEffect(() => {
    const init = async () => {
      // Handle auth callback from URL (for email verification and OAuth)
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        console.log('🔗 Processing auth callback from URL...');
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          setUser(data.user);
        } catch (error) {
          console.error('❌ Error processing auth callback:', error);
        }
      } else {
        // Normal auth check
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      }
      
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user?.email_confirmed_at && !justVerified) {
          setJustVerified(true);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [justVerified]);

  const handlePress = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert('Google Sign-In failed: ' + error.message);
    }
  };

  const handleEmailSignup = (name: string, username: string, email: string) => {
    setCurrentScreen('verification');
  };

  const handleLoginSuccess = (email: string) => {
    // User logged in, auth state will handle the rest
  };

  const handleVerificationSuccess = () => {
    setJustVerified(false);
    if (user) {
      onAuthSuccess(user);
    }
  };

  if (loading) return <SplashScreen />;

  // ❌ Not logged in - show auth flow
  if (!user) {
    if (currentScreen === 'signup') {
      return (
        <EmailSignUp 
          onSuccess={handleEmailSignup}
          onLoginClick={() => setCurrentScreen('login')}
        />
      );
    }
    
    if (currentScreen === 'login') {
      return (
        <EmailLogin 
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => {}} // TODO: implement if needed
          onSignUpClick={() => setCurrentScreen('signup')}
          onBack={() => setCurrentScreen('auth')}
        />
      );
    }

    if (currentScreen === 'verification') {
      return (
        <EmailVerification 
          email={user?.email || ''}
        />
      );
    }

    // Main auth screen
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 p-6 flex flex-col justify-end pb-12 transition-colors duration-300">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-6">
             <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="#0ea5e9" strokeWidth="8" />
                <path d="M30 35C30 35 35 25 50 25" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round"/>
             </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">Save your progress and join the leaderboard.</p>
          
          <div className="mt-8 flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Already have an account?</span>
              <button 
                  onClick={() => setCurrentScreen('login')}
                  onPointerDown={handlePress}
                  className="px-8 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95 duration-150 mt-1"
              >
                  Sign In
              </button>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-md mx-auto pt-12">
          <button 
            onClick={handleGoogleSignIn}
            onPointerDown={handlePress}
            className="w-full h-[44px] flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-[16px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-[0.97] active:shadow-md duration-150"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="leading-none mt-[1px]">Continue with Google</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('signup')}
            onPointerDown={handlePress}
            className="w-full h-[44px] flex items-center justify-center gap-3 bg-blue-600 text-white text-[16px] font-medium rounded-lg shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all active:scale-[0.97] active:shadow-xl duration-150"
          >
            <Mail className="w-[18px] h-[18px]" /> 
            <span className="leading-none mt-[1px]">Continue with Email</span>
          </button>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={onGuestContinue}
              className="w-full text-center text-sm text-gray-400 dark:text-gray-500 font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Skip for now (Guest Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ⏳ Logged in but NOT verified
  if (!user.email_confirmed_at) {
    return <EmailVerification email={user.email} />;
  }

  // ✅ Just verified (show success screen once)
  if (user.email_confirmed_at && justVerified) {
    return <VerificationSuccess onContinue={handleVerificationSuccess} />;
  }

  // 🏠 Fully authenticated - let parent handle
  onAuthSuccess(user);
  return <SplashScreen />;
};