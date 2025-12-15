import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  onBackToLogin: () => void;
}

export const PasswordResetSuccess: React.FC<Props> = ({ onBackToLogin }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 items-center justify-center transition-colors duration-300 text-center">
       <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
       </div>

       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Password Reset Successfully 🎉</h1>
       <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
          You can now log in with your new password.
       </p>

       <button 
          onClick={onBackToLogin}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center transition-transform active:scale-95"
       >
          Back to Login
          <ArrowRight className="w-5 h-5 ml-2" />
       </button>
    </div>
  );
};