import { useState } from 'react';
import { cn } from './lib/utils'; // cn फ़ंक्शन को इम्पोर्ट करें

function App() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white font-sans">
      <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-indigo-400">clsx + tailwind-merge 🔥</h1>
        
        {/* cn() का जादू: isActive के आधार पर बैकग्राउंड और टेक्स्ट कलर बदलेंगे */}
        <div className={cn(
          "p-4 rounded-xl mb-6 font-medium transition-all duration-300 border",
          isActive 
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
            : "bg-rose-500/20 text-rose-400 border-rose-500/40"
        )}>
          स्थिति: {isActive ? "एक्टिव (Active)" : "इन-एक्टिव (Inactive)"}
        </div>

        <button 
          onClick={() => setIsActive(!isActive)}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium rounded-lg shadow-md"
        >
          स्टेटस बदलें
        </button>
      </div>
    </div>
  );
}

export default App;