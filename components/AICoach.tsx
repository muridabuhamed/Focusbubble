import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ChevronLeft, Bot, Target } from 'lucide-react';
import { generateCoachResponse } from '../services/geminiService';
import { ChatMessage, User } from '../types';

interface Props {
  user: User;
  onBack: () => void;
  onUpdateGoals: (goals: string[]) => void;
}

export const AICoach: React.FC<Props> = ({ user, onBack, onUpdateGoals }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showGoalSelector, setShowGoalSelector] = useState(user.goals.length === 0);

  useEffect(() => {
    // Initial greeting logic
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        sender: 'ai',
        text: `Hi ${user.name.split(' ')[0]}! I'm Bubble 🫧. ${user.goals.length === 0 ? "To help you better, what are you focusing on?" : "Ready to crush your goals today?"}`,
        timestamp: new Date()
      }]);
    }
  }, [user.name, user.goals.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showGoalSelector]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await generateCoachResponse(input, messages, user);
    
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    }]);
  };

  const handleGoalSelect = (goal: string) => {
     const newGoals = [...user.goals, goal];
     onUpdateGoals(newGoals);
     
     // Add system message about goal
     setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'user',
        text: `I'm focusing on ${goal}.`,
        timestamp: new Date()
     }]);

     setShowGoalSelector(false);

     setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: `Awesome! ${goal} is a great goal. I'll help you stay on track.`,
            timestamp: new Date()
        }]);
     }, 1000);
  };

  const suggestions = ["Suggest a 5-min break", "Study Plan", "Motivation"];
  const goalOptions = ['Study', 'Work', 'Reading', 'Coding', 'Exams'];

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
       {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full mr-2">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h1 className="font-bold text-gray-900 dark:text-white">AI Coach</h1>
                <p className="text-xs text-green-500 font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                </p>
            </div>
        </div>
        <div className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
            {user.focusLevel}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
               <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 mt-1 shadow-sm">
                 <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
               </div>
            )}
            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Goal Selector (Inline) */}
        {showGoalSelector && (
           <div className="flex flex-col space-y-2 ml-10 mb-6 animate-fade-in">
              <span className="text-xs text-gray-400 font-medium ml-1">Choose a goal to start:</span>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(g => (
                    <button 
                        key={g} 
                        onClick={() => handleGoalSelect(g)}
                        className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        {g}
                    </button>
                ))}
              </div>
           </div>
        )}

        {isTyping && (
           <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                 <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
               </div>
              <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-slate-700 shadow-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 p-4 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
         {!showGoalSelector && (
            <div className="flex space-x-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => setInput(s)}
                        className="flex-shrink-0 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-100 dark:border-slate-700 transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>
         )}
         <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-2 py-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={showGoalSelector ? "Select a goal above..." : "Ask for advice..."}
              disabled={showGoalSelector}
              className="flex-1 bg-transparent border-none focus:ring-0 px-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none disabled:opacity-50"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2.5 rounded-full transition-all ${
                    input.trim() ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}
            >
                <Send className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};