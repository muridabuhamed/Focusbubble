import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail } from '../services/supabase';

interface Props {
  onLoginSuccess: (email: string) => void;
  onForgotPassword: () => void;
  onSignUpClick: () => void;
  onBack: () => void;
}

export const EmailLogin: React.FC<Props> = ({ onLoginSuccess, onForgotPassword, onSignUpClick, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email.");
      return;
    }
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await signInWithEmail(email, password);
      alert('✅ Login successful!');
      onLoginSuccess(email);
    } catch (error: any) {
      alert('❌ Login failed: ' + (error.message || 'Invalid email or password'));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 pt-4">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full mb-4">
           <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your email and password to log in.</p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4">
         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
              placeholder="hello@example.com"
            />
         </div>

         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end pt-2">
               <button 
                 onClick={onForgotPassword}
                 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
               >
                 Forgot Password?
               </button>
            </div>
         </div>
      </div>

      <div className="mt-8 mb-4">
        <button 
           onClick={handleLogin}
           disabled={isLoading}
           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-95"
        >
           {isLoading ? 'Logging In...' : 'Log In'}
        </button>
        
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
           Don't have an account?{' '}
           <button onClick={onSignUpClick} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
             Create Account
           </button>
        </p>
      </div>
    </div>
  );
};