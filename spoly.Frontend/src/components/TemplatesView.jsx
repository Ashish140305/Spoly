import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

// 🚀 UNIQUE SVG BACKGROUNDS GENERATOR FOR TEMPLATES
const getTemplateBackground = (id, colorClass) => {
  const baseClass = `absolute right-0 bottom-0 w-64 h-64 transition-transform duration-700 group-hover:scale-110 opacity-[0.05] dark:opacity-[0.10] ${colorClass}`;
  switch(id) {
    case 1: // AI Auto-Detect (Neural Nodes)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20,80 L50,50 L80,20 M50,50 L80,80" />
          <circle cx="50" cy="50" r="4" fill="currentColor"/><circle cx="20" cy="80" r="3"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="80" r="3"/>
        </svg>
      );
    // cases 2 to 10 truncated for brevity
    default: // Fallback Geometric
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="20" y="20" width="60" height="60" rx="8" opacity="0.5" strokeDasharray="4 4"/>
          <circle cx="50" cy="50" r="15"/>
        </svg>
      );
  }
};

export default function TemplatesView({
  templatesDB,
  templateCategories,
  templateFilter,
  setTemplateFilter,
  isDarkMode,
  getTheme,
  setActiveAiTemplate,
  setActiveTab,
  showToast
}) {
  return (
    <motion.div key="templates-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
       <div className="mb-8 flex justify-between items-end">
         <div>
           <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Output Templates</h2>
           <p className={`font-medium text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a template before recording to format the diagram style.</p>
         </div>
       </div>
       
       {/* 🚀 FIXED: CLEAN DROPDOWN SELECTOR INSTEAD OF PILLS */}
       <div className="mb-6 flex items-center">
          <div className={`relative inline-flex items-center w-full md:w-64 rounded-xl border shadow-sm transition-colors ${isDarkMode ? "bg-[#1e2025] border-[#232a3b] text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="w-full appearance-none bg-transparent py-2.5 pl-4 pr-10 font-bold focus:outline-none cursor-pointer"
            >
              {templateCategories.map((cat) => (
                <option key={cat} value={cat} className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight size={18} className="rotate-90 text-slate-400" />
            </div>
          </div>
       </div>

       <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
         <AnimatePresence>
           {templatesDB.filter(t => templateFilter === 'All' || t.category === templateFilter).map((temp) => (
             <motion.div 
               key={temp.id} 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               transition={{ duration: 0.2 }}
               onClick={() => { setActiveAiTemplate(temp); setActiveTab('workspace'); showToast(`Template Set: ${temp.name}`); }} 
               className="relative group p-[1.5px] rounded-[2.5rem] overflow-hidden cursor-pointer transition-transform hover:-translate-y-2 shadow-sm"
             >
                <div className={`absolute inset-0 bg-gradient-to-br ${getTheme(temp.theme, isDarkMode).borderGlow} opacity-30 group-hover:opacity-100 transition-all duration-700`}></div>

                <div className={`relative h-full flex flex-col p-8 rounded-[2.4rem] z-10 ${isDarkMode ? 'bg-[#12151C] group-hover:bg-[#161A22]' : 'bg-white group-hover:bg-slate-50'} transition-colors duration-500 overflow-hidden`}>
                    
                    {getTemplateBackground(temp.id, getTheme(temp.theme, isDarkMode).text)}

                    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-700 ${getTheme(temp.theme, isDarkMode).glow1}`}></div>

                    <div className="flex items-start justify-between mb-auto relative z-10">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${getTheme(temp.theme, isDarkMode).iconBg}`}>
                          {React.cloneElement(temp.icon, { size: 28 })}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${isDarkMode ? 'text-slate-300 bg-[#0b0f19] border-[#232a3b]' : 'text-slate-500 bg-white border-slate-200'}`}>
                         {temp.category}
                       </span>
                    </div>

                    <div className="relative z-10 w-full mt-8">
                      <h3 className={`text-xl font-bold mb-2 transition-colors pr-4 ${isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{temp.name}</h3>
                      <p className={`text-sm font-medium leading-relaxed mb-6 flex-1 pr-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{temp.desc}</p>
                      
                      <div className={`flex items-center gap-2 font-bold text-sm transition-transform duration-300 group-hover:translate-x-1 ${getTheme(temp.theme, isDarkMode).text}`}>
                        Apply Format <ArrowRight size={16} />
                      </div>
                    </div>

                </div>
             </motion.div>
           ))}
         </AnimatePresence>
       </div>
    </motion.div>
  );
}