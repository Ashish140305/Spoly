import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Mic, Square, UploadCloud, FileText, ListChecks, 
  Workflow, Clock, LayoutDashboard, Settings, 
  FolderSearch, PlusCircle, CheckCircle2, Zap, Puzzle, 
  X, Video, FileAudio, Calendar, Search, Code, Download, Copy,
  CheckCircle, Circle, ToggleLeft, ToggleRight, ArrowRight, ChevronRight,
  Wand2, PlayCircle, PauseCircle, Send, AlignLeft, Briefcase, Sparkles,
  Database, GitMerge, Activity, Trash2, Layers, Menu, ChevronLeft, List,
  Tag, CalendarDays, Bot, ImageIcon, ImagePlus, Share2
} from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';

const WorkspaceMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 45, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-200/30 blur-[100px] will-change-transform transform-gpu" />
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-200/20 blur-[120px] will-change-transform transform-gpu" />
  </div>
);

const AudioWaveform = ({ isRecording, color = "bg-blue-500" }) => (
  <div className="flex items-center gap-1.5 h-8">
    {[...Array(5)].map((_, i) => (
      <motion.div key={`wave-${i}`} animate={isRecording ? { height: ["20%", "100%", "30%", "80%", "20%"] } : { height: "15%" }} transition={isRecording ? { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }} className={`w-1.5 ${color} rounded-full`} />
    ))}
  </div>
);

const EditableSection = ({ icon: Icon, title, value, onChange }) => {
  const textareaRef = useRef(null);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [value]);
  return (
    <div className="group relative border border-transparent hover:border-blue-100 hover:bg-blue-50/30 rounded-2xl p-4 -mx-4 transition-colors">
      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold"><Icon size={18} className="text-indigo-500" /><h4 className="text-md">{title}</h4></div>
      <textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-slate-700 leading-relaxed font-medium focus:outline-none focus:ring-0 resize-none overflow-hidden" spellCheck="false" />
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-100 px-2 py-1 rounded-md">Editable</span></div>
    </div>
  );
};

