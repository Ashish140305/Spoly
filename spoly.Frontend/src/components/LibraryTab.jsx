import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, FolderOpen, Folder, Search, LayoutGrid, GitCommit, FileText, Calendar, Headphones, Tag, Clock, CheckCircle2, FolderSearch, CalendarDays } from 'lucide-react';
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

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      setSavedNotes(prev => prev.filter(n => n.id !== noteId));
      showToast("Note deleted.");
    }
  };

  return (
    <motion.div key="notes-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* FOLDERS SIDEBAR */}
      <div className={`w-full lg:w-80 shrink-0 rounded-2xl p-6 border shadow-sm flex flex-col min-h-[500px] transition-colors ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D]' : 'bg-white border-slate-200'} sticky top-32`}>
         <div className="flex items-center justify-between mb-6 px-1">
           <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Folders</h3>
           <button onClick={() => setIsAddingFolder(!isAddingFolder)} className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg hover:text-blue-500 transition-colors p-1.5 ${isDarkMode ? 'text-slate-500 hover:bg-[#131722]' : 'text-slate-400 hover:bg-slate-50'}`} title="New Folder">
              <PlusCircle size={16} />
           </button>
         </div>

         <AnimatePresence>
           {isAddingFolder && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <input type="text" autoFocus placeholder="Folder name & Enter..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={handleAddFolder} onBlur={() => setIsAddingFolder(false)} className={`w-full px-4 py-3 text-sm font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${isDarkMode ? 'bg-[#131722] border-[#2A2F3D] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
              </motion.div>
           )}
         </AnimatePresence>

         <div className="space-y-2 flex-1">
           {folders.map(f => {
             const count = f.id === 'all' ? savedNotes.length : savedNotes.filter(n => n.folderId === f.id).length;
             const isActive = activeFolderId === f.id;
             const isDragOver = dragOverFolder === f.id;
             
             return (
               <button
                 key={f.id} onClick={() => setActiveFolderId(f.id)} onDragOver={(e) => { e.preventDefault(); setDragOverFolder(f.id); }} onDragLeave={() => setDragOverFolder(null)}
                 onDrop={(e) => {
                   e.preventDefault(); setDragOverFolder(null);
                   const noteId = e.dataTransfer.getData('noteId');
                   if (noteId && f.id !== 'all') {
                     setSavedNotes(prev => prev.map(n => n.id.toString() === noteId ? { ...n, folderId: f.id } : n));
                     showToast(`Moved note to ${f.name}`);
                   }
                 }}
                 className={`w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1f2e] group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${isDragOver ? (isDarkMode ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-blue-50 border border-blue-300') : isActive ? (isDarkMode ? 'bg-[#131722] text-white shadow-sm border border-[#232a3b]' : 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200') : (isDarkMode ? 'text-slate-400 hover:bg-[#131722] hover:text-slate-200 border border-transparent' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent')}`}
               >
                 {isActive || isDragOver ? <FolderOpen size={20} className={f.color} /> : <Folder size={20} className={f.color} />}
                 <span className="font-bold text-base truncate flex-1 text-left">{f.name}</span>
                 
                 {!f.isDefault && (
                    <div onClick={(e) => handleDeleteFolder(e, f.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} title="Delete Folder"><Trash2 size={14} /></div>
                 )}
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isActive ? (isDarkMode ? 'bg-[#232a3b] text-slate-300' : 'bg-white text-slate-500 shadow-sm') : (isDarkMode ? 'bg-[#1a1f2e] text-slate-500' : 'bg-slate-100 text-slate-400')}`}>{count}</span>
               </button>
             )
           })}
         </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{folders.find(f => f.id === activeFolderId)?.name}</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16}/>
              <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"}`} />
            </div>
            
            <div className={`flex items-center p-1.5 rounded-xl border shadow-sm ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D]' : 'bg-slate-100 border-slate-200'}`}>
               <button onClick={() => setNotesViewMode('grid')} className={`p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${notesViewMode === 'grid' ? (isDarkMode ? 'bg-[#131722] text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}><LayoutGrid size={18}/></button>
               <button onClick={() => setNotesViewMode('timeline')} className={`p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${notesViewMode === 'timeline' ? (isDarkMode ? 'bg-[#131722] text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}><GitCommit size={18}/></button>
            </div>
          </div>
        </div>

        {/* 🌟 FIX: RIGID, SYMMETRICAL CSS GRID VIEW */}
        {notesViewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNotesForLibrary.map((note) => (
              <button key={note.id} draggable onDragStart={(e) => e.dataTransfer.setData('noteId', note.id.toString())} onClick={() => setSelectedNote(note)} className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden h-[280px] p-6 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-400 shadow-sm"}`}>
                <svg className={`absolute bottom-0 right-0 w-3/4 h-3/4 transition-transform duration-700 group-hover:scale-110 opacity-40 dark:opacity-50 pointer-events-none ${isDarkMode ? "text-blue-500/20" : "text-blue-500/10"}`} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 200 Q 100 100 200 50" /><path d="M100 200 Q 150 150 200 100" opacity="0.6" /><path d="M150 200 Q 175 175 200 150" opacity="0.3" /><circle cx="200" cy="50" r="4" fill="currentColor" /><circle cx="200" cy="100" r="3" fill="currentColor" opacity="0.6" />
                </svg>
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-blue-600/30 group-hover:bg-blue-500/40" : "bg-blue-300/30 group-hover:bg-blue-300/40"}`}></div>

                {/* Top Row: Icon & Delete Button */}
                <div className="flex justify-between items-start relative z-10 w-full shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? "bg-[#131722] text-blue-400 border-[#2A2F3D]" : "bg-blue-50 text-blue-600 border-blue-100"}`}><FileText size={20} /></div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 uppercase tracking-widest border ${isDarkMode ? "text-slate-400 bg-[#131722] border-[#2A2F3D]" : "text-slate-500 bg-slate-50 border-slate-200"}`}><Calendar size={10} className="mb-[1px]" /> {note.date}</span>
                  </div>

                  {/* Delete Button (safely positioned top right) */}
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <div onClick={(e) => handleDeleteNote(e, note.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400 hover:text-red-400 hover:bg-[#1a1f2e]" : "bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:bg-slate-50"}`} title="Delete Note">
                      <Trash2 size={14} />
                    </div>
                  </div>
                </div>

                {/* Content Area (Grows to push footer down) */}
                <div className="relative z-10 w-full mt-6 flex flex-col flex-1 pr-2 min-h-0">
                  <h3 className={`text-xl font-bold tracking-tight mb-2 leading-tight transition-colors truncate shrink-0 ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}>{note.title}</h3>
                  <p className={`text-sm line-clamp-3 mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{note.summary}</p>
                  
                  {/* Bottom Row Footer (Always aligns perfectly at the bottom) */}
                  <div className="mt-auto shrink-0">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {note.audioUrl && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? "text-purple-300 bg-purple-900/30 border-purple-800/50" : "text-purple-600 bg-purple-50 border-purple-200"}`}><Headphones size={10} /> Audio</span>}
                      {note.tags?.map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${getTagStyles(tag, isDarkMode)}`}><Tag size={10} /> {tag}</span>)}
                    </div>
                    <div className={`flex items-center justify-between text-sm font-medium border-t pt-4 ${isDarkMode ? "text-slate-500 border-[#2A2F3D]" : "text-slate-500 border-slate-100"}`}>
                      <div className="flex gap-4"><span className="flex items-center gap-1.5"><Clock size={14} /> {note.duration}</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> {note.items} Tasks</span></div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {filteredNotesForLibrary.length === 0 && (
               <div className={`col-span-full py-24 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed relative overflow-hidden ${isDarkMode ? 'border-[#2A2F3D] bg-[#131722]/50' : 'border-slate-200 bg-slate-50/50'}`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/40'}`}></div>
                  <div className={`relative z-10 w-24 h-24 mb-6 rounded-3xl flex items-center justify-center shadow-inner border ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                     <FolderSearch size={40} />
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight mb-2 relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No notes in sight</h3>
                  <p className={`text-sm font-medium relative z-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>This folder is completely empty. Start a new recording.</p>
               </div>
            )}
          </div>
        )}

        {/* 🌟 FIX: TIMELINE VIEW (SLEEK MODE) WITH SAFE DELETE BUTTON ZONE */}
        {notesViewMode === 'timeline' && (
          <div className="space-y-8 pl-4 py-4">
            {Object.keys(groupedNotesByDate).length === 0 && (
               <div className={`py-24 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed relative overflow-hidden ${isDarkMode ? 'border-[#2A2F3D] bg-[#131722]/50' : 'border-slate-200 bg-slate-50/50'}`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-200/40'}`}></div>
                  <div className={`relative z-10 w-24 h-24 mb-6 rounded-3xl flex items-center justify-center shadow-inner border ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                     <CalendarDays size={40} />
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight mb-2 relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Timeline is quiet</h3>
                  <p className={`text-sm font-medium relative z-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>You haven't recorded any notes yet.</p>
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
                    <button key={note.id} draggable onDragStart={(e) => e.dataTransfer.setData('noteId', note.id.toString())} onClick={() => setSelectedNote(note)} className={`w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] group flex flex-col md:flex-row md:items-center text-left gap-4 p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden min-h-[88px] ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                      
                      <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center shadow-sm border ${isDarkMode ? "bg-[#131722] text-blue-400 border-[#2A2F3D]" : "bg-blue-50 text-blue-600 border-blue-100"}`}><FileText size={20} /></div>
                      
                      <div className="flex-1 pr-4 min-w-0">
                        <h4 className={`font-bold text-lg tracking-tight leading-tight mb-1 truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{note.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold">
                          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><Clock size={12}/> {note.duration}</span>
                          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><CheckCircle2 size={12}/> {note.items} Tasks</span>
                        </div>
                      </div>
                      
                      {/* Fixed Flex Container prevents delete button from ever overlapping tags */}
                      <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0">
                        <div className="flex flex-wrap gap-2 justify-end">
                          {note.tags?.slice(0, 2).map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${getTagStyles(tag, isDarkMode)}`}>{tag}</span>)}
                          {note.tags?.length > 2 && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${isDarkMode ? 'text-slate-500 border-[#2A2F3D]' : 'text-slate-400 border-slate-200'}`}>+{note.tags.length - 2}</span>}
                        </div>
                        
                        {/* Delete Button allocated guaranteed space */}
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                           <div onClick={(e) => handleDeleteNote(e, note.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400 hover:text-red-400 hover:bg-[#1a1f2e]" : "bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:bg-slate-50"}`} title="Delete Note">
                             <Trash2 size={14} />
                           </div>
                        </div>
                      </div>

                    </button>
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