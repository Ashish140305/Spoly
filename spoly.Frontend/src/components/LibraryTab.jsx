// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Trash2,
//   FolderOpen,
//   Folder,
//   Search,
//   LayoutGrid,
//   GitCommit,
//   FileText,
//   Calendar,
//   Tag,
//   Clock,
//   CheckCircle2,
//   X,
//   ChevronDown,
//   GripVertical,
//   Database,
//   PlayCircle,
//   Headphones,
//   Workflow,
//   Mic,
//   PenTool,
//   Star,
//   List,
//   CheckSquare,
//   Square,
//   Download,
// } from "lucide-react";

// // --- SLEEK ABSTRACT SVG PATTERNS FOR CARDS ---
// const LibraryCardPattern = ({ index }) => {
//   const patterns = [
//     <svg
//       width="120"
//       height="120"
//       viewBox="0 0 100 100"
//       className="text-blue-500 transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 group-hover:scale-110"
//     >
//       <path
//         d="M10 90 Q 30 50 90 10"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         strokeDasharray="4 4"
//       />
//       <circle cx="10" cy="90" r="2" fill="currentColor" />
//       <circle cx="90" cy="10" r="2" fill="currentColor" />
//       <path
//         d="M30 90 Q 60 70 90 40"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1"
//       />
//       <circle cx="50" cy="50" r="1.5" fill="currentColor" />
//     </svg>,
//     <svg
//       width="120"
//       height="120"
//       viewBox="0 0 100 100"
//       className="text-indigo-500 transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 group-hover:scale-110"
//     >
//       <rect
//         x="20"
//         y="20"
//         width="60"
//         height="60"
//         rx="4"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         transform="rotate(15 50 50)"
//       />
//       <rect
//         x="30"
//         y="30"
//         width="40"
//         height="40"
//         rx="3"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         transform="rotate(30 50 50)"
//       />
//       <circle cx="50" cy="50" r="2" fill="currentColor" />
//     </svg>,
//     <svg
//       width="120"
//       height="120"
//       viewBox="0 0 100 100"
//       className="transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 text-emerald-500 group-hover:scale-110"
//     >
//       <rect x="25" y="55" width="8" height="35" rx="4" fill="currentColor" />
//       <rect x="45" y="30" width="8" height="60" rx="4" fill="currentColor" />
//       <rect
//         x="65"
//         y="45"
//         width="8"
//         height="45"
//         rx="4"
//         fill="currentColor"
//         opacity="0.6"
//       />
//       <rect
//         x="85"
//         y="70"
//         width="8"
//         height="20"
//         rx="4"
//         fill="currentColor"
//         opacity="0.4"
//       />
//     </svg>,
//   ];
//   return (
//     <div className="absolute bottom-0 right-0 pointer-events-none">
//       {patterns[index % patterns.length]}
//     </div>
//   );
// };

// // --- SMART BLUEPRINT ENGINE (Thumbnails) ---
// const DiagramThumbnail = ({ graphCode, isDarkMode }) => {
//   const code = String(graphCode || "").toLowerCase();
//   const isSeq = code.includes("sequencediagram");
//   const isMindmap = code.includes("mindmap");

//   const baseStyle = `absolute inset-0 w-full h-full object-cover opacity-[0.04] dark:opacity-[0.08] pointer-events-none transition-transform duration-700 group-hover:scale-105 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`;

//   if (isSeq)
//     return (
//       <svg
//         className={baseStyle}
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//       >
//         <line
//           x1="25"
//           y1="10"
//           x2="25"
//           y2="90"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeDasharray="4 4"
//         />
//         <line
//           x1="75"
//           y1="10"
//           x2="75"
//           y2="90"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeDasharray="4 4"
//         />
//         <rect x="15" y="5" width="20" height="10" rx="2" fill="currentColor" />
//         <rect x="65" y="5" width="20" height="10" rx="2" fill="currentColor" />
//         <path
//           d="M25 30 L70 30"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <polygon points="70,27 75,30 70,33" fill="currentColor" />
//         <path
//           d="M75 50 L30 50"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeDasharray="2 2"
//         />
//         <polygon points="30,47 25,50 30,53" fill="currentColor" />
//       </svg>
//     );

//   if (isMindmap)
//     return (
//       <svg
//         className={baseStyle}
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//       >
//         <circle
//           cx="50"
//           cy="50"
//           r="12"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         />
//         <path
//           d="M50 38 C50 20 30 20 30 20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <path
//           d="M50 38 C50 20 70 20 70 20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <path
//           d="M50 62 C50 80 30 80 30 80"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <path
//           d="M50 62 C50 80 70 80 70 80"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         />
//         <rect x="20" y="15" width="10" height="10" rx="2" fill="currentColor" />
//         <rect x="70" y="15" width="10" height="10" rx="2" fill="currentColor" />
//         <rect x="20" y="75" width="10" height="10" rx="2" fill="currentColor" />
//         <rect x="70" y="75" width="10" height="10" rx="2" fill="currentColor" />
//       </svg>
//     );

//   return (
//     <svg className={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
//       <rect x="40" y="10" width="20" height="12" rx="3" fill="currentColor" />
//       <path
//         d="M50 22 L50 40"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <polygon points="48,37 50,40 52,37" fill="currentColor" />
//       <rect
//         x="35"
//         y="40"
//         width="30"
//         height="20"
//         rx="3"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       />
//       <path
//         d="M50 60 L50 80"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <polygon points="48,77 50,80 52,77" fill="currentColor" />
//       <path
//         d="M35 50 L20 50 L20 80"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//       />
//       <polygon points="18,77 20,80 22,77" fill="currentColor" />
//     </svg>
//   );
// };

// // --- MINI AUDIO PLAYER COMPONENT ---
// const MiniAudioPlayer = ({ isDarkMode }) => (
//   <div
//     className={`flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-inner ${isDarkMode ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"}`}
//   >
//     <PlayCircle
//       size={12}
//       className={isDarkMode ? "text-purple-400" : "text-purple-600"}
//     />
//     <div className="flex items-end gap-[2px] h-2.5">
//       <div className="w-[2px] h-full bg-current rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
//       <div className="w-[2px] h-1/2 bg-current rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]"></div>
//       <div className="w-[2px] h-3/4 bg-current rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]"></div>
//       <div className="w-[2px] h-1/3 bg-current rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.1s]"></div>
//     </div>
//   </div>
// );

// // --- GENERALIZED FILTERS ---
// const GENERAL_FILTERS = [
//   { id: "Recent", icon: <Clock size={12} /> },
//   { id: "With Diagrams", icon: <Workflow size={12} /> },
//   { id: "Audio Logs", icon: <Headphones size={12} /> },
//   { id: "Action Items", icon: <CheckCircle2 size={12} /> },
// ];

// export default function LibraryTab({
//   isDarkMode,
//   folders,
//   activeFolderId,
//   setActiveFolderId,
//   isAddingFolder,
//   setIsAddingFolder,
//   newFolderName,
//   setNewFolderName,
//   handleAddFolder,
//   handleDeleteFolder,
//   dragOverFolder,
//   setDragOverFolder,
//   setSavedNotes,
//   savedNotes,
//   showToast,
//   searchQuery,
//   setSearchQuery,
//   notesViewMode,
//   setNotesViewMode,
//   setSelectedNote,
// }) {
//   const [showFolderMenu, setShowFolderMenu] = useState(false);
//   const [localFolders, setLocalFolders] = useState(folders);
//   const [activeFilters, setActiveFilters] = useState([]);

//   const [selectedNoteIds, setSelectedNoteIds] = useState([]);
//   const [showBulkFolderMenu, setShowBulkFolderMenu] = useState(false);

//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   useEffect(() => {
//     let updated = [...localFolders];
//     updated = updated.filter((lf) => folders.some((f) => f.id === lf.id));
//     folders.forEach((f) => {
//       if (!updated.some((lf) => lf.id === f.id)) updated.push(f);
//     });
//     setLocalFolders(updated);
//   }, [folders]);

//   const activeFolder =
//     localFolders.find((f) => f.id === activeFolderId) || localFolders[0];

//   const safeSearchQuery = String(searchQuery || "").toLowerCase();

//   let filteredNotesForLibrary = savedNotes.filter((n) => {
//     const safeTitle = String(n.title || "").toLowerCase();
//     const safeSummary = String(n.summary || "").toLowerCase();
//     return (
//       (activeFolderId === "all" || n.folderId === activeFolderId) &&
//       (safeTitle.includes(safeSearchQuery) ||
//         safeSummary.includes(safeSearchQuery))
//     );
//   });

//   if (activeFilters.includes("Audio Logs"))
//     filteredNotesForLibrary = filteredNotesForLibrary.filter(
//       (n) => n.audioUrl || String(n.summary).toLowerCase().includes("audio"),
//     );
//   if (activeFilters.includes("Action Items"))
//     filteredNotesForLibrary = filteredNotesForLibrary.filter(
//       (n) =>
//         n.items > 0 || String(n.summary).toLowerCase().includes("action item"),
//     );
//   if (activeFilters.includes("With Diagrams"))
//     filteredNotesForLibrary = filteredNotesForLibrary.filter(
//       (n) => n.graph || n.diagram || (n.graphs && n.graphs.length > 0),
//     );
//   if (activeFilters.includes("Recent")) {
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//     filteredNotesForLibrary = filteredNotesForLibrary.filter((n) => {
//       const noteDate = new Date(n.date);
//       return !isNaN(noteDate) && noteDate >= oneWeekAgo;
//     });
//   }

//   const sortedNotes = [...filteredNotesForLibrary].sort((a, b) => {
//     if (a.isPinned && !b.isPinned) return -1;
//     if (!a.isPinned && b.isPinned) return 1;
//     return new Date(b.date) - new Date(a.date);
//   });

//   const groupedNotesByDate = sortedNotes.reduce((acc, note) => {
//     (acc[note.date] = acc[note.date] || []).push(note);
//     return acc;
//   }, {});

