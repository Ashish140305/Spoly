import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { 
  Mic, Square, UploadCloud, FileText, ListChecks, Workflow, PlusCircle, CheckCircle2, Zap, 
  Puzzle, X, FileAudio, Code, Copy, CheckCircle, Circle, ArrowRight, PlayCircle, PauseCircle, 
  AlignLeft, Sparkles, Database, Trash2, Layers, ChevronLeft, List, ImageIcon, ImagePlus, 
  Languages, FileUp, RefreshCw, Headphones, Youtube, Play, Activity, Video, FolderSearch, Maximize2 
} from "lucide-react";

// Utils & Constants
import { ScrollbarStyles, WorkspaceMeshBackground, AudioWaveform, getTheme } from "../utils/uiHelpers";
import { templatesDB, initialFolders, templateCategories } from "../utils/constants";

// Modular Tabs & Components
import Sidebar from "../components/Sidebar";
import LibraryTab from "../components/LibraryTab";
import NoteDetailView from "../components/NoteDetailView";
import TemplatesTab from "../components/TemplatesTab";
import SettingsView from "../components/SettingsView";

// 🚀 Feature: Dynamic Theme Extractor Simulator
const generateThemeFromFile = (file) => {
  if (!file) return null;
  // Beautiful preset palettes to match different document types
  const palettes = [
    { d1: 'bg-rose-900/20', d2: 'bg-orange-900/20', l1: 'bg-rose-300/30', l2: 'bg-orange-300/30' }, // Warm PDF
    { d1: 'bg-emerald-900/20', d2: 'bg-teal-900/20', l1: 'bg-emerald-300/30', l2: 'bg-teal-300/30' }, // Data Sheet
    { d1: 'bg-purple-900/20', d2: 'bg-pink-900/20', l1: 'bg-purple-300/30', l2: 'bg-pink-300/30' }, // Creative Doc
    { d1: 'bg-amber-900/20', d2: 'bg-red-900/20', l1: 'bg-amber-300/30', l2: 'bg-red-300/30' }, // Urgent Doc
  ];
  // Deterministic hash based on file name so the same file always gets the same color theme
  const hash = file.name.charCodeAt(0) + file.name.charCodeAt(file.name.length - 1) + file.size;
  return palettes[hash % palettes.length];
};

