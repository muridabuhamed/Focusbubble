import React, { useState, useRef, useEffect } from 'react';
import { Settings, List, Play, Zap, AlertTriangle } from 'lucide-react';
import { User, AppScreen } from '../types';

interface Props {
  user: User;
  onStartSession: (minutes: number) => void;
  onNavigate: (screen: AppScreen) => void;
  onSignup?: () => void;
  isActive?: boolean;
}

export const Home: React.FC<Props> = ({ user, onStartSession, onNavigate, onSignup, isActive = true }) => {
  const [duration, setDuration] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  
  const timerRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef(0);
  const durationRef = useRef(duration); // Track precise float value during drag

  // Load default timer preference whenever the screen becomes active
  useEffect(() => {
    if (!isActive) return;

    const saved = localStorage.getItem('focusbubble_preferences');
    if (saved) {
        try {
            const prefs = JSON.parse(saved);
            if (prefs.defaultTimer) {
                setDuration(prefs.defaultTimer);
                durationRef.current = prefs.defaultTimer;
            }
        } catch (e) {
            console.error("Error loading timer pref", e);
        }
    }
  }, [isActive]);

  // Timer calculations
  const radius = 110; 
  const circumference = 2 * Math.PI * radius; 
  // Calculate progress based on 60 minutes being a full circle, but handle > 60 min visually
  const strokeDashoffset = circumference - (circumference * duration) / 60;

  const isGuest = user.name === "Guest User";
  const MAX_DURATION = 240; // 4 hours

  // Sync ref with state when not dragging to ensure start position is correct
  useEffect(() => {
    if (!isDragging) {
      durationRef.current = duration;
    }
  }, [duration, isDragging]);

  const getAngle = (clientX: number, clientY: number) => {
    const rect = timerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Calculate angle in degrees
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only enable drag on left click or touch
    if (e.button !== 0) return;
    
    e.preventDefault();
    setIsDragging(true);
    lastAngleRef.current = getAngle(e.clientX, e.clientY);
    
    // Add global listeners to handle dragging outside the element
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    const newAngle = getAngle(e.clientX, e.clientY);
    let delta = newAngle - lastAngleRef.current;
    
    // Handle wrap-around (e.g. crossing -180/180)
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    lastAngleRef.current = newAngle;

    // Sensitivity: 360 degrees = 60 minutes
    const minutesPerDegree = 60 / 360;
    const change = delta * minutesPerDegree;
    
    let newDuration = durationRef.current + change;
    
    // Clamp between 1 and MAX_DURATION
    newDuration = Math.max(1, Math.min(MAX_DURATION, newDuration));
    
    // Haptic feedback every integer crossed
    if (Math.floor(newDuration) !== Math.floor(durationRef.current)) {
        if (navigator.vibrate) navigator.vibrate(5);
    }
    
    durationRef.current = newDuration;
    setDuration(newDuration);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    
    // Snap to nearest 1 minute
    setDuration(prev => {
        const snapped = Math.round(prev);
        return Math.max(1, Math.min(MAX_DURATION, snapped));
    });

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };

  // Safe start wrapper
  const handleStart = () => {
      onStartSession(Math.round(duration));
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300 select-none">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {isGuest ? (
              <>Welcome! <span className="text-xl">👋</span></>
            ) : (
              <>Hello, {user.name.split(' ')[0]} <span className="text-xl">👋</span></>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ready to focus?</p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="flex items-center bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-2xl border border-orange-100 dark:border-orange-900/50 shadow-sm animate-fade-in-up">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500 mr-1" />
                <span className="font-bold text-orange-700 dark:text-orange-400 text-sm">{user.streak}</span>
             </div>

            <button 
              onClick={() => onNavigate(AppScreen.SETTINGS)}
              className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer hover:opacity-80 transition-all active:scale-95 duration-150"
            >
               <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </button>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {isGuest && (
         <div className="mx-6 mb-2 mt-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 flex items-center justify-between shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Guest Mode</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Your progress isn't saved.</p>
               </div>
            </div>
            <button 
               onClick={onSignup}
               className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all active:scale-95 duration-150 shadow-sm"
            >
               Sign Up
            </button>
         </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-2">
        
        {/* Timer Dial Selection */}
        <div 
          className="relative mb-14 group touch-none"
          ref={timerRef}
          onPointerDown={handlePointerDown}
        >
          <div 
            className={`w-64 h-64 rounded-full bg-blue-50 dark:bg-slate-800/30 flex items-center justify-center relative shadow-[0_0_40px_-10px_rgba(14,165,233,0.2)] dark:shadow-[0_0_40px_-10px_rgba(14,165,233,0.1)] transition-all duration-200 ${isDragging ? 'scale-105 cursor-grabbing' : 'cursor-grab hover:scale-[1.02]'}`}
          >
             {/* Progress arc simulation */}
             <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 256 256">
               {/* Background Circle */}
               <circle 
                 cx="128" 
                 cy="128" 
                 r={radius} 
                 stroke="currentColor" 
                 strokeWidth="12" 
                 fill="transparent" 
                 className="text-gray-200 dark:text-slate-800" 
               />
               {/* Progress Circle */}
               <circle 
                 cx="128" 
                 cy="128" 
                 r={radius} 
                 stroke="#0ea5e9" 
                 strokeWidth="12" 
                 fill="transparent" 
                 strokeDasharray={circumference} 
                 strokeDashoffset={strokeDashoffset} 
                 strokeLinecap="round" 
                 className={isDragging ? '' : 'transition-all duration-300 ease-out'}
               />
             </svg>
             
             <div className="text-center z-10 pointer-events-none">
                <span className="text-7xl font-bold text-gray-900 dark:text-white tracking-tighter">
                    {Math.round(duration)}
                </span>
                <p className="text-gray-400 dark:text-gray-500 font-medium mt-1">
                  {Math.round(duration) === 1 ? 'minute' : 'minutes'}
                </p>
             </div>
          </div>
          
          {/* Controls */}
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-6">
             <button 
                onClick={() => setDuration(Math.max(1, Math.round(duration) - 5))}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-slate-700 transition-all active:scale-90 duration-150"
             >
                -5
             </button>
             <button 
                onClick={() => setDuration(Math.min(MAX_DURATION, Math.round(duration) + 5))}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-100 dark:border-slate-700 transition-all active:scale-90 duration-150"
             >
                +5
             </button>
          </div>
        </div>

        {/* Start Button */}
        <button 
           onClick={handleStart}
           className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-blue-400/40 dark:shadow-blue-600/30 flex items-center justify-center transition-all active:scale-[0.97] duration-150 mt-4"
        >
           <Play className="w-5 h-5 mr-2 fill-current" />
           Start Session
        </button>

        {/* Quick Actions */}
        <div className="flex w-full max-w-xs mt-8 space-x-4">
           <button 
              onClick={() => onNavigate(AppScreen.BLOCKLIST)}
              className="flex-1 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-[0.97] duration-150"
           >
              <List className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Blocklist</span>
           </button>
           <button 
              onClick={() => onNavigate(AppScreen.AI_COACH)}
              className="flex-1 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-[0.97] duration-150"
           >
              <Zap className="w-6 h-6 text-yellow-500 mb-2" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">AI Coach</span>
           </button>
        </div>
      </div>
    </div>
  );
};