//   const startEditing = (e, note) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setEditingNoteId(note.id);
//     setEditTitle(note.title);
//   };

//   const saveRename = (e, noteId) => {
//     e.stopPropagation();
//     if (editTitle.trim() === "") {
//       setEditingNoteId(null);
//       return;
//     }
//     setSavedNotes((prev) =>
//       prev.map((n) => (n.id === noteId ? { ...n, title: editTitle } : n)),
//     );
//     setEditingNoteId(null);
//     showToast("Note renamed successfully.");
//   };

//   const cancelRename = (e) => {
//     e.stopPropagation();
//     setEditingNoteId(null);
//     setEditTitle("");
//   };

//   const togglePin = (e, noteId) => {
//     e.stopPropagation();
//     setSavedNotes((prev) =>
//       prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)),
//     );
//     showToast("Pin status updated.");
//   };

//   const toggleSelection = (e, noteId) => {
//     e.stopPropagation();
//     setSelectedNoteIds((prev) =>
//       prev.includes(noteId)
//         ? prev.filter((id) => id !== noteId)
//         : [...prev, noteId],
//     );
//   };

//   const toggleSelectAll = () => {
//     if (
//       selectedNoteIds.length === sortedNotes.length &&
//       sortedNotes.length > 0
//     ) {
//       setSelectedNoteIds([]);
//     } else {
//       setSelectedNoteIds(sortedNotes.map((n) => n.id));
//     }
//   };

//   const handleBulkDelete = () => {
//     if (window.confirm(`Delete ${selectedNoteIds.length} notes permanently?`)) {
//       setSavedNotes((prev) =>
//         prev.filter((n) => !selectedNoteIds.includes(n.id)),
//       );
//       setSelectedNoteIds([]);
//       showToast(`${selectedNoteIds.length} notes deleted.`);
//     }
//   };

//   const handleBulkMove = (folderId) => {
//     setSavedNotes((prev) =>
//       prev.map((n) =>
//         selectedNoteIds.includes(n.id) ? { ...n, folderId } : n,
//       ),
//     );
//     setSelectedNoteIds([]);
//     setShowBulkFolderMenu(false);
//     const folderName = folders.find((f) => f.id === folderId)?.name || "Folder";
//     showToast(`Moved to ${folderName}`);
//   };

//   const handleBulkExport = () => {
//     showToast(`Exporting ${selectedNoteIds.length} notes as JSON...`);
//     setSelectedNoteIds([]);
//   };

//   const handleDeleteNote = (e, noteId) => {
//     e.stopPropagation();
//     if (window.confirm("Are you sure you want to delete this note?")) {
//       setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
//       showToast("Note deleted.");
//     }
//   };

//   const toggleFilter = (filter) => {
//     setActiveFilters((prev) =>
//       prev.includes(filter)
//         ? prev.filter((f) => f !== filter)
//         : [...prev, filter],
//     );
//   };

//   return (
//     <motion.div
//       key="notes-tab"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="relative flex flex-col w-full min-h-screen pb-32 bg-transparent"
//     >
//       <div
//         className={`relative w-full rounded-2xl px-8 py-8 mb-8 overflow-hidden shadow-sm transition-colors ${isDarkMode ? "bg-[#161B2A] border border-[#2A2F3D]" : "bg-[#0f172a] border border-transparent"}`}
//       >
//         <div
//           className={`absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none flex items-center justify-end pr-8 md:pr-12 ${isDarkMode ? "text-slate-600" : "text-slate-500"}`}
//         >
//           <svg
//             width="140"
//             height="100"
//             viewBox="0 0 100 100"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//           >
//             <path d="M 20 20 L 80 20 L 80 40 L 20 40 Z" />
//             <path d="M 20 50 L 80 50 L 80 70 L 20 70 Z" />
//             <line x1="30" y1="20" x2="30" y2="40" />
//             <line x1="30" y1="50" x2="30" y2="70" />
//           </svg>
//         </div>

//         <div className="relative z-10 flex flex-col items-start">
//           <div
//             className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-3 border ${isDarkMode ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-500/30 text-indigo-200 border-indigo-400/30"}`}
//           >
//             <Database size={14} /> Knowledge Base
//           </div>
//           <h2 className="mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
//             My Library.
//           </h2>
//           <p className="max-w-md text-sm font-medium leading-relaxed text-slate-300">
//             Access and organize your captured intelligence. Search, filter, and
//             review all your generated notes and diagrams in one place.
//           </p>
//         </div>
//       </div>

//       <div className="relative z-50 flex flex-col w-full gap-4 mb-6">
//         <div className="flex flex-col items-start justify-between w-full gap-4 xl:flex-row xl:items-center">
//           <div
//             className={`flex items-center rounded-2xl border transition-colors ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]" : "border-slate-200 bg-white"}`}
//           >
//             <div className="relative">
//               <button
//                 onClick={() => setShowFolderMenu(!showFolderMenu)}
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setShowFolderMenu(true);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-l-2xl font-bold text-sm transition-all outline-none ${isDarkMode ? "text-slate-200 hover:bg-[#1A2033]" : "text-slate-700 hover:bg-slate-50"}`}
//               >
//                 <FolderOpen
//                   size={16}
//                   className={
//                     activeFolder.color ||
//                     (isDarkMode ? "text-indigo-400" : "text-indigo-600")
//                   }
//                 />
//                 <span className="truncate max-w-[120px] sm:max-w-[180px]">
//                   {activeFolder.name}
//                 </span>
//                 <ChevronDown
//                   size={14}
//                   className={`shrink-0 transition-transform ${isDarkMode ? "text-slate-500" : "text-slate-400"} ${showFolderMenu ? "rotate-180" : ""}`}
//                 />
//               </button>

//               <AnimatePresence>
//                 {showFolderMenu && (
//                   <>
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       onClick={() => setShowFolderMenu(false)}
//                       className="fixed inset-0 z-40 cursor-default"
//                     />
//                     <motion.div
//                       initial={{ opacity: 0, y: 8, scale: 0.98 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: 8, scale: 0.98 }}
//                       transition={{ duration: 0.15 }}
//                       className={`absolute top-[calc(100%+8px)] left-0 w-64 rounded-xl border shadow-xl z-50 overflow-hidden ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//                     >
//                       <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
//                         {localFolders.map((f) => {
//                           const count =
//                             f.id === "all"
//                               ? savedNotes.length
//                               : savedNotes.filter((n) => n.folderId === f.id)
//                                   .length;
//                           const isActive = activeFolderId === f.id;
//                           return (
//                             <button
//                               key={f.id}
//                               draggable={!f.isDefault}
//                               onDragStart={(e) => {
//                                 if (!f.isDefault)
//                                   e.dataTransfer.setData(
//                                     "reorderFolderId",
//                                     f.id,
//                                   );
//                               }}
//                               onDragOver={(e) => {
//                                 e.preventDefault();
//                                 setDragOverFolder(f.id);
//                               }}
//                               onDragLeave={() => setDragOverFolder(null)}
//                               onDrop={(e) => {
//                                 e.preventDefault();
//                                 const noteId = e.dataTransfer.getData("noteId");
//                                 if (noteId && f.id !== "all") {
//                                   setSavedNotes((prev) =>
//                                     prev.map((n) =>
//                                       n.id.toString() === noteId
//                                         ? { ...n, folderId: f.id }
//                                         : n,
//                                     ),
//                                   );
//                                   showToast(`Moved to ${f.name}`);
//                                 }
//                                 setDragOverFolder(null);
//                                 setShowFolderMenu(false);
//                               }}
//                               onClick={() => {
//                                 setActiveFolderId(f.id);
//                                 setShowFolderMenu(false);
//                               }}
//                               className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all outline-none ${isActive ? (isDarkMode ? "bg-[#1F263B] text-white" : "bg-slate-100 text-slate-900") : isDarkMode ? "text-slate-400 hover:bg-[#1A2033] hover:text-slate-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} ${dragOverFolder === f.id ? "ring-2 ring-indigo-500 bg-indigo-500/20" : ""}`}
//                             >
//                               <div className="flex items-center gap-2.5 truncate">
//                                 {!f.isDefault && (
//                                   <GripVertical
//                                     size={12}
//                                     className={`opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                                   />
//                                 )}
//                                 {f.isDefault && (
//                                   <div className="w-[12px]"></div>
//                                 )}
//                                 <Folder size={14} className={f.color} />
//                                 <span className="truncate">{f.name}</span>
//                               </div>
//                               <div className="flex items-center gap-2 shrink-0">
//                                 {!f.isDefault && (
//                                   <div
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDeleteFolder(e, f.id);
//                                       setShowFolderMenu(false);
//                                     }}
//                                     className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 hover:text-red-500 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                                     title="Delete"
//                                   >
//                                     <Trash2 size={12} />
//                                   </div>
//                                 )}
//                                 <span
//                                   className={`text-[10px] ${isActive ? (isDarkMode ? "text-indigo-300" : "text-indigo-600") : isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                                 >
//                                   {count}
//                                 </span>
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </motion.div>
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div
//               className={`w-px h-5 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
//             ></div>

//             <AnimatePresence mode="wait">
//               {isAddingFolder ? (
//                 <motion.div
//                   initial={{ width: 0, opacity: 0 }}
//                   animate={{ width: "auto", opacity: 1 }}
//                   exit={{ width: 0, opacity: 0 }}
//                   className="pr-2 overflow-hidden shrink-0"
//                 >
//                   <input
//                     type="text"
//                     autoFocus
//                     placeholder="Name..."
//                     value={newFolderName}
//                     onChange={(e) => setNewFolderName(e.target.value)}
//                     onKeyDown={handleAddFolder}
//                     onBlur={() => setIsAddingFolder(false)}
//                     className={`w-24 ml-2 px-2 py-1 text-sm font-semibold rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isDarkMode ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
//                   />
//                 </motion.div>
//               ) : (
//                 <button
//                   onClick={() => setIsAddingFolder(true)}
//                   className={`flex items-center gap-2 px-4 py-2.5 rounded-r-2xl text-sm font-bold transition-all shrink-0 outline-none ${isDarkMode ? "text-slate-300 hover:text-white hover:bg-[#1A2033]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
//                 >
//                   <Plus
//                     size={16}
//                     className={isDarkMode ? "text-slate-400" : "text-slate-500"}
//                   />{" "}
//                   <span className="hidden sm:inline">New</span>
//                 </button>
//               )}
//             </AnimatePresence>
//           </div>

