import React, { useEffect, useState } from 'react';
import { CheckCircle, Share2, Home } from 'lucide-react';
import { getSessionInsight } from '../services/geminiService';

interface Props {
  minutes: number;
  onHome: () => void;
}

export const SessionSummary: React.FC<Props> = ({ minutes, onHome }) => {
  const [insight, setInsight] = useState("Analyzing your focus...");

  useEffect(() => {
    // Generate insight only once on mount
    getSessionInsight(minutes, 0).then(setInsight);
  }, [minutes]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 items-center justify-center text-center transition-colors duration-300">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
         <CheckCircle className="w-10 h-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Session Complete!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">You just got smarter.</p>

      <div className="w-full bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-slate-700">
         <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{minutes}</div>
         <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">Minutes Focused</div>
         
         <div className="h-px w-full bg-gray-200 dark:bg-slate-700 mb-6"></div>
         
         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
           <p className="text-gray-600 dark:text-gray-300 italic">"{insight}"</p>
           <p className="text-right text-xs text-blue-500 dark:text-blue-400 font-bold mt-2">- AI Coach</p>
         </div>
      </div>

      <div className="space-y-3 w-full">
         <button onClick={onHome} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-colors">
            Start Another Session
         </button>
         <div className="grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4 mr-2" /> Share
             </button>
             <button onClick={onHome} className="flex items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <Home className="w-4 h-4 mr-2" /> Home
             </button>
         </div>
      </div>
    </div>
  );
};