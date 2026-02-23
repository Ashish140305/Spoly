
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
  Activity, Video
} from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';
import SettingsView from '../components/SettingsView'; 

const WorkspaceMeshBackground = ({ isDarkMode }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500">
    <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'}`}></div>
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 45, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[100px] will-change-transform transform-gpu ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-200/30'}`} />
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] will-change-transform transform-gpu ${isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-200/20'}`} />
  </div>
);

const AudioWaveform = ({ isRecording, color = "bg-blue-500" }) => (
  <div className="flex items-center gap-1.5 h-8">
    {[...Array(5)].map((_, i) => (
      <motion.div key={`wave-${i}`} animate={isRecording ? { height: ["20%", "100%", "30%", "80%", "20%"] } : { height: "15%" }} transition={isRecording ? { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }} className={`w-1.5 ${color} rounded-full`} />
    ))}
  </div>
);

const EditableSection = ({ icon: Icon, title, value, onChange, isDarkMode }) => {
  const textareaRef = useRef(null);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [value]);
  return (
    <div className={`group relative border rounded-2xl p-4 -mx-4 transition-colors ${isDarkMode ? 'border-transparent hover:border-slate-800 hover:bg-[#131722]' : 'border-transparent hover:border-blue-100 hover:bg-blue-50/30'}`}>
      <div className={`flex items-center gap-2 mb-2 font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}><Icon size={18} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} /><h4 className="text-md">{title}</h4></div>
      <textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-transparent leading-relaxed font-medium focus:outline-none focus:ring-0 resize-none overflow-hidden ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} spellCheck="false" />
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${isDarkMode ? 'text-indigo-300 bg-indigo-900/40' : 'text-blue-400 bg-blue-100'}`}>Editable</span></div>
    </div>
  );
};