export default function LiveNotes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('workspace'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null); 

  const [status, setStatus] = useState('idle'); 
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [activeAiTemplate, setActiveAiTemplate] = useState(null);
  const [processingType, setProcessingType] = useState('audio'); 
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const typingRef = useRef(null);
  const uploadRef = useRef(null);
  const processingRef = useRef(null);
  const timerRef = useRef(0); 
  const stopTriggeredRef = useRef(false); 
  
  const [showCode, setShowCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [settingsToggles, setSettingsToggles] = useState({ notion: false, linear: true, dark: false });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false); 
  const [templateFilter, setTemplateFilter] = useState('All');
  
  const fullTranscript = "Alright, let's map out the new checkout flow. The user starts on the frontend client. They hit the API Gateway. The Gateway routes to the Auth Service to validate the session. If valid, the Auth Service checks the Postgres Database, and also caches the active session into Redis. Finally, we return the secure token back to the client.";
  
  const [meetingNotes, setMeetingNotes] = useState({
    summary: "The team mapped out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, Auth Service, Postgres, and Redis caching layers.",
    takeaways: "• Frontend interactions are secured via API Gateway.\n• Auth Service acts as the central validation hub.\n• Session states will be cached in Redis for high-speed retrieval.\n• PostgreSQL remains the persistent source of truth for user data.",
    decisions: "1. Use Redis over Memcached for session caching.\n2. Secure tokens will be passed back directly to the client after DB verification."
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [editableMermaid, setEditableMermaid] = useState("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;");
  const [actionItems, setActionItems] = useState([
    { id: 1, text: "Configure API Gateway routing rules", done: false },
    { id: 2, text: "Setup Redis session caching logic", done: false },
    { id: 3, text: "Implement token return to frontend", done: false }
  ]);

  const [savedNotes, setSavedNotes] = useState([
    { id: 1, title: "Sprint Planning: Q3 Authentication", date: "Feb 12, 2026", duration: "45:20", items: 4, tags: ["Engineering", "Planning"] },
    { id: 2, title: "Database Migration Sync", date: "Feb 10, 2026", duration: "32:15", items: 2, tags: ["Backend", "DevOps"] },
    { id: 3, title: "Client Onboarding: GlobalTech", date: "Feb 05, 2026", duration: "55:00", items: 7, tags: ["Product", "External"] },
  ]);

  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { id: 101, title: "Q3 Roadmap Planning", time: "10:00 AM", platform: "Zoom", botDeployed: false },
    { id: 102, title: "System Architecture Sync", time: "01:30 PM", platform: "Google Meet", botDeployed: false },
    { id: 103, title: "Client Update: Acme Corp", time: "04:00 PM", platform: "Microsoft Teams", botDeployed: false },
  ]);

  const templatesDB = [
    { id: 1, name: "Microservices", category: "Architecture", desc: "Map out highly decoupled services, gateways, and data stores.", icon: <Workflow size={24}/>, theme: "blue" },
    { id: 2, name: "User Journey", category: "Flowcharts", desc: "Visualize step-by-step user interactions and decisions.", icon: <Layers size={24}/>, theme: "purple" },
    { id: 3, name: "Database ERD", category: "Database", desc: "Auto-generate Entity-Relationship diagrams from context.", icon: <Database size={24}/>, theme: "emerald" },
    { id: 4, name: "Gantt Chart", category: "Planning", desc: "Structure project timelines, sprints, and dependencies.", icon: <Clock size={24}/>, theme: "amber" },
    { id: 5, name: "Git Workflow", category: "Architecture", desc: "Visualize branch strategies, merges, and CI/CD pipelines.", icon: <GitMerge size={24}/>, theme: "rose" },
    { id: 6, name: "State Machine", category: "Flowcharts", desc: "Map complex system states and triggers seamlessly.", icon: <Activity size={24}/>, theme: "cyan" },
  ];

  const themeClasses = {
    blue: { iconBg: "bg-blue-50 text-blue-600 border-blue-100", hover: "hover:border-blue-400", glow: "from-blue-100/50", text: "text-blue-600" },
    purple: { iconBg: "bg-purple-50 text-purple-600 border-purple-100", hover: "hover:border-purple-400", glow: "from-purple-100/50", text: "text-purple-600" },
    emerald: { iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", hover: "hover:border-emerald-400", glow: "from-emerald-100/50", text: "text-emerald-600" },
    amber: { iconBg: "bg-amber-50 text-amber-600 border-amber-100", hover: "hover:border-amber-400", glow: "from-amber-100/50", text: "text-amber-600" },
    rose: { iconBg: "bg-rose-50 text-rose-600 border-rose-100", hover: "hover:border-rose-400", glow: "from-rose-100/50", text: "text-rose-600" },
    cyan: { iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100", hover: "hover:border-cyan-400", glow: "from-cyan-100/50", text: "text-cyan-600" },
  };

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  // --- THE MAGIC EXTENSION LISTENER ---
  useEffect(() => {
    const handleExtensionMessage = (event) => {
      if (event.data.type === 'SPOLY_RECORDING_STARTED') {
        setIsExtensionActive(true);
        startSimulation();
      } else if (event.data.type === 'SPOLY_RECORDING_STOPPED') {
        handleStopRecording();
      }
    };
    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, []);

  useEffect(() => {
    let interval;
    if (status === 'recording') { interval = setInterval(() => { setTimer((prev) => { timerRef.current = prev + 1; return prev + 1; }); }, 1000); } 
    else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; };

  const finishProcessing = () => {
    setStatus('complete');
    showToast(processingType === 'image' ? "Whiteboard Converted Successfully!" : "Smart Notes Generated Successfully!");
    let noteTitle = fileName ? `Processed File: ${fileName}` : `Live Meeting ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    if (activeAiTemplate) noteTitle = `[${activeAiTemplate.name}] ${noteTitle}`;
    const newNote = { id: Date.now(), title: noteTitle, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), duration: formatTime(timerRef.current), items: actionItems.length, tags: [processingType === 'image' ? "Visual AI" : "AI Generated", "Recent"] };
    setSavedNotes(prev => [newNote, ...prev]);
  };

  const startSimulation = () => {
    stopTriggeredRef.current = false; setProcessingType('audio');
    setStatus('recording'); setTranscript(""); setTimer(0); timerRef.current = 0; setShowCode(false);
    let i = 0; if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      i += Math.floor(Math.random() * 5) + 2; setTranscript(fullTranscript.slice(0, i));
      if (i >= fullTranscript.length) clearInterval(typingRef.current);
    }, 100);
  };

  const handleStartRecording = () => startSimulation();
  
  const handleStopRecording = () => {
    if (stopTriggeredRef.current) return; stopTriggeredRef.current = true;
    if (typingRef.current) clearInterval(typingRef.current);
    setStatus('processing'); setIsExtensionActive(false); 
    if (processingRef.current) clearTimeout(processingRef.current);
    processingRef.current = setTimeout(() => { finishProcessing(); }, 2500);
  };

  // --- SAFE LAUNCH TRIGGER ---
  const handleLaunchExtension = () => {
    // Force broadcast the message directly to the window
    window.postMessage({ type: 'SPOLY_LAUNCH_WIDGET' }, '*');
    showToast("Launching Spoly Extension...");
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]); };
  const handleFileInput = (e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); };

  const processFile = (file) => {
    const isImage = file.type.startsWith('image/'); setProcessingType(isImage ? 'image' : 'audio'); setFileName(file.name); setStatus('uploading'); setUploadProgress(0); stopTriggeredRef.current = false;
    let progress = 0; if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100; clearInterval(uploadRef.current); setStatus('processing');
        if (isImage) {
           if (processingRef.current) clearTimeout(processingRef.current);
           processingRef.current = setTimeout(() => { finishProcessing(); }, 3000); 
        } else {
           let i = 0; if (typingRef.current) clearInterval(typingRef.current);
           typingRef.current = setInterval(() => {
             i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
             if (i >= fullTranscript.length) { clearInterval(typingRef.current); if (processingRef.current) clearTimeout(processingRef.current); processingRef.current = setTimeout(() => { finishProcessing(); }, 1500); }
           }, 40);
        }
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const toggleBot = (id) => { setUpcomingMeetings(prev => prev.map(m => { if (m.id === id) { if (!m.botDeployed) showToast(`Spoly Bot scheduled for ${m.title}`); return { ...m, botDeployed: !m.botDeployed }; } return m; })); };

  const handleReset = () => {
    if (typingRef.current) clearInterval(typingRef.current); if (uploadRef.current) clearInterval(uploadRef.current); if (processingRef.current) clearTimeout(processingRef.current);
    stopTriggeredRef.current = false; setStatus('idle'); setTranscript(""); setTimer(0); timerRef.current = 0; setFileName(""); setUploadProgress(0); setIsExtensionActive(false); if (fileInputRef.current) fileInputRef.current.value = ""; setActiveTab('workspace'); setActionItems(actionItems.map(item => ({...item, done: false}))); 
  };

  const toggleActionItem = (id) => { setActionItems(actionItems.map(item => item.id === id ? { ...item, done: !item.done } : item)); };

  const handleAiRefine = (e, formatPreset = null) => {
    if (e) e.preventDefault(); const prompt = formatPreset || aiPrompt; if (!prompt) return;
    setIsAiThinking(true); setTimeout(() => { setMeetingNotes(prev => ({ ...prev, summary: `[Refined: ${prompt}] \n\n` + prev.summary })); setAiPrompt(""); setIsAiThinking(false); showToast(`Notes successfully reformatted!`); }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      <WorkspaceMeshBackground />

      <AnimatePresence>
        {toast && (
          <motion.div key="toast-notification" initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-6 left-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border border-slate-700">
            <Sparkles size={18} className="text-amber-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNote && (
          <motion.div key="note-viewer-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedNote(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3"><FileText className="text-blue-600"/><h2 className="text-xl font-bold text-slate-800">{selectedNote.title}</h2></div>
                <button onClick={() => setSelectedNote(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto min-h-[300px]">
                <div className="flex items-center justify-between mb-6">
                   <p className="text-slate-500 font-medium">Recorded on {selectedNote.date}</p>
                   <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                     <button onClick={() => setIsPlayingAudio(!isPlayingAudio)} className="text-blue-600 hover:text-blue-800 transition-colors">
                       {isPlayingAudio ? <PauseCircle size={24}/> : <PlayCircle size={24}/>}
                     </button>
                     <div className="w-32 h-1.5 bg-slate-300 rounded-full overflow-hidden">
                       <motion.div className="h-full bg-blue-500" animate={{ width: isPlayingAudio ? "100%" : "30%" }} transition={{ duration: isPlayingAudio ? 45 : 0.5, ease: "linear" }} />
                     </div>
                     <span className="text-xs font-bold text-slate-500 w-10 text-right">{selectedNote.duration}</span>
                   </div>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-blue-600 font-bold shadow-inner">
                  <Workflow size={32} className="mb-3 text-blue-400"/> 
                  <span>Mermaid Diagram rendering is stored securely in your dashboard.</span>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => { setSelectedNote(null); showToast("Note archived"); }} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Archive</button>
                <button onClick={() => { setSelectedNote(null); showToast("Exporting to PDF..."); }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">Export PDF</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside animate={{ width: isSidebarOpen ? 288 : 88 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="hidden md:flex flex-col bg-white/60 backdrop-blur-2xl border-r border-white/80 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-20 relative overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0"><Mic className="text-white" size={20} /></div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && <motion.span key="sidebar-logo" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-2xl font-extrabold tracking-tight whitespace-nowrap">Spoly</motion.span>}
            </AnimatePresence>
          </div>
          {isSidebarOpen && <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><ChevronLeft size={24}/></button>}
        </div>

        {!isSidebarOpen && (
           <div className="pt-4 flex justify-center"><button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-blue-600 p-2"><Menu size={24}/></button></div>
        )}

        <div className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
          <button onClick={handleReset} className={`w-full flex items-center justify-center gap-3 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all mb-4 ${isSidebarOpen ? 'px-4' : 'px-0'}`} title="New Recording">
            <PlusCircle size={20} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">New Recording</span>}
          </button>
          
          {isSidebarOpen && <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Menu</p>}
          <nav className="space-y-2">
            {[
              { id: 'workspace', icon: LayoutDashboard, label: 'Workspace' },
              { id: 'notes', icon: FolderSearch, label: 'Saved Notes' },
              { id: 'templates', icon: Layers, label: 'Templates' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} title={!isSidebarOpen ? item.label : ""} className={`w-full flex items-center gap-3 py-2.5 font-semibold rounded-lg transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center px-0'} ${activeTab === item.id ? 'bg-blue-50/50 text-blue-700 border border-blue-100 shadow-sm' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}>
                <item.icon size={20} className="shrink-0" />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-6 border-t border-slate-200/50 flex items-center bg-white/40 ${isSidebarOpen ? 'gap-4' : 'justify-center'}`}>
          <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm shrink-0" } }} />
          {isSidebarOpen && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-bold truncate">{user?.firstName || "Engineer"}</span>
              <span className="text-xs text-slate-500">Pro Plan</span>
            </div>
          )}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto overflow-x-hidden min-w-0">
        
        <header className="px-8 py-6 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/40 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">{activeTab === 'workspace' ? 'Active Workspace' : activeTab}</h1>
            <p className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeTab === 'workspace' && (
            <div className="flex gap-3">
              {status === 'complete' && (
                 <button onClick={() => showToast("Share link copied!")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 font-bold shadow-sm hover:bg-slate-50 transition-colors">
                   <Share2 size={16}/> Share
                 </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold shadow-sm">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Ready
              </div>
            </div>
          )}
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">

          <AnimatePresence>
            {activeTab === 'workspace' && activeAiTemplate && status === 'idle' && (
              <motion.div key="active-template" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-indigo-700">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-indigo-100">{activeAiTemplate.icon}</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Active AI Template</p>
                    <p className="font-extrabold text-lg">{activeAiTemplate.name}</p>
                  </div>
                </div>
                <button onClick={() => { setActiveAiTemplate(null); showToast("Template cleared"); }} className="p-2 text-indigo-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"><Trash2 size={20}/></button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            
            {activeTab === 'workspace' && (
              <motion.div key="workspace-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                
                <AnimatePresence mode="wait">
                  {status !== 'complete' && (
                    <motion.div key="recording-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-[2rem] p-8 space-y-8 relative overflow-hidden">
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {status === 'recording' && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>}
                          {(status === 'processing' || status === 'uploading') && <Zap className="text-amber-500 animate-bounce" size={20} />}
                          <h2 className="text-xl font-bold text-slate-800">
                            {status === 'idle' && "Choose a capture method"}
                            {status === 'uploading' && "Uploading securely..."}
                            {status === 'recording' && (isExtensionActive ? "Monitoring Extension Audio..." : "Listening...")}
                            {status === 'processing' && (processingType === 'image' ? "Vision AI analyzing whiteboard..." : "AI is generating structure...")}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xl font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-xl shadow-inner border border-slate-200">
                          <Clock size={18} className="text-slate-400" /> {formatTime(timer)}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {status === 'idle' && (
                          <motion.div key="idle-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-6 pt-4 pb-4">
                            
                            {/* LAUNCH EXTENSION BUTTON */}
                            <button onClick={handleLaunchExtension} className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-500 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-sm hover:shadow-xl">
                              <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">Float OS Widget</div>
                              <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0"><Puzzle size={36} /></div>
                              <h3 className="text-xl font-bold text-indigo-900 mt-2">Launch Extension</h3>
                              <p className="text-indigo-700/70 font-medium text-center text-sm">Pop out an OS-level window over any Google Meet.</p>
                            </button>

                            <button onClick={handleStartRecording} className="group relative bg-white border-2 border-slate-200 hover:border-blue-500 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-sm hover:shadow-xl">
                              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Mic size={36} /></div>
                              <h3 className="text-xl font-bold text-slate-800 mt-2">Record Audio</h3>
                              <p className="text-slate-500 font-medium text-center text-sm">Use your device microphone to capture an in-person meeting.</p>
                            </button>

                            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`group relative bg-white border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-500 shadow-sm hover:bg-slate-50'}`}>
                              <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="audio/*,video/*,image/*" className="hidden" />
                              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}><ImagePlus size={36} className={isDragging ? 'animate-bounce' : ''} /></div>
                              <h3 className="text-xl font-bold text-slate-700 mt-2">{isDragging ? 'Drop File Here' : 'Upload File / Image'}</h3>
                              <p className="text-slate-500 font-medium text-center text-sm">Drop audio, video, or a <strong className="text-blue-600">Whiteboard Photo</strong>.</p>
                            </div>
                          </motion.div>
                        )}

                        {status === 'uploading' && (
                          <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-6 w-full max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner mb-2">
                               {processingType === 'image' ? <ImageIcon size={28}/> : <FileAudio size={28} />}
                            </div>
                            <div className="text-center w-full">
                              <p className="text-slate-800 font-bold text-lg mb-1 truncate px-4">{fileName}</p>
                              <p className="text-slate-500 font-medium text-sm mb-4">Uploading to Spoly Servers...</p>
                              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear" }} />
                              </div>
                              <p className="text-right text-xs font-bold text-blue-600 mt-2">{Math.floor(uploadProgress)}%</p>
                            </div>
                          </motion.div>
                        )}

                        {(status === 'recording' || status === 'processing') && !isExtensionActive && (
                          <motion.div key="recording" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-8">
                            {status === 'recording' && <AudioWaveform isRecording={true} />}
                            {status === 'recording' && (
                              <button onClick={handleStopRecording} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(239,68,68,0.4)] flex items-center gap-2 transition-transform hover:scale-105">
                                <Square size={20} fill="currentColor" /> Stop Capture
                              </button>
                            )}
                            {status === 'processing' && (
                              <div className="text-indigo-600 font-bold flex items-center gap-3 bg-indigo-50 px-6 py-4 rounded-full border border-indigo-100 shadow-sm">
                                <Zap size={20} className="animate-spin" /> 
                                {processingType === 'image' ? "Vision AI extracting Mermaid syntax from whiteboard..." : "Structuring Context & Rendering Code..."}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* EXTENSION ACTIVE UI */}
                        {status === 'recording' && isExtensionActive && (
                          <motion.div key="extension-live" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-8">
                            <AudioWaveform isRecording={true} color="bg-indigo-500" />
                            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-6 py-3 rounded-full font-bold shadow-sm flex items-center gap-3">
                              <Puzzle size={20} /> Connected to Spoly Extension
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {(status === 'recording' || status === 'processing') && processingType !== 'image' && (
                        <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-200 pt-8 mt-8">
                          <div className="flex items-center justify-between mb-3 px-2">
                              <div className="flex items-center gap-2"><FileText size={18} className="text-slate-400" /><span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Live Transcript</span></div>
                              {isExtensionActive && <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 shadow-sm">Receiving from Chrome Extension</span>}
                          </div>
                          <div className="w-full h-32 bg-slate-50 border border-slate-200 shadow-inner rounded-2xl p-6 overflow-y-auto relative">
                              <p className="font-mono text-slate-700 leading-relaxed text-sm">
                                {transcript}
                                {status === 'recording' && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle"></span>}
                              </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {status === 'complete' && (
                    <motion.div key="success-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl shadow-inner"><CheckCircle2 size={32} /></div>
                        <div><h2 className="text-2xl font-bold tracking-tight">Documentation Generated</h2><p className="text-emerald-50 font-medium">Your smart notes and diagrams are ready below.</p></div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 font-mono text-sm font-black text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200"><Clock size={16}/> {formatTime(timerRef.current)}</div>
                        <button onClick={handleReset} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 rounded-xl font-bold transition-all shadow-md w-full md:w-auto"><PlusCircle size={18}/> New Session</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {status === 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-10 mt-12">
                     <div>
                       <div className="flex items-center justify-between mb-6 px-2">
                         <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><CalendarDays size={22} className="text-indigo-500"/> Today's Meetings</h3>
                       </div>
                       <div className="space-y-4">
                         {upcomingMeetings.map(meeting => (
                           <div key={meeting.id} className="bg-white/80 backdrop-blur-xl border border-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{meeting.time}</span>
                                  <span className="text-xs font-bold text-slate-400">{meeting.platform}</span>
                                </div>
                                <h4 className="font-bold text-slate-800">{meeting.title}</h4>
                              </div>
                              <button onClick={() => toggleBot(meeting.id)} className={`px-4 py-2 flex items-center gap-2 rounded-xl font-bold text-sm transition-colors border ${meeting.botDeployed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                                 <Bot size={16} className={meeting.botDeployed ? "text-emerald-500" : ""} /> {meeting.botDeployed ? 'Bot Scheduled' : 'Deploy Bot'}
                              </button>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <div className="flex items-center justify-between mb-6 px-2">
                         <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><FolderSearch size={22} className="text-blue-500"/> Recent Notes</h3>
                         <button onClick={() => setActiveTab('notes')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
                       </div>
                       <div className="grid gap-4">
                         {savedNotes.slice(0, 2).map(note => (
                           <div key={note.id} onClick={() => setSelectedNote(note)} className="bg-white/80 backdrop-blur-xl border border-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 cursor-pointer flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner shrink-0"><FileText size={20}/></div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-800 mb-1 truncate">{note.title}</h4>
                                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                   <span className="flex items-center gap-1"><Calendar size={12}/> {note.date}</span>
                                   <span className="flex items-center gap-1"><CheckCircle2 size={12}/> {note.items} Action Items</span>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-300"/>
                           </div>
                         ))}
                       </div>
                     </div>
                  </motion.div>
                )}

                {status === 'complete' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-2 gap-8">
                    
                    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
                         <div className="flex items-center gap-3 text-indigo-700"><div className="p-2 bg-indigo-100 rounded-lg"><FileText size={20} /></div><h3 className="font-bold text-xl">Smart Document</h3></div>
                         <button onClick={() => { navigator.clipboard.writeText(`${meetingNotes.summary}\n\n${meetingNotes.takeaways}\n\n${meetingNotes.decisions}`); showToast("Notes copied to clipboard!"); }} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 font-bold text-xs transition-colors"><Copy size={14}/> Copy All</button>
                      </div>

                      <div className="p-8 flex-1 overflow-y-auto space-y-6">
                         <EditableSection icon={AlignLeft} title="Executive Summary" value={meetingNotes.summary} onChange={(val) => setMeetingNotes({...meetingNotes, summary: val})} />
                         <EditableSection icon={List} title="Key Takeaways" value={meetingNotes.takeaways} onChange={(val) => setMeetingNotes({...meetingNotes, takeaways: val})} />
                         <EditableSection icon={Briefcase} title="Technical Decisions" value={meetingNotes.decisions} onChange={(val) => setMeetingNotes({...meetingNotes, decisions: val})} />

                         <div className="pt-4 border-t border-slate-100">
                           <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 text-emerald-600 font-bold"><ListChecks size={18} /> <h4>Action Items</h4></div><span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{actionItems.filter(i=>i.done).length} / {actionItems.length}</span></div>
                           <ul className="space-y-2">
                             {actionItems.map((item) => (
                               <li key={item.id} onClick={() => toggleActionItem(item.id)} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${item.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-300 hover:shadow-sm'}`}>
                                 <div className="mt-0.5">{item.done ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 group-hover:text-emerald-400" />}</div>
                                 <span className={`font-medium text-sm transition-all ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                      </div>

                      <div className="p-6 bg-slate-50 border-t border-slate-100">
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
                          <button onClick={(e) => handleAiRefine(e, "Format as bullet points")} className="shrink-0 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">Format as Bullets</button>
                          <button onClick={(e) => handleAiRefine(e, "Make it shorter")} className="shrink-0 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">Make it Shorter</button>
                          <button onClick={(e) => handleAiRefine(e, "Extract Jira tickets")} className="shrink-0 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">Extract Tickets</button>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-[2px] shadow-sm">
                          <form onSubmit={(e) => handleAiRefine(e, null)} className="bg-white rounded-[14px] p-1.5 flex items-center gap-2 pl-4">
                             <Wand2 size={18} className="text-indigo-500 shrink-0"/>
                             <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Tell AI to refine these notes..." className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 text-sm font-medium" disabled={isAiThinking} />
                             <button type="submit" disabled={isAiThinking || !aiPrompt} className={`p-2 rounded-xl transition-all ${aiPrompt ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                               {isAiThinking ? <Zap size={16} className="animate-pulse text-amber-400" /> : <Send size={16} />}
                             </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white shadow-lg rounded-[2rem] p-8 hover:shadow-xl transition-shadow flex flex-col h-full min-h-[600px]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-blue-700">
                          <div className="p-2 bg-blue-100 rounded-lg"><Workflow size={20} /></div>
                          <h3 className="font-bold text-xl">System Architecture</h3>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-colors border font-bold text-sm flex items-center gap-2 ${showCode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent'}`} title="Toggle Editor">
                             {showCode ? <Workflow size={16}/> : <Code size={16}/>}
                             <span className="hidden sm:inline">{showCode ? 'View Graph' : 'Edit Code'}</span>
                          </button>
                          <button onClick={() => showToast("SVG Exported to Downloads!")} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-sm transition-colors border border-blue-100"><Download size={16} /> <span className="hidden sm:inline">Export</span></button>
                        </div>
                      </div>
                      
                      <div className={`flex-1 w-full border shadow-inner rounded-2xl flex items-center justify-center overflow-hidden relative group transition-colors ${showCode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="absolute top-4 left-4 flex gap-2 z-20"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                        {showCode ? (
                           <div className="w-full h-full pt-12 p-4 flex flex-col relative z-10">
                             <button onClick={() => { navigator.clipboard.writeText(editableMermaid); showToast("Code copied to clipboard!"); }} className="absolute top-3 right-3 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"><Copy size={16}/></button>
                             <textarea value={editableMermaid} onChange={(e) => setEditableMermaid(e.target.value)} className="w-full h-full bg-transparent text-blue-300 font-mono text-sm resize-none focus:outline-none leading-relaxed" spellCheck="false" />
                           </div>
                        ) : (
                           <div className="w-full h-full overflow-auto flex justify-center items-center p-8 bg-white relative z-10">
                             <MermaidDiagram chart={editableMermaid} />
                           </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* --- SAVED NOTES TAB --- */}
            {activeTab === 'notes' && (
              <motion.div key="notes-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                   <h2 className="text-3xl font-extrabold text-slate-900">Your Library</h2>
                   <div className="relative w-full md:w-auto">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                     <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72" />
                   </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {savedNotes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(note => (
                     <div key={note.id} onClick={() => setSelectedNote(note)} className="group relative bg-white/80 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 rounded-[2rem] p-1 cursor-pointer overflow-hidden flex flex-col h-full min-h-[220px]">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
                        <div className="relative z-10 p-6 flex flex-col h-full bg-white/50 rounded-[1.8rem] border border-white/50">
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><FileText size={20}/></div>
                              <span className="text-xs font-bold text-slate-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1"><Calendar size={12}/> {note.date}</span>
                           </div>
                           <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors flex-1">{note.title}</h3>
                           
                           <div className="flex gap-2 mb-6 flex-wrap">
                             {note.tags?.map((tag, i) => <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1"><Tag size={10}/> {tag}</span>)}
                           </div>

                           <div className="flex items-center justify-between text-sm font-medium text-slate-500 mt-auto border-t border-slate-200/60 pt-4">
                              <div className="flex gap-4">
                                 <span className="flex items-center gap-1"><Clock size={14}/> {note.duration}</span>
                                 <span className="flex items-center gap-1"><CheckCircle2 size={14}/> {note.items} Action Items</span>
                              </div>
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                           </div>
                        </div>
                     </div>
                   ))}
                   {savedNotes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                     <div className="col-span-full py-12 text-center text-slate-500 font-medium">No notes found matching "{searchQuery}"</div>
                   )}
                 </div>
              </motion.div>
            )}

            {/* --- TEMPLATES TAB --- */}
            {activeTab === 'templates' && (
              <motion.div key="templates-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="mb-8">
                   <h2 className="text-3xl font-extrabold text-slate-900 mb-2">AI Output Templates</h2>
                   <p className="text-slate-500 font-medium text-lg">Select a template before recording to format the specific architecture style.</p>
                 </div>
                 
                 <div className="flex gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                    {['All', 'Architecture', 'Flowcharts', 'Database', 'Planning'].map(cat => (
                      <button key={cat} onClick={() => setTemplateFilter(cat)} className={`px-5 py-2 rounded-full font-bold transition-all ${templateFilter === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{cat}</button>
                    ))}
                 </div>

                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   <AnimatePresence mode="popLayout">
                     {templatesDB.filter(t => templateFilter === 'All' || t.category === templateFilter).map((temp) => (
                       <motion.div 
                         key={temp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                         onClick={() => { setActiveAiTemplate(temp); setActiveTab('workspace'); showToast(`Template Set: ${temp.name}`); }} 
                         className={`relative bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] p-6 cursor-pointer group flex flex-col h-full min-h-[200px] overflow-hidden ${themeClasses[temp.theme].hover}`}
                       >
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${themeClasses[temp.theme].glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-5">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${themeClasses[temp.theme].iconBg}`}>{temp.icon}</div>
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">{temp.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">{temp.name}</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 flex-1">{temp.desc}</p>
                            <div className={`flex items-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 transform duration-300 ${themeClasses[temp.theme].text}`}>
                               Use Template <ArrowRight size={16} className="ml-2" />
                            </div>
                          </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
              </motion.div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
              <motion.div key="settings-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl">
                 <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Preferences</h2>
                 <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-[2.5rem] p-8 md:p-10 space-y-8">
                   
                   <div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Integrations</h3>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 transition-colors hover:bg-slate-100">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800 font-black border border-slate-100">N</div>
                         <div><p className="font-bold text-slate-800">Notion Sync</p><p className="text-sm text-slate-500">Automatically push notes to your Notion workspace.</p></div>
                       </div>
                       <button onClick={() => { setSettingsToggles(t => ({...t, notion: !t.notion})); showToast(settingsToggles.notion ? "Notion Sync Disabled" : "Notion Sync Enabled"); }}>
                         {settingsToggles.notion ? <ToggleRight size={36} className="text-blue-600 drop-shadow-sm" /> : <ToggleLeft size={36} className="text-slate-300" />}
                       </button>
                     </div>
                   </div>

                   <div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Display</h3>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800 border border-slate-100"><Settings size={20}/></div>
                         <div><p className="font-bold text-slate-800">Dark Mode</p><p className="text-sm text-slate-500">Workspace is currently optimized for light mode focus.</p></div>
                       </div>
                       <button onClick={() => showToast("Dark mode is locked to the landing page showcase.")}>
                         <ToggleLeft size={36} className="text-slate-300 opacity-50 cursor-not-allowed" />
                       </button>
                     </div>
                   </div>

                   <div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Account</h3>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                       <div className="flex items-center gap-4">
                         <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm" } }} />
                         <div><p className="font-bold text-slate-800">{user?.primaryEmailAddress?.emailAddress || "Developer Account"}</p><p className="text-sm text-blue-600 font-bold">Pro Plan Active</p></div>
                       </div>
                       <button onClick={() => showToast("Opening Clerk Account Portal...")} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors">Manage</button>
                     </div>
                   </div>

                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}




















