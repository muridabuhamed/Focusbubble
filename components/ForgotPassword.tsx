import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

export const ForgotPassword: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email.");
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300">
      <div className="pt-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full mb-4">
           <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your email and we’ll send you a link to reset your password.</p>
      </div>

      <div className="flex-1">
         <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all dark:text-white"
              placeholder="hello@example.com"
            />
         </div>
      </div>

      <button 
         onClick={handleSubmit}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform active:scale-95 mb-4"
      >
         Send Reset Email
      </button>
    </div>
  );
};