export default function LiveNotes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("workspace");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  // GLOBAL SETTINGS
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("spoly_dark") === "true");
  const [exportFormat, setExportFormat] = useState(() => localStorage.getItem("spoly_export") || "markdown");
  const [settingsToggles, setSettingsToggles] = useState({ notion: false });
  const [selectedMic, setSelectedMic] = useState(() => localStorage.getItem("spoly_mic") || "default");
  const [audioConstraints, setAudioConstraints] = useState(() => {
    const saved = localStorage.getItem("spoly_audio");
    return saved ? JSON.parse(saved) : { echoCancellation: true, noiseSuppression: true };
  });

  // 🚀 Feature: Dynamic Background State
  const [contextTheme, setContextTheme] = useState(null);

  useEffect(() => {
    localStorage.setItem("spoly_dark", isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(() => localStorage.setItem("spoly_export", exportFormat), [exportFormat]);
  useEffect(() => localStorage.setItem("spoly_mic", selectedMic), [selectedMic]);
  useEffect(() => localStorage.setItem("spoly_audio", JSON.stringify(audioConstraints)), [audioConstraints]);

  const [status, setStatus] = useState("idle");
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("English");
  const [contextFiles, setContextFiles] = useState([]);
  const [isRemixing, setIsRemixing] = useState(false);
  const [showRemixMenu, setShowRemixMenu] = useState(false);
  const contextInputRef = useRef(null);

  const [activeAiTemplate, setActiveAiTemplate] = useState(null);
  const [processingType, setProcessingType] = useState("audio");
  const [isWidgetDeployed, setIsWidgetDeployed] = useState(false);
  const [isExtensionActive, setIsExtensionActive] = useState(false);

  const [youtubeUrl, setYoutubeUrl] = useState("");

  const localMediaRecorderRef = useRef(null);
  const localAudioChunks = useRef([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingContext, setIsDraggingContext] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const typingRef = useRef(null);
  const uploadRef = useRef(null);
  const timerRef = useRef(0);
  const simulationIndex = useRef(0);
  const stopTriggeredRef = useRef(false);
  const milestones = useRef({ summary: false, takeaways: false, decisions: false, actions: false });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState("All");

  // LIBRARY STATE
  const [notesViewMode, setNotesViewMode] = useState("grid");
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const fullTranscript = "Alright, let's map out the new checkout flow. The user starts on the frontend client. They hit the API Gateway. The Gateway routes to the Auth Service to validate the session. If valid, the Auth Service checks the Postgres Database, and also caches the active session into Redis. Finally, we return the secure token back to the client. We need to make sure the Redis cache has a TTL of 15 minutes to avoid stale sessions. Action item for John to configure the API Gateway routing rules by tomorrow. Sarah, you'll handle the Redis caching logic. Let's make sure the token return is encrypted. Also, ensure logging is pushed to Datadog for observability.";

  const [meetingNotes, setMeetingNotes] = useState({ summary: "", takeaways: "", decisions: "" });
  const [actionItems, setActionItems] = useState([]);
  const [editableMermaid, setEditableMermaid] = useState("graph TD;\n  Client-->API_Gateway;");

  useEffect(() => {
    let interval = null;
    if (status === 'recording') {
      interval = setInterval(() => { setTimer(prev => prev + 1); timerRef.current += 1; }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const forceStartRef = useRef(null);
  const stopLocalRef = useRef(null);

  useEffect(() => {
    forceStartRef.current = forceStartSimulation;
    stopLocalRef.current = handleStopLocalRecording;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("autoStart") === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => { if (forceStartRef.current) forceStartRef.current(); }, 500);
    }
    const handleMessage = (e) => {
      const type = e.data?.type;
      if (type === 'SPOLY_RECORDING_STARTED' || type === 'SPOLY_HEARTBEAT_LIVE') {
         if (forceStartRef.current) forceStartRef.current();
      } else if (type === 'SPOLY_RECORDING_STOPPED' || type === 'SPOLY_UPLOAD_COMPLETE') {
         if (stopLocalRef.current) stopLocalRef.current();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [savedNotes, setSavedNotes] = useState([
    { id: 1, title: "Sprint Planning: Q3 Authentication", date: "Feb 12, 2026", folderId: "eng", duration: "45:20", items: 4, tags: ["Engineering", "Urgent", "Backend"], summary: "The team mapped out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, Auth Service, Postgres, and Redis caching layers.", takeaways: "• Frontend interactions are secured via API Gateway.\n• Session states will be cached in Redis.", decisions: "1. Use Redis over Memcached for session caching.", graph: "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;", audioUrl: null },
    { id: 2, title: "Marketing Campaign Q4 Kickoff", date: "Feb 09, 2026", folderId: "mkt", duration: "32:10", items: 2, tags: ["Marketing", "Social"], summary: "Aligned on the core messaging for the Q4 launch, focusing primarily on the new social media ad spend and influencer partnerships.", takeaways: "• Focus ad spend on Instagram and TikTok.\n• Partner with 5 micro-influencers by mid-quarter.", decisions: "1. Reallocate 20% of Google Ads budget to TikTok.", graph: "graph TD;\n  Campaign-->Instagram;\n  Campaign-->TikTok;\n  TikTok-->Influencers;", audioUrl: null }
  ]);

  const toggleActionItem = (id) => setActionItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };
  const formatTime = (sec) => { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; };

  const handleAddFolder = (e) => {
    if (e.key === 'Enter' && newFolderName.trim()) {
      const colors = ['text-emerald-500', 'text-purple-500', 'text-pink-500', 'text-cyan-500', 'text-rose-500', 'text-indigo-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newFolder = { id: `folder_${Date.now()}`, name: newFolderName.trim(), color: randomColor, isDefault: false };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName(""); setIsAddingFolder(false); showToast(`Folder "${newFolder.name}" created!`);
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    const folderName = folders.find(f => f.id === folderId)?.name;
    if (window.confirm(`Are you sure you want to delete the "${folderName}" folder?\n\nAny notes inside will be safely moved back to "All Notes".`)) {
      setSavedNotes(prev => prev.map(n => n.folderId === folderId ? { ...n, folderId: 'all' } : n));
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (activeFolderId === folderId) setActiveFolderId('all');
      showToast("Folder deleted.");
    }
  };

  const finishProcessing = (customTitle = null, overrideAudioUrl = null) => {
    setStatus("complete"); setIsExtensionActive(false);
    showToast(processingType === "image" ? "Whiteboard Converted Successfully!" : `Processed in ${outputLanguage}!`);
    let noteTitle = customTitle || (fileName ? `Processed File: ${fileName}` : `Live Session ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    if (activeAiTemplate) noteTitle = `[${activeAiTemplate.name}] ${noteTitle}`;
    const finalAudioUrl = overrideAudioUrl || currentAudioUrl;

    const newNote = {
      id: Date.now(), title: noteTitle, folderId: "all", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: formatTime(timerRef.current), items: actionItems.length, tags: [outputLanguage, activeAiTemplate?.category || "AI"],
      summary: meetingNotes.summary || "Summary successfully generated from context.", takeaways: meetingNotes.takeaways || "• Key points extracted seamlessly.",
      decisions: meetingNotes.decisions, graph: editableMermaid, audioUrl: finalAudioUrl,
    };
    setSavedNotes((prev) => [newNote, ...prev]);
  };

  const runSimulationTick = () => {
    if (stopTriggeredRef.current) { clearInterval(typingRef.current); return; }
    let i = simulationIndex.current; i += Math.floor(Math.random() * 5) + 2;
    if (i > fullTranscript.length) i = fullTranscript.length;
    simulationIndex.current = i; setTranscript(fullTranscript.slice(0, i));

    if (i > 80 && !milestones.current.summary) {
      milestones.current.summary = true;
      setMeetingNotes(prev => ({ ...prev, summary: "The team is mapping out the secure checkout authentication flow..." }));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;");
    }
    if (i > 200 && !milestones.current.takeaways) {
      milestones.current.takeaways = true;
      setMeetingNotes(prev => ({ ...prev, takeaways: "• Frontend interactions are secured via API Gateway." }));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];");
    }
    if (i > 300 && !milestones.current.decisions) {
      milestones.current.decisions = true;
      setMeetingNotes(prev => ({ ...prev, decisions: "1. Cache active sessions into Redis." }));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;");
    }
    if (i > 400 && !milestones.current.actions) {
      milestones.current.actions = true;
      setActionItems([{ id: 1, text: "Configure API Gateway routing rules", done: false }, { id: 2, text: "Setup Redis caching", done: false }]);
    }
  };

  const forceStartSimulation = () => {
    if (status === "recording" || status === "processing" || status === "paused") return;
    setActiveTab("workspace"); setIsExtensionActive(true); setStatus("recording"); stopTriggeredRef.current = false; setProcessingType("audio");
    setTranscript(""); setTimer(0); timerRef.current = 0; simulationIndex.current = 0; milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null);
    if (typingRef.current) clearInterval(typingRef.current); typingRef.current = setInterval(runSimulationTick, 100);
  };

  const handleStartLocalRecording = async () => {
    let stream = null;
    try {
      const constraints = { echoCancellation: audioConstraints.echoCancellation, noiseSuppression: audioConstraints.noiseSuppression };
      if (selectedMic !== "default") constraints.deviceId = { exact: selectedMic };
      stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
    } catch (err) { console.warn("Spoly: Mic denied", err); }

    setActiveTab("workspace"); setIsExtensionActive(false); setStatus("recording"); stopTriggeredRef.current = false; setProcessingType("audio");
    setTranscript(""); setTimer(0); timerRef.current = 0; simulationIndex.current = 0; milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null);
    if (typingRef.current) clearInterval(typingRef.current); typingRef.current = setInterval(runSimulationTick, 100);

    if (stream) {
      const recorder = new MediaRecorder(stream);
      localAudioChunks.current = [];
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) localAudioChunks.current.push(e.data); };
      recorder.onstop = () => {
        const mimeToUse = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(localAudioChunks.current, { type: mimeToUse });
        const audioUrl = URL.createObjectURL(audioBlob);
        setCurrentAudioUrl(audioUrl); stream.getTracks().forEach((t) => t.stop());
        finishProcessing("Live Classroom Capture", audioUrl);
      };
      recorder.start(1000); localMediaRecorderRef.current = recorder;
    } else {
      showToast("Mic unavailable or denied. Running AI Simulation mode."); localMediaRecorderRef.current = null;
    }
  };

  const toggleLocalPause = () => {
    if (status === "recording") { if (localMediaRecorderRef.current?.state === "recording") localMediaRecorderRef.current.pause(); setStatus("paused"); clearInterval(typingRef.current); } 
    else if (status === "paused") { if (localMediaRecorderRef.current?.state === "paused") localMediaRecorderRef.current.resume(); setStatus("recording"); typingRef.current = setInterval(runSimulationTick, 100); }
  };

  const handleStopLocalRecording = () => {
    if (stopTriggeredRef.current) return;
    stopTriggeredRef.current = true; if (typingRef.current) clearInterval(typingRef.current); setStatus("processing");
    if (localMediaRecorderRef.current && localMediaRecorderRef.current.state !== "inactive") { localMediaRecorderRef.current.stop(); } 
    else { setTimeout(() => finishProcessing("Live Classroom Capture"), 2000); }
  };

  const handleToggleWidget = () => {
    const isExtensionReady = document.getElementById("spoly-extension-marker");
    if (isExtensionReady) window.postMessage({ type: "SPOLY_TOGGLE_WIDGET" }, "*");
    else alert("⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!");
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]); };
  const processFile = (file) => {
    const isImage = file.type.startsWith("image/"); setProcessingType(isImage ? "image" : "audio"); setFileName(file.name); setStatus("uploading"); setUploadProgress(0); stopTriggeredRef.current = false;
    if (!isImage) setCurrentAudioUrl(URL.createObjectURL(file));
    let progress = 0; if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100; clearInterval(uploadRef.current); setStatus("processing");
        if (isImage) { setTimeout(() => finishProcessing(), 3000); } 
        else {
          let i = 0; if (typingRef.current) clearInterval(typingRef.current);
          milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
          typingRef.current = setInterval(() => {
            i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
            if (!milestones.current.summary && i > 50) {
              milestones.current.summary = true;
              setMeetingNotes({ summary: "Team mapped out secure checkout.", takeaways: "• Interactions via API Gateway.", decisions: "1. Use Redis." });
              setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setActionItems([{ id: 1, text: "Configure API Gateway", done: false }]);
            }
            if (i >= fullTranscript.length) { clearInterval(typingRef.current); setTimeout(() => finishProcessing(), 1500); }
          }, 40);
        }
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const processYoutube = (e) => {
    e.preventDefault(); if (!youtubeUrl.trim()) return;
    setProcessingType("youtube"); setFileName("Fetching YouTube Transcript..."); setStatus("uploading"); setUploadProgress(0); stopTriggeredRef.current = false;
    let progress = 0; if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100; clearInterval(uploadRef.current); setStatus("processing");
        let i = 0; if (typingRef.current) clearInterval(typingRef.current);
        milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
        typingRef.current = setInterval(() => {
          i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
          if (i >= fullTranscript.length) { clearInterval(typingRef.current); setTimeout(() => { finishProcessing("YouTube Video Notes", null); setYoutubeUrl(""); }, 1500); }
        }, 40);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  // 🚀 Feature Implementation: Dynamic Context Theme Update
  const handleContextDrop = (e) => { 
    e.preventDefault(); setIsDraggingContext(false); 
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { 
      const file = e.dataTransfer.files[0];
      setContextFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]); 
      setContextTheme(generateThemeFromFile(file)); // Inject Theme
      showToast(`Context Attached! Applied specific theme.`); 
    } 
  };
  
  const removeContextFile = (index) => {
    setContextFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) setContextTheme(null); // Remove theme if empty
      else setContextTheme(generateThemeFromFile(newFiles[0]));
      return newFiles;
    });
  };

  const handleReset = () => { 
    if (typingRef.current) clearInterval(typingRef.current); 
    if (uploadRef.current) clearInterval(uploadRef.current); 
    stopTriggeredRef.current = false; setStatus("idle"); setTranscript(""); 
    setTimer(0); timerRef.current = 0; setFileName(""); setUploadProgress(0); 
    setIsExtensionActive(false); if (fileInputRef.current) fileInputRef.current.value = ""; 
    setActiveTab("workspace"); setActionItems([]); setContextFiles([]); 
    setContextTheme(null); // Reset theme
  };

  const triggerRemix = (template) => { setShowRemixMenu(false); setActiveAiTemplate(template); setIsRemixing(true); setTimeout(() => { setIsRemixing(false); showToast(`Remixed into ${template.name}!`); setMeetingNotes((prev) => ({ ...prev, summary: `[Remixed for ${template.name}]\n\n${prev.summary}` })); }, 2000); };

  return (
    <div className={`flex h-screen relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? "text-slate-100 bg-[#0b0f19]" : "text-slate-900 bg-[#f8fafc]"}`}>
      <ScrollbarStyles />
      <WorkspaceMeshBackground isDarkMode={isDarkMode} customTheme={contextTheme} />
      
      <AnimatePresence>
        {toast && ( <motion.div key="toast" initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${isDarkMode ? "bg-white text-slate-900 border-slate-200" : "bg-slate-900 text-white border-slate-700"}`}><Sparkles size={18} className="text-amber-500" /> {toast}</motion.div> )}
      </AnimatePresence>

      {/* 🚀 Feature Implementation: Floating PiP Widget */}
      <AnimatePresence>
        {(status === 'recording' || status === 'paused') && activeTab !== 'workspace' && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className={`fixed bottom-8 right-8 z-[150] w-72 rounded-2xl shadow-2xl border p-4 cursor-grab active:cursor-grabbing backdrop-blur-xl ${isDarkMode ? 'bg-[#131722]/90 border-[#2A2F3D]' : 'bg-white/90 border-slate-200'}`}
          >
             {/* Header */}
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${status === 'paused' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Note</span>
               </div>
               <button onClick={() => setActiveTab('workspace')} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                 <Maximize2 size={14}/>
               </button>
             </div>
             
             {/* Time & Waveform */}
             <div className="flex items-center justify-between mb-4 px-2">
               <span className={`font-mono text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatTime(timer)}</span>
               <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-[#0E1116]' : 'bg-slate-50'}`}>
                  <AudioWaveform isRecording={status === 'recording'} color={status === 'paused' ? 'bg-amber-500' : 'bg-blue-500'} />
               </div>
             </div>

             {/* Controls (If Local Audio) */}
             {!isExtensionActive && (
               <div className="flex gap-2">
                 <button onClick={toggleLocalPause} className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${status === 'paused' ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' : (isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border-[#2A2F3D]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200')}`}>
                    {status === 'paused' ? <PlayCircle size={14}/> : <PauseCircle size={14}/>} {status === 'paused' ? 'Resume' : 'Pause'}
                 </button>
                 <button onClick={handleStopLocalRecording} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white border border-red-600 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                    <Square size={14} fill="currentColor"/> Stop
                 </button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODULAR: SIDEBAR */}
      <Sidebar isDarkMode={isDarkMode} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleReset={handleReset} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedNote={setSelectedNote} user={user} />

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto overflow-x-hidden min-w-0">
        <header className={`px-8 py-6 flex justify-between items-center border-b sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-[#0b0f19]/80 backdrop-blur-md border-[#232a3b]" : "bg-white/30 backdrop-blur-md border-white/40"}`}>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">{selectedNote ? selectedNote.title : activeTab === "workspace" ? "Active Workspace" : activeTab}</h1>
            <p className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{selectedNote ? `Saved on ${selectedNote.date}` : new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          {activeTab === "workspace" && status === "idle" && (
            <div className="flex items-center gap-4">
              <div className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? "bg-[#131722] border border-[#232a3b]" : "bg-white border border-slate-200"}`}>
                <Languages size={18} className="text-blue-500" />
                <select value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)} className={`bg-transparent border-none focus:outline-none text-sm font-bold cursor-pointer outline-none ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>English</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Hindi</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Spanish</option>
                </select>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${isDarkMode ? "bg-emerald-900/20 border border-emerald-800/50 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-700"}`}><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Ready</div>
            </div>
          )}
          {selectedNote && ( <button onClick={() => setSelectedNote(null)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}><ChevronLeft size={16} /> Back to Library</button> )}
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">
          <AnimatePresence>
            {activeTab === "workspace" && activeAiTemplate && status === "idle" && (
              <motion.div key="active-template" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-4 rounded-2xl flex items-center justify-between shadow-sm transition-colors border ${isDarkMode ? "bg-[#1a1f2e] border-indigo-500/30" : "bg-indigo-50 border-indigo-200"}`}>
                <div className={`flex items-center gap-3 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                  <div className={`p-2 rounded-xl shadow-sm border ${isDarkMode ? "bg-[#131722] border-indigo-500/20" : "bg-white border-indigo-100"}`}>{activeAiTemplate.icon}</div>
                  <div><p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`}>Active Template</p><p className="font-extrabold text-lg">{activeAiTemplate.name}</p></div>
                </div>
                <button onClick={() => { setActiveAiTemplate(null); showToast("Template cleared"); }} className={`p-2 rounded-xl transition-colors ${isDarkMode ? "text-slate-500 hover:text-red-400 hover:bg-[#131722]" : "text-indigo-400 hover:text-red-500 hover:bg-white"}`}><Trash2 size={20} /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* WORKSPACE VIEW */}
            {activeTab === "workspace" && !selectedNote && (
              <motion.div key="workspace-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {/* IDLE OR UPLOADING STATE */}
                {(status === "idle" || status === "uploading") && (
                  <motion.div key="recording-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`shadow-xl rounded-2xl p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-white/70 backdrop-blur-xl border-white"}`}>
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl shadow-sm border ${isDarkMode ? "bg-indigo-900/30 text-indigo-400 border-indigo-800/50" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}><Play size={24} className="animate-pulse" /></div>
                        <div><h2 className="text-2xl font-extrabold tracking-tight">Initialize Workspace</h2><p className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Select a data source to begin capturing intelligent notes.</p></div>
                      </div>
                    </div>

                    {status === "idle" && (
                      <motion.div key="idle-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-6">
                          
                          {/* EXTENSION CARD */}
                          <button onClick={handleToggleWidget} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isWidgetDeployed ? (isDarkMode ? "bg-red-950/20 border-red-900" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-indigo-600" : "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"}`}>
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isWidgetDeployed ? (isDarkMode ? "bg-[#0b0f19] border-red-900/50" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              
                              <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-red-600/50 group-hover:bg-red-500/60" : "bg-red-400/40 group-hover:bg-red-400/50") : isDarkMode ? "bg-purple-600/40 group-hover:bg-purple-500/50" : "bg-purple-300/40 group-hover:bg-purple-300/50"}`}></div>
                              <div className={`absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-orange-600/40" : "bg-orange-400/40") : isDarkMode ? "bg-indigo-600/40 group-hover:bg-indigo-500/50" : "bg-indigo-300/40 group-hover:bg-indigo-300/50"}`}></div>
                              <Workflow className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-red-500/25" : "text-red-500/20") : isDarkMode ? "text-indigo-400/25" : "text-indigo-500/20"}`} strokeWidth="2" />
                              <Sparkles className={`absolute left-8 bottom-2 w-14 h-14 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-orange-500/25" : "text-orange-500/20") : isDarkMode ? "text-purple-400/25" : "text-purple-500/20"}`} strokeWidth="2" />
                              
                              <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isWidgetDeployed ? (isDarkMode ? "bg-red-950 border-red-800 text-red-400" : "bg-white border-red-200 text-red-600") : isDarkMode ? "bg-[#131722] border-indigo-900/50 text-indigo-400" : "bg-white border-slate-100 text-indigo-600"}`}>
                                {isWidgetDeployed ? <X size={32} /> : <Puzzle size={32} />}
                              </div>
                              <div className="absolute top-4 right-4 z-10">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm border ${isWidgetDeployed ? (isDarkMode ? "bg-red-900/50 text-red-300 border-red-800" : "bg-red-100 text-red-700 border-red-200") : isDarkMode ? "bg-[#1a1f2e] text-slate-400 border-[#232a3b]" : "bg-white text-slate-500 border-slate-200"}`}>
                                  {isWidgetDeployed ? "Active" : "Widget"}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isWidgetDeployed ? (isDarkMode ? "text-red-300" : "text-red-900") : isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-700"}`}>{isWidgetDeployed ? "Close Extension" : "Web Record"}</h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isWidgetDeployed ? (isDarkMode ? "text-red-400/80" : "text-red-700/80") : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{isWidgetDeployed ? "Hide the Spoly widget." : "Inject the Spoly bot into the screen to capture any Google Meet or web audio."}</p>
                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? "bg-[#131722]" : "bg-slate-50 shadow-sm"}`}>
                                <ArrowRight size={14} className={isWidgetDeployed ? "text-red-500" : isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
                              </div>
                            </div>
                          </button>

                          {/* DEVICE AUDIO CARD */}
                          <button onClick={handleStartLocalRecording} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"}`}>
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              <div className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-blue-600/40 group-hover:bg-blue-500/50" : "bg-blue-400/40 group-hover:bg-blue-400/50"}`}></div>
                              <div className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-cyan-600/40 group-hover:bg-cyan-500/50" : "bg-cyan-300/40 group-hover:bg-cyan-300/50"}`}></div>
                              <Headphones className={`absolute left-6 top-4 w-20 h-20 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-blue-400/25" : "text-blue-500/20"}`} strokeWidth="2" />
                              <Activity className={`absolute right-8 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-cyan-400/25" : "text-cyan-500/20"}`} strokeWidth="2" />
                              <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-blue-900/50 text-blue-400" : "bg-white border-slate-100 text-blue-600"}`}>
                                <Mic size={32} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}>Device Audio</h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Capture an in-person meeting, lecture, or conversation directly through your microphone.</p>
                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? "bg-[#131722]" : "bg-slate-50 shadow-sm"}`}>
                                <ArrowRight size={14} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                              </div>
                            </div>
                          </button>

                          {/* UPLOAD FILE CARD */}
                          <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] ${isDragging ? (isDarkMode ? "border-emerald-400 bg-emerald-900/20" : "border-emerald-400 bg-emerald-50") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50" : "bg-white border-slate-300 hover:border-emerald-400 shadow-sm"}`}>
                            <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0]); }} accept="audio/*,video/*,image/*" className="hidden" />
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? "bg-emerald-900/30 border-emerald-800" : "bg-emerald-100/50 border-emerald-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-emerald-600/40 group-hover:bg-emerald-500/50" : "bg-emerald-400/40 group-hover:bg-emerald-300/50"}`}></div>
                              <div className={`absolute bottom-0 left-10 w-24 h-24 blur-2xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-teal-600/30 group-hover:bg-teal-500/40" : "bg-teal-300/30 group-hover:bg-teal-300/40"}`}></div>
                              <Database className={`absolute left-8 top-4 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-emerald-400/25" : "text-emerald-500/20"}`} strokeWidth="2" />
                              <Layers className={`absolute right-10 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-teal-400/25" : "text-teal-500/20"}`} strokeWidth="2" />
                              <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? "bg-[#131722] border-emerald-800 text-emerald-400" : "bg-white border-emerald-200 text-emerald-600") : isDarkMode ? "bg-[#131722] border-slate-800 text-slate-300" : "bg-white border-slate-100 text-slate-600"}`}>
                                <ImagePlus size={32} className={isDragging ? "animate-bounce" : ""} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-700"}`}>{isDragging ? "Drop File Here" : "Upload File"}</h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Post-process an existing audio recording or image of a whiteboard.</p>
                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? "bg-[#131722]" : "bg-slate-50 shadow-sm"}`}>
                                <ArrowRight size={14} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} />
                              </div>
                            </div>
                          </div>

                          {/* YOUTUBE LINK CARD */}
                          <div className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-red-500/50" : "bg-white border-slate-200 hover:border-red-300 shadow-sm"}`}>
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              <div className={`absolute top-0 right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-red-600/40 group-hover:bg-red-500/50" : "bg-red-400/40 group-hover:bg-red-300/50"}`}></div>
                              <div className={`absolute -bottom-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-orange-600/30 group-hover:bg-orange-500/40" : "bg-orange-300/30 group-hover:bg-orange-300/40"}`}></div>
                              <PlayCircle className={`absolute left-8 top-6 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-red-400/25" : "text-red-500/20"}`} strokeWidth="2" />
                              <Video className={`absolute right-6 bottom-2 w-20 h-20 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-orange-400/25" : "text-orange-500/20"}`} strokeWidth="2" />
                              <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-red-900/50 text-red-400" : "bg-white border-slate-100 text-red-600"}`}>
                                <Youtube size={32} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-3 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-red-400" : "text-slate-800 group-hover:text-red-600"}`}>YouTube Link</h3>
                              <form onSubmit={processYoutube} className="w-full relative mt-auto group/form">
                                <input type="text" placeholder="Paste video URL here..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className={`w-full text-sm pl-4 pr-12 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-white placeholder-slate-500 group-hover/form:border-red-500/50" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 group-hover/form:border-red-300"}`} />
                                <button type="submit" className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${youtubeUrl ? "bg-red-500 text-white hover:bg-red-600 shadow-md" : isDarkMode ? "text-slate-600 bg-transparent" : "text-slate-400 bg-transparent"}`}><ArrowRight size={16} /></button>
                              </form>
                            </div>
                          </div>
                        </div>

                        {/* CONTEXT FILES RAG UPLOAD */}
                        <div className={`group rounded-2xl p-6 transition-colors border relative overflow-hidden ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-white border-slate-200 shadow-sm"}`}>
                          <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-indigo-600/20 group-hover:bg-indigo-500/30" : "bg-indigo-300/30 group-hover:bg-indigo-300/40"}`}></div>
                          <FolderSearch className={`absolute right-10 top-2 w-32 h-32 transform rotate-12 transition-all duration-700 pointer-events-none ${isDarkMode ? "text-indigo-400 opacity-20" : "text-indigo-500 opacity-15"}`} strokeWidth="1.5" />
                          <div className="relative z-10">
                            <div className={`flex items-center gap-2 mb-4 font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                              <FileUp size={20} className={isDarkMode ? "text-indigo-400" : "text-indigo-500"} /> Add Pre-Context Documents (Optional)
                            </div>
                            <p className={`text-sm mb-4 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Upload a Syllabus, PRD, or past notes so the AI understands specific terminology before generating the diagram.</p>
                            <div onDragOver={(e) => { e.preventDefault(); setIsDraggingContext(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDraggingContext(false); }} onDrop={handleContextDrop} onClick={() => contextInputRef.current.click()} className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDraggingContext ? (isDarkMode ? "border-indigo-500 bg-indigo-900/20" : "border-indigo-500 bg-indigo-50") : isDarkMode ? "border-[#232a3b] bg-[#131722] hover:bg-[#0b0f19]" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}>
                              <input type="file" multiple ref={contextInputRef} onChange={(e) => { 
                                if(e.target.files.length) { 
                                  const file = e.target.files[0];
                                  setContextFiles(prev => [...prev, ...Array.from(e.target.files)]); 
                                  setContextTheme(generateThemeFromFile(file));
                                  showToast("Context Attached! Theme adjusted.");
                                } 
                              }} className="hidden" />
                              <span className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}><UploadCloud size={16} /> Drag & Drop PDFs/Docs here</span>
                            </div>
                            {contextFiles.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {contextFiles.map((file, idx) => (
                                  <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${isDarkMode ? "bg-indigo-900/40 text-indigo-300 border-indigo-800/50" : "bg-indigo-100 text-indigo-700 border-indigo-100"}`}>
                                    <FileText size={14} /> {file.name}
                                    <button onClick={(e) => { e.stopPropagation(); removeContextFile(idx); }} className="hover:text-red-500 ml-1"><X size={14} /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {status === "uploading" && (
                      <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-6 w-full max-w-lg mx-auto">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${processingType === "youtube" ? (isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600") : (isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600")}`}>
                           {processingType === "image" ? <ImageIcon size={28} /> : processingType === "youtube" ? <Youtube size={28} /> : <FileAudio size={28} />}
                        </div>
                        <div className="text-center w-full">
                          <p className="font-bold text-lg mb-1 truncate px-4">{fileName}</p>
                          <p className={`font-medium text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                             {processingType === "youtube" ? "Fetching Transcript from YouTube..." : "Uploading to Spoly Servers..."}
                          </p>
                          <div className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
                            <motion.div className={`h-full ${processingType === "youtube" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`} initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear" }} />
                          </div>
                          <p className={`text-right text-xs font-bold mt-2 ${processingType === "youtube" ? (isDarkMode ? "text-red-400" : "text-red-600") : (isDarkMode ? "text-blue-400" : "text-blue-600")}`}>{Math.floor(uploadProgress)}%</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* TRUE REAL-TIME LIVE UI */}
                {(status === "recording" || status === "processing" || status === "paused") && (
                  <motion.div key="live-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-12 gap-8 h-[75vh]">
                    <div className="xl:col-span-4 flex flex-col h-full gap-6">
                      <div className={`rounded-2xl p-6 flex flex-col relative shadow-sm border ${isDarkMode ? "bg-[#0E1116] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                        <div className="flex flex-col items-center justify-center py-4 relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${status === "paused" ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{isExtensionActive ? "Extension Tab" : "Device Mic"}</span>
                          </div>
                          <h2 className={`font-mono text-5xl font-black tracking-tight mb-6 ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}>{formatTime(timer)}</h2>
                          <div className="bg-slate-50 dark:bg-[#131722] py-4 px-8 rounded-2xl border border-slate-100 dark:border-[#2A2F3D] shadow-inner">
                            <AudioWaveform isRecording={status === "recording"} color={status === "paused" ? "bg-amber-500" : "bg-blue-500"} />
                          </div>
                        </div>
                      </div>

                      <div className={`flex-1 rounded-2xl flex flex-col overflow-hidden shadow-sm border ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                        <div className={`p-4 px-6 border-b flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isDarkMode ? "bg-[#0E1116]/80 border-[#2A2F3D] text-slate-400" : "bg-slate-50/80 border-slate-100 text-slate-500"}`}><List size={14} /> Live Transcript</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                          <p className={`font-sans font-medium leading-relaxed text-sm pr-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {transcript}
                            {status === "recording" && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse rounded-sm"></span>}
                          </p>
                        </div>
                      </div>

                      {!isExtensionActive && (status === "recording" || status === "paused") && (
                        <div className="flex flex-col lg:flex-row justify-center gap-3">
                          <button onClick={toggleLocalPause} className={`px-6 py-4 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 flex-1 border ${status === "paused" ? "bg-amber-500 text-white border-amber-600" : isDarkMode ? "bg-[#1a1f2e] text-white border-[#2A2F3D]" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {status === "paused" ? <PlayCircle size={18} /> : <PauseCircle size={18} />} {status === "paused" ? "Resume" : "Pause"}
                          </button>
                          <button onClick={handleStopLocalRecording} className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 flex-1"><Square size={18} fill="currentColor" /> Save</button>
                        </div>
                      )}
                    </div>

                    <div className={`xl:col-span-8 shadow-sm rounded-2xl p-8 flex flex-col relative transition-colors border ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDarkMode ? "border-[#2A2F3D]" : "border-slate-100"}`}>
                        <Zap size={24} className={status === "recording" ? "animate-pulse text-blue-500" : status === "paused" ? "text-amber-500" : "text-emerald-500"} />
                        <h3 className="font-bold text-xl">{status === "recording" ? "AI generating notes..." : "Finalizing Document..."}</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        <div className="space-y-2">
                          <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}><AlignLeft size={16} /> Summary</div>
                          <p className={`p-5 rounded-xl text-sm leading-relaxed border shadow-inner min-h-[100px] ${isDarkMode ? "text-slate-300 bg-[#0b0f19] border-[#2A2F3D]" : "text-slate-600 bg-slate-50 border-slate-100"}`}>{meetingNotes.summary || <span className="italic">Listening...</span>}</p>
                        </div>
                        {actionItems.length > 0 && (
                          <div className="space-y-2">
                            <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}><ListChecks size={16} /> Action Items Detected!</div>
                            <ul className="space-y-2">
                              {actionItems.map((item) => (
                                <li key={item.id} onClick={() => toggleActionItem(item.id)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${item.done ? (isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] opacity-50" : "bg-slate-50 border-slate-200 opacity-60") : isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                                  <div className="mt-0.5">{item.done ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} />}</div>
                                  <span className={`font-medium text-sm ${item.done ? "line-through text-slate-500" : isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {status === "complete" && (
                  <motion.div key="success-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-visible mb-8 bg-gradient-to-r ${isDarkMode ? "from-emerald-600 to-teal-600" : "from-emerald-500 to-teal-500"}`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl shadow-inner"><CheckCircle2 size={32} /></div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">{activeAiTemplate ? activeAiTemplate.name : "Smart Document"} Generated</h2>
                        <p className="text-emerald-50 font-medium">Output Language: {outputLanguage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <div className="relative">
                        <button onClick={() => setShowRemixMenu(!showRemixMenu)} className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold border ${isDarkMode ? "bg-emerald-800 border-emerald-700" : "bg-emerald-700 border-emerald-600"}`}><RefreshCw size={16} /> Remix Format</button>
                        <AnimatePresence>
                          {showRemixMenu && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute top-full right-0 mt-2 w-64 border rounded-2xl shadow-2xl overflow-hidden z-50 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {templatesDB.map((t) => (
                                  <button key={t.id} onClick={() => triggerRemix(t)} className={`w-full text-left px-4 py-3 border-b last:border-0 flex items-center gap-3 text-sm font-bold ${isDarkMode ? "hover:bg-slate-700 text-slate-200 border-slate-700" : "hover:bg-slate-50 text-slate-700 border-slate-100"}`}><span className={getTheme(t.theme, isDarkMode).text}>{t.icon}</span> {t.name}</button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button onClick={handleReset} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold w-full md:w-auto border ${isDarkMode ? "bg-slate-900 text-emerald-400 border-emerald-800" : "bg-white text-emerald-600 border-transparent"}`}><PlusCircle size={18} /> New Session</button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* MODULAR: LIBRARY TAB */}
            {activeTab === "notes" && !selectedNote && (
               <LibraryTab
                  isDarkMode={isDarkMode}
                  folders={folders}
                  activeFolderId={activeFolderId}
                  setActiveFolderId={setActiveFolderId}
                  isAddingFolder={isAddingFolder}
                  setIsAddingFolder={setIsAddingFolder}
                  newFolderName={newFolderName}
                  setNewFolderName={setNewFolderName}
                  handleAddFolder={handleAddFolder}
                  handleDeleteFolder={handleDeleteFolder}
                  dragOverFolder={dragOverFolder}
                  setDragOverFolder={setDragOverFolder}
                  setSavedNotes={setSavedNotes}
                  savedNotes={savedNotes}
                  showToast={showToast}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  notesViewMode={notesViewMode}
                  setNotesViewMode={setNotesViewMode}
                  setSelectedNote={setSelectedNote}
               />
            )}

            {/* MODULAR: NOTE DETAIL VIEW */}
            {selectedNote && (
               <NoteDetailView isDarkMode={isDarkMode} selectedNote={selectedNote} exportFormat={exportFormat} showToast={showToast} />
            )}

            {/* MODULAR: TEMPLATES TAB */}
            {activeTab === "templates" && (
               <TemplatesTab
                  isDarkMode={isDarkMode}
                  templateFilter={templateFilter}
                  setTemplateFilter={setTemplateFilter}
                  templateCategories={templateCategories}
                  templatesDB={templatesDB}
                  setActiveAiTemplate={setActiveAiTemplate}
                  setActiveTab={setActiveTab}
                  showToast={showToast}
               />
            )}

            {/* MODULAR: SETTINGS TAB */}
            {activeTab === "settings" && (
              <SettingsView user={user} settingsToggles={settingsToggles} setSettingsToggles={setSettingsToggles} showToast={showToast} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} exportFormat={exportFormat} setExportFormat={setExportFormat} selectedMic={selectedMic} setSelectedMic={setSelectedMic} audioConstraints={audioConstraints} setAudioConstraints={setAudioConstraints} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}