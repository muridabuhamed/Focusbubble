import React, { useEffect } from 'react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-50">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
        <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-pulse"></div>
        
        {/* Original Abstract Logo */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center shadow-2xl border-4 border-white/5 ring-1 ring-white/10">
           <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
              <path d="M30 35C30 35 35 25 50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
           </svg>
        </div>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">FocusBubble</h1>
      <p className="mt-2 text-blue-200/80 text-sm tracking-wide font-medium">Find your flow.</p>
    </div>
  );
};