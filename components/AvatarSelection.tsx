import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Props {
  onContinue: (avatar: string, name?: string) => void;
}

export const AvatarSelection: React.FC<Props> = ({ onContinue }) => {
  const [selected, setSelected] = useState<'male' | 'female' | null>(null);

  // Updated Male Avatar URL
  const maleAvatar = "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2150671126.jpg?w=200";
  const femaleAvatar = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2150671124.jpg?w=200";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col p-6 transition-colors duration-300">
       <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-10">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose your avatar</h1>
             <p className="text-gray-500 dark:text-gray-400">Pick a default profile picture.<br/>You can change it anytime.</p>
          </div>

          <div className="flex gap-6 mb-12">
             <button 
               onClick={() => setSelected('male')}
               className={`relative group transition-all duration-300 ${selected === 'male' ? 'transform scale-105' : 'opacity-70 hover:opacity-100'}`}
             >
                <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 ${selected === 'male' ? 'border-blue-500 shadow-xl shadow-blue-200 dark:shadow-blue-900/20' : 'border-transparent'}`}>
                   <img src={maleAvatar} alt="Male Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-3 font-medium text-gray-700 dark:text-gray-300">Male</div>
                {selected === 'male' && (
                   <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-md">
                      <Check className="w-4 h-4" strokeWidth={3} />
                   </div>
                )}
             </button>

             <button 
               onClick={() => setSelected('female')}
               className={`relative group transition-all duration-300 ${selected === 'female' ? 'transform scale-105' : 'opacity-70 hover:opacity-100'}`}
             >
                <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 ${selected === 'female' ? 'border-blue-500 shadow-xl shadow-blue-200 dark:shadow-blue-900/20' : 'border-transparent'}`}>
                   <img src={femaleAvatar} alt="Female Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-3 font-medium text-gray-700 dark:text-gray-300">Female</div>
                {selected === 'female' && (
                   <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-md">
                      <Check className="w-4 h-4" strokeWidth={3} />
                   </div>
                )}
             </button>
          </div>
       </div>

       <div className="space-y-4 mb-4">
         <button 
           onClick={() => onContinue(selected === 'male' ? maleAvatar : femaleAvatar)}
           disabled={!selected}
           className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all ${
             selected 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-blue-900/30 active:scale-95 cursor-pointer' 
              : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
           }`}
         >
           Continue
         </button>

         <button 
           onClick={() => onContinue("https://picsum.photos/200")}
           className="w-full text-center text-sm text-gray-400 dark:text-gray-500 font-medium py-2 hover:text-gray-600 dark:hover:text-gray-300"
         >
           Skip (Use random avatar)
         </button>
       </div>
    </div>
  );
};