//           <div className="flex flex-col items-center w-full gap-3 sm:flex-row xl:w-auto">
//             <div
//               className={`relative w-full sm:w-64 group flex items-center rounded-2xl border transition-colors ${isDarkMode ? "border-[#2A2F3D] focus-within:border-indigo-500/50 bg-[#131722]" : "border-slate-200 focus-within:border-indigo-300 bg-white"}`}
//             >
//               <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                 <Search
//                   size={14}
//                   className={`transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-indigo-400" : "text-slate-400 group-focus-within:text-indigo-600"}`}
//                 />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search library..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={`w-full pl-9 pr-8 py-2.5 bg-transparent font-semibold text-sm outline-none transition-all ${isDarkMode ? "text-white placeholder-slate-600" : "text-slate-900 placeholder-slate-400"}`}
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className={`absolute right-2 p-1 rounded-md transition-colors ${isDarkMode ? "hover:bg-[#1A2033] text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
//                 >
//                   <X size={14} />
//                 </button>
//               )}
//             </div>

//             <div
//               className={`hidden sm:block w-px h-5 mx-1 shrink-0 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
//             ></div>

//             <div
//               className={`flex items-center p-1 rounded-2xl shrink-0 w-full sm:w-auto border ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]" : "border-slate-200 bg-white"}`}
//             >
//               <button
//                 onClick={() => setNotesViewMode("grid")}
//                 className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "grid" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
//                 title="Grid View"
//               >
//                 <LayoutGrid size={16} />
//               </button>
//               <button
//                 onClick={() => setNotesViewMode("table")}
//                 className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "table" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
//                 title="Table View"
//               >
//                 <List size={16} />
//               </button>
//               <button
//                 onClick={() => setNotesViewMode("timeline")}
//                 className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "timeline" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
//                 title="Timeline View"
//               >
//                 <GitCommit size={16} />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center w-full gap-2 pb-1 overflow-x-auto custom-scrollbar mask-edges">
//           <div
//             className={`text-xs font-bold mr-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//           >
//             Filters
//           </div>
//           {GENERAL_FILTERS.map((filter) => (
//             <button
//               key={filter.id}
//               onClick={() => toggleFilter(filter.id)}
//               className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 ${activeFilters.includes(filter.id) ? (isDarkMode ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm") : isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400 hover:bg-[#1A2033]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
//             >
//               {filter.icon} {filter.id}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 🚀 FIXED GRID VIEW CARDS */}
//       {notesViewMode === "grid" && (
//         <div className="relative z-10 grid w-full grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
//           <AnimatePresence>
//             {sortedNotes.map((note, index) => {
//               const safeTags = Array.isArray(note.tags) ? note.tags : [];
//               const isSelected = selectedNoteIds.includes(note.id);

//               return (
//                 <motion.div // Changed to motion.div to prevent Spacebar bugs
//                   key={note.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   draggable
//                   onDragStart={(e) =>
//                     e.dataTransfer.setData("noteId", note.id.toString())
//                   }
//                   onClick={() => setSelectedNote(note)}
//                   className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1.5 border rounded-[1.5rem] overflow-hidden min-h-[240px] p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] ${isSelected ? (isDarkMode ? "bg-[#1A2033] border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]" : "bg-indigo-50 border-indigo-400 shadow-xl") : isDarkMode ? "bg-[#131722] border-[#2A2F3D] hover:border-[#3b435b] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl shadow-sm"}`}
//                 >
//                   {/* Fixed Checkbox Positioning */}
//                   <div
//                     onClick={(e) => toggleSelection(e, note.id)}
//                     className={`absolute top-6 left-6 z-30 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"}`}
//                   >
//                     {isSelected ? (
//                       <CheckSquare
//                         size={20}
//                         className={
//                           isDarkMode ? "text-indigo-400" : "text-indigo-600"
//                         }
//                         weight="fill"
//                       />
//                     ) : (
//                       <Square
//                         size={20}
//                         className={
//                           isDarkMode
//                             ? "text-slate-500 hover:text-slate-300"
//                             : "text-slate-300 hover:text-slate-500"
//                         }
//                       />
//                     )}
//                   </div>

//                   <div
//                     className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
//                   ></div>

//                   <DiagramThumbnail
//                     graphCode={note.graph}
//                     isDarkMode={isDarkMode}
//                   />
//                   <LibraryCardPattern index={index} />

//                   {/* Fixed Icon Padding to prevent collision with checkbox */}
//                   <div className="relative z-10 flex items-start justify-between w-full pl-10 mb-5 shrink-0">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-colors ${isDarkMode ? "bg-[#161B2A] border-[#2E364F] text-indigo-400" : "bg-white border-slate-200 text-indigo-600"}`}
//                       >
//                         <FileText size={18} strokeWidth={1.5} />
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-1.5">
//                       <span
//                         className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDarkMode ? "text-slate-400 border-[#2A2F3D] bg-[#0b0f19]/50 backdrop-blur-sm" : "text-slate-500 border-slate-200 bg-white/80 backdrop-blur-sm"}`}
//                       >
//                         {note.date}
//                       </span>
//                       <div
//                         onClick={(e) => togglePin(e, note.id)}
//                         className={`p-1.5 rounded-lg transition-all duration-200 ${note.isPinned ? (isDarkMode ? "text-amber-400 hover:bg-amber-400/10" : "text-amber-500 hover:bg-amber-50") : isDarkMode ? "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
//                         title={note.isPinned ? "Unpin" : "Pin Note"}
//                       >
//                         <Star
//                           size={14}
//                           className={note.isPinned ? "fill-current" : ""}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="relative z-10 flex flex-col flex-1 w-full min-h-0 pl-1">
//                     {/* Fixed Key Propagation Bug */}
//                     {editingNoteId === note.id ? (
//                       <div
//                         className="flex items-center w-full gap-2 mb-2"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <input
//                           autoFocus
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                           onKeyDown={(e) => {
//                             e.stopPropagation();
//                             if (e.key === "Enter") saveRename(e, note.id);
//                           }}
//                           onKeyUp={(e) => e.stopPropagation()}
//                           className={`flex-1 font-bold text-lg px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//                         />
//                         <button
//                           onClick={(e) => saveRename(e, note.id)}
//                           className="shrink-0 p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
//                         >
//                           <CheckCircle2 size={14} />
//                         </button>
//                         <button
//                           onClick={(e) => cancelRename(e)}
//                           className="shrink-0 p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
//                         >
//                           <X size={14} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-start gap-2 mb-1.5 w-full">
//                         <h3
//                           className={`text-lg font-extrabold tracking-tight leading-tight truncate flex-1 min-w-0 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-indigo-300" : "text-slate-800 group-hover:text-indigo-700"}`}
//                         >
//                           {note.title}
//                         </h3>
//                         <button
//                           onClick={(e) => startEditing(e, note)}
//                           className={`opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-md transition-all z-20 ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
//                           title="Rename Note"
//                         >
//                           <PenTool size={16} />
//                         </button>
//                       </div>
//                     )}

//                     <p
//                       className={`text-sm line-clamp-2 mb-4 font-medium leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                     >
//                       {note.summary}
//                     </p>

//                     <div
//                       className="flex flex-wrap items-center pt-4 mt-auto border-t shrink-0 gap-x-3 gap-y-2"
//                       style={{
//                         borderColor: isDarkMode
//                           ? "rgba(42, 47, 61, 0.5)"
//                           : "#F1F5F9",
//                       }}
//                     >
//                       {note.audioUrl && (
//                         <MiniAudioPlayer isDarkMode={isDarkMode} />
//                       )}
//                       <div
//                         className={`flex items-center gap-1 text-[11px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                       >
//                         <Clock size={12} /> {note.duration}
//                       </div>
//                       {note.items > 0 && (
//                         <div
//                           className={`flex items-center gap-1 text-[11px] font-bold ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`}
//                         >
//                           <CheckCircle2 size={12} /> {note.items} tasks
//                         </div>
//                       )}
//                       {safeTags.length > 0 && (
//                         <div
//                           className={`flex items-center gap-1 text-[11px] font-bold ml-auto ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
//                         >
//                           <Tag size={12} /> {safeTags.length}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         </div>
//       )}

//       {notesViewMode === "table" && (
//         <div className="relative z-10 w-full pt-2">
//           {sortedNotes.length === 0 ? (
//             <div
//               className={`py-24 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed w-full ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]/50" : "border-slate-200 bg-slate-50/50"}`}
//             >
//               <div
//                 className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border shadow-sm ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
//               >
//                 <Database size={28} strokeWidth={1.5} />
//               </div>
//               <h3
//                 className={`text-lg font-bold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}
//               >
//                 No Results
//               </h3>
//               <p
//                 className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//               >
//                 Try adjusting your filters or search query.
//               </p>
//             </div>
//           ) : (
//             <div
//               className={`w-full overflow-hidden rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//             >
//               <div className="overflow-x-auto custom-scrollbar">
//                 <table className="w-full text-left border-collapse min-w-[800px]">
//                   <thead>
//                     <tr
//                       className={`text-[10px] font-black uppercase tracking-widest border-b ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D] text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}
//                     >
//                       <th className="w-12 p-4 text-center">
//                         <button
//                           onClick={toggleSelectAll}
//                           className="focus:outline-none"
//                         >
//                           {selectedNoteIds.length === sortedNotes.length &&
//                           sortedNotes.length > 0 ? (
//                             <CheckSquare
//                               size={16}
//                               className={
//                                 isDarkMode
//                                   ? "text-indigo-400"
//                                   : "text-indigo-600"
//                               }
//                               weight="fill"
//                             />
//                           ) : (
//                             <Square
//                               size={16}
//                               className={
//                                 isDarkMode
//                                   ? "text-slate-500 hover:text-slate-300"
//                                   : "text-slate-300 hover:text-slate-500"
//                               }
//                             />
//                           )}
//                         </button>
//                       </th>
//                       <th className="w-10 p-4"></th>
//                       <th className="p-4 pl-0 text-xs font-extrabold">Name</th>
//                       <th className="p-4 text-xs font-extrabold">Directory</th>
//                       <th className="p-4 text-xs font-extrabold">Date</th>
//                       <th className="p-4 text-xs font-extrabold">Stats</th>
//                       <th className="p-4 text-xs font-extrabold">Tags</th>
//                       <th className="w-16 p-4"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sortedNotes.map((note) => {
//                       const safeTags = Array.isArray(note.tags)
//                         ? note.tags
//                         : [];
//                       const isSelected = selectedNoteIds.includes(note.id);
//                       const folderName =
//                         folders.find((f) => f.id === note.folderId)?.name ||
//                         "Unknown";
//                       const folderColor =
//                         folders.find((f) => f.id === note.folderId)?.color ||
//                         "text-indigo-500";

//                       return (
//                         <tr
//                           key={note.id}
//                           onClick={() => setSelectedNote(note)}
//                           draggable
//                           onDragStart={(e) =>
//                             e.dataTransfer.setData("noteId", note.id.toString())
//                           }
//                           className={`group cursor-pointer border-b transition-colors ${isSelected ? (isDarkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100") : isDarkMode ? "border-[#2A2F3D] hover:bg-[#1A2033]" : "border-slate-100 hover:bg-slate-50"} last:border-0`}
//                         >
//                           <td
//                             className="p-4 text-center"
//                             onClick={(e) => toggleSelection(e, note.id)}
//                           >
//                             {isSelected ? (
//                               <CheckSquare
//                                 size={16}
//                                 className={
//                                   isDarkMode
//                                     ? "text-indigo-400"
//                                     : "text-indigo-600"
//                                 }
//                                 weight="fill"
//                               />
//                             ) : (
//                               <Square
//                                 size={16}
//                                 className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-300 hover:text-slate-500"}`}
//                               />
//                             )}
//                           </td>
//                           <td
//                             className="p-4 pl-0"
//                             onClick={(e) => togglePin(e, note.id)}
//                           >
//                             <Star
//                               size={16}
//                               className={`transition-colors ${note.isPinned ? (isDarkMode ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500") : isDarkMode ? "opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-400" : "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500"}`}
//                             />
//                           </td>
//                           <td className="p-4 pl-0">
//                             <div className="flex items-center w-full gap-3">
//                               <div
//                                 className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isDarkMode ? "bg-[#131722] border-[#2E364F] text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}
//                               >
//                                 <FileText size={14} />
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 {editingNoteId === note.id ? (
//                                   <div
//                                     className="flex items-center w-full gap-2 mt-1"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     <input
//                                       autoFocus
//                                       value={editTitle}
//                                       onChange={(e) =>
//                                         setEditTitle(e.target.value)
//                                       }
//                                       onClick={(e) => e.stopPropagation()}
//                                       onKeyDown={(e) => {
//                                         e.stopPropagation();
//                                         if (e.key === "Enter")
//                                           saveRename(e, note.id);
//                                       }}
//                                       onKeyUp={(e) => e.stopPropagation()}
//                                       className={`flex-1 font-bold text-sm px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-900"}`}
//                                     />
//                                     <button
//                                       onClick={(e) => saveRename(e, note.id)}
//                                       className="p-1 text-white rounded shrink-0 bg-emerald-500 hover:bg-emerald-600"
//                                     >
//                                       <CheckCircle2 size={14} />
//                                     </button>
//                                     <button
//                                       onClick={(e) => cancelRename(e)}
//                                       className="p-1 text-white rounded shrink-0 bg-rose-500 hover:bg-rose-600"
//                                     >
//                                       <X size={14} />
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <div className="flex items-center justify-between gap-2 w-full max-w-[200px] lg:max-w-[300px]">
//                                     <div
//                                       className={`font-bold text-sm truncate flex-1 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
//                                     >
//                                       {note.title}
//                                     </div>
//                                     <button
//                                       onClick={(e) => startEditing(e, note)}
//                                       className={`opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded-md transition-all ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
//                                       title="Rename Note"
//                                     >
//                                       <PenTool size={14} />
//                                     </button>
//                                   </div>
//                                 )}
//                                 {note.audioUrl && (
//                                   <div
//                                     className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
//                                   >
//                                     <Mic size={10} /> Audio Source
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div
//                               className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold border ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D] text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}
//                             >
//                               <Folder size={12} className={folderColor} />{" "}
//                               <span className="truncate max-w-[100px]">
//                                 {folderName}
//                               </span>
//                             </div>
//                           </td>
//                           <td
//                             className={`p-4 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                           >
//                             {note.date}
//                           </td>
//                           <td className="p-4">
//                             <div className="flex flex-col gap-1 text-[11px] font-bold">
//                               <span
//                                 className={`flex items-center gap-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                               >
//                                 <Clock size={10} /> {note.duration}
//                               </span>
//                               {note.items > 0 && (
//                                 <span
//                                   className={`flex items-center gap-1.5 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
//                                 >
//                                   <CheckCircle2 size={10} /> {note.items} tasks
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex flex-wrap gap-1.5 max-w-[150px]">
//                               {safeTags.slice(0, 2).map((tag, i) => (
//                                 <span
//                                   key={i}
//                                   className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
//                                 >
//                                   {tag}
//                                 </span>
//                               ))}
//                               {safeTags.length > 2 && (
//                                 <span
//                                   className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                                 >
//                                   +{safeTags.length - 2}
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="p-4 text-right">
//                             <div
//                               onClick={(e) => handleDeleteNote(e, note.id)}
//                               className={`inline-flex p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? "hover:bg-red-500/20 text-slate-500 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"}`}
//                               title="Delete"
//                             >
//                               <Trash2 size={16} />
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* 🚀 FIXED TIMELINE VIEW */}
//       {notesViewMode === "timeline" && (
//         <div className="relative z-10 w-full py-4 pl-4 space-y-8">
//           {Object.keys(groupedNotesByDate).length === 0 && (
//             <div
//               className={`py-24 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed w-full ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]/50" : "border-slate-200 bg-slate-50/50"}`}
//             >
//               <div
//                 className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border shadow-sm ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
//               >
//                 <Calendar size={28} strokeWidth={1.5} />
//               </div>
//               <h3
//                 className={`text-lg font-bold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}
//               >
//                 Timeline is quiet
//               </h3>
//               <p
//                 className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//               >
//                 You haven't recorded any notes yet.
//               </p>
//             </div>
//           )}

//           {Object.entries(groupedNotesByDate).map(([date, dateNotes]) => (
//             <div key={date} className="relative w-full">
//               <div
//                 className={`absolute left-0 top-2 bottom-0 w-0.5 -translate-x-[0.5px] ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
//               ></div>

//               <div className="relative flex items-center mb-5">
//                 <div
//                   className={`absolute left-0 w-2.5 h-2.5 rounded-full border-2 -translate-x-[4.5px] ${isDarkMode ? "bg-[#0b0f19] border-indigo-500" : "bg-[#f8fafc] border-indigo-500"}`}
//                 ></div>
//                 <h3
//                   className={`ml-6 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}
//                 >
//                   {date}
//                 </h3>
//               </div>

//               <div className="ml-6 space-y-3">
//                 {dateNotes.map((note) => {
//                   const safeTags = Array.isArray(note.tags) ? note.tags : [];
//                   return (
//                     <div // Changed from <button> to <div> to prevent Spacebar bugs
//                       key={note.id}
//                       draggable
//                       onDragStart={(e) =>
//                         e.dataTransfer.setData("noteId", note.id.toString())
//                       }
//                       onClick={() => setSelectedNote(note)}
//                       className={`w-full focus:outline-none group flex flex-col md:flex-row md:items-center text-left gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:cursor-grabbing hover:-translate-y-0.5 relative overflow-hidden ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] hover:border-indigo-500/50 hover:shadow-lg" : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"}`}
//                     >
//                       <div
//                         className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity`}
//                       ></div>
//                       <div
//                         className={`w-10 h-10 ml-2 rounded-xl shrink-0 flex items-center justify-center border transition-colors ${isDarkMode ? "bg-[#1A2033] text-indigo-400 border-[#2E364F] group-hover:text-indigo-300" : "bg-slate-50 text-indigo-600 border-slate-200 group-hover:bg-indigo-50"}`}
//                       >
//                         <FileText size={18} strokeWidth={1.5} />
//                       </div>

//                       <div className="flex-1 min-w-0 pr-4">
//                         {editingNoteId === note.id ? (
//                           <div
//                             className="flex items-center w-full gap-2 mb-1"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <input
//                               autoFocus
//                               value={editTitle}
//                               onChange={(e) => setEditTitle(e.target.value)}
//                               onClick={(e) => e.stopPropagation()}
//                               onKeyDown={(e) => {
//                                 e.stopPropagation();
//                                 if (e.key === "Enter") saveRename(e, note.id);
//                               }}
//                               onKeyUp={(e) => e.stopPropagation()}
//                               className={`flex-1 font-bold text-sm px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-900"}`}
//                             />
//                             <button
//                               onClick={(e) => saveRename(e, note.id)}
//                               className="p-1 text-white rounded shrink-0 bg-emerald-500 hover:bg-emerald-600"
//                             >
//                               <CheckCircle2 size={14} />
//                             </button>
//                             <button
//                               onClick={(e) => cancelRename(e)}
//                               className="p-1 text-white rounded shrink-0 bg-rose-500 hover:bg-rose-600"
//                             >
//                               <X size={14} />
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-between w-full gap-2 mb-1">
//                             <div className="flex items-center flex-1 min-w-0 gap-2">
//                               {note.isPinned && (
//                                 <Star
//                                   size={12}
//                                   className={`shrink-0 ${isDarkMode ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500"}`}
//                                 />
//                               )}
//                               <h4
//                                 className={`font-bold text-sm truncate transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"}`}
//                               >
//                                 {note.title}
//                               </h4>
//                             </div>
//                             <button
//                               onClick={(e) => startEditing(e, note)}
//                               className={`opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-md transition-all z-20 ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
//                               title="Rename Note"
//                             >
//                               <PenTool size={14} />
//                             </button>
//                           </div>
//                         )}

//                         <div className="flex items-center gap-4 text-[11px] font-medium">
//                           <span
//                             className={`flex items-center gap-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
//                           >
//                             <Clock size={12} /> {note.duration}
//                           </span>
//                           {note.items > 0 && (
//                             <span
//                               className={`flex items-center gap-1 ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`}
//                             >
//                               <CheckCircle2 size={12} /> {note.items}
//                             </span>
//                           )}
//                           {note.audioUrl && (
//                             <MiniAudioPlayer isDarkMode={isDarkMode} />
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3 mt-3 shrink-0 md:mt-0">
//                         <div className="flex flex-wrap gap-1.5 justify-end">
//                           {safeTags.slice(0, 2).map((tag, i) => (
//                             <span
//                               key={i}
//                               className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                         <div
//                           className="flex items-center justify-center w-8 h-8 pl-2 border-l shrink-0"
//                           style={{
//                             borderColor: isDarkMode ? "#2E364F" : "#E2E8F0",
//                           }}
//                         >
//                           <div
//                             onClick={(e) => handleDeleteNote(e, note.id)}
//                             className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg ${isDarkMode ? "hover:bg-red-500/20 text-slate-500 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"}`}
//                             title="Delete Note"
//                           >
//                             <Trash2 size={14} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🌟 FLOATING BULK COMMAND BAR */}
//       <AnimatePresence>
//         {selectedNoteIds.length > 0 && (
//           <motion.div
//             initial={{ y: 100, opacity: 0, scale: 0.95 }}
//             animate={{ y: 0, opacity: 1, scale: 1 }}
//             exit={{ y: 100, opacity: 0, scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 400, damping: 25 }}
//             className="fixed z-50 -translate-x-1/2 pointer-events-auto bottom-8 left-1/2"
//           >
//             <div
//               className={`flex items-center gap-1.5 p-1.5 rounded-[1.25rem] shadow-[0_15px_40px_rgba(0,0,0,0.2)] border backdrop-blur-2xl ${isDarkMode ? "bg-[#131722]/90 border-[#2A2F3D]" : "bg-white/90 border-slate-200 shadow-slate-200/50"}`}
//             >
//               <div className="flex items-center gap-2 px-3">
//                 <div
//                   className={`flex items-center justify-center w-6 h-6 rounded-full font-black text-[10px] ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
//                 >
//                   {selectedNoteIds.length}
//                 </div>
//                 <span
//                   className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
//                 >
//                   Selected
//                 </span>
//               </div>
//               <div
//                 className={`w-px h-6 mx-1 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
//               ></div>

//               <div className="relative">
//                 <button
//                   onClick={() => setShowBulkFolderMenu(!showBulkFolderMenu)}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-100"}`}
//                 >
//                   <FolderOpen size={14} /> Move <ChevronDown size={12} />
//                 </button>
//                 <AnimatePresence>
//                   {showBulkFolderMenu && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className={`absolute bottom-[calc(100%+12px)] left-0 w-48 rounded-xl border shadow-xl overflow-hidden p-1.5 z-50 ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//                     >
//                       {localFolders.map((f) => (
//                         <button
//                           key={f.id}
//                           onClick={() => handleBulkMove(f.id)}
//                           className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-50"}`}
//                         >
//                           <Folder size={14} className={f.color} />{" "}
//                           <span className="truncate">{f.name}</span>
//                         </button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <button
//                 onClick={handleBulkExport}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-100"}`}
//               >
//                 <Download size={14} /> Export
//               </button>
//               <button
//                 onClick={handleBulkDelete}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
//               >
//                 <Trash2 size={14} /> Delete
//               </button>
//               <div
//                 className={`w-px h-6 mx-1 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
//               ></div>
//               <button
//                 onClick={() => setSelectedNoteIds([])}
//                 className={`p-2 rounded-xl transition-all ${isDarkMode ? "text-slate-500 hover:bg-[#1A2033] hover:text-slate-300" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  FolderOpen,
  Folder,
  Search,
  LayoutGrid,
  GitCommit,
  FileText,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  X,
  ChevronDown,
  GripVertical,
  Database,
  PlayCircle,
  Headphones,
  Workflow,
  Mic,
  PenTool,
  Star,
  List,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";

// 🚀 Setup Backend URL for the delete endpoints
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// --- SLEEK ABSTRACT SVG PATTERNS FOR CARDS ---
const LibraryCardPattern = ({ index }) => {
  const patterns = [
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="text-blue-500 transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 group-hover:scale-110"
    >
      <path
        d="M10 90 Q 30 50 90 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <circle cx="10" cy="90" r="2" fill="currentColor" />
      <circle cx="90" cy="10" r="2" fill="currentColor" />
      <path
        d="M30 90 Q 60 70 90 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="1.5" fill="currentColor" />
    </svg>,
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="text-indigo-500 transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 group-hover:scale-110"
    >
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(15 50 50)"
      />
      <rect
        x="30"
        y="30"
        width="40"
        height="40"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(30 50 50)"
      />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    </svg>,
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="transition-transform duration-700 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-20 text-emerald-500 group-hover:scale-110"
    >
      <rect x="25" y="55" width="8" height="35" rx="4" fill="currentColor" />
      <rect x="45" y="30" width="8" height="60" rx="4" fill="currentColor" />
      <rect
        x="65"
        y="45"
        width="8"
        height="45"
        rx="4"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="85"
        y="70"
        width="8"
        height="20"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>,
  ];
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none">
      {patterns[index % patterns.length]}
    </div>
  );
};

// --- SMART BLUEPRINT ENGINE (Thumbnails) ---
const DiagramThumbnail = ({ graphCode, isDarkMode }) => {
  const code = String(graphCode || "").toLowerCase();
  const isSeq = code.includes("sequencediagram");
  const isMindmap = code.includes("mindmap");

  const baseStyle = `absolute inset-0 w-full h-full object-cover opacity-[0.04] dark:opacity-[0.08] pointer-events-none transition-transform duration-700 group-hover:scale-105 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`;

  if (isSeq)
    return (
      <svg
        className={baseStyle}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1="25"
          y1="10"
          x2="25"
          y2="90"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <line
          x1="75"
          y1="10"
          x2="75"
          y2="90"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <rect x="15" y="5" width="20" height="10" rx="2" fill="currentColor" />
        <rect x="65" y="5" width="20" height="10" rx="2" fill="currentColor" />
        <path
          d="M25 30 L70 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <polygon points="70,27 75,30 70,33" fill="currentColor" />
        <path
          d="M75 50 L30 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <polygon points="30,47 25,50 30,53" fill="currentColor" />
      </svg>
    );

  if (isMindmap)
    return (
      <svg
        className={baseStyle}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M50 38 C50 20 30 20 30 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M50 38 C50 20 70 20 70 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M50 62 C50 80 30 80 30 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M50 62 C50 80 70 80 70 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect x="20" y="15" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="70" y="15" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="20" y="75" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="70" y="75" width="10" height="10" rx="2" fill="currentColor" />
      </svg>
    );

  return (
    <svg className={baseStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="40" y="10" width="20" height="12" rx="3" fill="currentColor" />
      <path
        d="M50 22 L50 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon points="48,37 50,40 52,37" fill="currentColor" />
      <rect
        x="35"
        y="40"
        width="30"
        height="20"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M50 60 L50 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon points="48,77 50,80 52,77" fill="currentColor" />
      <path
        d="M35 50 L20 50 L20 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon points="18,77 20,80 22,77" fill="currentColor" />
    </svg>
  );
};

// --- MINI AUDIO PLAYER COMPONENT ---
const MiniAudioPlayer = ({ isDarkMode }) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-inner ${isDarkMode ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"}`}
  >
    <PlayCircle
      size={12}
      className={isDarkMode ? "text-purple-400" : "text-purple-600"}
    />
    <div className="flex items-end gap-[2px] h-2.5">
      <div className="w-[2px] h-full bg-current rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
      <div className="w-[2px] h-1/2 bg-current rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]"></div>
      <div className="w-[2px] h-3/4 bg-current rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]"></div>
      <div className="w-[2px] h-1/3 bg-current rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.1s]"></div>
    </div>
  </div>
);

// --- GENERALIZED FILTERS ---
const GENERAL_FILTERS = [
  { id: "Recent", icon: <Clock size={12} /> },
  { id: "With Diagrams", icon: <Workflow size={12} /> },
  { id: "Audio Logs", icon: <Headphones size={12} /> },
  { id: "Action Items", icon: <CheckCircle2 size={12} /> },
];

export default function LibraryTab({
  isDarkMode,
  folders,
  activeFolderId,
  setActiveFolderId,
  isAddingFolder,
  setIsAddingFolder,
  newFolderName,
  setNewFolderName,
  handleAddFolder,
  handleDeleteFolder,
  dragOverFolder,
  setDragOverFolder,
  setSavedNotes,
  savedNotes,
  showToast,
  searchQuery,
  setSearchQuery,
  notesViewMode,
  setNotesViewMode,
  setSelectedNote,
}) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [localFolders, setLocalFolders] = useState(folders);
  const [activeFilters, setActiveFilters] = useState([]);

  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [showBulkFolderMenu, setShowBulkFolderMenu] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    let updated = [...localFolders];
    updated = updated.filter((lf) => folders.some((f) => f.id === lf.id));
    folders.forEach((f) => {
      if (!updated.some((lf) => lf.id === f.id)) updated.push(f);
    });
    setLocalFolders(updated);
  }, [folders]);

  const activeFolder =
    localFolders.find((f) => f.id === activeFolderId) || localFolders[0];

  const safeSearchQuery = String(searchQuery || "").toLowerCase();

  let filteredNotesForLibrary = savedNotes.filter((n) => {
    const safeTitle = String(n.title || "").toLowerCase();
    const safeSummary = String(n.summary || "").toLowerCase();
    return (
      (activeFolderId === "all" || n.folderId === activeFolderId) &&
      (safeTitle.includes(safeSearchQuery) ||
        safeSummary.includes(safeSearchQuery))
    );
  });

  if (activeFilters.includes("Audio Logs"))
    filteredNotesForLibrary = filteredNotesForLibrary.filter(
      (n) => n.audioUrl || String(n.summary).toLowerCase().includes("audio"),
    );
  if (activeFilters.includes("Action Items"))
    filteredNotesForLibrary = filteredNotesForLibrary.filter(
      (n) =>
        n.items > 0 || String(n.summary).toLowerCase().includes("action item"),
    );
  if (activeFilters.includes("With Diagrams"))
    filteredNotesForLibrary = filteredNotesForLibrary.filter(
      (n) => n.graph || n.diagram || (n.graphs && n.graphs.length > 0),
    );
  if (activeFilters.includes("Recent")) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    filteredNotesForLibrary = filteredNotesForLibrary.filter((n) => {
      const noteDate = new Date(n.date);
      return !isNaN(noteDate) && noteDate >= oneWeekAgo;
    });
  }

  const sortedNotes = [...filteredNotesForLibrary].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const groupedNotesByDate = sortedNotes.reduce((acc, note) => {
    (acc[note.date] = acc[note.date] || []).push(note);
    return acc;
  }, {});

  const startEditing = (e, note) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditTitle(note.title);
  };

  const saveRename = (e, noteId) => {
    e.stopPropagation();
    if (editTitle.trim() === "") {
      setEditingNoteId(null);
      return;
    }
    setSavedNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, title: editTitle } : n)),
    );
    setEditingNoteId(null);
    showToast("Note renamed successfully.");
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setEditingNoteId(null);
    setEditTitle("");
  };

  const togglePin = (e, noteId) => {
    e.stopPropagation();
    setSavedNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)),
    );
    showToast("Pin status updated.");
  };

  const toggleSelection = (e, noteId) => {
    e.stopPropagation();
    setSelectedNoteIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const toggleSelectAll = () => {
    if (
      selectedNoteIds.length === sortedNotes.length &&
      sortedNotes.length > 0
    ) {
      setSelectedNoteIds([]);
    } else {
      setSelectedNoteIds(sortedNotes.map((n) => n.id));
    }
  };

  // 🚀 FIXED: Actually tells the backend to permanently delete multiple notes
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedNoteIds.length} notes permanently?`)) {
      const idsToDelete = [...selectedNoteIds];

      // Update UI instantly
      setSavedNotes((prev) => prev.filter((n) => !idsToDelete.includes(n.id)));
      setSelectedNoteIds([]);

      // Tell Backend to physically remove them
      idsToDelete.forEach((id) => {
        fetch(`${BACKEND_URL}/api/notes/${id}`, { method: "DELETE" }).catch(
          (e) => console.error("Failed to delete note from DB:", e),
        );
      });

      showToast(`${idsToDelete.length} notes deleted.`);
    }
  };

  const handleBulkMove = (folderId) => {
    setSavedNotes((prev) =>
      prev.map((n) =>
        selectedNoteIds.includes(n.id) ? { ...n, folderId } : n,
      ),
    );
    setSelectedNoteIds([]);
    setShowBulkFolderMenu(false);
    const folderName = folders.find((f) => f.id === folderId)?.name || "Folder";
    showToast(`Moved to ${folderName}`);
  };

  // 🚀 FIXED: Actually packages the JSON data and triggers a real file download
  const handleBulkExport = () => {
    try {
      const notesToExport = savedNotes.filter((n) =>
        selectedNoteIds.includes(n.id),
      );
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(notesToExport, null, 2));

      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute(
        "download",
        `spoly_bulk_export_${new Date().toISOString().slice(0, 10)}.json`,
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      showToast(`Successfully exported ${selectedNoteIds.length} notes!`);
      setSelectedNoteIds([]);
    } catch (err) {
      console.error("Export failed:", err);
      showToast("Failed to bulk export notes.");
    }
  };

  // 🚀 FIXED: Tells backend to permanently delete a single note
  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      // Update UI instantly
      setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));

      // Tell Backend to physically remove it
      fetch(`${BACKEND_URL}/api/notes/${noteId}`, { method: "DELETE" }).catch(
        (e) => console.error("Failed to delete note from DB:", e),
      );

      showToast("Note deleted.");
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  return (
    <motion.div
      key="notes-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col w-full min-h-screen pb-32 bg-transparent"
    >
      {/* 🌟 UNIFIED ULTRA-COMPACT HERO BANNER */}
      <div
        className={`w-full rounded-3xl p-6 md:px-8 relative overflow-hidden shadow-sm border mb-8 flex flex-col justify-center ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full ${isDarkMode ? "bg-indigo-600/20" : "bg-indigo-300/30"}`}
          ></div>
          <div
            className={`absolute -bottom-24 -left-24 w-64 h-64 blur-[80px] rounded-full ${isDarkMode ? "bg-blue-600/20" : "bg-blue-300/30"}`}
          ></div>
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col md:flex-row md:items-center justify-between w-full">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2 border ${isDarkMode ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-50 text-indigo-600 border-indigo-200"}`}
            >
              <Database size={12} /> Knowledge Base
            </div>
            <h2
              className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Your Notes Library.
            </h2>
            <p
              className={`text-sm font-medium leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Search, filter, and review all your captured intelligence in one place.
            </p>
          </div>
        </div>
        
        {/* Unique SVG Pattern */}
        <div className={`absolute -right-4 -bottom-4 w-48 h-48 opacity-[0.12] pointer-events-none ${isDarkMode ? "text-white" : "text-indigo-600"}`}>
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M 30 70 L 170 70 L 170 180 L 30 180 Z" strokeDasharray="12 10" />
            <path d="M 40 50 L 160 50" strokeLinecap="round" />
            <path d="M 50 30 L 150 30" strokeLinecap="round" />
            <circle cx="70" cy="110" r="12" fill="currentColor" opacity="0.5" />
            <circle cx="130" cy="140" r="16" />
            <path d="M 70 122 L 130 140" strokeWidth="3" />
            <path d="M 100 80 L 130 124" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="80" r="8" />
          </svg>
        </div>
      </div>

      <div className="relative z-50 flex flex-col w-full gap-4 mb-6">
        <div className="flex flex-col items-start justify-between w-full gap-4 xl:flex-row xl:items-center">
          <div
            className={`flex items-center rounded-2xl border transition-colors ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]" : "border-slate-200 bg-white"}`}
          >
            <div className="relative">
              <button
                onClick={() => setShowFolderMenu(!showFolderMenu)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setShowFolderMenu(true);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-l-2xl font-bold text-sm transition-all outline-none ${isDarkMode ? "text-slate-200 hover:bg-[#1A2033]" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <FolderOpen
                  size={16}
                  className={
                    activeFolder.color ||
                    (isDarkMode ? "text-indigo-400" : "text-indigo-600")
                  }
                />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {activeFolder.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform ${isDarkMode ? "text-slate-500" : "text-slate-400"} ${showFolderMenu ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showFolderMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowFolderMenu(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-[calc(100%+8px)] left-0 w-64 rounded-xl border shadow-xl z-50 overflow-hidden ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                        {localFolders.map((f) => {
                          const count =
                            f.id === "all"
                              ? savedNotes.length
                              : savedNotes.filter((n) => n.folderId === f.id)
                                  .length;
                          const isActive = activeFolderId === f.id;
                          return (
                            <button
                              key={f.id}
                              draggable={!f.isDefault}
                              onDragStart={(e) => {
                                if (!f.isDefault)
                                  e.dataTransfer.setData(
                                    "reorderFolderId",
                                    f.id,
                                  );
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverFolder(f.id);
                              }}
                              onDragLeave={() => setDragOverFolder(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                const noteId = e.dataTransfer.getData("noteId");
                                if (noteId && f.id !== "all") {
                                  setSavedNotes((prev) =>
                                    prev.map((n) =>
                                      n.id.toString() === noteId
                                        ? { ...n, folderId: f.id }
                                        : n,
                                    ),
                                  );
                                  showToast(`Moved to ${f.name}`);
                                }
                                setDragOverFolder(null);
                                setShowFolderMenu(false);
                              }}
                              onClick={() => {
                                setActiveFolderId(f.id);
                                setShowFolderMenu(false);
                              }}
                              className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all outline-none ${isActive ? (isDarkMode ? "bg-[#1F263B] text-white" : "bg-slate-100 text-slate-900") : isDarkMode ? "text-slate-400 hover:bg-[#1A2033] hover:text-slate-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"} ${dragOverFolder === f.id ? "ring-2 ring-indigo-500 bg-indigo-500/20" : ""}`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                {!f.isDefault && (
                                  <GripVertical
                                    size={12}
                                    className={`opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                  />
                                )}
                                {f.isDefault && (
                                  <div className="w-[12px]"></div>
                                )}
                                <Folder size={14} className={f.color} />
                                <span className="truncate">{f.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {!f.isDefault && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(e, f.id);
                                      setShowFolderMenu(false);
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 hover:text-red-500 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </div>
                                )}
                                <span
                                  className={`text-[10px] ${isActive ? (isDarkMode ? "text-indigo-300" : "text-indigo-600") : isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                >
                                  {count}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div
              className={`w-px h-5 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
            ></div>

            <AnimatePresence mode="wait">
              {isAddingFolder ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="pr-2 overflow-hidden shrink-0"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={handleAddFolder}
                    onBlur={() => setIsAddingFolder(false)}
                    className={`w-24 ml-2 px-2 py-1 text-sm font-semibold rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isDarkMode ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
                  />
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsAddingFolder(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-r-2xl text-sm font-bold transition-all shrink-0 outline-none ${isDarkMode ? "text-slate-300 hover:text-white hover:bg-[#1A2033]" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  <Plus
                    size={16}
                    className={isDarkMode ? "text-slate-400" : "text-slate-500"}
                  />{" "}
                  <span className="hidden sm:inline">New</span>
                </button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center w-full gap-3 sm:flex-row xl:w-auto">
            <div
              className={`relative w-full sm:w-64 group flex items-center rounded-2xl border transition-colors ${isDarkMode ? "border-[#2A2F3D] focus-within:border-indigo-500/50 bg-[#131722]" : "border-slate-200 focus-within:border-indigo-300 bg-white"}`}
            >
              <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
                <Search
                  size={14}
                  className={`transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-indigo-400" : "text-slate-400 group-focus-within:text-indigo-600"}`}
                />
              </div>
              <input
                type="text"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2.5 bg-transparent font-semibold text-sm outline-none transition-all ${isDarkMode ? "text-white placeholder-slate-600" : "text-slate-900 placeholder-slate-400"}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-2 p-1 rounded-md transition-colors ${isDarkMode ? "hover:bg-[#1A2033] text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div
              className={`hidden sm:block w-px h-5 mx-1 shrink-0 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
            ></div>

            <div
              className={`flex items-center p-1 rounded-2xl shrink-0 w-full sm:w-auto border ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]" : "border-slate-200 bg-white"}`}
            >
              <button
                onClick={() => setNotesViewMode("grid")}
                className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "grid" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setNotesViewMode("table")}
                className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "table" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
                title="Table View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setNotesViewMode("timeline")}
                className={`flex-1 sm:flex-none p-1.5 rounded-xl flex justify-center items-center transition-all outline-none ${notesViewMode === "timeline" ? (isDarkMode ? "bg-[#1F263B] text-indigo-400" : "bg-slate-100 text-indigo-600") : isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
                title="Timeline View"
              >
                <GitCommit size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full gap-2 pb-1 overflow-x-auto custom-scrollbar mask-edges">
          <div
            className={`text-xs font-bold mr-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Filters
          </div>
          {GENERAL_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 ${activeFilters.includes(filter.id) ? (isDarkMode ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm") : isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400 hover:bg-[#1A2033]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {filter.icon} {filter.id}
            </button>
          ))}
        </div>
      </div>

      {notesViewMode === "grid" && (
        <div className="relative z-10 grid w-full grid-cols-1 gap-6 md:gap-8 pt-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence>
            {sortedNotes.map((note, index) => {
              const safeTags = Array.isArray(note.tags) ? note.tags : [];
              const isSelected = selectedNoteIds.includes(note.id);

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("noteId", note.id.toString())
                  }
                  onClick={() => setSelectedNote(note)}
                  className={`group relative flex flex-col text-left transition-all duration-500 hover:z-20 hover:-translate-y-2 border rounded-[1.75rem] overflow-hidden min-h-[260px] p-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] ${isSelected ? (isDarkMode ? "bg-[#1e2333] border-indigo-500/60 shadow-[0_0_40px_rgba(99,102,241,0.2)]" : "bg-indigo-50/80 border-indigo-500/50 shadow-2xl") : isDarkMode ? "bg-[#131722]/80 backdrop-blur-xl border-[#2A2F3D] hover:border-[#4B5563] hover:bg-[#1A2033] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xl shadow-md"}`}
                >
                  <div
                    onClick={(e) => toggleSelection(e, note.id)}
                    className={`absolute top-6 left-6 z-30 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"}`}
                  >
                    {isSelected ? (
                      <CheckSquare
                        size={20}
                        className={
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }
                        weight="fill"
                      />
                    ) : (
                      <Square
                        size={20}
                        className={
                          isDarkMode
                            ? "text-slate-500 hover:text-slate-300"
                            : "text-slate-300 hover:text-slate-500"
                        }
                      />
                    )}
                  </div>

                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  ></div>

                  <DiagramThumbnail
                    graphCode={note.graph}
                    isDarkMode={isDarkMode}
                  />
                  <LibraryCardPattern index={index} />

                  <div className="relative z-10 flex items-start justify-between w-full pl-10 mb-5 shrink-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-colors ${isDarkMode ? "bg-[#161B2A] border-[#2E364F] text-indigo-400" : "bg-white border-slate-200 text-indigo-600"}`}
                      >
                        <FileText size={18} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isDarkMode ? "text-slate-400 border-[#2A2F3D] bg-[#0b0f19]/50 backdrop-blur-sm" : "text-slate-500 border-slate-200 bg-white/80 backdrop-blur-sm"}`}
                      >
                        {note.date}
                      </span>
                      <div
                        onClick={(e) => togglePin(e, note.id)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${note.isPinned ? (isDarkMode ? "text-amber-400 hover:bg-amber-400/10" : "text-amber-500 hover:bg-amber-50") : isDarkMode ? "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 hover:bg-[#1A2033]" : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        title={note.isPinned ? "Unpin" : "Pin Note"}
                      >
                        <Star
                          size={14}
                          className={note.isPinned ? "fill-current" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col flex-1 w-full min-h-0 pl-1">
                    {editingNoteId === note.id ? (
                      <div
                        className="flex items-center w-full gap-2 mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") saveRename(e, note.id);
                          }}
                          onKeyUp={(e) => e.stopPropagation()}
                          className={`flex-1 font-bold text-lg px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                        />
                        <button
                          onClick={(e) => saveRename(e, note.id)}
                          className="shrink-0 p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          onClick={(e) => cancelRename(e)}
                          className="shrink-0 p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2 mb-1.5 w-full">
                        <h3
                          className={`text-lg font-extrabold tracking-tight leading-tight truncate flex-1 min-w-0 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-indigo-300" : "text-slate-800 group-hover:text-indigo-700"}`}
                        >
                          {note.title}
                        </h3>
                        <button
                          onClick={(e) => startEditing(e, note)}
                          className={`opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-md transition-all z-20 ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
                          title="Rename Note"
                        >
                          <PenTool size={16} />
                        </button>
                      </div>
                    )}

                    <p
                      className={`text-sm line-clamp-2 mb-4 font-medium leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {note.summary}
                    </p>

                    <div
                      className="flex flex-wrap items-center pt-4 mt-auto border-t shrink-0 gap-x-3 gap-y-2"
                      style={{
                        borderColor: isDarkMode
                          ? "rgba(42, 47, 61, 0.5)"
                          : "#F1F5F9",
                      }}
                    >
                      {note.audioUrl && (
                        <MiniAudioPlayer isDarkMode={isDarkMode} />
                      )}
                      <div
                        className={`flex items-center gap-1 text-[11px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                      >
                        <Clock size={12} /> {note.duration}
                      </div>
                      {note.items > 0 && (
                        <div
                          className={`flex items-center gap-1 text-[11px] font-bold ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`}
                        >
                          <CheckCircle2 size={12} /> {note.items} tasks
                        </div>
                      )}
                      {safeTags.length > 0 && (
                        <div
                          className={`flex items-center gap-1 text-[11px] font-bold ml-auto ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
                        >
                          <Tag size={12} /> {safeTags.length}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {notesViewMode === "table" && (
        <div className="relative z-10 w-full pt-2">
          {sortedNotes.length === 0 ? (
            <div
              className={`py-24 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed w-full ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]/50" : "border-slate-200 bg-slate-50/50"}`}
            >
              <div
                className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border shadow-sm ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
              >
                <Database size={28} strokeWidth={1.5} />
              </div>
              <h3
                className={`text-lg font-bold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                No Results
              </h3>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <div
              className={`w-full overflow-hidden rounded-[1.5rem] border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
            >
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr
                      className={`text-[10px] font-black uppercase tracking-widest border-b ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D] text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}
                    >
                      <th className="w-12 p-4 text-center">
                        <button
                          onClick={toggleSelectAll}
                          className="focus:outline-none"
                        >
                          {selectedNoteIds.length === sortedNotes.length &&
                          sortedNotes.length > 0 ? (
                            <CheckSquare
                              size={16}
                              className={
                                isDarkMode
                                  ? "text-indigo-400"
                                  : "text-indigo-600"
                              }
                              weight="fill"
                            />
                          ) : (
                            <Square
                              size={16}
                              className={
                                isDarkMode
                                  ? "text-slate-500 hover:text-slate-300"
                                  : "text-slate-300 hover:text-slate-500"
                              }
                            />
                          )}
                        </button>
                      </th>
                      <th className="w-10 p-4"></th>
                      <th className="p-4 pl-0 text-xs font-extrabold">Name</th>
                      <th className="p-4 text-xs font-extrabold">Directory</th>
                      <th className="p-4 text-xs font-extrabold">Date</th>
                      <th className="p-4 text-xs font-extrabold">Stats</th>
                      <th className="p-4 text-xs font-extrabold">Tags</th>
                      <th className="w-16 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedNotes.map((note) => {
                      const safeTags = Array.isArray(note.tags)
                        ? note.tags
                        : [];
                      const isSelected = selectedNoteIds.includes(note.id);
                      const folderName =
                        folders.find((f) => f.id === note.folderId)?.name ||
                        "Unknown";
                      const folderColor =
                        folders.find((f) => f.id === note.folderId)?.color ||
                        "text-indigo-500";

                      return (
                        <tr
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData("noteId", note.id.toString())
                          }
                          className={`group cursor-pointer border-b transition-colors ${isSelected ? (isDarkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100") : isDarkMode ? "border-[#2A2F3D] hover:bg-[#1A2033]" : "border-slate-100 hover:bg-slate-50"} last:border-0`}
                        >
                          <td
                            className="p-4 text-center"
                            onClick={(e) => toggleSelection(e, note.id)}
                          >
                            {isSelected ? (
                              <CheckSquare
                                size={16}
                                className={
                                  isDarkMode
                                    ? "text-indigo-400"
                                    : "text-indigo-600"
                                }
                                weight="fill"
                              />
                            ) : (
                              <Square
                                size={16}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-300 hover:text-slate-500"}`}
                              />
                            )}
                          </td>
                          <td
                            className="p-4 pl-0"
                            onClick={(e) => togglePin(e, note.id)}
                          >
                            <Star
                              size={16}
                              className={`transition-colors ${note.isPinned ? (isDarkMode ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500") : isDarkMode ? "opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-400" : "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500"}`}
                            />
                          </td>
                          <td className="p-4 pl-0">
                            <div className="flex items-center w-full gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isDarkMode ? "bg-[#131722] border-[#2E364F] text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}
                              >
                                <FileText size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                {editingNoteId === note.id ? (
                                  <div
                                    className="flex items-center w-full gap-2 mt-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      autoFocus
                                      value={editTitle}
                                      onChange={(e) =>
                                        setEditTitle(e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === "Enter")
                                          saveRename(e, note.id);
                                      }}
                                      onKeyUp={(e) => e.stopPropagation()}
                                      className={`flex-1 font-bold text-sm px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-900"}`}
                                    />
                                    <button
                                      onClick={(e) => saveRename(e, note.id)}
                                      className="p-1 text-white rounded shrink-0 bg-emerald-500 hover:bg-emerald-600"
                                    >
                                      <CheckCircle2 size={14} />
                                    </button>
                                    <button
                                      onClick={(e) => cancelRename(e)}
                                      className="p-1 text-white rounded shrink-0 bg-rose-500 hover:bg-rose-600"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-2 w-full max-w-[200px] lg:max-w-[300px]">
                                    <div
                                      className={`font-bold text-sm truncate flex-1 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                                    >
                                      {note.title}
                                    </div>
                                    <button
                                      onClick={(e) => startEditing(e, note)}
                                      className={`opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded-md transition-all ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
                                      title="Rename Note"
                                    >
                                      <PenTool size={14} />
                                    </button>
                                  </div>
                                )}
                                {note.audioUrl && (
                                  <div
                                    className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                                  >
                                    <Mic size={10} /> Audio Source
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold border ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D] text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                            >
                              <Folder size={12} className={folderColor} />{" "}
                              <span className="truncate max-w-[100px]">
                                {folderName}
                              </span>
                            </div>
                          </td>
                          <td
                            className={`p-4 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {note.date}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 text-[11px] font-bold">
                              <span
                                className={`flex items-center gap-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                <Clock size={10} /> {note.duration}
                              </span>
                              {note.items > 0 && (
                                <span
                                  className={`flex items-center gap-1.5 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
                                >
                                  <CheckCircle2 size={10} /> {note.items} tasks
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                              {safeTags.slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {safeTags.length > 2 && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                >
                                  +{safeTags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div
                              onClick={(e) => handleDeleteNote(e, note.id)}
                              className={`inline-flex p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? "hover:bg-red-500/20 text-slate-500 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"}`}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {notesViewMode === "timeline" && (
        <div className="relative z-10 w-full py-4 pl-4 space-y-8">
          {Object.keys(groupedNotesByDate).length === 0 && (
            <div
              className={`py-24 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed w-full ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]/50" : "border-slate-200 bg-slate-50/50"}`}
            >
              <div
                className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border shadow-sm ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
              >
                <Calendar size={28} strokeWidth={1.5} />
              </div>
              <h3
                className={`text-lg font-bold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}
              >
                Timeline is quiet
              </h3>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                You haven't recorded any notes yet.
              </p>
            </div>
          )}

          {Object.entries(groupedNotesByDate).map(([date, dateNotes]) => (
            <div key={date} className="relative w-full">
              <div
                className={`absolute left-0 top-2 bottom-0 w-0.5 -translate-x-[0.5px] ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
              ></div>

              <div className="relative flex items-center mb-5">
                <div
                  className={`absolute left-0 w-2.5 h-2.5 rounded-full border-2 -translate-x-[4.5px] ${isDarkMode ? "bg-[#0b0f19] border-indigo-500" : "bg-[#f8fafc] border-indigo-500"}`}
                ></div>
                <h3
                  className={`ml-6 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}
                >
                  {date}
                </h3>
              </div>

              <div className="ml-6 space-y-3">
                {dateNotes.map((note) => {
                  const safeTags = Array.isArray(note.tags) ? note.tags : [];
                  return (
                    <div
                      key={note.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("noteId", note.id.toString())
                      }
                      onClick={() => setSelectedNote(note)}
                      className={`w-full focus:outline-none group flex flex-col md:flex-row md:items-center text-left gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:cursor-grabbing hover:-translate-y-0.5 relative overflow-hidden ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] hover:border-indigo-500/50 hover:shadow-lg" : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"}`}
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity`}
                      ></div>
                      <div
                        className={`w-10 h-10 ml-2 rounded-xl shrink-0 flex items-center justify-center border transition-colors ${isDarkMode ? "bg-[#1A2033] text-indigo-400 border-[#2E364F] group-hover:text-indigo-300" : "bg-slate-50 text-indigo-600 border-slate-200 group-hover:bg-indigo-50"}`}
                      >
                        <FileText size={18} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        {editingNoteId === note.id ? (
                          <div
                            className="flex items-center w-full gap-2 mb-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === "Enter") saveRename(e, note.id);
                              }}
                              onKeyUp={(e) => e.stopPropagation()}
                              className={`flex-1 font-bold text-sm px-2 py-1 rounded outline-none border-2 focus:border-indigo-500 min-w-0 ${isDarkMode ? "bg-[#131722] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-900"}`}
                            />
                            <button
                              onClick={(e) => saveRename(e, note.id)}
                              className="p-1 text-white rounded shrink-0 bg-emerald-500 hover:bg-emerald-600"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              onClick={(e) => cancelRename(e)}
                              className="p-1 text-white rounded shrink-0 bg-rose-500 hover:bg-rose-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full gap-2 mb-1">
                            <div className="flex items-center flex-1 min-w-0 gap-2">
                              {note.isPinned && (
                                <Star
                                  size={12}
                                  className={`shrink-0 ${isDarkMode ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500"}`}
                                />
                              )}
                              <h4
                                className={`font-bold text-sm truncate transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"}`}
                              >
                                {note.title}
                              </h4>
                            </div>
                            <button
                              onClick={(e) => startEditing(e, note)}
                              className={`opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-md transition-all z-20 ${isDarkMode ? "bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"}`}
                              title="Rename Note"
                            >
                              <PenTool size={14} />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-[11px] font-medium">
                          <span
                            className={`flex items-center gap-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                          >
                            <Clock size={12} /> {note.duration}
                          </span>
                          {note.items > 0 && (
                            <span
                              className={`flex items-center gap-1 ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`}
                            >
                              <CheckCircle2 size={12} /> {note.items}
                            </span>
                          )}
                          {note.audioUrl && (
                            <MiniAudioPlayer isDarkMode={isDarkMode} />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 shrink-0 md:mt-0">
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {safeTags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div
                          className="flex items-center justify-center w-8 h-8 pl-2 border-l shrink-0"
                          style={{
                            borderColor: isDarkMode ? "#2E364F" : "#E2E8F0",
                          }}
                        >
                          <div
                            onClick={(e) => handleDeleteNote(e, note.id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg ${isDarkMode ? "hover:bg-red-500/20 text-slate-500 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"}`}
                            title="Delete Note"
                          >
                            <Trash2 size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌟 FLOATING BULK COMMAND BAR */}
      <AnimatePresence>
        {selectedNoteIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-50 -translate-x-1/2 pointer-events-auto bottom-8 left-1/2"
          >
            <div
              className={`flex items-center gap-1.5 p-1.5 rounded-[1.25rem] shadow-[0_15px_40px_rgba(0,0,0,0.2)] border backdrop-blur-2xl ${isDarkMode ? "bg-[#131722]/90 border-[#2A2F3D]" : "bg-white/90 border-slate-200 shadow-slate-200/50"}`}
            >
              <div className="flex items-center gap-2 px-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full font-black text-[10px] ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {selectedNoteIds.length}
                </div>
                <span
                  className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  Selected
                </span>
              </div>
              <div
                className={`w-px h-6 mx-1 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
              ></div>

              <div className="relative">
                <button
                  onClick={() => setShowBulkFolderMenu(!showBulkFolderMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <FolderOpen size={14} /> Move <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {showBulkFolderMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-[calc(100%+12px)] left-0 w-48 rounded-xl border shadow-xl overflow-hidden p-1.5 z-50 ${isDarkMode ? "bg-[#161B2A] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      {localFolders.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => handleBulkMove(f.id)}
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          <Folder size={14} className={f.color} />{" "}
                          <span className="truncate">{f.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleBulkExport}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-slate-300 hover:bg-[#1A2033]" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <Download size={14} /> Export
              </button>
              <button
                onClick={handleBulkDelete}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
              >
                <Trash2 size={14} /> Delete
              </button>
              <div
                className={`w-px h-6 mx-1 ${isDarkMode ? "bg-[#2A2F3D]" : "bg-slate-200"}`}
              ></div>
              <button
                onClick={() => setSelectedNoteIds([])}
                className={`p-2 rounded-xl transition-all ${isDarkMode ? "text-slate-500 hover:bg-[#1A2033] hover:text-slate-300" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
