import React, { useEffect, useState } from 'react';
import { Pause, X, Play, BellOff, Waves, Shield, AlertTriangle } from 'lucide-react';
import { notificationManager } from '../services/notificationManager';

interface Props {
  initialMinutes: number;
  onEnd: (minutesCompleted: number) => void;
}

export const ActiveSession: React.FC<Props> = ({ initialMinutes, onEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [notificationBlockingActive, setNotificationBlockingActive] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const totalSeconds = initialMinutes * 60;

  // Initialize notification blocking when session starts
  useEffect(() => {
    const initializeNotificationBlocking = async () => {
      try {
        // Check if user has enabled notification blocking in preferences
        const prefs = localStorage.getItem('focusbubble_preferences');
        const blockNotifications = prefs ? JSON.parse(prefs).blockNotifications : true;

        if (blockNotifications) {
          const hasPermission = await notificationManager.requestPermissions();
          if (hasPermission) {
            const success = await notificationManager.startFocusMode(initialMinutes);
            setNotificationBlockingActive(success);
          } else {
            setShowPermissionPrompt(true);
            // Still show web fallback
            await notificationManager.showWebFallbackNotification();
          }
        } else {
          // User disabled notification blocking
          setNotificationBlockingActive(false);
          setShowPermissionPrompt(false);
        }
      } catch (error) {
        console.error('Error initializing notification blocking:', error);
        setShowPermissionPrompt(true);
      }
    };

    initializeNotificationBlocking();

    // Cleanup on unmount
    return () => {
      notificationManager.endFocusMode();
    };
  }, [initialMinutes]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      // End notification blocking when session ends
      notificationManager.endFocusMode();
      onEnd(initialMinutes);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        // Micro vibration every minute (60s mark), but not at the very start
        if (next > 0 && next % 60 === 0 && next !== totalSeconds) {
             const prefs = localStorage.getItem('focusbubble_preferences');
             const hapticEnabled = prefs ? JSON.parse(prefs).hapticFeedback : true;
             
             if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                 navigator.vibrate(50); // Subtle pulse
             }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused, initialMinutes, onEnd, totalSeconds]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Progress Calculation
  // Fills up from 0% to 100%
  const percentComplete = (totalSeconds - secondsLeft) / totalSeconds;
  
  // SVG Configuration
  const size = 320;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 20; // Padding inside container
  const circumference = 2 * Math.PI * radius;
  // StrokeDashoffset: Start at Circumference (empty), End at 0 (full)
  const strokeDashoffset = circumference - (percentComplete * circumference);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-white">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s'}}></div>
      </div>

      {/* Focus Mode Indicator */}
      <div className="absolute top-12 flex flex-col items-center z-10 animate-fade-in-up space-y-3">
        {(() => {
          // Check notification blocking preference
          const prefs = localStorage.getItem('focusbubble_preferences');
          const blockNotifications = prefs ? JSON.parse(prefs).blockNotifications : true;
          const hasAutoDND = localStorage.getItem('focusbubble_dnd_permission') === 'granted';

          if (!blockNotifications) {
            return (
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center border border-blue-300/20 shadow-lg ring-1 ring-blue-300/5">
                 <BellOff className="w-3.5 h-3.5 text-blue-300 mr-2" />
                 <span className="text-xs font-semibold tracking-wide text-blue-50">FOCUS MODE</span>
              </div>
            );
          }

          if (notificationBlockingActive || hasAutoDND) {
            return (
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center border border-green-300/20 shadow-lg ring-1 ring-green-300/5">
                 <Shield className="w-3.5 h-3.5 text-green-300 mr-2" />
                 <span className="text-xs font-semibold tracking-wide text-green-50">
                   {hasAutoDND ? 'AUTO DND ACTIVE' : 'NOTIFICATIONS BLOCKED'}
                 </span>
              </div>
            );
          } else {
            return (
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center border border-orange-300/20 shadow-lg ring-1 ring-orange-300/5">
                 <BellOff className="w-3.5 h-3.5 text-orange-300 mr-2" />
                 <span className="text-xs font-semibold tracking-wide text-orange-50">SETUP REQUIRED</span>
              </div>
            );
          }
        })()}

        {showPermissionPrompt && (
          <div className="bg-orange-500/20 backdrop-blur-md px-3 py-2 rounded-lg flex items-center border border-orange-400/30 shadow-lg max-w-xs">
             <AlertTriangle className="w-3 h-3 text-orange-300 mr-2 flex-shrink-0" />
             <span className="text-xs text-orange-100 text-center">Enable Do Not Disturb manually for full notification blocking</span>
          </div>
        )}
      </div>

      {/* Main Timer Display */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Pulse Glow Container */}
        <div className="relative">
             {/* Breathing Glow Behind */}
             <div className={`absolute inset-0 rounded-full bg-blue-500/10 blur-3xl transition-all duration-[3000ms] ease-in-out ${!isPaused ? 'animate-pulse opacity-100 scale-105' : 'opacity-0 scale-95'}`}></div>

             {/* SVG Timer */}
             <div className="relative drop-shadow-2xl">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Track (Background Circle) */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#1e293b" // slate-800
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress (Foreground Circle) */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#0ea5e9" // sky-500
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`transition-all duration-300 ease-out ${isPaused ? 'opacity-50' : 'opacity-100'}`}
                        style={{
                            filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.4))'
                        }}
                    />
                </svg>

                {/* Centered Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <h1 className="text-7xl font-bold tracking-tighter tabular-nums text-white drop-shadow-lg">
                        {formatTime(secondsLeft)}
                    </h1>
                    
                    <div className="mt-4 flex flex-col items-center gap-1.5 opacity-90">
                         <span className="text-sm font-semibold text-blue-100 tracking-wide uppercase">Deep Focus</span>
                         
                         {/* Ambient Noise Indicator (Placeholder) */}
                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full ring-1 ring-white/5">
                             <Waves className="w-3 h-3" />
                             <span>Silence</span>
                         </div>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-16 w-full flex items-center justify-center z-20">
         <div className="relative flex items-center justify-center w-full max-w-[280px]">
             {/* Cancel Button - Absolute Left */}
             <div className={`absolute left-0 transition-all duration-300 transform ${isPaused ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-90 pointer-events-none'}`}>
                 <button 
                    onClick={() => onEnd(Math.floor((initialMinutes * 60 - secondsLeft) / 60))}
                    className="w-14 h-14 bg-slate-800/80 backdrop-blur text-red-400 rounded-full flex items-center justify-center hover:bg-slate-700/80 hover:text-red-300 transition-all active:scale-90 shadow-lg border border-white/5"
                    title="End Session"
                 >
                    <X className="w-6 h-6" strokeWidth={3} />
                 </button>
             </div>

             {/* Play/Pause Button - Centered */}
             <button 
               onClick={() => setIsPaused(!isPaused)}
               className="w-20 h-20 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all shadow-xl shadow-blue-500/10 active:scale-95 border-4 border-slate-900 ring-4 ring-white/10 relative z-10"
             >
               {isPaused ? (
                  <Play className="w-8 h-8 ml-1 fill-current" />
               ) : (
                  <Pause className="w-8 h-8 fill-current" />
               )}
             </button>
         </div>
      </div>
    </div>
  );
};