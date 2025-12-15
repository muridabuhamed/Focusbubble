import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface Props {
  onSubmit: (password: string) => void;
}

export const NewPassword: React.FC<Props> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (pass: string) => {
      if (!pass) return 0;
      let strength = 0;
      if (pass.length >= 8) strength += 1; // Medium
      if (pass.length >= 8 && /\d/.test(pass) && /[!@#$%^&*]/.test(pass)) strength += 1; // Strong
      return strength;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (s: number) => {
      if (password.length > 0 && password.length < 8) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
      if (s === 1) return { label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
      if (s === 2) return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500' };
      return { label: '', color: '', bg: 'bg-gray-200 dark:bg-slate-700' };
  };

  const strengthInfo = getStrengthLabel(strength);

  const handleSave = () => {
      if (password.length < 8) {
          alert("Password must be at least 8 characters.");
          return;
      }
      if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return;
      }
      onSubmit(password);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300">
      <div className="pt-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Password</h1>
        <p className="text-gray-500 dark:text-gray-400">Your new password must be different from previous used passwords.</p>
      </div>

      <div className="flex-1 space-y-4">
         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
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
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strengthInfo.bg}`} style={{ width: password.length < 8 ? '33%' : strength === 1 ? '66%' : '100%' }}></div>
                    </div>
                    <span className={`text-xs font-bold ${strengthInfo.color}`}>{strengthInfo.label}</span>
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
         </div>
         
         <div className="pt-2 space-y-2">
             <div className={`flex items-center text-xs ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                 {password.length >= 8 ? <Check className="w-3 h-3 mr-2" /> : <div className="w-3 h-3 mr-2 rounded-full border border-gray-400"></div>}
                 At least 8 characters
             </div>
             <div className={`flex items-center text-xs ${password === confirmPassword && password.length > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                 {password === confirmPassword && password.length > 0 ? <Check className="w-3 h-3 mr-2" /> : <div className="w-3 h-3 mr-2 rounded-full border border-gray-400"></div>}
                 Passwords match
             </div>
         </div>
      </div>

      <button 
         onClick={handleSave}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-95 mb-4"
      >
         Save Password
      </button>
    </div>
  );
};