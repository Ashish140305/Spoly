import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import {
  Mic,
  Square,
  UploadCloud,
  FileText,
  ListChecks,
  Workflow,
  PlusCircle,
  CheckCircle2,
  Zap,
  Puzzle,
  X,
  FileAudio,
  Code,
  Copy,
  CheckCircle,
  Circle,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  AlignLeft,
  Sparkles,
  Database,
  Trash2,
  Layers,
  ChevronLeft,
  List,
  ImageIcon,
  ImagePlus,
  Languages,
  FileUp,
  RefreshCw,
  Headphones,
  Youtube,
  Play,
  Pause,
  Activity,
  Video,
  FolderSearch,
  Maximize2,
  ArrowDown,
} from "lucide-react";

import {
  ScrollbarStyles,
  WorkspaceMeshBackground,
  AudioWaveform,
  getTheme,
} from "../utils/uiHelpers";
import {
  templatesDB,
  initialFolders,
  templateCategories,
} from "../utils/constants";

import Sidebar from "../components/Sidebar";
import LibraryTab from "../components/LibraryTab";
import NoteDetailView from "../components/NoteDetailView";
import TemplatesTab from "../components/TemplatesTab";
import SettingsView from "../components/SettingsView";
import MermaidDiagram from "../components/MermaidDiagram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LiveAudioVisualizer = ({ stream, isRecording, colorClass }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream || !isRecording) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    let animationId;

    const draw = () => {
      animationId = setTimeout(() => requestAnimationFrame(draw), 50);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 4;
      const gap = 3;
      const numBars = Math.floor(canvas.width / (barWidth + gap));
      const step = Math.floor(bufferLength / numBars);

      let x = 0;
      for (let i = 0; i < numBars; i++) {
        const dataIndex = i * step;
        let barHeight = (dataArray[dataIndex] / 255) * canvas.height;
        if (barHeight < 3) barHeight = 3;

        canvasCtx.fillStyle =
          colorClass === "bg-amber-500"
            ? "#f59e0b"
            : colorClass === "bg-purple-500"
              ? "#a855f7"
              : "#3b82f6";

        canvasCtx.beginPath();
        if (canvasCtx.roundRect) {
          canvasCtx.roundRect(
            x,
            (canvas.height - barHeight) / 2,
            barWidth,
            barHeight,
            2,
          );
        } else {
          canvasCtx.fillRect(
            x,
            (canvas.height - barHeight) / 2,
            barWidth,
            barHeight,
          );
        }
        canvasCtx.fill();
        x += barWidth + gap;
      }
    };

    draw();

    return () => {
      clearTimeout(animationId);
      audioCtx.close();
    };
  }, [stream, isRecording, colorClass]);

  if (!stream)
    return <AudioWaveform isRecording={isRecording} color={colorClass} />;
  return (
    <canvas
      ref={canvasRef}
      width="120"
      height="32"
      className="w-full h-8 opacity-90"
    />
  );
};

const generateThemeFromFile = (file) => {
  if (!file) return null;
  const palettes = [
    { d1: "bg-rose-900/20", d2: "bg-orange-900/20", l1: "bg-rose-300/30", l2: "bg-orange-300/30" },
    { d1: "bg-emerald-900/20", d2: "bg-teal-900/20", l1: "bg-emerald-300/30", l2: "bg-teal-300/30" },
    { d1: "bg-purple-900/20", d2: "bg-pink-900/20", l1: "bg-purple-300/30", l2: "bg-pink-300/30" },
    { d1: "bg-amber-900/20", d2: "bg-red-900/20", l1: "bg-amber-300/30", l2: "bg-red-300/30" },
  ];
  const hash = file.name.charCodeAt(0) + file.name.charCodeAt(file.name.length - 1) + file.size;
  return palettes[hash % palettes.length];
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.1, ease: "easeIn" } },
};

