import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Mic, Square, UploadCloud, FileText, ListChecks, 
  Workflow, Clock, LayoutDashboard, Settings, 
  FolderSearch, PlusCircle, CheckCircle2, Zap, Puzzle, 
  X, FileAudio, Calendar, Search, Code, Download, Copy,
  CheckCircle, Circle, ArrowRight, ChevronRight,
  Wand2, PlayCircle, PauseCircle, Send, AlignLeft, Briefcase, Sparkles,
  Database, Trash2, Layers, Menu, ChevronLeft, List,
  Tag, CalendarDays, Bot, ImageIcon, ImagePlus, Brain, Languages, FileUp, RefreshCw, Headphones, Youtube, Play,
  Activity, Video, Heart, Shield, TrendingUp, Brush, Users
} from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';
import SettingsView from '../components/SettingsView'; 

// 🚀 CUSTOM SCROLLBAR STYLES
const ScrollbarStyles = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(100, 116, 139, 0.6); }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(51, 65, 85, 0.6); }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(71, 85, 105, 0.8); }
  `}</style>
);

const WorkspaceMeshBackground = ({ isDarkMode }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500">
    <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'}`}></div>
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 45, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[100px] will-change-transform transform-gpu ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-200/30'}`} />
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] will-change-transform transform-gpu ${isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-200/20'}`} />
  </div>
);

const AudioWaveform = ({ isRecording, color = "bg-blue-500" }) => (
  <div className="flex items-center gap-1.5 h-8">
    {[...Array(7)].map((_, i) => (
      <motion.div key={`wave-${i}`} animate={isRecording ? { height: ["20%", "100%", "30%", "80%", "20%"] } : { height: "15%" }} transition={isRecording ? { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }} className={`w-1.5 ${color} rounded-full`} />
    ))}
  </div>
);

const EditableSection = ({ icon: Icon, title, value, onChange, isDarkMode }) => {
  const textareaRef = useRef(null);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [value]);
  return (
    <div className={`group relative border rounded-xl p-4 -mx-4 transition-colors ${isDarkMode ? 'border-transparent hover:border-slate-800 hover:bg-[#131722]' : 'border-transparent hover:border-blue-100 hover:bg-blue-50/30'}`}>
      <div className={`flex items-center gap-2 mb-2 font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}><Icon size={18} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} /><h4 className="text-md">{title}</h4></div>
      <textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-transparent leading-relaxed font-medium focus:outline-none focus:ring-0 resize-none overflow-hidden ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} spellCheck="false" />
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${isDarkMode ? 'text-indigo-300 bg-indigo-900/40' : 'text-blue-400 bg-blue-100'}`}>Editable</span></div>
    </div>
  );
};

// 🚀 UNIQUE CUSTOM SVGS FOR EACH TEMPLATE
const getTemplateBackground = (id, colorClass) => {
  const baseClass = `absolute right-0 bottom-0 w-64 h-64 transition-transform duration-700 group-hover:scale-110 opacity-[0.05] dark:opacity-[0.10] ${colorClass}`;
  switch(id) {
    case 1: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20,80 L50,50 L80,20 M50,50 L80,80" /><circle cx="50" cy="50" r="4" fill="currentColor"/><circle cx="20" cy="80" r="3"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="80" r="3"/></svg>);
    case 2: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 50 Q 50 50 80 20 M20 50 Q 50 50 80 80 M20 50 L 80 50" /><circle cx="20" cy="50" r="4" fill="currentColor"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="50" r="3"/><circle cx="80" cy="80" r="3"/></svg>);
    case 3: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 50 L 90 50 M 30 40 L 30 60 M 50 30 L 50 70 M 70 40 L 70 60" /><circle cx="10" cy="50" r="3" fill="currentColor"/><circle cx="90" cy="50" r="3" fill="currentColor"/></svg>);
    case 4: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="30" y="30" width="20" height="20" rx="4" /><rect x="60" y="50" width="20" height="20" rx="4" /><path d="M50 40 L 70 40 L 70 50" strokeDasharray="3 3" /><circle cx="70" cy="40" r="2" fill="currentColor"/></svg>);
    case 5: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="50" cy="30" rx="20" ry="8" /><path d="M30 30 L 30 70 A 20 8 0 0 0 70 70 L 70 30" /><path d="M30 50 A 20 8 0 0 0 70 50" opacity="0.5"/></svg>);
    case 6: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M10 50 L 30 50 L 40 20 L 60 80 L 70 50 L 90 50" /></svg>);
    case 7: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M50 20 L 50 80 M 20 40 L 80 40 M 20 40 L 35 70 M 80 40 L 65 70" /><path d="M20 70 C 20 80 50 80 50 70 M50 70 C 50 80 80 80 80 70" strokeDasharray="2 2" opacity="0.5"/></svg>);
    case 8: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 80 L 40 50 L 60 60 L 90 20 M 90 20 L 70 20 M 90 20 L 90 40" strokeLinecap="round" strokeLinejoin="round"/><circle cx="20" cy="80" r="3" fill="currentColor"/><circle cx="40" cy="50" r="3" fill="currentColor"/></svg>);
    case 9: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="40" cy="40" r="25" opacity="0.6"/><circle cx="65" cy="40" r="25" opacity="0.6"/><circle cx="52.5" cy="65" r="25" opacity="0.6"/></svg>);
    case 10: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="50" cy="30" r="10"/><path d="M35 70 C 35 50 65 50 65 70" /><circle cx="20" cy="50" r="6" opacity="0.5"/><circle cx="80" cy="50" r="6" opacity="0.5"/><path d="M25 50 L 40 40 M 75 50 L 60 40" strokeDasharray="2 2"/></svg>);
    default: return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1"><rect x="20" y="20" width="60" height="60" rx="8" opacity="0.5" strokeDasharray="4 4"/><circle cx="50" cy="50" r="15"/></svg>);
  }
};

