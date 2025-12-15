import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, AtSign, Check, AlertCircle } from 'lucide-react';
import { signUpWithEmail } from '../services/supabase';

interface Props {
  onSuccess: (name: string, username: string, email: string) => void;
  onLoginClick: () => void;
}

export const EmailSignUp: React.FC<Props> = ({ onSuccess, onLoginClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const calculateStrength = (pass: string) => {
      if (!pass) return 0;
      if (pass.length < 8) return 1; // Weak

      let complexity = 0;
      if (/\d/.test(pass)) complexity++; // Has number
      if (/[A-Z]/.test(pass)) complexity++; // Has uppercase
      if (/[^A-Za-z0-9]/.test(pass)) complexity++; // Has symbol

      if (complexity >= 2) return 3; // Strong
      return 2; // Medium
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (s: number) => {
      if (s === 0) return { label: '', color: '', bg: 'bg-gray-200 dark:bg-slate-700', width: '0%' };
      if (s === 1) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', width: '33%' };
      if (s === 2) return { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500', width: '66%' };
      return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', width: '100%' };
  };

  const strengthInfo = getStrengthLabel(strength);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!username.trim()) {
      alert("Please enter a User ID.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmail(email, password, { name, username });
      
      if (result.needsConfirmation) {
        alert('✅ Account created! Please check your email to confirm your account before signing in.');
      } else {
        alert('✅ Account created successfully!');
        onSuccess(name, username, email);
      }
    } catch (error: any) {
      alert('❌ Failed to create account: ' + (error.message || 'Unknown error'));
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 pt-4">
        <button onClick={onLoginClick} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full mb-4">
           <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
        <p className="text-gray-500 dark:text-gray-400">Start your focus journey and sync your progress across devices.</p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4">
         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
              placeholder="John Doe"
            />
         </div>

         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">User ID</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
                placeholder="username"
              />
              <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
         </div>

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
            {/* Strength Indicator */}
            {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2 animate-fade-in">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ease-out ${strengthInfo.bg}`} 
                          style={{ width: strengthInfo.width }} 
                        />
                    </div>
                    <span className={`text-xs font-bold w-12 text-right ${strengthInfo.color}`}>{strengthInfo.label}</span>
                </div>
            )}
         </div>

         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
            {confirmPassword.length > 0 && (
               <div className={`text-xs font-medium ml-1 mt-1 flex items-center ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {password === confirmPassword ? (
                    <>
                      <Check className="w-3 h-3 mr-1" /> Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" /> Passwords do not match
                    </>
                  )}
               </div>
            )}
         </div>
      </div>

      <div className="mt-8 mb-4">
        <button 
           onClick={handleCreateAccount}
           disabled={isLoading}
           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-95"
        >
           {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
           Already have an account?{' '}
           <button onClick={onLoginClick} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
             Log In
           </button>
        </p>
      </div>
    </div>
  );
};