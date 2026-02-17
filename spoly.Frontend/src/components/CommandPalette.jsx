import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Zap, Moon, Sun, Monitor } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

const CommandPalette = ({ isOpen, setIsOpen, setIsDark, isDark }) => {
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/40"
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="text-slate-400" size={20} />
              <input autoFocus placeholder="Type a command or search..." className="w-full bg-transparent outline-none text-lg text-slate-900 dark:text-white" />
            </div>
            
            <div className="p-2 max-h-[400px] overflow-y-auto">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Account</div>
              <SignInButton mode="modal">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors">
                  <User size={18} /> Sign In / Sign Up
                </button>
              </SignInButton>

              <div className="px-3 py-2 mt-2 text-xs font-bold text-slate-400 uppercase">Appearance</div>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                Switch to {isDark ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;