export default function LiveNotes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("workspace");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("spoly_dark") === "true");
  const [exportFormat, setExportFormat] = useState(() => localStorage.getItem("spoly_export") || "markdown");
  const [settingsToggles, setSettingsToggles] = useState({ notion: false });
  const [selectedMic, setSelectedMic] = useState(() => localStorage.getItem("spoly_mic") || "default");
  const [audioConstraints, setAudioConstraints] = useState(() => {
    const saved = localStorage.getItem("spoly_audio");
    return saved ? JSON.parse(saved) : { echoCancellation: true, noiseSuppression: true };
  });

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

  const [audioStream, setAudioStream] = useState(null);
  const transcriptContainerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const isAutoScrolling = useRef(true);
  const [showResumeScroll, setShowResumeScroll] = useState(false);

  const capturedTitleRef = useRef("");

  const handleTranscriptScroll = () => {
    if (!transcriptContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = transcriptContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAutoScrolling.current = isNearBottom;
    if (!isNearBottom && !showResumeScroll) setShowResumeScroll(true);
    else if (isNearBottom && showResumeScroll) setShowResumeScroll(false);
  };

  useEffect(() => {
    if (isAutoScrolling.current && transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  const [activeAiTemplate, setActiveAiTemplate] = useState(null);
  const activeAiTemplateRef = useRef(null);

  useEffect(() => { activeAiTemplateRef.current = activeAiTemplate; }, [activeAiTemplate]);

  const [processingType, setProcessingType] = useState("audio");
  const [isWidgetDeployed, setIsWidgetDeployed] = useState(false);
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  const [globalSpeakerColor, setGlobalSpeakerColor] = useState("bg-blue-500");
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
  const isPausedRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState("All");

  const [notesViewMode, setNotesViewMode] = useState("grid");
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [meetingNotes, setMeetingNotes] = useState({ summary: "", takeaways: "", decisions: "" });
  const [actionItems, setActionItems] = useState([]);
  const [editableMermaid, setEditableMermaid] = useState("");

  useEffect(() => {
    let interval = null;
    if (status === "recording") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        timerRef.current += 1;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const forceStartRef = useRef(null);
  const stopLocalRef = useRef(null);
  const pauseLocalRef = useRef(null);

  useEffect(() => {
    forceStartRef.current = forceStartSimulation;
    stopLocalRef.current = handleStopLocalRecording;

    pauseLocalRef.current = (isPaused) => {
      if (stopTriggeredRef.current) return;
      isPausedRef.current = isPaused;
      setStatus(isPaused ? "paused" : "recording");
    };
  });

  useEffect(() => {
    const handleMessage = (e) => {
      const type = e.data?.type;
      if (type === "SPOLY_RECORDING_STARTED" || type === "SPOLY_HEARTBEAT_LIVE") {
        if (e.data.title && e.data.title.trim() !== "" && e.data.title !== "Live Web Capture") {
          capturedTitleRef.current = e.data.title;
        }
        if (e.data.speakerState) setGlobalSpeakerColor(e.data.speakerState === "sys" ? "bg-purple-500" : "bg-blue-500");
        if (forceStartRef.current) forceStartRef.current(e.data.title);
      } else if (type === "SPOLY_RECORDING_STOPPED" || type === "SPOLY_UPLOAD_COMPLETE") {
        if (stopLocalRef.current) stopLocalRef.current();
      } else if (type === "INTERNAL_SYNC_UI") {
        if (e.data.isLive === false) {
          if (stopLocalRef.current) stopLocalRef.current();
        } else {
          if (pauseLocalRef.current) pauseLocalRef.current(e.data.isPaused);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const [savedNotes, setSavedNotes] = useState([]);

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 3000); };
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAddFolder = (e) => {
    if (e.key === "Enter" && newFolderName.trim()) {
      const colors = ["text-emerald-500", "text-purple-500", "text-pink-500", "text-cyan-500", "text-rose-500", "text-indigo-500"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newFolder = { id: `folder_${Date.now()}`, name: newFolderName.trim(), color: randomColor, isDefault: false };
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName(""); setIsAddingFolder(false);
      showToast(`Folder "${newFolder.name}" created!`);
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    const folderName = folders.find((f) => f.id === folderId)?.name;
    if (window.confirm(`Are you sure you want to delete the "${folderName}" folder?\n\nAny notes inside will be safely moved back to "All Notes".`)) {
      setSavedNotes((prev) => prev.map((n) => n.folderId === folderId ? { ...n, folderId: "all" } : n));
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      if (activeFolderId === folderId) setActiveFolderId("all");
      showToast("Folder deleted.");
    }
  };

  // 🚀 PASS FETCHED DATA DIRECTLY TO BYPASS STALE REACT STATE
  const finishProcessing = (customTitle = null, overrideAudioUrl = null, fetchedData = null) => {
    setStatus("complete");
    setIsExtensionActive(false);
    setIsWidgetDeployed(false);
    setAudioStream(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;
    showToast(processingType === "image" ? "Whiteboard Converted Successfully!" : `Processed in ${outputLanguage}!`);

    let finalTitle = capturedTitleRef.current || `Live Session ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (customTitle && customTitle !== "Live Capture") finalTitle = customTitle;
    if (activeAiTemplate) finalTitle = `[${activeAiTemplate.name}] ${finalTitle}`;

    const finalAudioUrl = overrideAudioUrl || currentAudioUrl;

    const newNote = {
      id: Date.now(),
      title: finalTitle,
      folderId: "all",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: formatTime(timerRef.current),
      items: actionItems.length,
      tags: [outputLanguage, activeAiTemplate?.category || "AI"],
      summary: fetchedData?.summary || meetingNotes.summary || "Summary generation failed.",
      takeaways: "",
      decisions: "",
      graph: fetchedData?.graph || editableMermaid,
      audioUrl: finalAudioUrl,
      transcript: fetchedData?.transcript || transcript 
    };

    setSavedNotes((prev) => [newNote, ...prev]);
  };

// 🚀 BULLETPROOF BACKEND INTEGRATION
  const processAudioWithBackend = async (audioBlob, defaultTitle) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch(`${BACKEND_URL}/api/notes/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      
      const generatedTranscript = data.transcript || "No transcript returned by the AI.";
      const generatedSummary = data.notes || "No notes generated by the AI.";
      
      // 🚀 THE ULTIMATE LINE-BY-LINE MERMAID SANITIZER
      let generatedGraph = data.diagram || "";
      if (generatedGraph && generatedGraph !== "API FAILED") {
          // 1. Extract from markdown backticks
          const match = generatedGraph.match(/\x60\x60\x60(?:mermaid)?\s*([\s\S]*?)\x60\x60\x60/i);
          if (match) generatedGraph = match[1];

          // 2. Find the actual start of the diagram
          const validStarts = ["graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram", "mindmap", "timeline", "pie"];
          let startIndex = -1;
          for (const start of validStarts) {
              const idx = generatedGraph.toLowerCase().indexOf(start.toLowerCase());
              if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
                  startIndex = idx;
              }
          }
          if (startIndex !== -1) generatedGraph = generatedGraph.substring(startIndex);

          // 3. Process the diagram safely line-by-line
          generatedGraph = generatedGraph
              .replace(/\x60\x60\x60/g, "") // Strip stray backticks
              .replace(/^[ \t]*note\s+.*$/gim, "") // Delete rogue note lines
              .replace(/^(graph\s+[A-Z]{2}|flowchart\s+[A-Z]{2})\s+/gim, "$1\n"); // FORCE newline after graph TD

          const lines = generatedGraph.split('\n');
          const cleanLines = lines.map(line => {
              let l = line.trim();
              // Safely remove spaces in Node IDs without breaking connections
              if (!l.includes('-->') && !l.includes('---') && l.includes('[')) {
                   l = l.replace(/^([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*\[/, "$1$2[");
              }
              return l;
          }).filter(line => line.length > 0);
          
          generatedGraph = cleanLines.join('\n');
      } else {
          generatedGraph = "";
      }

      setTranscript(generatedTranscript);
      setMeetingNotes({ summary: generatedSummary, takeaways: "", decisions: "" });
      setEditableMermaid(generatedGraph);

      const freshData = {
        transcript: generatedTranscript,
        summary: generatedSummary,
        graph: generatedGraph
      };

      finishProcessing(defaultTitle, currentAudioUrl, freshData);

    } catch (error) {
      console.error("Backend Error:", error);
      showToast("Error processing with backend.");
      
      const errorMsg = `🚨 API Error: Could not generate notes.\nDetails: ${error.message}\nMake sure your FastAPI backend is running at ${BACKEND_URL}/api/notes/generate`;
      
      setTranscript("Error connecting to backend API.");
      setMeetingNotes({ summary: errorMsg, takeaways: "", decisions: "" });
      
      const errorData = { transcript: "Error", summary: errorMsg, graph: "" };
      finishProcessing(defaultTitle, currentAudioUrl, errorData);
    }
  };

  const forceStartSimulation = (scrapedTitle) => {
    if (stopTriggeredRef.current) return;
    if (status === "recording" || status === "processing" || status === "paused") return;

    if (scrapedTitle && typeof scrapedTitle === "string") capturedTitleRef.current = scrapedTitle;
    else capturedTitleRef.current = "";

    setActiveTab("workspace");
    setIsExtensionActive(true);
    setStatus("recording");
    stopTriggeredRef.current = false;
    setProcessingType("audio");
    isPausedRef.current = false;

    setTranscript("Recording in progress... Notes will be generated once stopped.");
    setTimer(0);
    timerRef.current = 0;
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaid("");
    setCurrentAudioUrl(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;
  };

  const handleStartLocalRecording = async () => {
    let stream = null;
    try {
      const constraints = { echoCancellation: audioConstraints.echoCancellation, noiseSuppression: audioConstraints.noiseSuppression };
      if (selectedMic !== "default") constraints.deviceId = { exact: selectedMic };
      stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
    } catch (err) { console.warn("Spoly: Mic denied", err); }

    setActiveTab("workspace");
    setIsExtensionActive(false);
    setStatus("recording");
    stopTriggeredRef.current = false;
    setProcessingType("audio");
    isPausedRef.current = false;

    setTranscript("Recording in progress... Notes will be generated once stopped.");
    setTimer(0);
    timerRef.current = 0;
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaid("");
    setCurrentAudioUrl(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;

    if (stream) {
      setAudioStream(stream);
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/webm" };
      }

      const recorder = new MediaRecorder(stream, options);
      localAudioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) localAudioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        try {
          const finalBlob = new Blob(localAudioChunks.current, { type: "audio/webm" });
          const audioUrl = window.URL.createObjectURL(finalBlob);
          setCurrentAudioUrl(audioUrl);
          
          await processAudioWithBackend(finalBlob, "Live Capture");
        } catch (err) {
          console.error("Audio construction failed:", err);
          finishProcessing("Live Capture", null);
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start(250);
      localMediaRecorderRef.current = recorder;
    } else {
      showToast("Mic unavailable or denied.");
      localMediaRecorderRef.current = null;
    }
  };

  const toggleLocalPause = () => {
    if (status === "recording") {
      if (localMediaRecorderRef.current?.state === "recording") localMediaRecorderRef.current.pause();
      isPausedRef.current = true;
      setStatus("paused");
    } else if (status === "paused") {
      if (localMediaRecorderRef.current?.state === "paused") localMediaRecorderRef.current.resume();
      isPausedRef.current = false;
      setStatus("recording");
    }
  };

  const handleStopLocalRecording = () => {
    if (stopTriggeredRef.current) return;
    stopTriggeredRef.current = true;
    isPausedRef.current = true;
    setStatus("processing");
    setAudioStream(null);

    if (localMediaRecorderRef.current && localMediaRecorderRef.current.state !== "inactive") {
      localMediaRecorderRef.current.requestData();
      setTimeout(() => {
        localMediaRecorderRef.current.stop();
      }, 100);
    } else {
      setTimeout(() => finishProcessing("Live Classroom Capture"), 2000);
    }
  };

  const handleToggleWidget = () => {
    const isExtensionReady = document.getElementById("spoly-extension-marker");
    if (isExtensionReady) {
      window.postMessage({ type: "SPOLY_TOGGLE_WIDGET" }, "*");
      setIsWidgetDeployed(!isWidgetDeployed);
    } else {
      alert("⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const processFile = (file) => {
    const isImage = file.type.startsWith("image/");
    setProcessingType(isImage ? "image" : "audio");
    setFileName(file.name);
    setStatus("uploading");
    setUploadProgress(0);
    stopTriggeredRef.current = false;
    if (!isImage) setCurrentAudioUrl(URL.createObjectURL(file));
    
    let progress = 0;
    if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(async () => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadRef.current);
        setStatus("processing");
        if (isImage) {
          setTimeout(() => finishProcessing(), 3000);
        } else {
          await processAudioWithBackend(file, file.name);
        }
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const processYoutube = (e) => {
    e.preventDefault();
    // Intentionally skipped complex Youtube DL for brevity in this fix scope
  };

  const handleContextDrop = (e) => {
    e.preventDefault();
    setIsDraggingContext(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setContextFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
      setContextTheme(generateThemeFromFile(file));
      showToast(`Context Attached! Theme adjusted.`);
    }
  };

  const handleReset = () => {
    if (typingRef.current) clearInterval(typingRef.current);
    if (uploadRef.current) clearInterval(uploadRef.current);
    stopTriggeredRef.current = false;
    setStatus("idle");
    setTranscript("");
    setTimer(0);
    timerRef.current = 0;
    setFileName("");
    setUploadProgress(0);
    setIsExtensionActive(false);
    setIsWidgetDeployed(false);
    setAudioStream(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveTab("workspace");
    setActionItems([]);
    setContextFiles([]);
    setEditableMermaid("");
    setContextTheme(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;
    capturedTitleRef.current = ""; 
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className={`flex h-screen relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "text-slate-100 bg-[#0b0f19]" : "text-slate-900 bg-[#f8fafc]"}`}>
      <ScrollbarStyles />
      <WorkspaceMeshBackground isDarkMode={isDarkMode} customTheme={contextTheme} />

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${isDarkMode ? "bg-white text-slate-900 border-slate-200" : "bg-slate-900 text-white border-slate-700"}`}>
            <Sparkles size={18} className="text-amber-500" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar isDarkMode={isDarkMode} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleReset={handleReset} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedNote={setSelectedNote} user={user} />

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto overflow-x-hidden min-w-0">
        <header className={`px-8 py-6 flex justify-between items-center border-b sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-[#0b0f19]/80 backdrop-blur-md border-[#232a3b]" : "bg-white/30 backdrop-blur-md border-white/40"}`}>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">
              {selectedNote ? selectedNote.title : activeTab === "workspace" ? "Active Workspace" : activeTab}
            </h1>
            <p className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {selectedNote ? `Saved on ${selectedNote.date}` : new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {(status === "recording" || status === "paused") && activeTab !== "workspace" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${isDarkMode ? "bg-[#131722]" : "bg-white"} ${status === "recording" ? (isDarkMode ? "shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/40" : "shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-300") : isDarkMode ? "shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/40" : "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-300"}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${status === "paused" ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}></div>
                <span className={`font-mono text-sm font-bold tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}>{formatTime(timer)}</span>
                {!isExtensionActive && (
                  <>
                    <div className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}></div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={toggleLocalPause} className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors ${status === "paused" ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" : isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`} title={status === "paused" ? "Resume" : "Pause"}>
                        {status === "paused" ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                      </button>
                      <button onClick={handleStopLocalRecording} className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors" title="Save & Stop">
                        <Square size={12} fill="currentColor" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "workspace" && status === "idle" && (
              <>
                <div className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? "bg-[#131722] border border-[#232a3b]" : "bg-white border border-slate-200"}`}>
                  <Languages size={18} className="text-blue-500" />
                  <select value={outputLanguage} onChange={(e) => setOutputLanguage(e.target.value)} className={`bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md text-sm font-bold cursor-pointer ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    <option className={isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-900"}>English</option>
                  </select>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${isDarkMode ? "bg-emerald-900/20 border border-emerald-800/50 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-700"}`}>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Ready
                </div>
              </>
            )}
            {selectedNote && (
              <button onClick={() => setSelectedNote(null)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}>
                <ChevronLeft size={16} /> Back to Library
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === "workspace" && !selectedNote && (
              <motion.div key="workspace-tab" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                
                {/* IDLE / UPLOAD CARDS (unchanged logic, preserving layout) */}
                {(status === "idle" || status === "uploading") && (
                  <motion.div key="recording-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`shadow-xl rounded-2xl p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-white/70 backdrop-blur-xl border-white"}`}>
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl shadow-sm border ${isDarkMode ? "bg-indigo-900/30 text-indigo-400 border-indigo-800/50" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                          <Play size={24} className="animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold tracking-tight">Initialize Workspace</h2>
                          <p className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Select a data source to begin capturing intelligent notes.</p>
                        </div>
                      </div>
                    </div>

                    {status === "idle" && (
                      <motion.div key="idle-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-6">
                          <motion.button whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.97 }} onClick={handleStartLocalRecording} className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"}`}>
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              <div className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-blue-600/40" : "bg-blue-400/40"}`}></div>
                              <Headphones className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-blue-400/25" : "text-blue-500/20"}`} strokeWidth="2" />
                              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-blue-900/50 text-blue-400" : "bg-white border-slate-100 text-blue-600"}`}>
                                <Mic size={32} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}>Device Audio</h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Capture an in-person meeting, lecture, or conversation directly through your microphone.</p>
                            </div>
                          </motion.button>

                          <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.97 }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-[#131722] ${isDragging ? (isDarkMode ? "border-emerald-400 bg-emerald-900/20" : "border-emerald-400 bg-emerald-50") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50" : "bg-white border-slate-300 hover:border-emerald-400 shadow-sm"}`}>
                            <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0]); }} accept="audio/*,video/*,image/*" className="hidden" />
                            <div className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? "bg-emerald-900/30 border-emerald-800" : "bg-emerald-100/50 border-emerald-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}>
                              <div className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-emerald-600/40" : "bg-emerald-400/40"}`}></div>
                              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? "bg-[#131722] border-emerald-800 text-emerald-400" : "bg-white border-emerald-200 text-emerald-600") : isDarkMode ? "bg-[#131722] border-slate-800 text-slate-300" : "bg-white border-slate-100 text-slate-600"}`}>
                                <ImagePlus size={32} className={isDragging ? "animate-bounce" : ""} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-700"}`}>Upload File</h3>
                              <p className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Post-process an existing audio recording.</p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {status === "uploading" && (
                      <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 gap-6 w-full max-w-lg mx-auto">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                          <FileAudio size={28} />
                        </div>
                        <div className="text-center w-full">
                          <p className="font-bold text-lg tracking-tight mb-1 truncate px-4">{fileName}</p>
                          <p className={`font-medium text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Uploading to Spoly Servers...</p>
                          <div className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
                            <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* LIVE RECORDING PANEL (unchanged layout, simplified code) */}
                {(status === "recording" || status === "processing" || status === "paused") && (
                  <motion.div key="live-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid xl:grid-cols-1 gap-8 h-[75vh]">
                    <div className={`flex flex-col h-full shadow-sm rounded-[2rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                      <div className={`relative p-5 flex items-center justify-between gap-4 border-b ${isDarkMode ? "bg-gradient-to-r from-[#0b0f19] to-[#131722] border-[#2A2F3D]" : "bg-gradient-to-r from-slate-50 to-white border-slate-200"}`}>
                         <h2 className={`font-mono text-2xl font-medium tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}>{formatTime(timer)}</h2>
                         {status !== "processing" && (
                            <button onClick={handleStopLocalRecording} className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">
                              <Square size={14} fill="currentColor" /> Stop & Generate
                            </button>
                         )}
                      </div>
                      
                      {status === "processing" && (
                         <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                            <Zap size={48} className="animate-pulse text-blue-500" />
                            <h3 className="text-2xl font-bold tracking-tight text-blue-500">AI is generating your notes and diagram...</h3>
                            <p className="text-slate-500 font-medium">Please wait a moment while the backend pipeline processes the audio.</p>
                         </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 🌟 NEW FIX: COMPLETELY REDESIGNED SUCCESS SCREEN 🌟 */}
                {status === "complete" && (
                  <motion.div key="success-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl mx-auto space-y-8">
                    
                    {/* Header Banner */}
                    <div className={`rounded-[2.5rem] relative border ${isDarkMode ? "bg-[#0b0f19] border-emerald-500/20 shadow-[0_20px_60px_rgba(16,185,129,0.1)]" : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl border-transparent"}`}>
                      <div className="relative z-20 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${isDarkMode ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/20 text-white border border-white/20"}`}>
                            <CheckCircle2 size={32} />
                          </div>
                          <div>
                            <h2 className={`text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? "text-emerald-50" : "text-white"}`}>Session Saved Successfully!</h2>
                            <p className={`font-medium ${isDarkMode ? "text-emerald-200/70" : "text-emerald-50"}`}>Your backend data has been successfully mapped to the UI.</p>
                          </div>
                        </div>
                        <button onClick={() => { setSelectedNote(savedNotes[0]); setStatus("idle"); }} className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${isDarkMode ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400" : "bg-white text-emerald-600 hover:bg-slate-50"}`}>
                          <FileText size={18} /> Add to Library
                        </button>
                      </div>
                    </div>

                    {/* Backend Data Display - Fully Scalable and Scrollable */}
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Note Content Panel - Replaced line-clamp with scrollable div */}
                      <div className={`rounded-[2rem] p-8 border shadow-sm flex flex-col min-h-[500px] max-h-[800px] ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                        <div className={`flex items-center gap-2 font-bold text-lg mb-6 tracking-tight ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                          <AlignLeft size={20} /> Generated Notes
                        </div>
                        <div className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar pr-4 flex-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          {meetingNotes.summary || "No notes returned from backend."}
                        </div>
                      </div>

                      {/* Mermaid Diagram Panel - Made explicit and error-proof */}
                      <div className={`rounded-[2rem] p-8 border shadow-sm flex flex-col min-h-[500px] max-h-[800px] ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}>
                        <div className={`flex items-center gap-2 font-bold text-lg mb-6 tracking-tight ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                          <Workflow size={20} /> Mermaid Diagram
                        </div>
                        <div className={`flex-1 overflow-auto custom-scrollbar flex items-center justify-center p-6 rounded-xl border ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-100"}`}>
                          {editableMermaid ? (
                            <MermaidDiagram chart={editableMermaid} isDarkMode={isDarkMode} />
                          ) : (
                            <div className="text-center text-slate-500 italic space-y-2">
                               <p>No valid Mermaid diagram found.</p>
                               <p className="text-xs opacity-70">Check backend payload for 'diagram' key.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Reset Button */}
                    <div className="flex justify-center mt-12 pb-6">
                      <button onClick={handleReset} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 ${isDarkMode ? "bg-slate-800 text-white border border-slate-700" : "bg-white text-slate-800 border border-slate-200"}`}>
                        <PlusCircle size={22} className="text-blue-500" /> Start New Recording
                      </button>
                    </div>

                  </motion.div>
                )}

              </motion.div>
            )}

            {/* MODULAR TABS */}
            {activeTab === "notes" && !selectedNote && (
              <motion.div key="notes-tab" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <LibraryTab isDarkMode={isDarkMode} folders={folders} activeFolderId={activeFolderId} setActiveFolderId={setActiveFolderId} isAddingFolder={isAddingFolder} setIsAddingFolder={setIsAddingFolder} newFolderName={newFolderName} setNewFolderName={setNewFolderName} handleAddFolder={handleAddFolder} handleDeleteFolder={handleDeleteFolder} dragOverFolder={dragOverFolder} setDragOverFolder={setDragOverFolder} setSavedNotes={setSavedNotes} savedNotes={savedNotes} showToast={showToast} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notesViewMode={notesViewMode} setNotesViewMode={setNotesViewMode} setSelectedNote={setSelectedNote} />
              </motion.div>
            )}

            {selectedNote && (
              <motion.div key="detail-tab" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <NoteDetailView isDarkMode={isDarkMode} selectedNote={selectedNote} exportFormat={exportFormat} showToast={showToast} />
              </motion.div>
            )}

            {activeTab === "templates" && (
              <motion.div key="templates-tab" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <TemplatesTab isDarkMode={isDarkMode} templateFilter={templateFilter} setTemplateFilter={setTemplateFilter} templateCategories={templateCategories} templatesDB={templatesDB} setActiveAiTemplate={setActiveAiTemplate} setActiveTab={setActiveTab} showToast={showToast} />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings-tab" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <SettingsView user={user} settingsToggles={settingsToggles} setSettingsToggles={setSettingsToggles} showToast={showToast} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} exportFormat={exportFormat} setExportFormat={setExportFormat} selectedMic={selectedMic} setSelectedMic={setSelectedMic} audioConstraints={audioConstraints} setAudioConstraints={setAudioConstraints} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}