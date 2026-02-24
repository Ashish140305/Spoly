import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
    case 2: // Study Mind Map (Branching Tree)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 50 Q 50 50 80 20 M20 50 Q 50 50 80 80 M20 50 L 80 50" />
          <circle cx="20" cy="50" r="4" fill="currentColor"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="50" r="3"/><circle cx="80" cy="80" r="3"/>
        </svg>
      );
    case 3: // Historical Timeline (Horizontal Ticks)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 50 L 90 50 M 30 40 L 30 60 M 50 30 L 50 70 M 70 40 L 70 60" />
          <circle cx="10" cy="50" r="3" fill="currentColor"/><circle cx="90" cy="50" r="3" fill="currentColor"/>
        </svg>
      );
    case 4: // Microservices (Isometric Blocks)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="30" y="30" width="20" height="20" rx="4" />
          <rect x="60" y="50" width="20" height="20" rx="4" />
          <path d="M50 40 L 70 40 L 70 50" strokeDasharray="3 3" />
          <circle cx="70" cy="40" r="2" fill="currentColor"/>
        </svg>
      );
    case 5: // Database ERD (Layered Cylinders)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="50" cy="30" rx="20" ry="8" />
          <path d="M30 30 L 30 70 A 20 8 0 0 0 70 70 L 70 30" />
          <path d="M30 50 A 20 8 0 0 0 70 50" opacity="0.5"/>
        </svg>
      );
    case 6: // Medical Consultation (ECG Heartbeat)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M10 50 L 30 50 L 40 20 L 60 80 L 70 50 L 90 50" />
        </svg>
      );
    case 7: // Legal Review (Scales of Justice abstraction)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M50 20 L 50 80 M 20 40 L 80 40 M 20 40 L 35 70 M 80 40 L 65 70" />
          <path d="M20 70 C 20 80 50 80 50 70 M50 70 C 50 80 80 80 80 70" strokeDasharray="2 2" opacity="0.5"/>
        </svg>
      );
    case 8: // Sales Discovery (Trending Chart)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 80 L 40 50 L 60 60 L 90 20 M 90 20 L 70 20 M 90 20 L 90 40" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="80" r="3" fill="currentColor"/>
          <circle cx="40" cy="50" r="3" fill="currentColor"/>
        </svg>
      );
    case 9: // Creative Brainstorm (Venn Diagram)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="40" cy="40" r="25" opacity="0.6"/>
          <circle cx="65" cy="40" r="25" opacity="0.6"/>
          <circle cx="52.5" cy="65" r="25" opacity="0.6"/>
        </svg>
      );
    case 10: // HR Candidate Screen (Network/People)
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="30" r="10"/>
          <path d="M35 70 C 35 50 65 50 65 70" />
          <circle cx="20" cy="50" r="6" opacity="0.5"/>
          <circle cx="80" cy="50" r="6" opacity="0.5"/>
          <path d="M25 50 L 40 40 M 75 50 L 60 40" strokeDasharray="2 2"/>
        </svg>
      );
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
       
       <div className="flex gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {templateCategories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setTemplateFilter(cat)} 
              className={`px-5 py-2 rounded-full font-bold transition-all border ${templateFilter === cat ? (isDarkMode ? 'bg-slate-200 text-slate-900 border-transparent shadow-md' : 'bg-slate-800 text-white border-transparent shadow-md') : (isDarkMode ? 'bg-[#1e2025] text-slate-300 border-[#232a3b] hover:bg-[#131722]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}
            >
              {cat}
            </button>
          ))}
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
                {/* Animated Glimmering Border Edge */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getTheme(temp.theme, isDarkMode).borderGlow} opacity-30 group-hover:opacity-100 transition-all duration-700`}></div>

                {/* Inner Glass Card */}
                <div className={`relative h-full flex flex-col p-8 rounded-[2.4rem] z-10 ${isDarkMode ? 'bg-[#12151C] group-hover:bg-[#161A22]' : 'bg-white group-hover:bg-slate-50'} transition-colors duration-500 overflow-hidden`}>
                    
                    {/* Unique Dynamic SVG Pattern Based on Template ID */}
                    {getTemplateBackground(temp.id, getTheme(temp.theme, isDarkMode).text)}

                    {/* Subtle Corner Glow */}
                    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-700 ${getTheme(temp.theme, isDarkMode).glow1}`}></div>

                    {/* Content Header */}
                    <div className="flex items-start justify-between mb-auto relative z-10">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${getTheme(temp.theme, isDarkMode).iconBg}`}>
                          {React.cloneElement(temp.icon, { size: 28 })}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${isDarkMode ? 'text-slate-300 bg-[#0b0f19] border-[#232a3b]' : 'text-slate-500 bg-white border-slate-200'}`}>
                         {temp.category}
                       </span>
                    </div>

                    {/* Content Text */}
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