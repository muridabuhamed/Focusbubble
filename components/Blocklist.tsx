import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Camera, 
  Music, 
  Video, 
  Mail, 
  MessageCircle, 
  Search, 
  Plus, 
  X, 
  Smartphone, 
  ShoppingBag, 
  Gamepad2, 
  Tv, 
  Globe, 
  Hash, 
  Ghost,
  User,
  Zap,
  Coffee,
  List,
  Grid,
  Info
} from 'lucide-react';
import { BlockApp } from '../types';

interface Props {
  onBack: () => void;
  apps: BlockApp[];
  setApps: React.Dispatch<React.SetStateAction<BlockApp[]>>;
}

type Profile = 'Custom' | 'Deep Focus' | 'Social Detox';
type ViewMode = 'categories' | 'all';

export const Blocklist: React.FC<Props> = ({ onBack, apps, setApps }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState<Profile>('Custom');
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Helper to get generic icons
  const getIcon = (iconName: string, className = "w-6 h-6") => {
      switch (iconName) {
          case 'camera': return <Camera className={className} />;
          case 'music': return <Music className={className} />;
          case 'video': return <Video className={className} />;
          case 'mail': return <Mail className={className} />;
          case 'message': return <MessageCircle className={className} />;
          case 'shopping-bag': return <ShoppingBag className={className} />;
          case 'gamepad-2': return <Gamepad2 className={className} />;
          case 'tv': return <Tv className={className} />;
          case 'globe': return <Globe className={className} />;
          case 'hash': return <Hash className={className} />;
          case 'ghost': return <Ghost className={className} />;
          default: return <Smartphone className={className} />;
      }
  };

  const getCategoryColor = (category: string) => {
      switch (category) {
          case 'social': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
          case 'games': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
          case 'entertainment': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
          case 'shopping': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
          case 'productivity': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
          default: return 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400';
      }
  };

  const getProfileIcon = (profile: Profile) => {
      switch (profile) {
          case 'Custom': return <User className="w-3.5 h-3.5 mr-1.5" />;
          case 'Deep Focus': return <Zap className="w-3.5 h-3.5 mr-1.5" />;
          case 'Social Detox': return <Coffee className="w-3.5 h-3.5 mr-1.5" />;
      }
  };

  const toggleApp = (id: string) => {
    setActiveProfile('Custom'); // Switch to custom if user manually toggles
    setApps(apps.map(app => app.id === id ? { ...app, isBlocked: !app.isBlocked } : app));
  };

  const handleProfileChange = (profile: Profile) => {
      setActiveProfile(profile);
      if (profile === 'Deep Focus') {
          // Block Social, Games, Entertainment
          setApps(prev => prev.map(a => ({
              ...a,
              isBlocked: ['social', 'games', 'entertainment'].includes(a.category)
          })));
      } else if (profile === 'Social Detox') {
          // Block only Social
          setApps(prev => prev.map(a => ({
              ...a,
              isBlocked: a.category === 'social'
          })));
      }
  };

  const handleAddApp = () => {
      if (!newAppName.trim()) return;
      const newApp: BlockApp = {
          id: Date.now().toString(),
          name: newAppName,
          icon: 'default',
          category: 'other',
          isBlocked: true,
          usage: 'New'
      };
      setApps([...apps, newApp]);
      setNewAppName('');
      setShowAddModal(false);
  };

  const handleScanDevice = () => {
      setIsScanning(true);
      setTimeout(() => {
          // Simulate finding new apps
          const discoveredApps: BlockApp[] = [
              { id: '101', name: 'Pinterest', icon: 'camera', isBlocked: true, category: 'social', usage: '35m avg' },
              { id: '102', name: 'Discord', icon: 'message', isBlocked: false, category: 'social', usage: '2h avg' },
              { id: '103', name: 'Spotify', icon: 'music', isBlocked: false, category: 'entertainment', usage: '4h avg' },
          ];
          // Filter out duplicates based on name
          const existingNames = new Set(apps.map(a => a.name));
          const newUnique = discoveredApps.filter(a => !existingNames.has(a.name));
          
          setApps(prev => [...prev, ...newUnique]);
          setIsScanning(false);
          alert(`Scan complete! Found ${newUnique.length} new apps.`);
      }, 1500);
  };

  // Filter and Group Apps
  const filteredApps = apps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Dynamic Grouping
  const groupedApps = useMemo(() => {
      const groups: Record<string, BlockApp[]> = {};
      filteredApps.forEach(app => {
          const cat = app.category.charAt(0).toUpperCase() + app.category.slice(1);
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(app);
      });
      return groups;
  }, [filteredApps]);

  const categories = Object.keys(groupedApps).sort();
  const allAppsAlphabetical = [...filteredApps].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-6 pt-6 pb-2 shadow-sm z-20 sticky top-0 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold ml-2 text-gray-900 dark:text-white">Blocklist</h1>
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="p-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all placeholder-gray-400"
            />
        </div>

        {/* Profile Selector */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-3">
            {['Custom', 'Deep Focus', 'Social Detox'].map(p => (
                <button
                    key={p}
                    onClick={() => handleProfileChange(p as Profile)}
                    className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        activeProfile === p 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20' 
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                    {getProfileIcon(p as Profile)}
                    {p}
                </button>
            ))}
            <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-200"
            >
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg mb-2">
            <button 
                onClick={() => setViewMode('categories')}
                className={`flex-1 flex items-center justify-center py-1.5 text-xs font-bold rounded-md transition-all ${
                    viewMode === 'categories' 
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
            >
                <Grid className="w-3 h-3 mr-1.5" /> Categories
            </button>
            <button 
                onClick={() => setViewMode('all')}
                className={`flex-1 flex items-center justify-center py-1.5 text-xs font-bold rounded-md transition-all ${
                    viewMode === 'all' 
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
            >
                <List className="w-3 h-3 mr-1.5" /> All Apps
            </button>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide">
        
        {/* UX Tip */}
        {showTip && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 mb-6 relative shadow-lg shadow-blue-200 dark:shadow-blue-900/10 animate-fade-in-up text-white">
                <button 
                    onClick={() => setShowTip(false)}
                    className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-3 h-3 text-blue-100" />
                </button>
                <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-1.5 rounded-lg mt-0.5">
                        <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-medium leading-relaxed text-blue-50">
                            Tip: You can scan your device for all apps, search by name, or create multiple focus modes for different times of the day.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Scan Button CTA - Improved Visibility */}
        <button 
            onClick={handleScanDevice}
            disabled={isScanning}
            className="w-full mb-6 bg-white dark:bg-slate-900 border border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
        >
            {isScanning ? (
                <>Scanning Device...</>
            ) : (
                <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Scan for new apps
                </>
            )}
        </button>

        {filteredApps.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Ghost className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No apps found.</p>
            </div>
        ) : (
            <>
                {viewMode === 'categories' ? (
                    categories.map(cat => (
                        <div key={cat} className="mb-8 animate-fade-in-up">
                            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center">
                                {cat}
                                <span className="ml-2 bg-gray-100 dark:bg-slate-800 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">
                                    {groupedApps[cat].length}
                                </span>
                            </h2>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden divide-y divide-gray-50 dark:divide-slate-800">
                                {groupedApps[cat].map(app => (
                                    <AppItem key={app.id} app={app} toggleApp={toggleApp} getIcon={getIcon} getCategoryColor={getCategoryColor} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden divide-y divide-gray-50 dark:divide-slate-800 animate-fade-in-up">
                         {allAppsAlphabetical.map(app => (
                             <AppItem key={app.id} app={app} toggleApp={toggleApp} getIcon={getIcon} getCategoryColor={getCategoryColor} />
                         ))}
                    </div>
                )}
            </>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 max-w-md mx-auto z-30">
         <button 
            onClick={onBack} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-95"
         >
            <Save className="w-5 h-5 mr-2" />
            Save Blocklist
         </button>
      </div>

      {/* Add Custom App Modal */}
      {showAddModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-pop-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Custom App</h3>
                      <button onClick={() => setShowAddModal(false)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                          <X className="w-5 h-5 text-gray-500" />
                      </button>
                  </div>
                  
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">App Name</label>
                      <input 
                          autoFocus
                          value={newAppName}
                          onChange={(e) => setNewAppName(e.target.value)}
                          placeholder="e.g. Netflix"
                          className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                  </div>

                  <button 
                      onClick={handleAddApp}
                      disabled={!newAppName.trim()}
                      className="w-full bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
                  >
                      Add App
                  </button>
              </div>
          </div>
      )}

      {/* Create Profile Modal Placeholder */}
      {showProfileModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-fade-in">
             <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-pop-in text-center">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Grid className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create New Mode</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Customize which apps to block for specific activities like "Study" or "Sleep".
                 </p>
                 <button 
                    onClick={() => setShowProfileModal(false)}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mb-3"
                 >
                    Create (Pro Feature)
                 </button>
                 <button 
                    onClick={() => setShowProfileModal(false)}
                    className="w-full text-gray-500 font-bold py-2"
                 >
                    Cancel
                 </button>
             </div>
          </div>
      )}
    </div>
  );
};

// Subcomponent for App Item
const AppItem: React.FC<{
    app: BlockApp;
    toggleApp: (id: string) => void;
    getIcon: (name: string, className?: string) => React.ReactNode;
    getCategoryColor: (cat: string) => string;
}> = ({ app, toggleApp, getIcon, getCategoryColor }) => (
    <div 
        onClick={() => toggleApp(app.id)}
        className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
    >
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(app.category)}`}>
                {getIcon(app.icon)}
            </div>
            <div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm block">{app.name}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium flex items-center mt-0.5">
                    {app.usage || 'Not used recently'}
                </span>
            </div>
        </div>
        
        <button 
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 relative ${
                app.isBlocked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'
            }`}
        >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                app.isBlocked ? 'translate-x-5' : 'translate-x-0'
            }`} />
        </button>
    </div>
);