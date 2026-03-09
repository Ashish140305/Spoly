import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ArrowRight } from 'lucide-react';
import { getTheme, getTemplateBackground } from '../utils/uiHelpers';

export default function TemplatesTab({ isDarkMode, templateFilter, setTemplateFilter, templateCategories, templatesDB, setActiveAiTemplate, setActiveTab, showToast }) {
  return (
    <motion.div key="templates-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Output Templates</h2>
          <p className={`font-medium text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a template before recording to format the diagram style.</p>
        </div>
        
        <div className={`relative inline-flex items-center w-full md:w-64 rounded-xl border shadow-sm transition-colors shrink-0 ${isDarkMode ? "bg-[#1e2025] border-[#232a3b] text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
          <div className="absolute left-4 pointer-events-none"><Filter size={16} className={isDarkMode ? "text-slate-400" : "text-slate-500"} /></div>
          <select value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)} className="w-full appearance-none bg-transparent py-2.5 pl-11 pr-10 font-bold focus:outline-none cursor-pointer">
            {templateCategories.map((cat) => <option key={cat} value={cat} className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>{cat}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={18} className="text-slate-400" /></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {templatesDB.filter((t) => templateFilter === "All" || t.category === templateFilter).map((temp) => (
              <motion.div
                key={temp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                onClick={() => { setActiveAiTemplate(temp); setActiveTab("workspace"); showToast(`Template Set: ${temp.name}`); }}
                className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[240px] p-6 ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] shadow-sm" : "bg-white border-slate-200 shadow-sm"} ${getTheme(temp.theme, isDarkMode).hover}`}
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getTheme(temp.theme, isDarkMode)?.accent || "from-blue-500"}`}></div>
                {getTemplateBackground(temp.id, getTheme(temp.theme, isDarkMode)?.text || "text-blue-500")}
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 opacity-30 group-hover:opacity-50 ${getTheme(temp.theme, isDarkMode)?.glow1 || "bg-blue-500/20"}`}></div>
                
                <div className="relative z-10 flex items-start justify-between mb-auto">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border backdrop-blur-sm ${getTheme(temp.theme, isDarkMode)?.iconBg || "bg-blue-50 border-blue-200"}`}>
                    {temp.icon ? React.cloneElement(temp.icon, { size: 28 }) : null}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${isDarkMode ? "text-slate-400 bg-[#13151a]/80 backdrop-blur-md border-[#232a3b]" : "text-slate-500 bg-white/80 backdrop-blur-md border-slate-200"}`}>
                    {temp.category}
                  </span>
                </div>

                <div className="relative z-10 w-full mt-6">
                  <h3 className={`text-xl font-bold mb-2 transition-colors pr-4 ${isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"}`}>{temp.name}</h3>
                  <p className={`text-sm font-medium leading-relaxed mb-6 flex-1 pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{temp.desc}</p>
                  
                  <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? "bg-[#131722] shadow-md" : "bg-slate-50 shadow-sm border border-slate-100"}`}>
                    <ArrowRight size={14} className={getTheme(temp.theme, isDarkMode)?.text || "text-blue-500"} />
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}