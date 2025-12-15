import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Clock, 
  Zap, 
  Bell, 
  Coffee, 
  HelpCircle, 
  Star,
  UserPlus,
  Check,
  X,
  Edit,
  Camera,
  Save,
  Shield
} from 'lucide-react';
import { User, AppScreen } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  user: User;
  onLogin: () => void;
  onLogout?: () => void;
  onNavigate: (screen: AppScreen) => void;
  onUpdateUser: (user: User) => void;
}

interface Preferences {
  defaultTimer: number;
  hapticFeedback: boolean;
  dailyReminders: boolean;
  breakAlerts: boolean;
  blockNotifications: boolean;
}

export const Settings: React.FC<Props> = ({ user, onLogin, onLogout, onNavigate, onUpdateUser }) => {
  const { themeMode, setThemeMode } = useTheme();
  
  // Preference State
  const [preferences, setPreferences] = useState<Preferences>({
    defaultTimer: 25,
    hapticFeedback: true,
    dailyReminders: true,
    breakAlerts: false,
    blockNotifications: true
  });

  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  
  // Edit Profile State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    avatar: ''
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('focusbubble_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Initialize edit form when modal opens
  useEffect(() => {
    if (isEditProfileOpen) {
      setEditForm({
        name: user.name,
        username: user.username || '',
        email: user.email,
        avatar: user.avatar
      });
    }
  }, [isEditProfileOpen, user]);

  // Save preference helper
  const updatePreference = (key: keyof Preferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('focusbubble_preferences', JSON.stringify(newPrefs));
  };

  const isGuest = user.name === "Guest User";
  const timerOptions = [10, 15, 20, 25, 30, 45, 60, 90, 120];

  const handleSupportClick = (action: string) => {
      // Simulation for support actions
      if (action === 'help') {
          alert("Opening FocusBubble Help Center...");
      } else if (action === 'rate') {
          alert("Thank you for rating FocusBubble! ⭐⭐⭐⭐⭐");
      }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const saveProfile = () => {
      if (!editForm.name.trim()) return;
      onUpdateUser({
          ...user,
          name: editForm.name,
          username: editForm.username,
          // email: editForm.email, // Email update disabled based on user request
          avatar: editForm.avatar
      });
      setIsEditProfileOpen(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Fixed Header with Backdrop Blur */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 pt-12 pb-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-slate-800/50 flex items-center transition-all duration-300">
        <button 
          onClick={() => onNavigate(AppScreen.HOME)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-white transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2 flex-1 text-center pr-8">
          {isGuest ? 'Guest Settings' : 'Profile & Settings'}
        </h1>
      </div>

      {/* Scrollable Content Container - pt-32 prevents overlap with fixed header */}
      <div className="flex-1 w-full h-full overflow-y-auto px-6 pt-32 pb-32 scrollbar-hide">
        
        {/* Guest Warning Card */}
        {isGuest && (
            <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-[2rem] p-6 mb-6 flex flex-col items-center text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You are in Guest Mode</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                   Create an account to save your progress and join the leaderboard.
                </p>
                <button 
                    onClick={onLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-[0.97] duration-150"
                >
                    Create Free Account
                </button>
            </div>
        )}

        {/* Normal Profile Card (Hidden for Guest) */}
        {!isGuest && (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 flex flex-col items-center text-center relative overflow-hidden mt-2 animate-fade-in-up">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-400 to-cyan-300 mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900" 
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full uppercase tracking-wide">
                Focus Level: {user.focusLevel}
            </div>
            
            <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors group"
            >
                <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Edit Profile
            </button>
            </div>
        )}

        {/* Appearance Section */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
           <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 ml-2">Appearance</h3>
           <div className="flex gap-3">
              <ThemeOption 
                icon={Sun} 
                label="Light" 
                isSelected={themeMode === 'light'} 
                onClick={() => setThemeMode('light')} 
              />
              <ThemeOption 
                icon={Moon} 
                label="Dark" 
                isSelected={themeMode === 'dark'} 
                onClick={() => setThemeMode('dark')} 
              />
           </div>
        </div>

        {/* Focus Preferences */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
           <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 ml-2">Focus Preferences</h3>
           <div className="space-y-3">
              <SettingRow 
                 icon={Clock} 
                 label="Default Timer" 
                 rightElement={<div className="flex items-center text-slate-400 font-medium text-sm">{preferences.defaultTimer} min <ChevronRight className="w-4 h-4 ml-2" /></div>} 
                 onClick={() => setIsTimerModalOpen(true)}
              />
              <SettingRow 
                 icon={Zap} 
                 label="Haptic Feedback" 
                 rightElement={<Toggle isActive={preferences.hapticFeedback} />} 
                 onClick={() => updatePreference('hapticFeedback', !preferences.hapticFeedback)}
              />
           </div>
        </div>

        {/* Notifications */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
           <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 ml-2">Notifications</h3>
           <div className="space-y-3">
              <SettingRow 
                 icon={Shield} 
                 label="Block During Focus" 
                 rightElement={<Toggle isActive={preferences.blockNotifications} />} 
                 onClick={() => updatePreference('blockNotifications', !preferences.blockNotifications)}
              />
              <SettingRow 
                 icon={Bell} 
                 label="Daily Reminders" 
                 rightElement={<Toggle isActive={preferences.dailyReminders} />} 
                 onClick={() => updatePreference('dailyReminders', !preferences.dailyReminders)}
              />
              <SettingRow 
                 icon={Coffee} 
                 label="Break Alerts" 
                 rightElement={<Toggle isActive={preferences.breakAlerts} />} 
                 onClick={() => updatePreference('breakAlerts', !preferences.breakAlerts)}
              />
           </div>
        </div>

        {/* Support */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
           <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 ml-2">Support</h3>
           <div className="space-y-3">
              <SettingRow 
                 icon={HelpCircle} 
                 label="Help Center" 
                 rightElement={<ChevronRight className="w-4 h-4 text-slate-400" />} 
                 onClick={() => handleSupportClick('help')}
              />
              <SettingRow 
                 icon={Star} 
                 label="Rate the App" 
                 rightElement={<ChevronRight className="w-4 h-4 text-slate-400" />} 
                 onClick={() => handleSupportClick('rate')}
              />
           </div>
        </div>

        {/* Logout & Version */}
        <div className="flex flex-col items-center space-y-4 mb-8 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
           {isGuest ? (
              <button 
                onClick={onLogin}
                className="text-gray-400 dark:text-gray-500 font-medium text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                 Exit Guest Mode
              </button>
           ) : (
             <button 
               onClick={onLogout}
               className="text-red-500 font-bold text-base hover:opacity-80 transition-opacity active:scale-95"
             >
                Log Out
             </button>
           )}
           <span className="text-xs text-slate-400 font-medium">Version 1.0.3</span>
        </div>
      </div>

      {/* Timer Selection Modal */}
      {isTimerModalOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-6">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/20 relative animate-pop-in max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Default Timer</h3>
                  <button onClick={() => setIsTimerModalOpen(false)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 overflow-y-auto">
                 {timerOptions.map(min => (
                     <button
                        key={min}
                        onClick={() => {
                            updatePreference('defaultTimer', min);
                            setIsTimerModalOpen(false);
                        }}
                        className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${
                            preferences.defaultTimer === min
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
                            : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                     >
                        {min} min
                     </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in sm:p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl border border-white/20 relative animate-slide-up sm:animate-pop-in max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                    <button onClick={() => setIsEditProfileOpen(false)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Avatar Edit */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-400 to-cyan-300 shadow-lg">
                            <img src={editForm.avatar} className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900" alt="Avatar Preview" />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors active:scale-90 transform">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-medium">Tap icon to change</p>
                </div>

                {/* Fields */}
                <div className="space-y-5 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Full Name</label>
                        <input 
                            value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none dark:text-white font-medium transition-all"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                            <input 
                                value={editForm.username.replace('@', '')}
                                onChange={e => setEditForm({...editForm, username: '@' + e.target.value.replace('@', '')})}
                                className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none dark:text-white font-medium transition-all"
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
                        <input 
                            value={editForm.email}
                            disabled
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed opacity-80"
                            placeholder="Email Address"
                        />
                         <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 ml-1">Email cannot be changed.</p>
                    </div>
                </div>

                {/* Save Button */}
                <button 
                    onClick={saveProfile}
                    disabled={!editForm.name.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center shadow-lg transition-all active:scale-95 ${!editForm.name.trim() ? 'bg-gray-300 dark:bg-slate-800 cursor-not-allowed text-gray-500' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30'}`}
                >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

// Sub-components

const ThemeOption: React.FC<{
  icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isSelected, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all duration-200 active:scale-95 shadow-sm ${
      isSelected 
        ? 'bg-white dark:bg-slate-800 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800'
    }`}
  >
     <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'stroke-2' : 'stroke-1'}`} />
     <span className="text-sm font-bold">{label}</span>
  </button>
);

const SettingRow: React.FC<{
  icon: React.ElementType;
  label: string;
  rightElement: React.ReactNode;
  onClick?: () => void;
}> = ({ icon: Icon, label, rightElement, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-transform duration-100 ${onClick ? 'active:scale-[0.99] cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50' : ''}`}
  >
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
           <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
     </div>
     {rightElement}
  </div>
);

const Toggle: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
     <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);