export default function LiveNotes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('workspace'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null); 

  // GLOBAL SETTINGS STATES
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('spoly_dark') === 'true');
  const [exportFormat, setExportFormat] = useState(() => localStorage.getItem('spoly_export') || 'markdown');
  const [settingsToggles, setSettingsToggles] = useState({ notion: false });
  const [selectedMic, setSelectedMic] = useState(() => localStorage.getItem('spoly_mic') || 'default');
  const [audioConstraints, setAudioConstraints] = useState(() => {
    const saved = localStorage.getItem('spoly_audio');
    return saved ? JSON.parse(saved) : { echoCancellation: true, noiseSuppression: true };
  });

  useEffect(() => { 
    localStorage.setItem('spoly_dark', isDarkMode); 
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => { localStorage.setItem('spoly_export', exportFormat); }, [exportFormat]);
  useEffect(() => { localStorage.setItem('spoly_mic', selectedMic); }, [selectedMic]);
  useEffect(() => { localStorage.setItem('spoly_audio', JSON.stringify(audioConstraints)); }, [audioConstraints]);

  const [status, setStatus] = useState('idle'); 
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [outputLanguage, setOutputLanguage] = useState('English');
  const [contextFiles, setContextFiles] = useState([]);
  const [isRemixing, setIsRemixing] = useState(false);
  const [showRemixMenu, setShowRemixMenu] = useState(false);
  const contextInputRef = useRef(null);

  const [activeAiTemplate, setActiveAiTemplate] = useState(null);
  const [processingType, setProcessingType] = useState('audio'); 
  const [isWidgetDeployed, setIsWidgetDeployed] = useState(false);
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  
  const [youtubeUrl, setYoutubeUrl] = useState('');

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
  const processingRef = useRef(null);
  const timerRef = useRef(0); 
  const simulationIndex = useRef(0); 
  const stopTriggeredRef = useRef(false); 
  const milestones = useRef({ summary: false, takeaways: false, decisions: false, actions: false });

  const [showCode, setShowCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState('All');
  
  const fullTranscript = "Alright, let's map out the new checkout flow. The user starts on the frontend client. They hit the API Gateway. The Gateway routes to the Auth Service to validate the session. If valid, the Auth Service checks the Postgres Database, and also caches the active session into Redis. Finally, we return the secure token back to the client. We need to make sure the Redis cache has a TTL of 15 minutes to avoid stale sessions. Action item for John to configure the API Gateway routing rules by tomorrow. Sarah, you'll handle the Redis caching logic. Let's make sure the token return is encrypted. Also, ensure logging is pushed to Datadog for observability.";
  
  const [meetingNotes, setMeetingNotes] = useState({ summary: "", takeaways: "", decisions: "" });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [editableMermaid, setEditableMermaid] = useState("graph TD;\n  Client-->API_Gateway;");
  const [actionItems, setActionItems] = useState([]);

  const toggleActionItem = (id) => {
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAiRefine = (e, promptOverride) => {
    if (e) e.preventDefault();
    const promptToUse = promptOverride || aiPrompt;
    if (!promptToUse) return;
    setIsAiThinking(true);
    setTimeout(() => {
        setIsAiThinking(false);
        setAiPrompt("");
        showToast("Notes refined by AI!");
        setMeetingNotes(prev => ({...prev, summary: `[Refined: ${promptToUse}]\n\n${prev.summary}`}));
    }, 1500);
  };

  const [savedNotes, setSavedNotes] = useState([
    { 
      id: 1, title: "Sprint Planning: Q3 Authentication", date: "Feb 12, 2026", duration: "45:20", items: 4, tags: ["Engineering", "English"],
      summary: "The team mapped out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, Auth Service, Postgres, and Redis caching layers.",
      takeaways: "• Frontend interactions are secured via API Gateway.\n• Auth Service acts as the central validation hub.\n• Session states will be cached in Redis for high-speed retrieval.\n• PostgreSQL remains the persistent source of truth for user data.",
      decisions: "1. Use Redis over Memcached for session caching.\n2. Secure tokens will be passed back directly to the client after DB verification.",
      graph: "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;",
      audioUrl: null
    },
    { 
      id: 2, title: "Marketing Campaign Q4 Kickoff", date: "Feb 09, 2026", duration: "32:10", items: 2, tags: ["Marketing", "Hindi"],
      summary: "Aligned on the core messaging for the Q4 launch, focusing primarily on the new social media ad spend and influencer partnerships.",
      takeaways: "• Focus ad spend on Instagram and TikTok.\n• Partner with 5 micro-influencers by mid-quarter.",
      decisions: "1. Reallocate 20% of Google Ads budget to TikTok.",
      graph: "graph TD;\n  Campaign-->Instagram;\n  Campaign-->TikTok;\n  TikTok-->Influencers;",
      audioUrl: null
    }
  ]);

  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { id: 101, title: "Q3 Roadmap Planning", time: "10:00 AM", platform: "Zoom", botDeployed: false },
    { id: 102, title: "System Architecture Sync", time: "01:30 PM", platform: "Google Meet", botDeployed: false },
  ]);

  const templatesDB = [
    { id: 1, name: "AI Auto-Detect", category: "General", desc: "Let Spoly listen and automatically pick the best diagram format.", icon: <Sparkles size={24}/>, theme: "purple" },
    { id: 2, name: "Study Mind Map", category: "Education", desc: "Break down complex lectures into visual, branching concept maps.", icon: <Brain size={24}/>, theme: "blue" },
    { id: 3, name: "Historical Timeline", category: "Education", desc: "Visualize dates, eras, and chronological events perfectly.", icon: <Clock size={24}/>, theme: "amber" },
    { id: 4, name: "Microservices", category: "Engineering", desc: "Map out decoupled services, gateways, and architecture.", icon: <Workflow size={24}/>, theme: "blue" },
    { id: 5, name: "Database ERD", category: "Engineering", desc: "Auto-generate Entity-Relationship diagrams from context.", icon: <Database size={24}/>, theme: "emerald" },
    { id: 6, name: "Medical Consultation", category: "Healthcare", desc: "Extract patient symptoms, diagnoses, and medical prescriptions.", icon: <Heart size={24}/>, theme: "emerald" },
    { id: 7, name: "Legal Contract Review", category: "Legal", desc: "Isolate clauses, liabilities, and core contractual obligations.", icon: <Shield size={24}/>, theme: "amber" },
    { id: 8, name: "Sales Discovery Call", category: "Business", desc: "Map out BANT: Budget, Authority, Need, and Timeline insights.", icon: <TrendingUp size={24}/>, theme: "blue" },
    { id: 9, name: "Creative Brainstorm", category: "Creative", desc: "Summarize visual ideas, moodboard concepts, and design goals.", icon: <Brush size={24}/>, theme: "purple" },
    { id: 10, name: "HR Candidate Screen", category: "HR", desc: "Structure candidate background, strengths, weaknesses, and fit.", icon: <Users size={24}/>, theme: "rose" },
  ];
  const templateCategories = ['All', 'General', 'Education', 'Business', 'Engineering', 'Healthcare', 'Legal', 'Creative', 'HR'];

  const getTheme = (theme, dark) => {
    const themes = {
      blue: dark ? { iconBg: "bg-[#131722] text-blue-400 border-blue-900/50", hover: "hover:border-blue-500/50 shadow-blue-500/10", text: "text-blue-400", borderGlow: "from-blue-600 via-indigo-500 to-cyan-400", glow1: "bg-blue-600/40", glow2: "bg-cyan-600/40", accent: "from-blue-500" } : { iconBg: "bg-blue-50/80 text-blue-600 border-blue-200", hover: "hover:border-blue-400 shadow-blue-500/10", text: "text-blue-600", borderGlow: "from-blue-400 via-indigo-400 to-cyan-300", glow1: "bg-blue-400/40", glow2: "bg-cyan-300/40", accent: "from-blue-400" },
      purple: dark ? { iconBg: "bg-[#131722] text-purple-400 border-purple-900/50", hover: "hover:border-purple-500/50 shadow-purple-500/10", text: "text-purple-400", borderGlow: "from-purple-600 via-fuchsia-500 to-pink-400", glow1: "bg-purple-600/40", glow2: "bg-fuchsia-600/40", accent: "from-purple-500" } : { iconBg: "bg-purple-50/80 text-purple-600 border-purple-200", hover: "hover:border-purple-400 shadow-purple-500/10", text: "text-purple-600", borderGlow: "from-purple-400 via-fuchsia-400 to-pink-300", glow1: "bg-purple-400/40", glow2: "bg-fuchsia-300/40", accent: "from-purple-400" },
      emerald: dark ? { iconBg: "bg-[#131722] text-emerald-400 border-emerald-900/50", hover: "hover:border-emerald-500/50 shadow-emerald-500/10", text: "text-emerald-400", borderGlow: "from-emerald-600 via-teal-500 to-green-400", glow1: "bg-emerald-600/40", glow2: "bg-teal-600/40", accent: "from-emerald-500" } : { iconBg: "bg-emerald-50/80 text-emerald-600 border-emerald-200", hover: "hover:border-emerald-400 shadow-emerald-500/10", text: "text-emerald-600", borderGlow: "from-emerald-400 via-teal-400 to-green-300", glow1: "bg-emerald-400/40", glow2: "bg-teal-300/40", accent: "from-emerald-400" },
      amber: dark ? { iconBg: "bg-[#131722] text-amber-400 border-amber-900/50", hover: "hover:border-amber-500/50 shadow-amber-500/10", text: "text-amber-400", borderGlow: "from-amber-600 via-orange-500 to-yellow-400", glow1: "bg-amber-600/40", glow2: "bg-orange-600/40", accent: "from-amber-500" } : { iconBg: "bg-amber-50/80 text-amber-600 border-amber-200", hover: "hover:border-amber-400 shadow-amber-500/10", text: "text-amber-600", borderGlow: "from-amber-400 via-orange-400 to-yellow-300", glow1: "bg-amber-400/40", glow2: "bg-orange-300/40", accent: "from-amber-400" },
      rose: dark ? { iconBg: "bg-[#131722] text-rose-400 border-rose-900/50", hover: "hover:border-rose-500/50 shadow-rose-500/10", text: "text-rose-400", borderGlow: "from-rose-600 via-pink-500 to-red-400", glow1: "bg-rose-600/40", glow2: "bg-pink-600/40", accent: "from-rose-500" } : { iconBg: "bg-rose-50/80 text-rose-600 border-rose-200", hover: "hover:border-rose-400 shadow-rose-500/10", text: "text-rose-600", borderGlow: "from-rose-400 via-pink-400 to-red-300", glow1: "bg-rose-400/40", glow2: "bg-pink-300/40", accent: "from-rose-400" },
    };
    return themes[theme] || themes['blue'];
  };

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  const finishProcessing = (customTitle = null, overrideAudioUrl = null) => {
    setStatus('complete'); setIsExtensionActive(false);
    showToast(processingType === 'image' ? "Whiteboard Converted Successfully!" : `Processed in ${outputLanguage}!`);
    let noteTitle = customTitle || (fileName ? `Processed File: ${fileName}` : `Live Session ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
    if (activeAiTemplate) noteTitle = `[${activeAiTemplate.name}] ${noteTitle}`;
    
    const finalAudioUrl = overrideAudioUrl || currentAudioUrl;

    const newNote = { 
      id: Date.now(), title: noteTitle, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      duration: formatTime(timerRef.current), items: actionItems.length, tags: [outputLanguage, activeAiTemplate?.category || "AI"],
      summary: meetingNotes.summary || "Summary successfully generated from context.", takeaways: meetingNotes.takeaways || "• Key points extracted seamlessly.",
      decisions: meetingNotes.decisions, graph: editableMermaid, audioUrl: finalAudioUrl
    };
    setSavedNotes(prev => [newNote, ...prev]);
  };

  const runSimulationTick = () => {
    if (stopTriggeredRef.current) { clearInterval(typingRef.current); return; }
    let i = simulationIndex.current; i += Math.floor(Math.random() * 5) + 2; 
    if (i > fullTranscript.length) i = fullTranscript.length;
    simulationIndex.current = i; setTranscript(fullTranscript.slice(0, i));

    if (i > 80 && !milestones.current.summary) {
      milestones.current.summary = true;
      setMeetingNotes(prev => ({...prev, summary: "The team is mapping out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, and Auth Service."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;");
    }
    if (i > 200 && !milestones.current.takeaways) {
      milestones.current.takeaways = true;
      setMeetingNotes(prev => ({...prev, takeaways: "• Frontend interactions are secured via API Gateway.\n• Auth Service validates sessions against Postgres DB."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];");
    }
    if (i > 300 && !milestones.current.decisions) {
      milestones.current.decisions = true;
      setMeetingNotes(prev => ({...prev, decisions: "1. Cache active sessions into Redis to ensure high-speed retrieval and token passing."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;");
    }
    if (i > 400 && !milestones.current.actions) {
      milestones.current.actions = true;
      setActionItems([{ id: 1, text: "Configure API Gateway routing rules", done: false }, { id: 2, text: "Setup Redis session caching logic", done: false }]);
    }
  };

  const forceStartSimulation = () => {
    if (status === 'recording' || status === 'processing' || status === 'paused') return;
    setActiveTab('workspace'); setIsExtensionActive(true); setStatus('recording'); stopTriggeredRef.current = false; setProcessingType('audio');
    setTranscript(""); setTimer(0); timerRef.current = 0; simulationIndex.current = 0; setShowCode(false);
    milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null); 
    if (typingRef.current) clearInterval(typingRef.current); typingRef.current = setInterval(runSimulationTick, 100);
  };

  const handleStartLocalRecording = async () => {
    let stream = null;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("MediaDevices not supported");
      const constraints = { echoCancellation: audioConstraints.echoCancellation, noiseSuppression: audioConstraints.noiseSuppression, autoGainControl: true };
      if (selectedMic !== 'default') constraints.deviceId = { exact: selectedMic };
      stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
    } catch (err) { console.warn("Spoly: Mic denied", err); }

    setActiveTab('workspace'); setIsExtensionActive(false); setStatus('recording'); stopTriggeredRef.current = false; setProcessingType('audio');
    setTranscript(""); setTimer(0); timerRef.current = 0; simulationIndex.current = 0; setShowCode(false);
    milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null);

    if (typingRef.current) clearInterval(typingRef.current); typingRef.current = setInterval(runSimulationTick, 100);

    if (stream) {
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) options = { mimeType: 'audio/webm;codecs=opus' };
      else if (MediaRecorder.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
      else if (MediaRecorder.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };

      const recorder = new MediaRecorder(stream, options);
      localAudioChunks.current = [];

      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) localAudioChunks.current.push(e.data); };
      recorder.onstop = () => {
        const mimeToUse = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(localAudioChunks.current, { type: mimeToUse });
        const audioUrl = URL.createObjectURL(audioBlob);
        setCurrentAudioUrl(audioUrl); stream.getTracks().forEach(t => t.stop());
        
        const downloadLink = document.createElement('a'); downloadLink.style.display = 'none'; downloadLink.href = audioUrl;
        downloadLink.download = `Spoly_Device_Audio_${Date.now()}.${mimeToUse.includes('mp4') ? 'mp4' : 'webm'}`;
        document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink);

        finishProcessing("Live Classroom Capture", audioUrl);
      };
      recorder.start(1000); localMediaRecorderRef.current = recorder;
    } else {
      showToast("Mic unavailable or denied. Running AI Simulation mode."); localMediaRecorderRef.current = null;
    }
  };

  const toggleLocalPause = () => {
    if (status === 'recording') {
      if (localMediaRecorderRef.current?.state === 'recording') localMediaRecorderRef.current.pause();
      setStatus('paused'); clearInterval(typingRef.current);
    } else if (status === 'paused') {
      if (localMediaRecorderRef.current?.state === 'paused') localMediaRecorderRef.current.resume();
      setStatus('recording'); typingRef.current = setInterval(runSimulationTick, 100);
    }
  };
  
  const handleStopLocalRecording = () => {
    if (stopTriggeredRef.current) return; 
    stopTriggeredRef.current = true; if (typingRef.current) clearInterval(typingRef.current); setStatus('processing'); 
    if (localMediaRecorderRef.current && localMediaRecorderRef.current.state !== 'inactive') { localMediaRecorderRef.current.stop(); } 
    else { setTimeout(() => { finishProcessing("Live Classroom Capture"); }, 2000); }
  };

  const handleToggleWidget = () => {
    const isExtensionReady = document.getElementById('spoly-extension-marker');
    if (isExtensionReady) window.postMessage({ type: 'SPOLY_TOGGLE_WIDGET' }, '*');
    else alert("⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!");
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]); };
  const processFile = (file) => {
    const isImage = file.type.startsWith('image/'); setProcessingType(isImage ? 'image' : 'audio'); setFileName(file.name); setStatus('uploading'); setUploadProgress(0); stopTriggeredRef.current = false;
    if (!isImage) setCurrentAudioUrl(URL.createObjectURL(file));

    let progress = 0; if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100; clearInterval(uploadRef.current); setStatus('processing');
        if (isImage) { setTimeout(() => { finishProcessing(); }, 3000); } 
        else {
           let i = 0; if (typingRef.current) clearInterval(typingRef.current);
           milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
           typingRef.current = setInterval(() => {
             i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
             
             if (!milestones.current.summary && i > 50) {
                milestones.current.summary = true;
                setMeetingNotes({ summary: "Team mapped out secure checkout via API Gateway, Auth Service, and Redis.", takeaways: "• Interactions via API Gateway.\n• Validation in Auth Service.", decisions: "1. Use Redis for caching." });
                setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->Cache{Redis};");
                setActionItems([{ id: 1, text: "Configure API Gateway", done: false }]);
             }
             if (i >= fullTranscript.length) { clearInterval(typingRef.current); setTimeout(() => { finishProcessing(); }, 1500); }
           }, 40);
        }
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const processYoutube = (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    setProcessingType('youtube'); setFileName("Fetching YouTube Transcript..."); setStatus('uploading'); setUploadProgress(0); stopTriggeredRef.current = false;

    let progress = 0; if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100; clearInterval(uploadRef.current); setStatus('processing');
        let i = 0; if (typingRef.current) clearInterval(typingRef.current);
        milestones.current = { summary: false, takeaways: false, decisions: false, actions: false };
        typingRef.current = setInterval(() => {
          i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
          
          if (!milestones.current.summary && i > 50) {
              milestones.current.summary = true;
              setMeetingNotes({ summary: "AI extracted summary from YouTube video covering API Gateway, Auth Service, and Redis.", takeaways: "• Interactions via API Gateway.\n• Validation in Auth Service.", decisions: "1. Use Redis for caching." });
              setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->Cache{Redis};");
              setActionItems([{ id: 1, text: "Review video concepts", done: false }]);
          }
          if (i >= fullTranscript.length) { clearInterval(typingRef.current); setTimeout(() => { finishProcessing("YouTube Video Notes", null); setYoutubeUrl(''); }, 1500); }
        }, 40);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleContextDrop = (e) => {
    e.preventDefault(); setIsDraggingContext(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { setContextFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); showToast("Context File Attached!"); }
  };
  const removeContextFile = (index) => { setContextFiles(prev => prev.filter((_, i) => i !== index)); };

  const handleReset = () => {
    if (typingRef.current) clearInterval(typingRef.current); if (uploadRef.current) clearInterval(uploadRef.current); if (processingRef.current) clearTimeout(processingRef.current);
    stopTriggeredRef.current = false; setStatus('idle'); setTranscript(""); setTimer(0); timerRef.current = 0; setFileName(""); setUploadProgress(0); setIsExtensionActive(false); if (fileInputRef.current) fileInputRef.current.value = ""; setActiveTab('workspace'); setActionItems([]); setContextFiles([]);
  };

  const triggerRemix = (template) => {
    setShowRemixMenu(false); setActiveAiTemplate(template); setIsRemixing(true);
    setTimeout(() => { setIsRemixing(false); showToast(`Remixed into ${template.name}!`); setMeetingNotes(prev => ({...prev, summary: `[Remixed for ${template.name}]\n\n${prev.summary}`})); }, 2000);
  };

  return (
    <div className={`flex h-screen relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'text-slate-100 bg-[#0b0f19]' : 'text-slate-900 bg-[#f8fafc]'}`}>
      
      <ScrollbarStyles />
      <WorkspaceMeshBackground isDarkMode={isDarkMode} />

      <AnimatePresence>
        {toast && (
          <motion.div key="toast-notification" initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${isDarkMode ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-900 text-white border-slate-700'}`}>
            <Sparkles size={18} className={isDarkMode ? 'text-amber-500' : 'text-amber-400'} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside animate={{ width: isSidebarOpen ? 288 : 88 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`hidden md:flex flex-col z-20 relative overflow-hidden shrink-0 transition-colors shadow-[10px_0_30px_rgba(0,0,0,0.02)] ${isDarkMode ? 'bg-[#131722] border-r border-[#232a3b]' : 'bg-white/60 backdrop-blur-2xl border-r border-slate-200/50'}`}>
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-200/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0"><Mic className="text-white" size={20} /></div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && <motion.span key="sidebar-logo" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-2xl font-extrabold tracking-tight whitespace-nowrap">Spoly</motion.span>}
            </AnimatePresence>
          </div>
          {isSidebarOpen && <button onClick={() => setIsSidebarOpen(false)} className={`p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><ChevronLeft size={24}/></button>}
        </div>

        {!isSidebarOpen && (
           <div className="pt-4 flex justify-center"><button onClick={() => setIsSidebarOpen(true)} className={`p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}><Menu size={24}/></button></div>
        )}

        <div className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
          <button onClick={handleReset} className={`w-full flex items-center justify-center gap-3 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all mb-4 ${isSidebarOpen ? 'px-4' : 'px-0'}`} title="New Recording">
            <PlusCircle size={20} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">New Recording</span>}
          </button>
          
          {isSidebarOpen && <p className={`px-4 text-xs font-bold uppercase tracking-widest mt-6 mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Menu</p>}
          <nav className="space-y-2">
            {[
              { id: 'workspace', icon: LayoutDashboard, label: 'Workspace' },
              { id: 'notes', icon: FolderSearch, label: 'Saved Notes' },
              { id: 'templates', icon: Layers, label: 'Templates' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedNote(null); }} title={!isSidebarOpen ? item.label : ""} className={`w-full flex items-center gap-3 py-2.5 font-semibold rounded-xl transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center px-0'} ${activeTab === item.id && !selectedNote ? (isDarkMode ? 'bg-[#1a1f2e] text-white border border-[#232a3b] shadow-sm' : 'bg-blue-50/50 text-blue-700 border border-blue-100 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200 border border-transparent' : 'text-slate-600 hover:bg-slate-100 border border-transparent')}`}>
                <item.icon size={20} className="shrink-0" />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-6 border-t flex items-center ${isSidebarOpen ? 'gap-4' : 'justify-center'} ${isDarkMode ? 'border-[#232a3b] bg-transparent' : 'border-slate-200/50 bg-white/40'}`}>
          <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm shrink-0" } }} />
          {isSidebarOpen && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-bold truncate dark:text-white">{user?.firstName || "Engineer"}</span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pro Plan</span>
            </div>
          )}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto overflow-x-hidden min-w-0">
        
        <header className={`px-8 py-6 flex justify-between items-center border-b sticky top-0 z-30 transition-colors ${isDarkMode ? 'bg-[#0b0f19]/80 backdrop-blur-md border-[#232a3b]' : 'bg-white/30 backdrop-blur-md border-white/40'}`}>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">{selectedNote ? selectedNote.title : (activeTab === 'workspace' ? 'Active Workspace' : activeTab)}</h1>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedNote ? `Saved on ${selectedNote.date}` : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeTab === 'workspace' && status === 'idle' && (
            <div className="flex items-center gap-4">
              <div className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? 'bg-[#131722] border border-[#232a3b]' : 'bg-white border border-slate-200'}`}>
                <Languages size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
                <select 
                  value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)} 
                  className={`bg-transparent border-none focus:outline-none text-sm font-bold cursor-pointer outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>English</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Marathi</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Hindi</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Spanish</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>French</option>
                  <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>Japanese</option>
                </select>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800/50 text-emerald-400' : 'bg-emerald-100 border border-emerald-200 text-emerald-700'}`}>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Ready
              </div>
            </div>
          )}
          {selectedNote && (
            <button onClick={() => setSelectedNote(null)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'}`}>
              <ChevronLeft size={16}/> Back to Library
            </button>
          )}
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">

          <AnimatePresence>
            {activeTab === 'workspace' && activeAiTemplate && status === 'idle' && (
              <motion.div key="active-template" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-4 rounded-2xl flex items-center justify-between shadow-sm transition-colors border ${isDarkMode ? 'bg-[#1a1f2e] border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                <div className={`flex items-center gap-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  <div className={`p-2 rounded-xl shadow-sm border ${isDarkMode ? 'bg-[#131722] border-indigo-500/20' : 'bg-white border-indigo-100'}`}>{activeAiTemplate.icon}</div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>Active Template</p>
                    <p className="font-extrabold text-lg">{activeAiTemplate.name}</p>
                  </div>
                </div>
                <button onClick={() => { setActiveAiTemplate(null); showToast("Template cleared"); }} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-[#131722]' : 'text-indigo-400 hover:text-red-500 hover:bg-white'}`}><Trash2 size={20}/></button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            
            {activeTab === 'workspace' && !selectedNote && (
              <motion.div key="workspace-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                
                {/* IDLE OR UPLOADING STATE */}
                {(status === 'idle' || status === 'uploading') && (
                  <motion.div key="recording-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`shadow-xl rounded-2xl p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/70 backdrop-blur-xl border-white'}`}>
                    
                    {/* PREMIUM HEADER SECTION */}
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl shadow-sm border ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                          <Play size={24} className="animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold tracking-tight">Initialize Workspace</h2>
                          <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a data source to begin capturing intelligent notes.</p>
                        </div>
                      </div>
                    </div>

                    {status === 'idle' && (
                      <motion.div key="idle-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        
                        {/* 🚀 BOLD MESH & LAYERED BENTO BOX GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-6">
                          
                          {/* EXTENSION CARD */}
                          <button onClick={handleToggleWidget} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isWidgetDeployed ? (isDarkMode ? 'bg-red-950/20 border-red-900' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-indigo-600' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm')}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isWidgetDeployed ? (isDarkMode ? 'bg-[#0b0f19] border-red-900/50' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100')}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? 'bg-red-600/50 group-hover:bg-red-500/60' : 'bg-red-400/40 group-hover:bg-red-400/50') : (isDarkMode ? 'bg-purple-600/40 group-hover:bg-purple-500/50' : 'bg-purple-300/40 group-hover:bg-purple-300/50')}`}></div>
                               <div className={`absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? 'bg-orange-600/40' : 'bg-orange-400/40') : (isDarkMode ? 'bg-indigo-600/40 group-hover:bg-indigo-500/50' : 'bg-indigo-300/40 group-hover:bg-indigo-300/50')}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Workflow className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? 'text-red-500/25' : 'text-red-500/20') : (isDarkMode ? 'text-indigo-400/25' : 'text-indigo-500/20')}`} strokeWidth="2" />
                               <Sparkles className={`absolute left-8 bottom-2 w-14 h-14 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? 'text-orange-500/25' : 'text-orange-500/20') : (isDarkMode ? 'text-purple-400/25' : 'text-purple-500/20')}`} strokeWidth="2" />
                               
                               {/* Centered Premium Icon Block */}
                               <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isWidgetDeployed ? (isDarkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-white border-red-200 text-red-600') : (isDarkMode ? 'bg-[#131722] border-indigo-900/50 text-indigo-400' : 'bg-white border-slate-100 text-indigo-600')}`}>
                                  {isWidgetDeployed ? <X size={32}/> : <Puzzle size={32}/>}
                               </div>

                               {/* Active Status Badge */}
                               <div className="absolute top-4 right-4 z-10">
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm border ${isWidgetDeployed ? (isDarkMode ? 'bg-red-900/50 text-red-300 border-red-800' : 'bg-red-100 text-red-700 border-red-200') : (isDarkMode ? 'bg-[#1a1f2e] text-slate-400 border-[#232a3b]' : 'bg-white text-slate-500 border-slate-200')}`}>
                                    {isWidgetDeployed ? 'Active' : 'Widget'}
                                  </span>
                               </div>
                            </div>

                            {/* BOTTOM CONTENT */}
                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isWidgetDeployed ? (isDarkMode ? 'text-red-300' : 'text-red-900') : (isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-indigo-700')}`}>
                                {isWidgetDeployed ? 'Close Extension' : 'Web Record'}
                              </h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isWidgetDeployed ? (isDarkMode ? 'text-red-400/80' : 'text-red-700/80') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                                {isWidgetDeployed ? 'Hide the Spoly widget.' : 'Inject the Spoly bot into the screen to capture any Google Meet or web audio.'}
                              </p>

                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'bg-[#131722]' : 'bg-slate-50 shadow-sm'}`}>
                                 <ArrowRight size={14} className={isWidgetDeployed ? 'text-red-500' : (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')} />
                              </div>
                            </div>
                          </button>

                          {/* DEVICE AUDIO CARD */}
                          <button onClick={handleStartLocalRecording} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100'}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-blue-600/40 group-hover:bg-blue-500/50' : 'bg-blue-400/40 group-hover:bg-blue-400/50'}`}></div>
                               <div className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-cyan-600/40 group-hover:bg-cyan-500/50' : 'bg-cyan-300/40 group-hover:bg-cyan-300/50'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Headphones className={`absolute left-6 top-4 w-20 h-20 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-blue-400/25' : 'text-blue-500/20'}`} strokeWidth="2" />
                               <Activity className={`absolute right-8 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-cyan-400/25' : 'text-cyan-500/20'}`} strokeWidth="2" />
                               
                               <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? 'bg-[#131722] border-blue-900/50 text-blue-400' : 'bg-white border-slate-100 text-blue-600'}`}>
                                  <Mic size={32}/>
                               </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-700'}`}>
                                Device Audio
                              </h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Capture an in-person meeting, lecture, or conversation directly through your microphone.
                              </p>

                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'bg-[#131722]' : 'bg-slate-50 shadow-sm'}`}>
                                 <ArrowRight size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                              </div>
                            </div>
                          </button>

                          {/* UPLOAD FILE CARD */}
                          <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] ${isDragging ? (isDarkMode ? 'border-emerald-400 bg-emerald-900/20' : 'border-emerald-400 bg-emerald-50') : (isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50' : 'bg-white border-slate-300 hover:border-emerald-400 shadow-sm')}`}>
                            <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); }} accept="audio/*,video/*,image/*" className="hidden" />
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-100/50 border-emerald-200') : (isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100')}`}>
                               
                               {/* Rich Mesh Gradient Glows */}
                               <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-emerald-600/40 group-hover:bg-emerald-500/50' : 'bg-emerald-400/40 group-hover:bg-emerald-300/50'}`}></div>
                               <div className={`absolute bottom-0 left-10 w-24 h-24 blur-2xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-teal-600/30 group-hover:bg-teal-500/40' : 'bg-teal-300/30 group-hover:bg-teal-300/40'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Database className={`absolute left-8 top-4 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-emerald-400/25' : 'text-emerald-500/20'}`} strokeWidth="2" />
                               <Layers className={`absolute right-10 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-teal-400/25' : 'text-teal-500/20'}`} strokeWidth="2" />
                               
                               <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? 'bg-[#131722] border-emerald-800 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-600') : (isDarkMode ? 'bg-[#131722] border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-600')}`}>
                                  <ImagePlus size={32} className={isDragging ? 'animate-bounce' : ''}/>
                               </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                                {isDragging ? 'Drop File Here' : 'Upload File'}
                              </h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Post-process an existing audio recording or image of a whiteboard.
                              </p>

                              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'bg-[#131722]' : 'bg-slate-50 shadow-sm'}`}>
                                 <ArrowRight size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                              </div>
                            </div>
                          </div>

                          {/* YOUTUBE LINK CARD */}
                          <div className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-300 shadow-sm'}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100'}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute top-0 right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-red-600/40 group-hover:bg-red-500/50' : 'bg-red-400/40 group-hover:bg-red-300/50'}`}></div>
                               <div className={`absolute -bottom-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-orange-600/30 group-hover:bg-orange-500/40' : 'bg-orange-300/30 group-hover:bg-orange-300/40'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <PlayCircle className={`absolute left-8 top-6 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-red-400/25' : 'text-red-500/20'}`} strokeWidth="2" />
                               <Video className={`absolute right-6 bottom-2 w-20 h-20 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-orange-400/25' : 'text-orange-500/20'}`} strokeWidth="2" />

                               <div className={`relative z-10 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? 'bg-[#131722] border-red-900/50 text-red-400' : 'bg-white border-slate-100 text-red-600'}`}>
                                  <Youtube size={32}/>
                               </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col w-full relative">
                              <h3 className={`text-xl font-bold mb-3 transition-colors ${isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-800 group-hover:text-red-600'}`}>
                                YouTube Link
                              </h3>
                              <form onSubmit={processYoutube} className="w-full relative mt-auto group/form">
                                 <input 
                                    type="text" 
                                    placeholder="Paste video URL here..." 
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    className={`w-full text-sm pl-4 pr-12 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-white placeholder-slate-500 group-hover/form:border-red-500/50' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 group-hover/form:border-red-300'}`}
                                 />
                                 <button type="submit" className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${youtubeUrl ? 'bg-red-500 text-white hover:bg-red-600 shadow-md' : (isDarkMode ? 'text-slate-600 bg-transparent' : 'text-slate-400 bg-transparent')}`}>
                                   <ArrowRight size={16}/>
                                 </button>
                              </form>
                            </div>
                          </div>

                        </div>

                        {/* 🚀 CONTEXT FILES RAG UPLOAD (Full Width Bottom) */}
                        <div className={`group rounded-2xl p-6 transition-colors border relative overflow-hidden ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                          
                          {/* Rich Mesh Gradient Glows for Context Area - BOLDER */}
                          <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? 'bg-indigo-600/20 group-hover:bg-indigo-500/30' : 'bg-indigo-300/30 group-hover:bg-indigo-300/40'}`}></div>

                          {/* BOLD Floating Decor Icons */}
                          <FolderSearch className={`absolute right-10 top-2 w-32 h-32 transform rotate-12 transition-all duration-700 pointer-events-none ${isDarkMode ? 'text-indigo-400 opacity-20' : 'text-indigo-500 opacity-15'}`} strokeWidth="1.5" />

                          <div className="relative z-10">
                            <div className={`flex items-center gap-2 mb-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                              <FileUp size={20} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}/> Add Pre-Context Documents (Optional)
                            </div>
                            <p className={`text-sm mb-4 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Upload a Syllabus, PRD, or past notes so the AI understands specific terminology before generating the diagram.</p>
                            
                            <div 
                              onDragOver={(e) => { e.preventDefault(); setIsDraggingContext(true); }} 
                              onDragLeave={(e) => { e.preventDefault(); setIsDraggingContext(false); }} 
                              onDrop={handleContextDrop} 
                              onClick={() => contextInputRef.current.click()}
                              className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDraggingContext ? (isDarkMode ? 'border-indigo-500 bg-indigo-900/20' : 'border-indigo-500 bg-indigo-50') : (isDarkMode ? 'border-[#232a3b] bg-[#131722] hover:bg-[#0b0f19]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100')}`}
                            >
                              <input type="file" multiple ref={contextInputRef} onChange={(e) => { if(e.target.files.length) { setContextFiles(prev => [...prev, ...Array.from(e.target.files)]); showToast("Context Attached!");} }} className="hidden" />
                              <span className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}><UploadCloud size={16}/> Drag & Drop PDFs/Docs here</span>
                            </div>

                            {contextFiles.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {contextFiles.map((file, idx) => (
                                  <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800/50' : 'bg-indigo-100 text-indigo-700 border-indigo-100'}`}>
                                    <FileText size={14}/> {file.name}
                                    <button onClick={(e) => { e.stopPropagation(); removeContextFile(idx); }} className="hover:text-red-500 ml-1"><X size={14}/></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {status === 'uploading' && (
                      <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-6 w-full max-w-lg mx-auto">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${
                           processingType === 'youtube' 
                             ? (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600')
                             : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')
                        }`}>
                           {processingType === 'image' ? <ImageIcon size={28}/> : (processingType === 'youtube' ? <Youtube size={28} /> : <FileAudio size={28} />)}
                        </div>
                        <div className="text-center w-full">
                          <p className="font-bold text-lg mb-1 truncate px-4">{fileName}</p>
                          <p className={`font-medium text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                             {processingType === 'youtube' ? 'Fetching Transcript from YouTube...' : 'Uploading to Spoly Servers...'}
                          </p>
                          <div className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                            <motion.div className={`h-full ${processingType === 'youtube' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear" }} />
                          </div>
                          <p className={`text-right text-xs font-bold mt-2 ${processingType === 'youtube' ? (isDarkMode ? 'text-red-400' : 'text-red-600') : (isDarkMode ? 'text-blue-400' : 'text-blue-600')}`}>{Math.floor(uploadProgress)}%</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* 🚀 TRUE REAL-TIME LIVE UI WITH FIXES */}
                {(status === 'recording' || status === 'processing' || status === 'paused') && (
                  <motion.div key="live-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-12 gap-8 h-[75vh]">
                    
                    {/* LEFT PANEL: RECORDING HUD */}
                    <div className="xl:col-span-4 flex flex-col h-full gap-6">
                       
                       {/* Top HUD: Timer & Waveform */}
                       <div className={`rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-sm border ${isDarkMode ? 'bg-[#0E1116] border-[#2A2F3D]' : 'bg-white border-slate-200'}`}>
                          
                          <div className="flex flex-col items-center justify-center py-4 relative z-10">
                             <div className="flex items-center gap-2 mb-3">
                               <span className={`w-2.5 h-2.5 rounded-full ${status === 'paused' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></span>
                               <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                 {isExtensionActive ? "Extension Tab" : "Device Mic"}
                                 {status === 'paused' && " (Paused)"}
                               </span>
                             </div>
                             <h2 className={`font-mono text-5xl font-black tracking-tight mb-6 ${status === 'paused' ? 'text-amber-500' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                               {formatTime(timer)}
                             </h2>
                             <div className="bg-slate-50 dark:bg-[#131722] py-4 px-8 rounded-2xl border border-slate-100 dark:border-[#2A2F3D] shadow-inner">
                               <AudioWaveform isRecording={status === 'recording'} color={status === 'paused' ? 'bg-amber-500' : 'bg-blue-500'} />
                             </div>
                          </div>
                       </div>

                       {/* Bottom HUD: Live Transcript Scroll Box */}
                       <div className={`flex-1 rounded-2xl flex flex-col overflow-hidden shadow-sm border ${isDarkMode ? 'bg-[#131722] border-[#2A2F3D]' : 'bg-white border-slate-200'}`}>
                          {/* Static Header separated from scroll */}
                          <div className={`p-4 px-6 border-b flex items-center gap-2 font-bold text-xs uppercase tracking-widest z-10 ${isDarkMode ? 'bg-[#0E1116]/80 border-[#2A2F3D] text-slate-400' : 'bg-slate-50/80 border-slate-100 text-slate-500'}`}>
                            <List size={14}/> Live Transcript
                          </div>
                          {/* Scrolling Text area */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                            <p className={`font-sans font-medium leading-relaxed text-sm pr-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {transcript}
                              {status === 'recording' && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle rounded-sm"></span>}
                            </p>
                          </div>
                       </div>

                       {/* LOCAL RECORDING CONTROLS */}
                       {(!isExtensionActive && (status === 'recording' || status === 'paused')) && (
                          <div className="flex flex-col lg:flex-row justify-center gap-3">
                            <button onClick={toggleLocalPause} className={`px-6 py-4 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] flex-1 border ${status === 'paused' ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' : (isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-white border-[#2A2F3D]' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200')}`}>
                              {status === 'paused' ? <PlayCircle size={18} /> : <PauseCircle size={18} />} 
                              {status === 'paused' ? 'Resume' : 'Pause'}
                            </button>
                            <button onClick={handleStopLocalRecording} className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] flex-1 border border-red-600">
                              <Square size={18} fill="currentColor" /> Save Notes
                            </button>
                          </div>
                       )}
                       
                       {isExtensionActive && (status === 'recording' || status === 'paused') && (
                          <div className={`flex justify-center p-4 rounded-xl font-bold text-sm text-center border ${isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                             Use the floating Spoly Widget to control recording.
                          </div>
                       )}
                    </div>

                    {/* RIGHT PANEL */}
                    <div className={`xl:col-span-8 shadow-sm rounded-2xl p-8 flex flex-col relative transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#2A2F3D]' : 'bg-white border-slate-200'}`}>
                      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDarkMode ? 'border-[#2A2F3D]' : 'border-slate-100'}`}>
                        <Zap size={24} className={status === 'recording' ? "animate-pulse text-blue-500" : (status === 'paused' ? "text-amber-500 opacity-50" : "text-emerald-500")} />
                        <h3 className="font-bold text-xl">
                          {status === 'recording' ? "AI is actively generating notes..." : (status === 'paused' ? "AI generation paused..." : "Finalizing Smart Document...")}
                        </h3>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                         <div className="space-y-2">
                           <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><AlignLeft size={16}/> Summary</div>
                           <p className={`p-5 rounded-xl text-sm leading-relaxed border shadow-inner min-h-[100px] ${isDarkMode ? 'text-slate-300 bg-[#0b0f19] border-[#2A2F3D]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                             {meetingNotes.summary || <span className={isDarkMode ? 'text-slate-600 italic' : 'text-slate-400 italic'}>Listening for context...</span>}
                           </p>
                         </div>

                         <div className="space-y-2">
                           <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><List size={16}/> Extracting Takeaways</div>
                           <div className={`p-5 rounded-xl text-sm leading-relaxed border shadow-inner whitespace-pre-wrap min-h-[100px] ${isDarkMode ? 'text-slate-300 bg-[#0b0f19] border-[#2A2F3D]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                             {meetingNotes.takeaways || <span className={isDarkMode ? 'text-slate-600 italic' : 'text-slate-400 italic'}>Waiting for key points...</span>}
                           </div>
                         </div>

                         {actionItems.length > 0 && (
                           <div className="space-y-2">
                             <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}><ListChecks size={16}/> Action Items Detected!</div>
                             <ul className="space-y-2">
                               {actionItems.map(item => (
                                 <li key={item.id} onClick={() => toggleActionItem(item.id)} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${item.done ? (isDarkMode ? 'bg-[#0b0f19] border-[#2A2F3D] opacity-50' : 'bg-slate-50 border-slate-200 opacity-60') : (isDarkMode ? 'bg-[#1a1f2e] border-[#2A2F3D] hover:border-emerald-500/50' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300')}`}>
                                   <div className="mt-0.5">{item.done ? <CheckCircle size={18} className={isDarkMode ? 'text-emerald-500' : 'text-emerald-500'}/> : <Circle size={18} className={`group-hover:text-emerald-500 transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}/>}</div>
                                   <span className={`font-medium text-sm transition-all ${item.done ? 'line-through text-slate-500' : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>{item.text}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}
                      </div>
                    </div>

                  </motion.div>
                )}
                  
                {status === 'complete' && (
                  <motion.div key="success-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-visible mb-8 bg-gradient-to-r ${isDarkMode ? 'from-emerald-600 to-teal-600' : 'from-emerald-500 to-teal-500'}`}>
                    {isRemixing && (
                      <div className={`absolute inset-0 z-10 backdrop-blur-md rounded-2xl flex items-center justify-center gap-3 font-bold text-lg ${isDarkMode ? 'bg-emerald-700/90' : 'bg-emerald-600/90'}`}>
                        <RefreshCw className="animate-spin text-white" size={24}/> Re-processing via Gemini...
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl shadow-inner"><CheckCircle2 size={32} /></div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                          {activeAiTemplate ? activeAiTemplate.name : "Smart Document"} Generated
                        </h2>
                        <p className="text-emerald-50 font-medium">Output Language: {outputLanguage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <div className="relative">
                        <button onClick={() => setShowRemixMenu(!showRemixMenu)} className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold transition-all shadow-inner border ${isDarkMode ? 'bg-emerald-800 hover:bg-emerald-900 border-emerald-700' : 'bg-emerald-700 hover:bg-emerald-800 border-emerald-600'}`}>
                          <RefreshCw size={16}/> Remix Format
                        </button>
                        <AnimatePresence>
                          {showRemixMenu && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute top-full right-0 mt-2 w-64 border rounded-2xl shadow-2xl overflow-hidden z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                              <div className={`p-3 border-b text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>Change Template</div>
                              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {templatesDB.map(t => (
                                  <button key={t.id} onClick={() => triggerRemix(t)} className={`w-full text-left px-4 py-3 border-b last:border-0 flex items-center gap-3 text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-slate-700 border-slate-700 text-slate-200' : 'hover:bg-slate-50 border-slate-100 text-slate-700'}`}>
                                    <span className={getTheme(t.theme, isDarkMode).text}>{t.icon}</span> {t.name}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button onClick={handleReset} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md w-full md:w-auto hover:scale-105 border ${isDarkMode ? 'bg-slate-900 text-emerald-400 hover:bg-slate-800 border-emerald-800' : 'bg-white text-emerald-600 hover:bg-emerald-50 border-transparent'}`}><PlusCircle size={18}/> New Session</button>
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* 🚀 SAVED NOTES TAB (DOCKET DESIGN) */}
            {activeTab === 'notes' && !selectedNote && (
              <motion.div key="notes-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                   <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Library</h2>
                   <div className="relative w-full md:w-72 flex items-center">
                     <Search className="absolute left-3 text-slate-400 z-10" size={18}/>
                     <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'}`} />
                   </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {savedNotes?.filter(n => n?.title?.toLowerCase().includes(searchQuery?.toLowerCase())).map(note => (
                     <div key={note.id} onClick={() => setSelectedNote(note)} className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[220px] p-6 ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}>
                        
                        {/* Custom Data Wave Background */}
                        <svg className={`absolute bottom-0 right-0 w-3/4 h-3/4 transition-transform duration-700 group-hover:scale-110 opacity-40 dark:opacity-50 ${isDarkMode ? 'text-blue-500/20' : 'text-blue-500/10'}`} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
                           <path d="M50 200 Q 100 100 200 50" />
                           <path d="M100 200 Q 150 150 200 100" opacity="0.6"/>
                           <path d="M150 200 Q 175 175 200 150" opacity="0.3"/>
                           <circle cx="200" cy="50" r="4" fill="currentColor"/>
                           <circle cx="200" cy="100" r="3" fill="currentColor" opacity="0.6"/>
                        </svg>

                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-blue-600/30 group-hover:bg-blue-500/40' : 'bg-blue-300/30 group-hover:bg-blue-300/40'}`}></div>
                        
                        <div className="flex justify-between items-start mb-auto relative z-10">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-[#131722] text-blue-400 border-[#232a3b]' : 'bg-blue-50 text-blue-600 border-blue-100'}`}><FileText size={20}/></div>
                           <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 uppercase tracking-widest border ${isDarkMode ? 'text-slate-400 bg-[#131722] border-[#232a3b]' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                             <Calendar size={10} className="mb-[1px]"/> {note.date}
                           </span>
                        </div>

                        <div className="relative z-10 w-full mt-6">
                           <h3 className={`text-xl font-bold mb-3 leading-tight transition-colors pr-4 ${isDarkMode ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-700'}`}>{note.title}</h3>
                           
                           <div className="flex gap-2 mb-4 flex-wrap">
                             {note.audioUrl && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? 'text-purple-300 bg-purple-900/30 border-purple-800/50' : 'text-purple-600 bg-purple-50 border-purple-200'}`}><Headphones size={10}/> Audio</span>}
                             {note.tags?.map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? 'text-slate-400 bg-[#131722] border-[#232a3b]' : 'text-slate-500 bg-slate-50 border-slate-200'}`}><Tag size={10}/> {tag}</span>)}
                           </div>

                           <div className={`flex items-center justify-between text-sm font-medium mt-auto border-t pt-4 ${isDarkMode ? 'text-slate-500 border-[#232a3b]' : 'text-slate-500 border-slate-100'}`}>
                              <div className="flex gap-4">
                                 <span className="flex items-center gap-1.5"><Clock size={14}/> {note.duration}</span>
                                 <span className="flex items-center gap-1.5"><CheckCircle2 size={14}/> {note.items} Tasks</span>
                              </div>
                           </div>

                           <div className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'bg-[#131722] shadow-md' : 'bg-white shadow-sm border border-slate-100'}`}>
                              <ArrowRight size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </motion.div>
            )}

            {/* 🚀 FULL SCREEN NOTE VIEWER */}
            {selectedNote && (
               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  {selectedNote.audioUrl && (
                    <div className={`text-white rounded-2xl p-6 shadow-xl flex items-center gap-6 border ${isDarkMode ? 'bg-[#1e2025] border-[#232a3b]' : 'bg-slate-900 border-transparent'}`}>
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"><Headphones size={24}/></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">Original Audio Recording</h4>
                        <audio controls className="w-full max-w-xl outline-none" src={selectedNote.audioUrl}>Your browser does not support the audio element.</audio>
                      </div>
                    </div>
                  )}

                  <div className="grid xl:grid-cols-2 gap-8">
                    <div className={`shadow-lg rounded-2xl p-8 border ${isDarkMode ? 'bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                      <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-100'}`}>
                        <h3 className={`font-bold text-xl flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}><AlignLeft size={20}/> AI Summary & Notes</h3>
                        <button onClick={() => { 
                           const textToCopy = exportFormat === 'markdown' 
                             ? `## Summary\n${selectedNote.summary}\n\n## Takeaways\n${selectedNote.takeaways}\n\n## Decisions\n${selectedNote.decisions}`
                             : `${selectedNote.summary}\n\n${selectedNote.takeaways}\n\n${selectedNote.decisions}`;
                           navigator.clipboard.writeText(textToCopy); 
                           showToast("Notes copied to clipboard!"); 
                        }} className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs transition-colors border ${isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300 border-[#232a3b]' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}><Copy size={12}/> Copy All</button>
                      </div>
                      <div className="space-y-6">
                        <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Executive Summary</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.summary}</p></div>
                        <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Key Takeaways</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.takeaways}</p></div>
                        {selectedNote.decisions && <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Decisions</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.decisions}</p></div>}
                      </div>
                    </div>

                    {selectedNote.graph && (
                      <div className={`shadow-lg rounded-2xl p-8 flex flex-col border ${isDarkMode ? 'bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                        <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-100'}`}>
                          <h3 className={`font-bold text-xl flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}><Workflow size={20}/> Extracted Diagram</h3>
                          <button onClick={() => { navigator.clipboard.writeText(selectedNote.graph); showToast("Mermaid code copied!"); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs transition-colors border ${isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300 border-[#232a3b]' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}><Code size={12}/> Copy Code</button>
                        </div>
                        <div className={`flex-1 w-full shadow-inner rounded-2xl flex items-center justify-center p-8 min-h-[400px] border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                           <MermaidDiagram chart={selectedNote.graph} />
                        </div>
                      </div>
                    )}
                  </div>
               </motion.div>
            )}

            {/* 🚀 TEMPLATES TAB (CUSTOM GEOMETRIC SVG DESIGNS) */}
            {activeTab === 'templates' && (
              <motion.div key="templates-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="mb-8 flex justify-between items-end">
                   <div>
                     <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Output Templates</h2>
                     <p className={`font-medium text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a template before recording to format the diagram style.</p>
                   </div>
                 </div>
                 
                 {/* 🚀 FIXED: TIGHTER, NICER SEGMENTED CONTROL / CHIP DESIGN */}
                 <div className="flex flex-wrap gap-2 mb-6">
                    {templateCategories.map(cat => (
                      <button 
                         key={cat} 
                         onClick={() => setTemplateFilter(cat)} 
                         className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border shrink-0 ${templateFilter === cat ? (isDarkMode ? 'bg-slate-200 text-slate-900 border-transparent shadow-sm' : 'bg-slate-800 text-white border-transparent shadow-sm') : (isDarkMode ? 'bg-[#1e2025] text-slate-300 border-[#232a3b] hover:bg-[#131722]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}
                      >
                         {cat}
                      </button>
                    ))}
                 </div>

                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   <AnimatePresence>
                     {templatesDB.filter(t => templateFilter === 'All' || t.category === templateFilter).map((temp) => (
                       <motion.div 
                         key={temp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                         onClick={() => { setActiveAiTemplate(temp); setActiveTab('workspace'); showToast(`Template Set: ${temp.name}`); }} 
                         className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[240px] p-6 ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] shadow-sm' : 'bg-white border-slate-200 shadow-sm'} ${getTheme(temp.theme, isDarkMode).hover}`}
                       >
                          {/* Top Glow Accent Bar */}
                          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getTheme(temp.theme, isDarkMode)?.accent || 'from-blue-500'}`}></div>

                          {/* Dynamic Unique Background Vector Injection */}
                          {getTemplateBackground(temp.id, getTheme(temp.theme, isDarkMode)?.text || 'text-blue-500')}

                          <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 opacity-30 group-hover:opacity-50 ${getTheme(temp.theme, isDarkMode)?.glow1 || 'bg-blue-500/20'}`}></div>
                          
                          <div className="relative z-10 flex items-start justify-between mb-auto">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border backdrop-blur-sm ${getTheme(temp.theme, isDarkMode)?.iconBg || 'bg-blue-50 border-blue-200'}`}>
                               {temp.icon ? React.cloneElement(temp.icon, { size: 28 }) : null}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${isDarkMode ? 'text-slate-400 bg-[#13151a]/80 backdrop-blur-md border-[#232a3b]' : 'text-slate-500 bg-white/80 backdrop-blur-md border-slate-200'}`}>
                               {temp.category}
                            </span>
                          </div>

                          <div className="relative z-10 w-full mt-6">
                            <h3 className={`text-xl font-bold mb-2 transition-colors pr-4 ${isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{temp.name}</h3>
                            <p className={`text-sm font-medium leading-relaxed mb-6 flex-1 pr-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{temp.desc}</p>
                            
                            <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'bg-[#131722] shadow-md' : 'bg-slate-50 shadow-sm border border-slate-100'}`}>
                               <ArrowRight size={14} className={getTheme(temp.theme, isDarkMode)?.text || 'text-blue-500'} />
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
              <SettingsView 
                user={user}
                settingsToggles={settingsToggles}
                setSettingsToggles={setSettingsToggles}
                showToast={showToast}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
                selectedMic={selectedMic}
                setSelectedMic={setSelectedMic}
                audioConstraints={audioConstraints}
                setAudioConstraints={setAudioConstraints}
              />
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}