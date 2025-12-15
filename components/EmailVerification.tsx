import React from 'react';
import { Mail, RefreshCw, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  email: string;
  onResend: () => void;
  onSkip: () => void;
  onSimulateVerify: () => void;
}

export const EmailVerification: React.FC<Props> = ({ email, onResend, onSkip, onSimulateVerify }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 items-center justify-center transition-colors duration-300 text-center">
       <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
       </div>

       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Check your email</h1>
       <p className="text-gray-500 dark:text-gray-400 mb-2">We sent a verification link to:</p>
       <p className="text-gray-900 dark:text-white font-bold text-lg mb-8">{email}</p>

       <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 mb-8 max-w-xs">
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
             Please verify your email to unlock full access to FocusBubble features like the Global Leaderboard and Pro Plan.
          </p>
       </div>

       <div className="w-full max-w-xs space-y-3">
          <a href={`mailto:`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center transition-transform active:scale-95">
             Open Email App
             <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          
          <button 
            onClick={onResend}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
             <RefreshCw className="w-4 h-4 mr-2" />
             Resend Verification Email
          </button>

          {/* Skip Option */}
          <button 
             onClick={onSkip}
             className="w-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-sm font-medium py-2"
          >
             Skip for now (Restricted Access)
          </button>
       </div>

       {/* Simulation for Demo */}
       <div className="mt-12 pt-6 border-t border-gray-100 dark:border-slate-800 w-full max-w-xs">
          <button 
             onClick={onSimulateVerify}
             className="text-xs text-green-500 font-bold flex items-center justify-center mx-auto hover:underline"
          >
             DEV: Simulate "Verify Email" Link Click
             <ArrowRight className="w-3 h-3 ml-1" />
          </button>
       </div>
    </div>
  );
};