import React, { useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface Props {
  onFinish: () => void;
  onLogin: () => void;
}

export const Onboarding: React.FC<Props> = ({ onFinish, onLogin }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else onFinish();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-8 transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        {step === 1 && (
          <div className="animate-fade-in flex flex-col items-center">
             <div className="w-24 h-24 mb-8 flex items-center justify-center">
               <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="#0ea5e9" strokeWidth="8" />
                  <path d="M30 35C30 35 35 25 50 25" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round"/>
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">FocusBubble</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Find your flow.</p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in max-w-xs">
             <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center text-blue-600 dark:text-blue-500">
                <Zap className="w-10 h-10" fill="currentColor" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
               Boost focus.<br/>Block distractions.<br/>Improve habits.
             </h2>
             <p className="text-gray-500 dark:text-gray-400">
               Master your time with the ultimate productivity companion.
             </p>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2 mb-8">
        {[1, 2].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${step === i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      <button 
        onClick={nextStep}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/30 active:scale-95"
      >
        {step === 2 ? 'Start Now' : 'Continue'}
        {step === 1 && <ChevronRight className="ml-2 w-5 h-5" />}
      </button>

      <button 
        onClick={onLogin}
        className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Log In
      </button>
    </div>
  );
};