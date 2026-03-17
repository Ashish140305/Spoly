import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Headphones, AlignLeft, Copy, Workflow, DownloadCloud, Edit3, Eye } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';

export default function NoteDetailView({ isDarkMode, selectedNote, exportFormat, showToast }) {
  
  const [isEditingGraph, setIsEditingGraph] = useState(false);
  const defaultGraph = "graph TD;\n  A[Start Recording]-->B[AI Listens];\n  B-->C[Generate Summary];\n  C-->D[Extract Diagram];";
  const [editedGraph, setEditedGraph] = useState(selectedNote?.graph || defaultGraph);

  // Sync state if the user clicks a different note
  useEffect(() => {
    setEditedGraph(selectedNote?.graph || defaultGraph);
    setIsEditingGraph(false);
  }, [selectedNote]);
  
  const handleDownloadAudio = () => {
    if (!selectedNote?.audioUrl) {
      showToast("No audio file available for this note.");
      return;
    }
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = selectedNote.audioUrl;
    
    const safeTitle = selectedNote.title ? selectedNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'audio';
    a.download = `Spoly_Audio_${safeTitle}_${Date.now()}.webm`;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    
    showToast("Download triggered successfully!");
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-32">
      
      {/* 🌟 AUDIO PLAYER ALWAYS RENDERED */}
      <div className={`rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 border shadow-sm transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-900"}`}>
        
        <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-colors shadow-inner border ${isDarkMode ? "bg-[#131722] text-blue-400 border-[#2A2F3D]" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
          <Headphones size={28} />
        </div>
        
        <div className="flex-1 w-full min-w-0">
          <h4 className={`font-extrabold text-xl mb-4 tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Original Audio Recording</h4>
          
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
            <div className={`flex-1 w-full rounded-full p-1.5 border shadow-inner flex items-center ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-200"}`}>
              <audio controls className="w-full h-11 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full" src={selectedNote?.audioUrl || ""}>
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <button 
              onClick={handleDownloadAudio}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 w-full lg:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? "bg-blue-600 hover:bg-blue-500 text-white dark:focus:ring-offset-[#1a1f2e]" : "bg-blue-600 hover:bg-blue-500 text-white focus:ring-offset-white"}`}
            >
              <DownloadCloud size={18} /> Download Audio
            </button>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        
        {/* SUMMARY SECTION - Fixed 650px Min Height */}
        <div className={`shadow-lg rounded-[2rem] p-8 border flex flex-col transition-all duration-500 ease-in-out min-h-[650px] ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
          <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? "border-[#2A2F3D]" : "border-slate-100"}`}>
            <h3 className={`font-bold text-xl tracking-tight flex items-center gap-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-700"}`}><AlignLeft size={20} /> AI Summary & Notes</h3>
            <button onClick={() => { 
                const textToCopy = exportFormat === "markdown" ? `## Summary\n${selectedNote?.summary}\n\n## Takeaways\n${selectedNote?.takeaways}\n\n## Decisions\n${selectedNote?.decisions}` : `${selectedNote?.summary}\n\n${selectedNote?.takeaways}\n\n${selectedNote?.decisions}`;
                navigator.clipboard.writeText(textToCopy);
                showToast("Notes copied to clipboard!");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-colors border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-[#131722] hover:bg-[#232a3b] text-slate-300 border-[#2A2F3D]" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              <Copy size={14} /> Copy All
            </button>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div><h4 className={`font-bold mb-2 tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Executive Summary</h4><p className={`text-sm leading-relaxed p-5 rounded-2xl border shadow-inner ${isDarkMode ? "text-slate-400 bg-[#0b0f19] border-[#2A2F3D]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote?.summary}</p></div>
            <div><h4 className={`font-bold mb-2 tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Key Takeaways</h4><p className={`text-sm leading-relaxed p-5 rounded-2xl border shadow-inner whitespace-pre-wrap ${isDarkMode ? "text-slate-400 bg-[#0b0f19] border-[#2A2F3D]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote?.takeaways}</p></div>
            {selectedNote?.decisions && (
              <div><h4 className={`font-bold mb-2 tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Decisions</h4><p className={`text-sm leading-relaxed p-5 rounded-2xl border shadow-inner whitespace-pre-wrap ${isDarkMode ? "text-slate-400 bg-[#0b0f19] border-[#2A2F3D]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{selectedNote.decisions}</p></div>
            )}
          </div>
        </div>

        {/* DIAGRAM SECTION - Fixed 650px Min Height */}
        <div className={`shadow-lg rounded-[2rem] p-8 flex flex-col border transition-all duration-500 ease-in-out min-h-[650px] ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
          
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-4 ${isDarkMode ? "border-[#2A2F3D]" : "border-slate-100"}`}>
            <h3 className={`font-bold text-xl tracking-tight flex items-center gap-2 shrink-0 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`}><Workflow size={20} /> Extracted Diagram</h3>
            
            <div className="flex items-center gap-2">
              
              {/* 🌟 UNIFIED BUTTON DESIGN */}
              <button onClick={() => setIsEditingGraph(!isEditingGraph)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-colors border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-[#131722] hover:bg-[#232a3b] text-slate-300 border-[#2A2F3D]" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {isEditingGraph ? <Eye size={14} className={isDarkMode ? "text-blue-400" : "text-blue-600"} /> : <Edit3 size={14} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}/>} 
                {isEditingGraph ? "Preview Diagram" : "Edit Code"}
              </button>

              <button onClick={() => { navigator.clipboard.writeText(editedGraph); showToast("Mermaid code copied!"); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-colors border focus:outline-none focus:ring-2 focus:ring-slate-500 ${isDarkMode ? "bg-[#131722] hover:bg-[#232a3b] text-slate-300 border-[#2A2F3D]" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                <Copy size={14} /> Copy Code
              </button>
            </div>
          </div>

          <div className={`flex-1 w-full shadow-inner rounded-2xl flex flex-col overflow-hidden border transition-all duration-500 ease-in-out ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-100"}`}>
            {isEditingGraph ? (
              <textarea 
                value={editedGraph}
                onChange={(e) => setEditedGraph(e.target.value)}
                className={`flex-1 w-full h-full p-6 font-mono text-sm resize-none outline-none custom-scrollbar ${isDarkMode ? "bg-transparent text-blue-300 placeholder-slate-600" : "bg-transparent text-blue-800 placeholder-slate-400"}`}
                spellCheck="false"
                placeholder="Enter Mermaid syntax here..."
              />
            ) : (
              <div className="flex-1 w-full h-full flex items-center justify-center p-8 overflow-x-auto custom-scrollbar">
                {editedGraph.trim() ? (
                  <MermaidDiagram chart={editedGraph} isDarkMode={isDarkMode} />
                ) : (
                  <p className={`text-sm italic font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No valid code to display.</p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}