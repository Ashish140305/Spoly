import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, AlignLeft, Copy, Workflow, Code } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';

export default function NoteDetailView({ isDarkMode, selectedNote, exportFormat, showToast }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      {selectedNote.audioUrl && (
        <div className={`text-white rounded-2xl p-6 shadow-xl flex items-center gap-6 border ${isDarkMode ? "bg-[#1e2025] border-[#232a3b]" : "bg-slate-900 border-transparent"}`}>
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"><Headphones size={24} /></div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-2">Original Audio Recording</h4>
            <audio controls className="w-full max-w-xl outline-none" src={selectedNote.audioUrl}>Your browser does not support the audio element.</audio>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-8">
        <div className={`shadow-lg rounded-2xl p-8 border ${isDarkMode ? "bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]" : "bg-white/80 backdrop-blur-xl border-white"}`}>
          <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}>
            <h3 className={`font-bold text-xl flex items-center gap-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-700"}`}><AlignLeft size={20} /> AI Summary & Notes</h3>
            <button onClick={() => { 
                const textToCopy = exportFormat === "markdown" ? `## Summary\n${selectedNote.summary}\n\n## Takeaways\n${selectedNote.takeaways}\n\n## Decisions\n${selectedNote.decisions}` : `${selectedNote.summary}\n\n${selectedNote.takeaways}\n\n${selectedNote.decisions}`;
                navigator.clipboard.writeText(textToCopy);
                showToast("Notes copied to clipboard!");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs transition-colors border ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300 border-[#232a3b]" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              <Copy size={12} /> Copy All
            </button>
          </div>
          <div className="space-y-6">
            <div><h4 className={`font-bold mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Executive Summary</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border ${isDarkMode ? "text-slate-400 bg-[#13151a] border-[#232a3b]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote.summary}</p></div>
            <div><h4 className={`font-bold mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Key Takeaways</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? "text-slate-400 bg-[#13151a] border-[#232a3b]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote.takeaways}</p></div>
            {selectedNote.decisions && (
              <div><h4 className={`font-bold mb-2 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Decisions</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? "text-slate-400 bg-[#13151a] border-[#232a3b]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote.decisions}</p></div>
            )}
          </div>
        </div>

        {selectedNote.graph && (
          <div className={`shadow-lg rounded-2xl p-8 flex flex-col border ${isDarkMode ? "bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]" : "bg-white/80 backdrop-blur-xl border-white"}`}>
            <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}>
              <h3 className={`font-bold text-xl flex items-center gap-2 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`}><Workflow size={20} /> Extracted Diagram</h3>
              <button onClick={() => { navigator.clipboard.writeText(selectedNote.graph); showToast("Mermaid code copied!"); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs transition-colors border ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300 border-[#232a3b]" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                <Code size={12} /> Copy Code
              </button>
            </div>
            <div className={`flex-1 w-full shadow-inner rounded-2xl flex items-center justify-center p-8 min-h-[400px] border ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-white border-slate-200"}`}>
              <MermaidDiagram chart={selectedNote.graph} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}