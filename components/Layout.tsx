import React from 'react';
import { Home, BarChart2, Award, Settings, LogIn } from 'lucide-react';
import { AppScreen } from '../types';

interface Props {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  isGuest?: boolean;
  onSignup?: () => void;
  // Slots for persistent screens
  homeScreen: React.ReactNode;
  statsScreen: React.ReactNode;
  leaderboardScreen: React.ReactNode;
  settingsScreen: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ 
  currentScreen, 
  onNavigate, 
  isGuest = false, 
  onSignup,
  homeScreen,
  statsScreen,
  leaderboardScreen,
  settingsScreen
}) => {
  const navItems = [
    { id: AppScreen.HOME, icon: Home, label: 'Home' },
    { id: AppScreen.STATS, icon: BarChart2, label: 'Stats' },
    // Leaderboard hidden for this version
    // { id: AppScreen.LEADERBOARD, icon: Award, label: 'Ranks' },
    { id: AppScreen.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  // Helper to manage visibility styles for persistent mounting
  const getTabStyle = (screenId: AppScreen) => {
    const isActive = currentScreen === screenId;
    return {
      // Toggle pointer events to prevent clicking hidden items
      pointerEvents: isActive ? 'auto' : 'none',
      // Fade and slide transition
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0)' : 'translateY(15px)',
      // Keep inactive tabs in the flow but stacked or hidden
      // We use absolute positioning for inactive to prevent layout shift, 
      // but active needs to be relative to take up space.
      // However, making them all absolute works if the parent has height.
      // Better approach: Absolute inset-0 for all, with z-index control.
      position: 'absolute',
      inset: 0,
      zIndex: isActive ? 10 : 0,
      transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      overflow: 'hidden', // Contain scrolling
      display: 'flex', // Maintain flex layout of children
      flexDirection: 'column'
    } as React.CSSProperties;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950 relative transition-colors duration-300 overflow-hidden">
      {/* Main Content Area - Stacked Screens */}
      <div className="flex-1 relative w-full overflow-hidden">
        
        <div style={getTabStyle(AppScreen.HOME)}>
           {homeScreen}
        </div>

        <div style={getTabStyle(AppScreen.STATS)}>
           {statsScreen}
        </div>

        <div style={getTabStyle(AppScreen.LEADERBOARD)}>
           {leaderboardScreen}
        </div>

        <div style={getTabStyle(AppScreen.SETTINGS)}>
           {settingsScreen}
        </div>

      </div>
      
      {/* Bottom Nav or Guest CTA */}
      <div className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-50 transition-colors duration-300 safe-area-bottom relative">
        {isGuest ? (
          <div className="px-6 py-4 flex items-center justify-between bg-slate-900 dark:bg-slate-800 text-white">
            <div className="flex flex-col">
              <span className="font-bold text-sm">Guest Mode</span>
              <span className="text-xs text-slate-400">Sync your progress</span>
            </div>
            <button 
              onClick={onSignup}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97] flex items-center shadow-lg shadow-blue-900/20"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign Up
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <item.icon className={`w-7 h-7 mb-1.5 transition-colors ${isActive ? 'fill-blue-100 dark:fill-blue-900/30' : ''}`} />
                  <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};