export default function LiveNotes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('workspace'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null); 

  // 🚀 GLOBAL SETTINGS STATES
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
    document.documentElement.classList.remove('dark'); 
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
  
  const [showCode, setShowCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState('All');
  
  const fullTranscript = "Alright, let's map out the new checkout flow. The user starts on the frontend client. They hit the API Gateway. The Gateway routes to the Auth Service to validate the session. If valid, the Auth Service checks the Postgres Database, and also caches the active session into Redis. Finally, we return the secure token back to the client. We need to make sure the Redis cache has a TTL of 15 minutes to avoid stale sessions. Action item for John to configure the API Gateway routing rules by tomorrow. Sarah, you'll handle the Redis caching logic. Let's make sure the token return is encrypted. Also, ensure logging is pushed to Datadog for observability.";
  
  const [meetingNotes, setMeetingNotes] = useState({ summary: "", takeaways: "", decisions: "" });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [editableMermaid, setEditableMermaid] = useState("graph TD;\n  Client-->API_Gateway;");
  const [actionItems, setActionItems] = useState([]);

  const [savedNotes, setSavedNotes] = useState([
    { 
      id: 1, title: "Sprint Planning: Q3 Authentication", date: "Feb 12, 2026", duration: "45:20", items: 4, tags: ["Engineering", "English"],
      summary: "The team mapped out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, Auth Service, Postgres, and Redis caching layers.",
      takeaways: "• Frontend interactions are secured via API Gateway.\n• Auth Service acts as the central validation hub.\n• Session states will be cached in Redis for high-speed retrieval.\n• PostgreSQL remains the persistent source of truth for user data.",
      decisions: "1. Use Redis over Memcached for session caching.\n2. Secure tokens will be passed back directly to the client after DB verification.",
      graph: "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;",
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
    { id: 8, name: "Microservices", category: "Engineering", desc: "Map out decoupled services, gateways, and architecture.", icon: <Workflow size={24}/>, theme: "blue" },
    { id: 9, name: "Database ERD", category: "Engineering", desc: "Auto-generate Entity-Relationship diagrams from context.", icon: <Database size={24}/>, theme: "emerald" },
  ];
  const templateCategories = ['All', 'General', 'Education', 'Business', 'Engineering'];

  const getTheme = (theme, dark) => {
    const themes = {
      blue: dark ? { iconBg: "bg-slate-800 text-blue-400 border-slate-700", hover: "hover:border-blue-500", text: "text-blue-400", glow: "from-blue-900/20" } : { iconBg: "bg-blue-50 text-blue-600 border-blue-100", hover: "hover:border-blue-400", text: "text-blue-600", glow: "from-blue-100/50" },
      purple: dark ? { iconBg: "bg-slate-800 text-purple-400 border-slate-700", hover: "hover:border-purple-500", text: "text-purple-400", glow: "from-purple-900/20" } : { iconBg: "bg-purple-50 text-purple-600 border-purple-100", hover: "hover:border-purple-400", text: "text-purple-600", glow: "from-purple-100/50" },
      emerald: dark ? { iconBg: "bg-slate-800 text-emerald-400 border-slate-700", hover: "hover:border-emerald-500", text: "text-emerald-400", glow: "from-emerald-900/20" } : { iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", hover: "hover:border-emerald-400", text: "text-emerald-600", glow: "from-emerald-100/50" },
      amber: dark ? { iconBg: "bg-slate-800 text-amber-400 border-slate-700", hover: "hover:border-amber-500", text: "text-amber-400", glow: "from-amber-900/20" } : { iconBg: "bg-amber-50 text-amber-600 border-amber-100", hover: "hover:border-amber-400", text: "text-amber-600", glow: "from-amber-100/50" },
    };
    return themes[theme];
  };

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autoStart') === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname); 
      setTimeout(() => { setShouldAutoStart(true); }, 1000); 
    }
  }, []);

  useEffect(() => { if (shouldAutoStart && status === 'idle') { setShouldAutoStart(false); forceStartSimulation(); } }, [shouldAutoStart, status]);

  useEffect(() => {
    setTimeout(() => { setIsWidgetDeployed(!!document.getElementById('spoly-fab-root')); }, 1000);
    
    const handleExtensionMessage = (event) => {
      if (event.data.type === 'SPOLY_WIDGET_STATUS') setIsWidgetDeployed(event.data.status);
      else if (event.data.type === 'SPOLY_RECORDING_STARTED' || event.data.type === 'SPOLY_HEARTBEAT_LIVE') { 
        if (status === 'idle' && !stopTriggeredRef.current) setShouldAutoStart(true); 
      }
      else if (event.data.type === 'INTERNAL_SYNC_UI') {
        if (isExtensionActive) {
          if (event.data.isPaused && status === 'recording') {
            setStatus('paused'); clearInterval(typingRef.current);
          } else if (!event.data.isPaused && status === 'paused') {
            setStatus('recording'); typingRef.current = setInterval(runSimulationTick, 100);
          }
        }
      }
      else if (event.data.type === 'SPOLY_RECORDING_STOPPED' || event.data.type === 'SPOLY_UPLOAD_COMPLETE') {
        if ((status === 'recording' || status === 'paused') && isExtensionActive) {
          showToast(event.data.type === 'SPOLY_UPLOAD_COMPLETE' ? "Audio synced from extension!" : "Recording stopped locally.");
          stopTriggeredRef.current = true; setIsExtensionActive(false);
          if (event.data.audioUrl) setCurrentAudioUrl(event.data.audioUrl);
          if (typingRef.current) clearInterval(typingRef.current); if (processingRef.current) clearTimeout(processingRef.current); 
          finishProcessing("Live Chrome Extension Session", event.data.audioUrl);
        }
      }
    };
    
    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [status, isExtensionActive]); 

  useEffect(() => {
    let interval;
    if (status === 'recording') { interval = setInterval(() => { setTimer((prev) => { timerRef.current = prev + 1; return prev + 1; }); }, 1000); } 
    else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; };

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

    if (i > 80 && i < 85) {
      setMeetingNotes(prev => ({...prev, summary: "The team is mapping out the secure checkout authentication flow, detailing the precise interaction between the Client, API Gateway, and Auth Service."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;");
    }
    if (i > 200 && i < 205) {
      setMeetingNotes(prev => ({...prev, takeaways: "• Frontend interactions are secured via API Gateway.\n• Auth Service validates sessions against Postgres DB."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];");
    }
    if (i > 300 && i < 305) {
      setMeetingNotes(prev => ({...prev, decisions: "1. Cache active sessions into Redis to ensure high-speed retrieval and token passing."}));
      setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;");
    }
    if (i > 400 && i < 405) {
      setActionItems([{ id: 1, text: "Configure API Gateway routing rules (Assigned: John)", done: false }, { id: 2, text: "Setup Redis session caching logic (Assigned: Sarah)", done: false }]);
    }
  };

  const forceStartSimulation = () => {
    if (status === 'recording' || status === 'processing' || status === 'paused') return;
    setActiveTab('workspace'); setIsExtensionActive(true); setStatus('recording'); stopTriggeredRef.current = false; setProcessingType('audio');
    setTranscript(""); setTimer(0); timerRef.current = 0; simulationIndex.current = 0; setShowCode(false);
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null); 
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
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" }); setActionItems([]); setEditableMermaid("graph TD;\n  Client-->API_Gateway;"); setCurrentAudioUrl(null);

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
      if (localMediaRecorderRef.current && localMediaRecorderRef.current.state === 'recording') localMediaRecorderRef.current.pause();
      setStatus('paused'); clearInterval(typingRef.current);
    } else if (status === 'paused') {
      if (localMediaRecorderRef.current && localMediaRecorderRef.current.state === 'paused') localMediaRecorderRef.current.resume();
      setStatus('recording'); typingRef.current = setInterval(runSimulationTick, 100);
    }
  };
  
  const handleStopLocalRecording = () => {
    if (stopTriggeredRef.current) return; 
    stopTriggeredRef.current = true; if (typingRef.current) clearInterval(typingRef.current); setStatus('processing'); 
    if (localMediaRecorderRef.current && localMediaRecorderRef.current.state !== 'inactive') { localMediaRecorderRef.current.stop(); } 
    else { if (processingRef.current) clearTimeout(processingRef.current); processingRef.current = setTimeout(() => { finishProcessing("Live Classroom Capture"); }, 2000); }
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
        if (isImage) { processingRef.current = setTimeout(() => { finishProcessing(); }, 3000); } 
        else {
           let i = 0; if (typingRef.current) clearInterval(typingRef.current);
           typingRef.current = setInterval(() => {
             i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
             setMeetingNotes({ summary: "Team mapped out secure checkout via API Gateway, Auth Service, and Redis.", takeaways: "• Interactions via API Gateway.\n• Validation in Auth Service.", decisions: "1. Use Redis for caching." });
             setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->Cache{Redis};");
             if (actionItems.length === 0) setActionItems([{ id: 1, text: "Configure API Gateway", done: false }]);
             if (i >= fullTranscript.length) { clearInterval(typingRef.current); processingRef.current = setTimeout(() => { finishProcessing(); }, 1500); }
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
        typingRef.current = setInterval(() => {
          i += Math.floor(Math.random() * 20) + 15; setTranscript(fullTranscript.slice(0, i));
          setMeetingNotes({ summary: "AI extracted summary from YouTube video covering API Gateway, Auth Service, and Redis.", takeaways: "• Interactions via API Gateway.\n• Validation in Auth Service.", decisions: "1. Use Redis for caching." });
          setEditableMermaid("graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->Cache{Redis};");
          if (actionItems.length === 0) setActionItems([{ id: 1, text: "Review video concepts", done: false }]);
          if (i >= fullTranscript.length) { clearInterval(typingRef.current); processingRef.current = setTimeout(() => { finishProcessing("YouTube Video Notes", null); setYoutubeUrl(''); }, 1500); }
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
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedNote(null); }} title={!isSidebarOpen ? item.label : ""} className={`w-full flex items-center gap-3 py-2.5 font-semibold rounded-lg transition-colors ${isSidebarOpen ? 'px-4' : 'justify-center px-0'} ${activeTab === item.id && !selectedNote ? (isDarkMode ? 'bg-[#1a1f2e] text-white border border-[#232a3b] shadow-sm' : 'bg-blue-50/50 text-blue-700 border border-blue-100 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200 border border-transparent' : 'text-slate-600 hover:bg-slate-100 border border-transparent')}`}>
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
              <div className={`flex items-center rounded-full px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? 'bg-[#131722] border border-[#232a3b]' : 'bg-white border border-slate-200'}`}>
                <Languages size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />
                <select 
                  value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)} 
                  className={`bg-transparent border-none focus:outline-none text-sm font-bold cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  <option>English</option><option>Marathi</option><option>Hindi</option>
                  <option>Spanish</option><option>French</option><option>Japanese</option>
                </select>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow-sm transition-colors ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800/50 text-emerald-400' : 'bg-emerald-100 border border-emerald-200 text-emerald-700'}`}>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Ready
              </div>
            </div>
          )}
          {selectedNote && (
            <button onClick={() => setSelectedNote(null)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'}`}>
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
                <button onClick={() => { setActiveAiTemplate(null); showToast("Template cleared"); }} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-[#131722]' : 'text-indigo-400 hover:text-red-500 hover:bg-white'}`}><Trash2 size={20}/></button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            
            {activeTab === 'workspace' && !selectedNote && (
              <motion.div key="workspace-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                
                {/* IDLE OR UPLOADING STATE */}
                {(status === 'idle' || status === 'uploading') && (
                  <motion.div key="recording-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`shadow-xl rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/70 backdrop-blur-xl border-white'}`}>
                    
                    {/* 🚀 PREMIUM HEADER SECTION */}
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
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
                          <button onClick={handleToggleWidget} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-[2rem] overflow-hidden ${isWidgetDeployed ? (isDarkMode ? 'bg-red-950/20 border-red-900' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-indigo-600' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm')}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isWidgetDeployed ? (isDarkMode ? 'bg-[#0b0f19] border-red-900/50' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100')}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? 'bg-red-600/50 group-hover:bg-red-500/60' : 'bg-red-400/40 group-hover:bg-red-400/50') : (isDarkMode ? 'bg-purple-600/40 group-hover:bg-purple-500/50' : 'bg-purple-300/40 group-hover:bg-purple-300/50')}`}></div>
                               <div className={`absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? 'bg-orange-600/40' : 'bg-orange-400/40') : (isDarkMode ? 'bg-indigo-600/40 group-hover:bg-indigo-500/50' : 'bg-indigo-300/40 group-hover:bg-indigo-300/50')}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Workflow className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? 'text-red-500/25' : 'text-red-500/20') : (isDarkMode ? 'text-indigo-400/25' : 'text-indigo-500/20')}`} strokeWidth="2" />
                               <Sparkles className={`absolute left-8 bottom-2 w-14 h-14 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? 'text-orange-500/25' : 'text-orange-500/20') : (isDarkMode ? 'text-purple-400/25' : 'text-purple-500/20')}`} strokeWidth="2" />
                               
                               {/* Centered Premium Icon Block */}
                               <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isWidgetDeployed ? (isDarkMode ? 'bg-red-950 border-red-800 text-red-400' : 'bg-white border-red-200 text-red-600') : (isDarkMode ? 'bg-[#131722] border-indigo-900/50 text-indigo-400' : 'bg-white border-slate-100 text-indigo-600')}`}>
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
                          <button onClick={handleStartLocalRecording} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-[2rem] overflow-hidden ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100'}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-blue-600/40 group-hover:bg-blue-500/50' : 'bg-blue-400/40 group-hover:bg-blue-400/50'}`}></div>
                               <div className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-cyan-600/40 group-hover:bg-cyan-500/50' : 'bg-cyan-300/40 group-hover:bg-cyan-300/50'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Headphones className={`absolute left-6 top-4 w-20 h-20 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-blue-400/25' : 'text-blue-500/20'}`} strokeWidth="2" />
                               <Activity className={`absolute right-8 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-cyan-400/25' : 'text-cyan-500/20'}`} strokeWidth="2" />
                               
                               <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? 'bg-[#131722] border-blue-900/50 text-blue-400' : 'bg-white border-slate-100 text-blue-600'}`}>
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
                          <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-dashed cursor-pointer rounded-[2rem] overflow-hidden ${isDragging ? (isDarkMode ? 'border-emerald-400 bg-emerald-900/20' : 'border-emerald-400 bg-emerald-50') : (isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50' : 'bg-white border-slate-300 hover:border-emerald-400 shadow-sm')}`}>
                            <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); }} accept="audio/*,video/*,image/*" className="hidden" />
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-100/50 border-emerald-200') : (isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100')}`}>
                               
                               {/* Rich Mesh Gradient Glows */}
                               <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-emerald-600/40 group-hover:bg-emerald-500/50' : 'bg-emerald-400/40 group-hover:bg-emerald-300/50'}`}></div>
                               <div className={`absolute bottom-0 left-10 w-24 h-24 blur-2xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-teal-600/30 group-hover:bg-teal-500/40' : 'bg-teal-300/30 group-hover:bg-teal-300/40'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <Database className={`absolute left-8 top-4 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-emerald-400/25' : 'text-emerald-500/20'}`} strokeWidth="2" />
                               <Layers className={`absolute right-10 bottom-2 w-16 h-16 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-teal-400/25' : 'text-teal-500/20'}`} strokeWidth="2" />
                               
                               <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? 'bg-[#131722] border-emerald-800 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-600') : (isDarkMode ? 'bg-[#131722] border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-600')}`}>
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
                          <div className={`group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border rounded-[2rem] overflow-hidden ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-red-500/50' : 'bg-white border-slate-200 hover:border-red-300 shadow-sm'}`}>
                            
                            {/* TOP BANNER */}
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-50 border-slate-100'}`}>
                               
                               {/* Rich Mesh Gradient Glows - BOLDER OPACITIES */}
                               <div className={`absolute top-0 right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-red-600/40 group-hover:bg-red-500/50' : 'bg-red-400/40 group-hover:bg-red-300/50'}`}></div>
                               <div className={`absolute -bottom-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? 'bg-orange-600/30 group-hover:bg-orange-500/40' : 'bg-orange-300/30 group-hover:bg-orange-300/40'}`}></div>

                               {/* BOLD Floating Decor Icons */}
                               <PlayCircle className={`absolute left-8 top-6 w-16 h-16 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-red-400/25' : 'text-red-500/20'}`} strokeWidth="2" />
                               <Video className={`absolute right-6 bottom-2 w-20 h-20 transform rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? 'text-orange-400/25' : 'text-orange-500/20'}`} strokeWidth="2" />

                               <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? 'bg-[#131722] border-red-900/50 text-red-400' : 'bg-white border-slate-100 text-red-600'}`}>
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

                {/* 🚀 TRUE REAL-TIME LIVE UI */}
                {(status === 'recording' || status === 'processing' || status === 'paused') && (
                  <motion.div key="live-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-12 gap-8 h-[75vh]">
                    
                    {/* LEFT PANEL */}
                    <div className={`xl:col-span-4 rounded-[2rem] shadow-2xl p-6 flex flex-col relative overflow-hidden border ${isDarkMode ? 'bg-[#0b0f19] border-[#232a3b]' : 'bg-slate-900 border-slate-800'}`}>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 text-white">
                          <span className={`w-3 h-3 rounded-full ${status === 'paused' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]' : 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]'}`}></span>
                          <h2 className="text-lg font-bold flex items-center">
                            {isExtensionActive ? "Extension Capturing" : "Mic Active"}
                            {status === 'paused' && <span className="ml-2 text-amber-400 text-xs uppercase tracking-wider">(Paused)</span>}
                          </h2>
                        </div>
                        <div className={`font-mono text-xl font-black ${status === 'paused' ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`}>{formatTime(timer)}</div>
                      </div>

                      <div className="flex justify-center my-6">
                        <AudioWaveform isRecording={status === 'recording'} color={status === 'paused' ? 'bg-amber-500' : 'bg-emerald-400'} />
                      </div>

                      <div className={`flex-1 rounded-2xl p-5 border overflow-y-auto custom-scrollbar relative ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-slate-800/50 border-slate-700/50'}`}>
                        <div className={`sticky top-0 backdrop-blur-sm -mt-5 -mx-5 p-4 mb-4 border-b flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-wider z-10 ${isDarkMode ? 'bg-[#131722]/90 border-[#232a3b]' : 'bg-slate-800/90 border-slate-700'}`}>
                          <List size={16}/> Live Transcript
                        </div>
                        <p className="font-mono text-slate-300 leading-relaxed text-sm">
                          {transcript}
                          {status === 'recording' && <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse align-middle"></span>}
                        </p>
                      </div>

                      {/* 🚀 LOCAL RECORDING CONTROLS */}
                      {(!isExtensionActive && (status === 'recording' || status === 'paused')) && (
                        <div className="mt-6 flex flex-col lg:flex-row justify-center gap-3">
                          <button onClick={toggleLocalPause} className={`px-6 py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 flex-1 ${status === 'paused' ? 'bg-amber-500 hover:bg-amber-600 text-white' : (isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-white border border-[#232a3b]' : 'bg-slate-700 hover:bg-slate-600 text-white')}`}>
                            {status === 'paused' ? <PlayCircle size={20} /> : <PauseCircle size={20} />} 
                            {status === 'paused' ? 'Resume' : 'Pause'}
                          </button>
                          <button onClick={handleStopLocalRecording} className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-transform hover:scale-105 flex-1">
                            <Square size={20} fill="currentColor" /> Save
                          </button>
                        </div>
                      )}
                      
                      {isExtensionActive && (status === 'recording' || status === 'paused') && (
                        <div className={`mt-6 flex justify-center p-4 rounded-xl text-slate-300 font-bold text-sm text-center border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-slate-800 border-slate-700'}`}>
                           Please use the floating Spoly Widget to Pause, Stop, & Send this meeting.
                        </div>
                      )}
                    </div>

                    {/* RIGHT PANEL */}
                    <div className={`xl:col-span-8 shadow-xl rounded-[2rem] p-8 flex flex-col relative transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/90 backdrop-blur-xl border-white'}`}>
                      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDarkMode ? 'text-indigo-400 border-[#232a3b]' : 'text-indigo-700 border-slate-100'}`}>
                        <Zap size={24} className={status === 'recording' ? "animate-pulse text-amber-500" : (status === 'paused' ? "text-amber-500 opacity-50" : "text-emerald-500")} />
                        <h3 className="font-bold text-xl">
                          {status === 'recording' ? "AI is actively generating notes..." : (status === 'paused' ? "AI generation paused..." : "Finalizing Smart Document...")}
                        </h3>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                         <div className="space-y-2">
                           <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}><AlignLeft size={16}/> Summary</div>
                           <p className={`p-5 rounded-xl text-sm leading-relaxed border min-h-[100px] ${isDarkMode ? 'text-slate-300 bg-[#1a1f2e] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                             {meetingNotes.summary || <span className={isDarkMode ? 'text-slate-500 italic' : 'text-slate-400 italic'}>Listening for context...</span>}
                           </p>
                         </div>

                         <div className="space-y-2">
                           <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}><List size={16}/> Extracting Takeaways</div>
                           <div className={`p-5 rounded-xl text-sm leading-relaxed border whitespace-pre-wrap min-h-[100px] ${isDarkMode ? 'text-slate-300 bg-[#1a1f2e] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                             {meetingNotes.takeaways || <span className={isDarkMode ? 'text-slate-500 italic' : 'text-slate-400 italic'}>Waiting for key points...</span>}
                           </div>
                         </div>

                         {actionItems.length > 0 && (
                           <div className="space-y-2">
                             <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}><ListChecks size={16}/> Action Items Detected!</div>
                             <ul className="space-y-2">
                               {actionItems.map(item => (
                                 <li key={item.id} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium border ${isDarkMode ? 'bg-emerald-900/10 border-emerald-800/30 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                                   <CheckCircle size={16} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}/> {item.text}
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
                  <motion.div key="success-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-white shadow-xl rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-visible mb-8 bg-gradient-to-r ${isDarkMode ? 'from-emerald-600 to-teal-600' : 'from-emerald-500 to-teal-500'}`}>
                    {isRemixing && (
                      <div className={`absolute inset-0 z-10 backdrop-blur-md rounded-[2rem] flex items-center justify-center gap-3 font-bold text-lg ${isDarkMode ? 'bg-emerald-700/90' : 'bg-emerald-600/90'}`}>
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
                              <div className="max-h-60 overflow-y-auto">
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

                {status === 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-10 mt-12">
                     <div>
                       <div className="flex items-center justify-between mb-6 px-2">
                         <h3 className={`text-xl font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><CalendarDays size={22} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}/> Today's Meetings</h3>
                       </div>
                       <div className="space-y-4">
                         {upcomingMeetings.map(meeting => (
                           <div key={meeting.id} className={`shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 flex items-center justify-between border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${isDarkMode ? 'text-slate-400 bg-slate-800 border-transparent' : 'text-slate-500 bg-slate-100 border-transparent'}`}>{meeting.time}</span>
                                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{meeting.platform}</span>
                                </div>
                                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{meeting.title}</h4>
                              </div>
                              <button onClick={() => toggleBot(meeting.id)} className={`px-4 py-2 flex items-center gap-2 rounded-xl font-bold text-sm transition-colors border ${meeting.botDeployed ? (isDarkMode ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200') : (isDarkMode ? 'bg-[#1a1f2e] text-slate-300 border-[#232a3b] hover:border-indigo-500 hover:text-indigo-300' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600')}`}>
                                 <Bot size={16} className={meeting.botDeployed ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-500') : ""} /> {meeting.botDeployed ? 'Bot Scheduled' : 'Deploy Bot'}
                              </button>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <div className="flex items-center justify-between mb-6 px-2">
                         <h3 className={`text-xl font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><FolderSearch size={22} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'}/> Recent Notes</h3>
                         <button onClick={() => setActiveTab('notes')} className={`text-sm font-bold flex items-center gap-1 group transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
                       </div>
                       <div className="grid gap-4">
                         {savedNotes.slice(0, 2).map(note => (
                           <div key={note.id} onClick={() => setSelectedNote(note)} className={`shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 cursor-pointer flex items-center gap-4 border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0 border ${isDarkMode ? 'bg-blue-900/20 text-blue-400 border-blue-800/50' : 'bg-blue-50 text-blue-600 border-transparent'}`}><FileText size={20}/></div>
                              <div className="flex-1">
                                <h4 className={`font-bold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{note.title}</h4>
                                <div className={`flex items-center gap-3 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                   <span className="flex items-center gap-1"><Calendar size={12}/> {note.date}</span>
                                   <span className="flex items-center gap-1"><CheckCircle2 size={12}/> {note.items} Action Items</span>
                                </div>
                              </div>
                              <ChevronRight size={16} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}/>
                           </div>
                         ))}
                       </div>
                     </div>
                  </motion.div>
                )}

                {status === 'complete' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-2 gap-8">
                    
                    <div className={`flex flex-col h-full shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow relative border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                      {isRemixing && <div className={`absolute inset-0 backdrop-blur-sm z-20 ${isDarkMode ? 'bg-[#0b0f19]/50' : 'bg-white/50'}`} />}
                      
                      <div className={`p-8 pb-4 border-b flex justify-between items-center ${isDarkMode ? 'border-[#232a3b] bg-transparent' : 'border-slate-100 bg-white/50'}`}>
                         <div className={`flex items-center gap-3 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}><div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-indigo-900/40 border-indigo-800/50' : 'bg-indigo-100 border-transparent'}`}><FileText size={20} /></div><h3 className="font-bold text-xl">Smart Document</h3></div>
                         <button onClick={() => { 
                           const textToCopy = exportFormat === 'markdown' 
                             ? `## Summary\n${meetingNotes.summary}\n\n## Takeaways\n${meetingNotes.takeaways}\n\n## Decisions\n${meetingNotes.decisions}`
                             : `${meetingNotes.summary}\n\n${meetingNotes.takeaways}\n\n${meetingNotes.decisions}`;
                           navigator.clipboard.writeText(textToCopy); 
                           showToast("Notes copied to clipboard!"); 
                         }} className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><Copy size={14}/> Copy All</button>
                      </div>

                      <div className="p-8 flex-1 overflow-y-auto space-y-6">
                         <EditableSection isDarkMode={isDarkMode} icon={AlignLeft} title={activeAiTemplate?.category === 'Education' ? "Lecture Summary" : "Executive Summary"} value={meetingNotes.summary} onChange={(val) => setMeetingNotes({...meetingNotes, summary: val})} />
                         <EditableSection isDarkMode={isDarkMode} icon={List} title="Key Takeaways" value={meetingNotes.takeaways} onChange={(val) => setMeetingNotes({...meetingNotes, takeaways: val})} />
                         <EditableSection isDarkMode={isDarkMode} icon={Briefcase} title={activeAiTemplate?.category === 'Education' ? "Core Concepts" : "Technical Decisions"} value={meetingNotes.decisions} onChange={(val) => setMeetingNotes({...meetingNotes, decisions: val})} />

                         <div className={`pt-4 border-t ${isDarkMode ? 'border-[#232a3b]' : 'border-slate-100'}`}>
                           <div className="flex items-center justify-between mb-4"><div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}><ListChecks size={18} /> <h4>Action Items</h4></div><span className={`text-xs font-bold px-2 py-1 rounded-md ${isDarkMode ? 'text-slate-500 bg-[#1a1f2e]' : 'text-slate-400 bg-slate-100'}`}>{actionItems.filter(i=>i.done).length} / {actionItems.length}</span></div>
                           <ul className="space-y-2">
                             {actionItems.map((item) => (
                               <li key={item.id} onClick={() => toggleActionItem(item.id)} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${item.done ? (isDarkMode ? 'bg-[#0b0f19] border-[#232a3b] opacity-60' : 'bg-slate-50 border-slate-200 opacity-60') : (isDarkMode ? 'bg-emerald-900/10 border-emerald-800/40 hover:border-emerald-600 hover:shadow-sm' : 'bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-300 hover:shadow-sm')}`}>
                                 <div className="mt-0.5">{item.done ? <CheckCircle size={18} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-500'} /> : <Circle size={18} className={`group-hover:text-emerald-400 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />}</div>
                                 <span className={`font-medium text-sm transition-all ${item.done ? (isDarkMode ? 'text-slate-600 line-through' : 'text-slate-400 line-through') : (isDarkMode ? 'text-slate-300' : 'text-slate-700')}`}>{item.text}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                      </div>

                      <div className={`p-6 border-t ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
                          <button onClick={(e) => handleAiRefine(e, "Format as bullet points")} className={`shrink-0 px-3 py-1 border rounded-full text-xs font-bold transition-colors ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-slate-300 hover:border-indigo-500 hover:text-indigo-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}>Format as Bullets</button>
                          <button onClick={(e) => handleAiRefine(e, "Make it shorter")} className={`shrink-0 px-3 py-1 border rounded-full text-xs font-bold transition-colors ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-slate-300 hover:border-indigo-500 hover:text-indigo-400' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}>Make it Shorter</button>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-[2px] shadow-sm">
                          <form onSubmit={(e) => handleAiRefine(e, null)} className={`rounded-[14px] p-1.5 flex items-center gap-2 pl-4 ${isDarkMode ? 'bg-[#131722]' : 'bg-white'}`}>
                             <Wand2 size={18} className={`shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}/>
                             <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Tell AI to refine these notes..." className={`flex-1 bg-transparent border-none focus:outline-none text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} disabled={isAiThinking} />
                             <button type="submit" disabled={isAiThinking || !aiPrompt} className={`p-2 rounded-xl transition-all ${aiPrompt ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : (isDarkMode ? 'bg-[#1a1f2e] text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                               {isAiThinking ? <Zap size={16} className="animate-pulse text-amber-400" /> : <Send size={16} />}
                             </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col h-full min-h-[600px] relative shadow-lg rounded-[2rem] p-8 hover:shadow-xl transition-shadow border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                      {isRemixing && <div className={`absolute inset-0 backdrop-blur-sm z-20 ${isDarkMode ? 'bg-[#0b0f19]/50' : 'bg-white/50'}`} />}
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                          <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-blue-900/30 border-blue-800/50' : 'bg-blue-100 border-transparent'}`}>{activeAiTemplate ? activeAiTemplate.icon : <Workflow size={20} />}</div>
                          <h3 className="font-bold text-xl">{activeAiTemplate ? activeAiTemplate.name : "System Architecture"}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-colors border font-bold text-sm flex items-center gap-2 ${showCode ? (isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-800 text-white border-slate-700') : (isDarkMode ? 'bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-300 border-[#232a3b]' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent')}`} title="Toggle Editor">
                             {showCode ? <Workflow size={16}/> : <Code size={16}/>}
                             <span className="hidden sm:inline">{showCode ? 'View Graph' : 'Edit Code'}</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className={`flex-1 w-full border shadow-inner rounded-2xl flex items-center justify-center overflow-hidden relative group transition-colors ${showCode ? (isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800') : (isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200')}`}>
                        {showCode ? (
                           <div className="w-full h-full pt-12 p-4 flex flex-col relative z-10">
                             <button onClick={() => { navigator.clipboard.writeText(editableMermaid); showToast("Code copied to clipboard!"); }} className="absolute top-3 right-3 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"><Copy size={16}/></button>
                             <textarea value={editableMermaid} onChange={(e) => setEditableMermaid(e.target.value)} className="w-full h-full bg-transparent text-blue-300 font-mono text-sm resize-none focus:outline-none leading-relaxed" spellCheck="false" />
                           </div>
                        ) : (
                           <div className="w-full h-full overflow-auto flex justify-center items-center p-8 relative z-10">
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
            {activeTab === 'notes' && !selectedNote && (
              <motion.div key="notes-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                   <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Library</h2>
                   <div className="relative w-full md:w-auto">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                     <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 pr-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-colors border ${isDarkMode ? 'bg-[#131722]/60 backdrop-blur-md border-[#232a3b] text-white' : 'bg-white/60 backdrop-blur-md border-white text-slate-800'}`} />
                   </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {savedNotes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(note => (
                     <div key={note.id} onClick={() => setSelectedNote(note)} className={`group relative shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] p-1 cursor-pointer overflow-hidden flex flex-col h-full min-h-[220px] border ${isDarkMode ? 'bg-[#131722]/80 backdrop-blur-xl border-[#232a3b] hover:border-blue-700' : 'bg-white/80 backdrop-blur-xl border-white/80 hover:border-blue-300'}`}>
                        <div className={`absolute top-0 left-0 w-full h-24 z-0 bg-gradient-to-br ${isDarkMode ? 'from-blue-900/10 to-indigo-900/10' : 'from-blue-50 to-indigo-50'}`}></div>
                        <div className={`relative z-10 p-6 flex flex-col h-full rounded-[1.8rem] border ${isDarkMode ? 'bg-[#0b0f19]/50 border-[#232a3b]' : 'bg-white/50 border-white/50'}`}>
                           <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border ${isDarkMode ? 'bg-[#131722] text-blue-400 border-[#232a3b]' : 'bg-white text-blue-600 border-slate-100'}`}><FileText size={20}/></div>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 border ${isDarkMode ? 'text-slate-400 bg-slate-800/80 backdrop-blur-sm border-[#232a3b]' : 'text-slate-500 bg-white/80 backdrop-blur-sm border-slate-100'}`}><Calendar size={12}/> {note.date}</span>
                           </div>
                           <h3 className={`text-xl font-bold mb-4 leading-tight transition-colors flex-1 ${isDarkMode ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'}`}>{note.title}</h3>
                           
                           <div className="flex gap-2 mb-6 flex-wrap">
                             {note.audioUrl && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? 'text-purple-300 bg-purple-900/30 border-purple-800/50' : 'text-purple-600 bg-purple-100 border-transparent'}`}><Headphones size={10}/> Audio</span>}
                             {note.tags?.map((tag, i) => <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 border ${isDarkMode ? 'text-slate-400 bg-[#1a1f2e] border-[#232a3b]' : 'text-slate-500 bg-slate-100 border-transparent'}`}><Tag size={10}/> {tag}</span>)}
                           </div>

                           <div className={`flex items-center justify-between text-sm font-medium mt-auto border-t pt-4 ${isDarkMode ? 'text-slate-500 border-[#232a3b]' : 'text-slate-500 border-slate-200/60'}`}>
                              <div className="flex gap-4">
                                 <span className="flex items-center gap-1"><Clock size={14}/> {note.duration}</span>
                                 <span className="flex items-center gap-1"><CheckCircle2 size={14}/> {note.items} Action Items</span>
                              </div>
                              <ChevronRight size={16} className={`transition-colors ${isDarkMode ? 'text-slate-600 group-hover:text-blue-400' : 'text-slate-300 group-hover:text-blue-500'}`}/>
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
                    <div className={`shadow-lg rounded-[2rem] p-8 border ${isDarkMode ? 'bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                      <h3 className={`font-bold text-xl flex items-center gap-2 mb-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}><AlignLeft size={20}/> AI Summary & Notes</h3>
                      <div className="space-y-6">
                        <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Executive Summary</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.summary}</p></div>
                        <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Key Takeaways</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.takeaways}</p></div>
                        {selectedNote.decisions && <div><h4 className={`font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Decisions</h4><p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-wrap ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>{selectedNote.decisions}</p></div>}
                      </div>
                    </div>

                    {selectedNote.graph && (
                      <div className={`shadow-lg rounded-[2rem] p-8 flex flex-col border ${isDarkMode ? 'bg-[#1e2025]/80 backdrop-blur-xl border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
                        <h3 className={`font-bold text-xl flex items-center gap-2 mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}><Workflow size={20}/> Extracted Diagram</h3>
                        <div className={`flex-1 w-full shadow-inner rounded-2xl flex items-center justify-center p-8 min-h-[400px] border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                           <MermaidDiagram chart={selectedNote.graph} />
                        </div>
                      </div>
                    )}
                  </div>
               </motion.div>
            )}

            {/* --- TEMPLATES TAB --- */}
            {activeTab === 'templates' && (
              <motion.div key="templates-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <div className="mb-8 flex justify-between items-end">
                   <div>
                     <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI Output Templates</h2>
                     <p className={`font-medium text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a template before recording to format the diagram style.</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                    {templateCategories.map(cat => (
                      <button key={cat} onClick={() => setTemplateFilter(cat)} className={`px-5 py-2 rounded-full font-bold transition-all border ${templateFilter === cat ? (isDarkMode ? 'bg-slate-200 text-slate-900 border-transparent shadow-md' : 'bg-slate-800 text-white border-transparent shadow-md') : (isDarkMode ? 'bg-[#1e2025] text-slate-300 border-[#232a3b] hover:bg-[#131722]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}>{cat}</button>
                    ))}
                 </div>

                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                   <AnimatePresence mode="popLayout">
                     {templatesDB.filter(t => templateFilter === 'All' || t.category === templateFilter).map((temp) => (
                       <motion.div 
                         key={temp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                         onClick={() => { setActiveAiTemplate(temp); setActiveTab('workspace'); showToast(`Template Set: ${temp.name}`); }} 
                         className={`relative shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] p-6 cursor-pointer group flex flex-col h-full min-h-[200px] overflow-hidden border ${isDarkMode ? 'bg-[#1e2025] border-[#232a3b]' : 'bg-white border-slate-200'} ${getTheme(temp.theme, isDarkMode).hover}`}
                       >
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getTheme(temp.theme, isDarkMode).glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`} />
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-5">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${getTheme(temp.theme, isDarkMode).iconBg}`}>{temp.icon}</div>
                               <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${isDarkMode ? 'text-slate-400 bg-[#13151a] border-[#232a3b]' : 'text-slate-500 bg-slate-100 border-transparent'}`}>{temp.category}</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-900 group-hover:text-slate-800'}`}>{temp.name}</h3>
                            <p className={`font-medium text-sm leading-relaxed mb-6 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{temp.desc}</p>
                            <div className={`flex items-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 transform duration-300 ${getTheme(temp.theme, isDarkMode).text}`}>
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