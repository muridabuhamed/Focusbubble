import React from 'react';
import { Mail, RefreshCw, ExternalLink, ArrowRight } from 'lucide-react';

interface Props {
  email: string;
  onOpenEmail: () => void;
  onResend: () => void;
  onBackToLogin: () => void;
  onSimulateLinkClick: () => void;
}

export const ResetLinkSent: React.FC<Props> = ({ email, onOpenEmail, onResend, onBackToLogin, onSimulateLinkClick }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 items-center justify-center transition-colors duration-300 text-center">
       <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
       </div>

       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Check your email</h1>
       <p className="text-gray-500 dark:text-gray-400 mb-2">We sent a verification link to:</p>
       <p className="text-gray-900 dark:text-white font-bold text-lg mb-8">{email}</p>

       <div className="w-full max-w-xs space-y-3">
          <button 
            onClick={onOpenEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center transition-transform active:scale-95"
          >
             Open Email App
             <ExternalLink className="w-4 h-4 ml-2" />
          </button>
          
          <button 
            onClick={onResend}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
             <RefreshCw className="w-4 h-4 mr-2" />
             Resend Email
          </button>

          <button 
             onClick={onBackToLogin}
             className="w-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm font-medium py-2"
          >
             Back to Login
          </button>
       </div>

       {/* Simulation for Demo */}
       <div className="mt-12 pt-6 border-t border-gray-100 dark:border-slate-800 w-full max-w-xs">
          <button 
             onClick={onSimulateLinkClick}
             className="text-xs text-green-500 font-bold flex items-center justify-center mx-auto hover:underline"
          >
             DEV: Simulate "Reset Password" Link Click
             <ArrowRight className="w-3 h-3 ml-1" />
          </button>
       </div>
    </div>
  );
};