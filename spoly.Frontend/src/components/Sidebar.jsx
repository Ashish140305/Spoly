import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { Mic, ChevronLeft, Menu, PlusCircle, LayoutDashboard, FolderSearch, Layers, Settings } from 'lucide-react';

export default function Sidebar({ isDarkMode, isSidebarOpen, setIsSidebarOpen, handleReset, activeTab, setActiveTab, setSelectedNote, user }) {
  return (
    <motion.aside animate={{ width: isSidebarOpen ? 288 : 88 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`hidden md:flex flex-col z-20 relative overflow-hidden shrink-0 transition-colors shadow-[10px_0_30px_rgba(0,0,0,0.02)] ${isDarkMode ? "bg-[#131722] border-r border-[#232a3b]" : "bg-white/60 backdrop-blur-2xl border-r border-slate-200/50"}`}>
      <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? "border-[#232a3b]" : "border-slate-200/50"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0"><Mic className="text-white" size={20} /></div>
          <AnimatePresence mode="wait">
            {isSidebarOpen && <motion.span key="sidebar-logo" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-2xl font-extrabold tracking-tight whitespace-nowrap">Spoly</motion.span>}
          </AnimatePresence>
        </div>
        {isSidebarOpen && <button onClick={() => setIsSidebarOpen(false)} className={`p-1 transition-colors ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}`}><ChevronLeft size={24} /></button>}
      </div>

      {!isSidebarOpen && (
        <div className="pt-4 flex justify-center">
          <button onClick={() => setIsSidebarOpen(true)} className={`p-2 transition-colors ${isDarkMode ? "text-slate-400 hover:text-blue-400" : "text-slate-400 hover:text-blue-600"}`}><Menu size={24} /></button>
        </div>
      )}

      <div className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
        <button onClick={handleReset} className={`w-full flex items-center justify-center gap-3 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all mb-4 ${isSidebarOpen ? "px-4" : "px-0"}`}>
          <PlusCircle size={20} className="shrink-0" />
          {isSidebarOpen && <span className="whitespace-nowrap">New Recording</span>}
        </button>

        {isSidebarOpen && <p className={`px-4 text-xs font-bold uppercase tracking-widest mt-6 mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Menu</p>}
        <nav className="space-y-2">
          {[
            { id: "workspace", icon: LayoutDashboard, label: "Workspace" },
            { id: "notes", icon: FolderSearch, label: "Saved Notes" },
            { id: "templates", icon: Layers, label: "Templates" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedNote(null); }}
              title={!isSidebarOpen ? item.label : ""}
              className={`w-full flex items-center gap-3 py-2.5 font-semibold rounded-xl transition-colors ${isSidebarOpen ? "px-4" : "justify-center px-0"} ${activeTab === item.id ? (isDarkMode ? "bg-[#1a1f2e] text-white border border-[#232a3b] shadow-sm" : "bg-blue-50/50 text-blue-700 border border-blue-100 shadow-sm") : isDarkMode ? "text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200 border border-transparent" : "text-slate-600 hover:bg-slate-100 border border-transparent"}`}
            >
              <item.icon size={20} className="shrink-0" />
              {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`p-6 border-t flex items-center ${isSidebarOpen ? "gap-4" : "justify-center"} ${isDarkMode ? "border-[#232a3b] bg-transparent" : "border-slate-200/50 bg-white/40"}`}>
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm shrink-0" } }} />
        {isSidebarOpen && (
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-bold truncate dark:text-white">{user?.firstName || "Engineer"}</span>
            <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Pro Plan</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}