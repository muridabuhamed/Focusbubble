import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Users, UserPlus, Search, QrCode, Share2, Copy, X, Check, Clock, Crown, Lock, Sparkles, Swords, Smile, UserCheck, Bell, MessageCircle, ExternalLink, Mail, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User;
}

type Tab = 'global' | 'friends';

interface LeaderboardUser {
  id: number | string;
  name: string;
  hours: number;
  avatar: string;
  isMe?: boolean;
  isFriend?: boolean;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  type: 'challenge' | 'system' | 'rank';
}

interface FriendRequest {
    id: number;
    name: string;
    avatar: string;
    time: string;
}

interface AcceptedRequest {
    id: number;
    name: string;
    message: string;
}

export const Leaderboard: React.FC<Props> = ({ currentUser }) => {
  // FIX 1: Default to 'global' to prevent locked view from showing immediately
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isWeeklyShared, setIsWeeklyShared] = useState(false);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  // Dynamic Friends List State
  const [friendsList, setFriendsList] = useState<LeaderboardUser[]>([]);

  // Friend Requests State
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Accepted Requests Log
  const [acceptedRequests, setAcceptedRequests] = useState<AcceptedRequest[]>([
      { id: 301, name: 'Sarah J.', message: 'You and Sarah J. are now friends' }
  ]);

  // Initialize Friends List 
  useEffect(() => {
    if (friendsList.length === 0) {
        setFriendsList([
            { id: 4, name: 'You', hours: currentUser.totalHours, avatar: currentUser.avatar, isMe: true },
        ].sort((a, b) => b.hours - a.hours));
    } else {
        setFriendsList(prev => prev.map(u => u.isMe ? { ...u, hours: currentUser.totalHours, avatar: currentUser.avatar } : u).sort((a, b) => b.hours - a.hours));
    }
  }, [currentUser]);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
        id: 1, 
        title: 'New Challenge', 
        message: 'Sarah J. challenged you to a 2h focus duel!', 
        time: '2m ago', 
        read: false, 
        avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=100', 
        type: 'challenge' 
    },
    { 
        id: 2, 
        title: 'Rank Up', 
        message: 'You reached the top 5! Keep it up.', 
        time: '1h ago', 
        read: false, 
        type: 'rank' 
    },
    { 
        id: 3, 
        title: 'Weekly Summary', 
        message: 'Your weekly report is ready to view.', 
        time: '1d ago', 
        read: true, 
        type: 'system' 
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCloseAddModal = () => {
      setShowAddModal(false);
      setAcceptedRequests([]);
  };

  const handleAcceptRequest = (req: FriendRequest) => {
      const newFriend: LeaderboardUser = {
          id: req.id,
          name: req.name,
          hours: 0,
          avatar: req.avatar,
          isFriend: true
      };
      setFriendsList(prev => [...prev, newFriend].sort((a,b) => b.hours - a.hours));
      setFriendRequests(prev => prev.filter(r => r.id !== req.id));
      setAcceptedRequests(prev => [...prev, { id: req.id, name: req.name, message: `You and ${req.name} are now friends` }]);
  };

  const handleDeclineRequest = (id: number) => {
      setFriendRequests(prev => prev.filter(r => r.id !== id));
  };

  const getWeekId = () => {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(),0,1);
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return `${d.getFullYear()}-W${weekNo}`;
  };

  useEffect(() => {
     const weekId = getWeekId();
     const storageKey = `focusbubble_shared_${weekId}`;
     const saved = localStorage.getItem(storageKey);
     setIsWeeklyShared(!!saved);
  }, []);

  // Global Data (Memoized to prevent instability)
  const globalUsers = useMemo<LeaderboardUser[]>(() => [
    { id: 1, name: 'Alex M.', hours: 42, avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2150671124.jpg?w=100' },
    { id: 2, name: 'Sarah J.', hours: 38, avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=100' },
    { id: 3, name: 'Mike T.', hours: 35, avatar: 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?w=100' },
    { id: 4, name: 'You', hours: currentUser.totalHours, avatar: currentUser.avatar, isMe: true },
    { id: 5, name: 'Lisa K.', hours: 28, avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2150671126.jpg?w=100' },
    { id: 6, name: 'Tom H.', hours: 22, avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2150671120.jpg?w=100' },
  ].sort((a, b) => b.hours - a.hours), [currentUser]);

  // FIX 3: Check lock state
  const isLocked = activeTab === 'friends' && !currentUser.isPro;
  
  // FIX 4: Explicitly derive active data based on tab
  const activeData = useMemo(() => {
      return activeTab === 'global' ? globalUsers : friendsList;
  }, [activeTab, globalUsers, friendsList]);
  
  const showEmptyState = !isLocked && activeTab === 'friends' && activeData.length <= 1 && !activeData.some(u => !u.isMe);
  
  // FIX 5: Hide podium if locked to avoid overlapping UI
  const showPodium = !isLocked && !showEmptyState;
  
  // Memoize slices to ensure stability
  const topThree = useMemo(() => showPodium ? activeData.slice(0, 3) : [], [showPodium, activeData]);
  const restOfList = useMemo(() => showPodium ? activeData.slice(3) : activeData, [showPodium, activeData]);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (rank: number | null, hours: number) => {
    if (!currentUser.isVerified) {
        setShowVerifyModal(true);
        return;
    }

    const weekId = getWeekId();
    const storageKey = `focusbubble_shared_${weekId}`;

    if (isWeeklyShared) {
        localStorage.removeItem(storageKey);
        setIsWeeklyShared(false);
    } else {
        const postData = {
            username: currentUser.username,
            avatar: currentUser.avatar,
            hours: hours,
            sessions: 12,
            rank: rank,
            focusLevel: currentUser.focusLevel,
            weekId: weekId,
            postedAt: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(postData));
        setIsWeeklyShared(true);
    }
  };

  const handleAddFriendAction = (id: string | number) => {
      if (!currentUser.isVerified) {
          setShowVerifyModal(true);
          return;
      }
      
      setAddedFriends(prev => {
          const idStr = id.toString();
          // Toggle logic: If present, remove it. If missing, add it.
          if (prev.includes(idStr)) {
              return prev.filter(fid => fid !== idStr);
          } else {
              return [...prev, idStr];
          }
      });
  };

  const handleOpenAddModal = () => {
      setShowAddModal(true);
  };

  const handleProInteraction = () => {
      if (!currentUser.isVerified) {
          setShowVerifyModal(true);
          return;
      }
      if (!currentUser.isPro) {
          setShowProModal(true);
      } else {
          alert("Interaction sent! (Pro feature active)");
      }
  };

  const handleResendVerify = () => {
      alert("Verification email resent.");
  };

  const displayId = currentUser.username 
    ? (currentUser.username.startsWith('@') ? currentUser.username : `@${currentUser.username}`)
    : '@USER-8392';

  // Helper check for logged in user (Guest User is default)
  const isGuest = currentUser.name === 'Guest User';

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col pb-4 transition-colors duration-300 relative h-full">
       
       {/* Header Section */}
       <div className="bg-blue-600 dark:bg-blue-700 px-6 pt-10 pb-8 rounded-b-[2.5rem] text-white shadow-xl mb-4 relative z-10 overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Trophy className="w-32 h-32 transform rotate-12" />
          </div>

          {/* Top Bar */}
          <div className="flex items-start justify-between mb-6 relative z-10">
             <div>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="text-blue-200 text-sm mt-1">Based on focused hours this week</p>
             </div>
             <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="relative bg-blue-500/30 hover:bg-blue-500/50 text-white p-2 rounded-xl transition-all duration-150 active:scale-95 backdrop-blur-sm border border-white/10"
                     aria-label="Notifications"
                   >
                     <Bell className="w-5 h-5" />
                     {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600 animate-pulse"></span>
                     )}
                   </button>

                   <button 
                     onClick={handleOpenAddModal}
                     className="bg-blue-500/50 hover:bg-blue-500 text-white p-2 rounded-xl transition-all duration-150 active:scale-95 backdrop-blur-sm border border-white/20"
                     aria-label="Add Friend"
                   >
                     <UserPlus className="w-5 h-5" />
                   </button>
                </div>
                <div className="flex items-center text-[10px] font-medium bg-blue-800/40 px-2 py-1 rounded-lg text-blue-100 whitespace-nowrap">
                   <Clock className="w-3 h-3 mr-1" />
                   Resets in 3 days
                </div>
             </div>
          </div>

          {/* Toggle Tabs with Moving Background */}
          <div className="bg-black/20 p-1 rounded-xl flex mb-8 backdrop-blur-sm relative z-10">
             <div className={`absolute top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-200 ease-out z-0 ${activeTab === 'global' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'}`} />
             
             <button 
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-200 relative z-10 ${activeTab === 'global' ? 'text-blue-600' : 'text-blue-100 hover:text-white'}`}
             >
                Global
             </button>
             <button 
                onClick={() => setActiveTab('friends')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-200 relative z-10 ${activeTab === 'friends' ? 'text-blue-600' : 'text-blue-100 hover:text-white'}`}
             >
                Friends
             </button>
          </div>
          
          {/* Podium - Only show if enabled (not locked, not empty) */}
          {showPodium && (
            <div key={activeTab} className="flex justify-center items-end gap-2 sm:gap-6 min-h-[190px] relative z-10 pb-4 w-full max-w-sm mx-auto">
               
               {/* 2nd Place - Left */}
               {topThree[1] && (
                 <div className="flex flex-col items-center justify-end w-24 animate-slide-in-left">
                    <div className="relative mb-2">
                       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-300 dark:border-blue-400 overflow-hidden shadow-md ring-2 ring-blue-300/30">
                           <img src={topThree[1].avatar} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-blue-100 shadow-sm z-10">
                           2
                       </div>
                    </div>
                    <div className="text-center mt-1">
                        <p className="font-bold text-xs sm:text-sm text-white truncate max-w-[80px] drop-shadow-sm">{topThree[1].name}</p>
                        <span className="text-[10px] sm:text-xs text-blue-100 font-medium bg-blue-800/30 px-2 py-0.5 rounded-full inline-block mt-1">
                            {Math.round(topThree[1].hours)}h
                        </span>
                    </div>
                 </div>
               )}
               
               {/* 1st Place - Center (Lifted by mb-8) */}
               {topThree[0] && (
                 <div className="flex flex-col items-center justify-end w-28 mb-8 animate-pop-in z-20">
                     <div className="relative mb-2">
                        <Trophy className="w-8 h-8 text-yellow-300 absolute -top-10 left-1/2 transform -translate-x-1/2 drop-shadow-lg animate-bounce" />
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-xl ring-4 ring-yellow-400/30">
                            <img src={topThree[0].avatar} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 w-7 h-7 flex items-center justify-center text-sm font-bold rounded-full border-2 border-white shadow-sm z-10">
                            1
                        </div>
                     </div>
                    <div className="text-center mt-1">
                        <p className="font-bold text-sm sm:text-base text-white truncate max-w-[100px] drop-shadow-md">{topThree[0].name}</p>
                        <span className="text-xs sm:text-sm text-yellow-100 font-bold bg-yellow-500/30 px-3 py-0.5 rounded-full inline-block mt-1 border border-yellow-400/20">
                            {Math.round(topThree[0].hours)}h
                        </span>
                    </div>
                 </div>
               )}

               {/* 3rd Place - Right */}
               {topThree[2] && (
                 <div className="flex flex-col items-center justify-end w-24 animate-slide-in-right">
                    <div className="relative mb-2">
                       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-400 overflow-hidden shadow-md ring-2 ring-orange-400/30">
                           <img src={topThree[2].avatar} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-orange-100 shadow-sm z-10">
                           3
                       </div>
                    </div>
                    <div className="text-center mt-1">
                        <p className="font-bold text-xs sm:text-sm text-white truncate max-w-[80px] drop-shadow-sm">{topThree[2].name}</p>
                        <span className="text-[10px] sm:text-xs text-orange-100 font-medium bg-orange-800/30 px-2 py-0.5 rounded-full inline-block mt-1">
                            {Math.round(topThree[2].hours)}h
                        </span>
                    </div>
                 </div>
               )}
            </div>
          )}
          
          {/* Locked Header Placeholder: Show a nice graphic or just space if podium is hidden */}
          {isLocked && (
              <div className="flex flex-col items-center justify-center py-6 text-blue-200/80">
                  <Lock className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Locked for Guests</span>
              </div>
          )}
       </div>

       {/* Main Content Area */}
       <div className="flex-1 px-4 overflow-y-auto pb-4 relative">
          {/* Smooth transition container for content height changes */}
          <div className="transition-all duration-300 ease-in-out">
            {/* FIX 6: Render Locked View directly in flow (not overlay) if locked */}
            {isLocked ? (
                <div className="flex flex-col items-center justify-center h-full animate-fade-in-up pb-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-blue-100 dark:border-slate-800 w-full max-w-sm text-center">
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/30">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Unlock FocusBubble+</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            See your friends' stats and compete on the leaderboard to stay motivated.
                        </p>
                        <button 
                            onClick={() => setShowProModal(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.97] flex items-center justify-center duration-150"
                        >
                            <Sparkles className="w-5 h-5 mr-2 text-yellow-200" fill="currentColor" />
                            Upgrade Now
                        </button>
                    </div>
                </div>
            ) : (
                /* Render List Content */
                <div>
                    {showEmptyState ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-6 animate-fade-in-up">
                            <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-full mb-6 shadow-sm">
                            <Users className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You have no friends yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                            Compete with friends to stay motivated.<br/>Add them from the Global list!
                            </p>
                            <button 
                            onClick={() => setActiveTab('global')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-[0.97] duration-150 flex items-center"
                            >
                            <Users className="w-5 h-5 mr-2" />
                            Find Friends
                            </button>
                        </div>
                    ) : (
                        restOfList.map((u, i) => (
                        <div 
                            key={u.id} 
                            style={{ animationDelay: `${i * 60}ms` }}
                            className={`animate-fade-in-up flex items-center p-4 mb-3 rounded-2xl border shadow-sm transition-transform active:scale-[0.98] duration-150 relative overflow-hidden active:bg-blue-50 dark:active:bg-slate-800 ${
                            u.isMe 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
                        }`}>
                            {u.isMe && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-r-md" />
                            )}

                            <span className={`font-bold w-6 text-center z-10 ${u.isMe ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{i + 4}</span>
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden mx-3 border border-gray-100 dark:border-slate-700 z-10">
                                <img src={u.avatar} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 z-10">
                                <h3 className={`font-bold text-sm flex items-center gap-2 ${u.isMe ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {u.name} 
                                {u.isMe && (
                                    <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                                        You
                                    </span>
                                )}
                                </h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500">12 sessions this week</p>
                            </div>
                            <div className="text-right z-10 flex items-center gap-2">
                                {u.isMe ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleShare(i + 4, Math.round(u.hours)); }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.97] ${
                                            isWeeklyShared 
                                            ? 'bg-blue-600 border-transparent' 
                                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                                        }`}
                                        aria-label={isWeeklyShared ? "Remove from community feed" : "Share to global community feed"}
                                    >
                                        <span className={`font-bold text-sm ${isWeeklyShared ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                            {Math.round(u.hours)}h
                                        </span>
                                        <Share2 className={`w-3.5 h-3.5 ${isWeeklyShared ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                                    </button>
                                ) : (
                                    <>
                                        <span className="block font-bold text-gray-800 dark:text-gray-200 mr-2">{Math.round(u.hours)}h</span>
                                        
                                        {/* ADD FRIEND BUTTON: Visible if Global Tab, Verified, Not Guest, Not Me, Not already a Friend */}
                                        {activeTab === 'global' && currentUser.isVerified && !isGuest && !friendsList.some(f => f.id === u.id) && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAddFriendAction(u.id); }}
                                                className={`p-2 rounded-full transition-all duration-150 active:scale-[0.85] ${
                                                    addedFriends.includes(u.id.toString())
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : 'bg-gray-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {addedFriends.includes(u.id.toString()) ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                            </button>
                                        )}

                                        {activeTab === 'friends' && (
                                            <>
                                                <button 
                                                    onClick={handleProInteraction}
                                                    className="p-2 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-150 active:scale-[0.85]"
                                                    title="Send Challenge (Pro)"
                                                >
                                                    <Swords className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={handleProInteraction}
                                                    className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-150 active:scale-[0.85]"
                                                    title="React (Pro)"
                                                >
                                                    <Smile className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        ))
                    )}
                </div>
            )}
          </div>
       </div>

       {/* Notification Center Modal */}
       {showNotifications && (
         <div className="absolute top-24 right-4 z-50 w-full max-w-sm">
             <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-pop-in">
                 {/* Header */}
                 <div className="px-5 py-4 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Stay updated with your friends</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline px-2">
                                Mark all read
                            </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                 </div>
                 
                 {/* List */}
                 <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                <Bell className="w-6 h-6" />
                            </div>
                            <p className="text-gray-400 text-sm">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div 
                              key={n.id}
                              onClick={() => handleNotificationClick(n.id)}
                              className={`p-4 border-b border-gray-50 dark:border-slate-800 cursor-pointer transition-colors flex gap-3 items-start relative group
                                  ${n.read 
                                    ? 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50' 
                                    : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30'
                                  }
                              `}
                            >
                               {!n.read && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                               )}
                               <div className="shrink-0 mt-0.5">
                                  {n.avatar ? (
                                      <img src={n.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-700" />
                                  ) : (
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${
                                          n.type === 'rank' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                                      }`}>
                                          {n.type === 'rank' ? <Trophy className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                                      </div>
                                  )}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                      <p className={`text-sm truncate pr-2 ${n.read ? 'font-medium text-gray-900 dark:text-gray-200' : 'font-bold text-gray-900 dark:text-white'}`}>
                                          {n.title}
                                      </p>
                                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.time}</span>
                                  </div>
                                  <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${n.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                                      {n.message}
                                  </p>
                               </div>
                            </div>
                        ))
                    )}
                 </div>
             </div>
         </div>
       )}

       {/* Add Friend Modal */}
       {showAddModal && (
         <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4 sm:p-0">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-slate-800 animate-slide-up sm:animate-pop-in max-h-[85vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Friends</h2>
                  <button onClick={handleCloseAddModal} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-90 transition-transform">
                     <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
               </div>
               <div className="relative mb-6">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter username or ID"
                    className="w-full bg-gray-50 dark:bg-slate-800 pl-11 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-shadow"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <button className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-4 rounded-2xl transition-all border border-blue-100 dark:border-blue-900/50 group active:scale-[0.97]">
                     <div className="bg-white dark:bg-blue-900 p-3 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                        <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                     </div>
                     <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Scan to add</span>
                  </button>
                  <button onClick={handleCopyLink} className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 p-4 rounded-2xl transition-all border border-purple-100 dark:border-purple-900/50 group active:scale-[0.97]">
                     <div className="bg-white dark:bg-purple-900 p-3 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                        {copied ? <Check className="w-6 h-6 text-green-500" /> : <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                     </div>
                     <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{copied ? 'Link Copied!' : 'Invite friends'}</span>
                  </button>
               </div>
               {/* ... (Request content same as before) ... */}
               <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                     <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">My User ID</span>
                     <p className="font-mono font-bold text-gray-900 dark:text-white tracking-wide">{displayId}</p>
                  </div>
                  <button onClick={handleCopyLink} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 active:scale-90 transition-transform">
                     <Copy className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
       )}

       {/* Pro Modal */}
       {showProModal && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-6">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/20 relative animate-pop-in">
               <button 
                 onClick={() => setShowProModal(false)}
                 className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-90 transition-transform"
               >
                 <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
               <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-200 dark:shadow-orange-900/20">
                  <Crown className="w-8 h-8 text-white" fill="currentColor" />
               </div>
               <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Pro Feature</h2>
               <p className="text-center text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Competing with friends requires FocusBubble+. Unlock the full experience.
               </p>
               <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-[0.97] flex items-center justify-center duration-150">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-200" fill="currentColor" />
                  Upgrade Now
               </button>
            </div>
         </div>
       )}

       {/* Verification Required Modal */}
       {showVerifyModal && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-6">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/20 relative animate-pop-in">
               <button 
                 onClick={() => setShowVerifyModal(false)}
                 className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-90 transition-transform"
               >
                 <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
               <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
               </div>
               <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Email verification required</h2>
               <p className="text-center text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Please verify your email to access this feature.
               </p>
               <div className="space-y-3">
                    <a href="mailto:" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-[0.97] duration-150">
                        Open Email App
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                    <button 
                        onClick={handleResendVerify}
                        className="w-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-[0.97] duration-150"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Verification Email
                    </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};