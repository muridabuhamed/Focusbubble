import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LabelList 
} from 'recharts';
import { 
  Zap, 
  Clock, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
}

const data = [
  { day: 'Mon', short: 'M', hours: 0 },
  { day: 'Tue', short: 'T', hours: 0 },
  { day: 'Wed', short: 'W', hours: 0 },
  { day: 'Thu', short: 'T', hours: 0 },
  { day: 'Fri', short: 'F', hours: 0 },
  { day: 'Sat', short: 'S', hours: 0 },
  { day: 'Sun', short: 'S', hours: 0 },
];

export const Stats: React.FC<Props> = ({ user }) => {
  
  // Calculate Summary Metrics
  const summary = useMemo(() => {
    const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);
    const avgDaily = (totalHours / data.length).toFixed(1);
    const maxDay = data.reduce((prev, current) => (prev.hours > current.hours) ? prev : current);
    const consistency = Math.round((data.filter(d => d.hours > 0).length / 7) * 100);
    
    return { totalHours, avgDaily, maxDay, consistency };
  }, []);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-slate-950 overflow-y-auto pb-24 transition-colors duration-300 scrollbar-hide">
      
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in-up">Your Stats</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            Track your focus journey this week.
        </p>
      </div>
      
      {/* Top Widgets */}
      <div className="px-6 mb-8 grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
           {/* Streak Widget */}
           <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group active:scale-95 transition-all duration-200">
             <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
             <div className="bg-blue-50 dark:bg-blue-900/20 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400">
               <Zap className="w-4 h-4 fill-current" />
             </div>
             <div className="relative z-10">
                <span className="text-2xl font-bold text-gray-900 dark:text-white block">{user.streak}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Day Streak</span>
             </div>
           </div>
           
           {/* Total Hours Widget */}
           <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group active:scale-95 transition-all duration-200">
             <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
             <div className="bg-purple-50 dark:bg-purple-900/20 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-purple-600 dark:text-purple-400">
               <Clock className="w-4 h-4" />
             </div>
             <div className="relative z-10">
                <span className="text-2xl font-bold text-gray-900 dark:text-white block">{user.totalHours}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Hours</span>
             </div>
           </div>
           
           {/* Badges Widget */}
           <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group active:scale-95 transition-all duration-200">
             <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
             <div className="bg-yellow-50 dark:bg-yellow-900/20 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-yellow-600 dark:text-yellow-400">
               <Award className="w-4 h-4" />
             </div>
             <div className="relative z-10">
                <span className="text-2xl font-bold text-gray-900 dark:text-white block">12</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badges</span>
             </div>
           </div>
      </div>

      {/* Main Chart Section */}
      <div className="px-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Weekly Focus</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total {summary.totalHours.toFixed(1)} hours</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg flex items-center">
                    <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">+12%</span>
                </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="short" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}}
                    tickCount={5}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.05)', radius: 8}} 
                    contentStyle={{
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '8px 12px'
                    }} 
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                    formatter={(value: number) => [`${value}h`, 'Focus Time']}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 6, 6]} animationDuration={1500}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.hours > 3.5 ? '#2563EB' : '#93C5FD'} 
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                    <LabelList 
                        dataKey="hours" 
                        position="top" 
                        formatter={(val: number) => val > 0 ? `${val}h` : ''} 
                        style={{ fill: '#64748b', fontSize: '10px', fontWeight: 600 }}
                        offset={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="px-6 mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
         <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 ml-1">This Week Summary</h3>
         <div className="grid grid-cols-2 gap-4">
            
            {/* Best Day */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-28">
               <div className="bg-orange-50 dark:bg-orange-900/20 w-8 h-8 rounded-full flex items-center justify-center text-orange-500">
                  <Calendar className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Best Day</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {summary.maxDay.day} <span className="text-sm font-normal text-gray-400">({summary.maxDay.hours}h)</span>
                  </p>
               </div>
            </div>

            {/* Daily Avg */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-28">
               <div className="bg-green-50 dark:bg-green-900/20 w-8 h-8 rounded-full flex items-center justify-center text-green-500">
                  <Activity className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Daily Avg</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.avgDaily}h</p>
               </div>
            </div>

            {/* Sessions */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-28">
               <div className="bg-blue-50 dark:bg-blue-900/20 w-8 h-8 rounded-full flex items-center justify-center text-blue-500">
                  <Target className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Sessions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">0</p>
               </div>
            </div>

             {/* Consistency */}
             <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-28">
               <div className="bg-pink-50 dark:bg-pink-900/20 w-8 h-8 rounded-full flex items-center justify-center text-pink-500">
                  <TrendingUp className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Consistency</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.consistency}%</p>
               </div>
            </div>
         </div>
      </div>

      {/* AI Productivity Tip */}
      <div className="px-6 pb-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
           {/* Background Decor */}
           <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                     <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                     <span className="text-[10px] font-bold tracking-wide uppercase">AI Tip</span>
                  </div>
                  <div className="bg-white/10 p-1.5 rounded-full">
                     <Clock className="w-4 h-4 text-indigo-100" />
                  </div>
               </div>
               
               <h3 className="font-bold text-lg mb-2">The Pomodoro Effect</h3>
               <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-90">
                  You focus best in the morning. Try scheduling your deepest work blocks between 9 AM and 11 AM for maximum efficiency.
               </p>
               
               <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center group">
                  View Full Insights
                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};