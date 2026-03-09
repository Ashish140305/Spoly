import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, FolderOpen, Folder, Search, LayoutGrid, GitCommit, FileText, Calendar, Headphones, Tag, Clock, CheckCircle2, ArrowRight, CalendarDays, FolderSearch } from 'lucide-react';
import { getTagStyles } from '../utils/uiHelpers';

export default function LibraryTab({ 
  isDarkMode, folders, activeFolderId, setActiveFolderId, isAddingFolder, setIsAddingFolder, 
  newFolderName, setNewFolderName, handleAddFolder, handleDeleteFolder, dragOverFolder, setDragOverFolder, 
  setSavedNotes, savedNotes, showToast, searchQuery, setSearchQuery, notesViewMode, setNotesViewMode, setSelectedNote 
}) {

  const filteredNotesForLibrary = savedNotes.filter(n => 
    (activeFolderId === 'all' || n.folderId === activeFolderId) &&
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedNotes = [...filteredNotesForLibrary].sort((a,b) => new Date(b.date) - new Date(a.date));
  const groupedNotesByDate = sortedNotes.reduce((acc, note) => {
     (acc[note.date] = acc[note.date] || []).push(note);
     return acc;
  }, {});

  return (
    <motion.div key="notes-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-8">
      {/* 📂 FOLDERS SIDEBAR */}
      <div className={`w-full lg:w-64 shrink-0 rounded-2xl p-4 border shadow-sm ${isDarkMode ? 'bg-[#131722] border-[#2A2F3D]' : 'bg-white border-slate-200'} self-start sticky top-32`}>
         <div className="flex items-center justify-between mb-4 px-2">
           <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Folders</h3>
           <button onClick={() => setIsAddingFolder(!isAddingFolder)} className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} title="New Folder">
              <PlusCircle size={14} />
           </button>
         </div>

         <AnimatePresence>
           {isAddingFolder && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2">
                <input type="text" autoFocus placeholder="Folder name & Enter..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={handleAddFolder} onBlur={() => setIsAddingFolder(false)} className={`w-full px-3 py-2 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? 'bg-[#0E1116] border-[#2A2F3D] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
              </motion.div>
           )}
         </AnimatePresence>

         <div className="space-y-1">
           {folders.map(f => {
             const count = f.id === 'all' ? savedNotes.length : savedNotes.filter(n => n.folderId === f.id).length;
             const isActive = activeFolderId === f.id;
             const isDragOver = dragOverFolder === f.id;
             
             return (
               <div
                 key={f.id} onClick={() => setActiveFolderId(f.id)} onDragOver={(e) => { e.preventDefault(); setDragOverFolder(f.id); }} onDragLeave={() => setDragOverFolder(null)}
                 onDrop={(e) => {
                   e.preventDefault(); setDragOverFolder(null);
                   const noteId = e.dataTransfer.getData('noteId');
                   if (noteId && f.id !== 'all') {
                     setSavedNotes(prev => prev.map(n => n.id.toString() === noteId ? { ...n, folderId: f.id } : n));
                     showToast(`Moved note to ${f.name}`);
                   }
                 }}
                 className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isDragOver ? (isDarkMode ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-blue-50 border border-blue-300') : isActive ? (isDarkMode ? 'bg-[#1a1f2e] text-white shadow-sm' : 'bg-slate-100 text-slate-900 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}`}
               >
                 {isActive || isDragOver ? <FolderOpen size={18} className={f.color} /> : <Folder size={18} className={f.color} />}
                 <span className="font-bold text-sm truncate flex-1">{f.name}</span>
                 
                 {!f.isDefault && (
                    <button onClick={(e) => handleDeleteFolder(e, f.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/20 hover:text-red-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} title="Delete Folder"><Trash2 size={12} /></button>
                 )}
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? (isDarkMode ? 'bg-[#232a3b] text-slate-300' : 'bg-white text-slate-500 shadow-sm') : (isDarkMode ? 'bg-[#1a1f2e] text-slate-500' : 'bg-slate-100 text-slate-400')}`}>{count}</span>
               </div>
             )
           })}
         </div>
      </div>

      {/* 📝 MAIN NOTES CONTENT */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <h2 className={`text-3xl font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{folders.find(f => f.id === activeFolderId)?.name}</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16}/>
              <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"}`} />
            </div>
            
            <div className={`flex items-center p-1 rounded-lg border shadow-sm ${isDarkMode ? 'bg-[#131722] border-[#2A2F3D]' : 'bg-slate-100 border-slate-200'}`}>
               <button onClick={() => setNotesViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${notesViewMode === 'grid' ? (isDarkMode ? 'bg-[#1a1f2e] text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}><LayoutGrid size={16}/></button>
               <button onClick={() => setNotesViewMode('timeline')} className={`p-1.5 rounded-md transition-colors ${notesViewMode === 'timeline' ? (isDarkMode ? 'bg-[#1a1f2e] text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}><GitCommit size={16}/></button>
            </div>
          </div>
        </div>

        {/* GRID VIEW */}
        {notesViewMode === 'grid' && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredNotesForLibrary.map((note) => (
              <div key={note.id} draggable onDragStart={(e) => e.dataTransfer.setData('noteId', note.id.toString())} onClick={() => setSelectedNote(note)} className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[220px] p-6 cursor-grab active:cursor-grabbing ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-400 shadow-sm"}`}>
                <svg className={`absolute bottom-0 right-0 w-3/4 h-3/4 transition-transform duration-700 group-hover:scale-110 opacity-40 dark:opacity-50 ${isDarkMode ? "text-blue-500/20" : "text-blue-500/10"}`} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 200 Q 100 100 200 50" /><path d="M100 200 Q 150 150 200 100" opacity="0.6" /><path d="M150 200 Q 175 175 200 150" opacity="0.3" /><circle cx="200" cy="50" r="4" fill="currentColor" /><circle cx="200" cy="100" r="3" fill="currentColor" opacity="0.6" />
                </svg>
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-blue-600/30 group-hover:bg-blue-500/40" : "bg-blue-300/30 group-hover:bg-blue-300/40"}`}></div>

                <div className="flex justify-between items-start mb-auto relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? "bg-[#131722] text-blue-400 border-[#232a3b]" : "bg-blue-50 text-blue-600 border-blue-100"}`}><FileText size={20} /></div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 uppercase tracking-widest border ${isDarkMode ? "text-slate-400 bg-[#131722] border-[#232a3b]" : "text-slate-500 bg-slate-50 border-slate-200"}`}><Calendar size={10} className="mb-[1px]" /> {note.date}</span>
                </div>

                <div className="relative z-10 w-full mt-6">
                  <h3 className={`text-xl font-bold mb-3 leading-tight transition-colors pr-4 ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}>{note.title}</h3>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {note.audioUrl && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? "text-purple-300 bg-purple-900/30 border-purple-800/50" : "text-purple-600 bg-purple-50 border-purple-200"}`}><Headphones size={10} /> Audio</span>}
                    {note.tags?.map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${getTagStyles(tag, isDarkMode)}`}><Tag size={10} /> {tag}</span>)}
                  </div>
                  <div className={`flex items-center justify-between text-sm font-medium mt-auto border-t pt-4 ${isDarkMode ? "text-slate-500 border-[#232a3b]" : "text-slate-500 border-slate-100"}`}>
                    <div className="flex gap-4"><span className="flex items-center gap-1.5"><Clock size={14} /> {note.duration}</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> {note.items} Tasks</span></div>
                  </div>
                  <div className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? "bg-[#131722] shadow-md" : "bg-white shadow-sm border border-slate-100"}`}><ArrowRight size={14} className={isDarkMode ? "text-blue-400" : "text-blue-600"} /></div>
                </div>
              </div>
            ))}
            {filteredNotesForLibrary.length === 0 && (
               <div className="col-span-full py-12 text-center">
                  <FolderSearch size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className={`font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No notes found in this folder.</p>
               </div>
            )}
          </div>
        )}

        {/* TIMELINE VIEW */}
        {notesViewMode === 'timeline' && (
          <div className="space-y-8 pl-4 py-4">
            {Object.keys(groupedNotesByDate).length === 0 && (
               <div className="py-12 text-center">
                  <CalendarDays size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className={`font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No activity recorded.</p>
               </div>
            )}
            {Object.entries(groupedNotesByDate).map(([date, dateNotes]) => (
              <div key={date} className="relative">
                <div className={`absolute left-0 top-2 bottom-0 w-[2px] -translate-x-1/2 ${isDarkMode ? 'bg-[#2A2F3D]' : 'bg-slate-200'}`}></div>
                <div className="relative flex items-center mb-6">
                  <div className={`absolute left-0 w-3 h-3 rounded-full border-2 -translate-x-[6.5px] ${isDarkMode ? 'bg-[#0b0f19] border-blue-500' : 'bg-[#f8fafc] border-blue-500'}`}></div>
                  <h3 className={`ml-6 text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{date}</h3>
                </div>
                <div className="space-y-4 ml-6">
                  {dateNotes.map(note => (
                    <div key={note.id} draggable onDragStart={(e) => e.dataTransfer.setData('noteId', note.id.toString())} onClick={() => setSelectedNote(note)} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-lg hover:-translate-y-0.5 ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                      <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm border ${isDarkMode ? "bg-[#131722] text-blue-400 border-[#232a3b]" : "bg-blue-50 text-blue-600 border-blue-100"}`}><FileText size={20} /></div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg leading-tight mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{note.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold">
                          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><Clock size={12}/> {note.duration}</span>
                          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><CheckCircle2 size={12}/> {note.items} Tasks</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0 md:justify-end">
                        {note.tags?.slice(0, 2).map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${getTagStyles(tag, isDarkMode)}`}>{tag}</span>)}
                        {note.tags?.length > 2 && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${isDarkMode ? 'text-slate-500 border-[#232a3b]' : 'text-slate-400 border-slate-200'}`}>+{note.tags.length - 2}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}