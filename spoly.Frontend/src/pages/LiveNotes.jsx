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
      // 🚀 Use setTimeout here as well for React component resilience
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
    {
      d1: "bg-rose-900/20",
      d2: "bg-orange-900/20",
      l1: "bg-rose-300/30",
      l2: "bg-orange-300/30",
    },
    {
      d1: "bg-emerald-900/20",
      d2: "bg-teal-900/20",
      l1: "bg-emerald-300/30",
      l2: "bg-teal-300/30",
    },
    {
      d1: "bg-purple-900/20",
      d2: "bg-pink-900/20",
      l1: "bg-purple-300/30",
      l2: "bg-pink-300/30",
    },
    {
      d1: "bg-amber-900/20",
      d2: "bg-red-900/20",
      l1: "bg-amber-300/30",
      l2: "bg-red-300/30",
    },
  ];
  const hash =
    file.name.charCodeAt(0) +
    file.name.charCodeAt(file.name.length - 1) +
    file.size;
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

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("spoly_dark") === "true",
  );
  const [exportFormat, setExportFormat] = useState(
    () => localStorage.getItem("spoly_export") || "markdown",
  );
  const [settingsToggles, setSettingsToggles] = useState({ notion: false });
  const [selectedMic, setSelectedMic] = useState(
    () => localStorage.getItem("spoly_mic") || "default",
  );
  const [audioConstraints, setAudioConstraints] = useState(() => {
    const saved = localStorage.getItem("spoly_audio");
    return saved
      ? JSON.parse(saved)
      : { echoCancellation: true, noiseSuppression: true };
  });

  const [contextTheme, setContextTheme] = useState(null);

  useEffect(() => {
    localStorage.setItem("spoly_dark", isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(
    () => localStorage.setItem("spoly_export", exportFormat),
    [exportFormat],
  );
  useEffect(
    () => localStorage.setItem("spoly_mic", selectedMic),
    [selectedMic],
  );
  useEffect(
    () => localStorage.setItem("spoly_audio", JSON.stringify(audioConstraints)),
    [audioConstraints],
  );

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

  // 🚀 FIXED: Using a Ref so React's stale closure bug doesn't forget the title!
  const capturedTitleRef = useRef("");

  const handleTranscriptScroll = () => {
    if (!transcriptContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      transcriptContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAutoScrolling.current = isNearBottom;
    if (!isNearBottom && !showResumeScroll) setShowResumeScroll(true);
    else if (isNearBottom && showResumeScroll) setShowResumeScroll(false);
  };

  useEffect(() => {
    if (isAutoScrolling.current && transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  const [activeAiTemplate, setActiveAiTemplate] = useState(null);
  const activeAiTemplateRef = useRef(null);

  useEffect(() => {
    activeAiTemplateRef.current = activeAiTemplate;
  }, [activeAiTemplate]);

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

  // 🚀 RACE CONDITION SAFEGUARDS
  const stopTriggeredRef = useRef(false);
  const isPausedRef = useRef(false);

  const milestones = useRef({
    summary: false,
    takeaways: false,
    decisions: false,
    actions: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState("All");

  const [notesViewMode, setNotesViewMode] = useState("grid");
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const fullTranscript =
    "Alright, let's map out the new checkout flow. The user starts on the frontend client. They hit the API Gateway. The Gateway routes to the Auth Service to validate the session. If valid, the Auth Service checks the Postgres Database, and also caches the active session into Redis. Finally, we return the secure token back to the client. We need to make sure the Redis cache has a TTL of 15 minutes to avoid stale sessions. Action item for John to configure the API Gateway routing rules by tomorrow. Sarah, you'll handle the Redis caching logic. Let's make sure the token return is encrypted. Also, ensure logging is pushed to Datadog for observability.";

  const [meetingNotes, setMeetingNotes] = useState({
    summary: "",
    takeaways: "",
    decisions: "",
  });
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
      // 🚀 ABSOLUTE LOCKDOWN: Ignore unpause requests if we already triggered a stop!
      if (stopTriggeredRef.current) return;

      isPausedRef.current = isPaused;
      if (isPaused) {
        if (typingRef.current) {
          clearInterval(typingRef.current);
          typingRef.current = null;
        }
        setStatus("paused");
      } else {
        setStatus("recording");
        if (!typingRef.current) {
          typingRef.current = setInterval(runSimulationTick, 100);
        }
      }
    };
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("autoStart") === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        if (forceStartRef.current) forceStartRef.current();
      }, 500);
    }

    const handleMessage = (e) => {
      const type = e.data?.type;

      if (
        type === "SPOLY_RECORDING_STARTED" ||
        type === "SPOLY_HEARTBEAT_LIVE"
      ) {
        // 🚀 FORCE GRAB TITLE FROM HEARTBEAT
        if (
          e.data.title &&
          e.data.title.trim() !== "" &&
          e.data.title !== "Live Web Capture"
        ) {
          capturedTitleRef.current = e.data.title;
        }
        if (e.data.speakerState) {
          setGlobalSpeakerColor(
            e.data.speakerState === "sys" ? "bg-purple-500" : "bg-blue-500",
          );
        }
        if (forceStartRef.current) forceStartRef.current(e.data.title);
      } else if (
        type === "SPOLY_RECORDING_STOPPED" ||
        type === "SPOLY_UPLOAD_COMPLETE"
      ) {
        if (stopLocalRef.current) stopLocalRef.current();
      } else if (type === "INTERNAL_SYNC_UI") {
        // 🚀 SAFEGUARD: If extension broadcasts that it's no longer live, forcefully stop
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

  const [savedNotes, setSavedNotes] = useState([
    {
      id: 1,
      title: "OS Process Scheduling",
      date: "Mar 12, 2026",
      folderId: "personal",
      duration: "45:20",
      items: 4,
      tags: ["Education", "OS", "Urgent"],
      summary:
        "Detailed breakdown of process scheduling algorithms including Round Robin, FCFS, and SJF.",
      takeaways:
        "• SJF provides the minimum average waiting time.\n• Round Robin is essential for time-sharing systems.",
      decisions: "1. Implement Round Robin simulator for the assignment.",
      graph:
        "graph TD;\n  ReadyQueue-->CPU;\n  CPU-->|Time Quantum Expired|ReadyQueue;\n  CPU-->|I/O Request|WaitingQueue;\n  WaitingQueue-->|I/O Complete|ReadyQueue;",
      audioUrl: null,
    },
  ]);

  const toggleActionItem = (id) =>
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAddFolder = (e) => {
    if (e.key === "Enter" && newFolderName.trim()) {
      const colors = [
        "text-emerald-500",
        "text-purple-500",
        "text-pink-500",
        "text-cyan-500",
        "text-rose-500",
        "text-indigo-500",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newFolder = {
        id: `folder_${Date.now()}`,
        name: newFolderName.trim(),
        color: randomColor,
        isDefault: false,
      };
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      setIsAddingFolder(false);
      showToast(`Folder "${newFolder.name}" created!`);
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    const folderName = folders.find((f) => f.id === folderId)?.name;
    if (
      window.confirm(
        `Are you sure you want to delete the "${folderName}" folder?\n\nAny notes inside will be safely moved back to "All Notes".`,
      )
    ) {
      setSavedNotes((prev) =>
        prev.map((n) =>
          n.folderId === folderId ? { ...n, folderId: "all" } : n,
        ),
      );
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      if (activeFolderId === folderId) setActiveFolderId("all");
      showToast("Folder deleted.");
    }
  };

  const finishProcessing = (customTitle = null, overrideAudioUrl = null) => {
    setStatus("complete");
    setIsExtensionActive(false);
    setIsWidgetDeployed(false);
    setAudioStream(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;
    showToast(
      processingType === "image"
        ? "Whiteboard Converted Successfully!"
        : `Processed in ${outputLanguage}!`,
    );

    // 🚀 AUTO TITLING: Safely accesses the physical reference
    let finalTitle =
      capturedTitleRef.current ||
      `Live Session ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (customTitle && customTitle !== "Live Capture") finalTitle = customTitle;
    if (activeAiTemplate)
      finalTitle = `[${activeAiTemplate.name}] ${finalTitle}`;

    const finalAudioUrl = overrideAudioUrl || currentAudioUrl;

    const newNote = {
      id: Date.now(),
      title: finalTitle,
      folderId: "all",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      duration: formatTime(timerRef.current),
      items: actionItems.length,
      tags: [outputLanguage, activeAiTemplate?.category || "AI"],
      summary:
        meetingNotes.summary || "Summary successfully generated from context.",
      takeaways: meetingNotes.takeaways || "• Key points extracted seamlessly.",
      decisions: meetingNotes.decisions,
      graph: editableMermaid,
      audioUrl: finalAudioUrl,
    };

    setSavedNotes((prev) => [newNote, ...prev]);
  };

  const getDiagramForTemplate = (step) => {
    const templateName = activeAiTemplateRef.current?.name || "";

    if (templateName.includes("Sequence")) {
      if (step === 1) return "sequenceDiagram\n  Client->>API_Gateway: Request";
      if (step === 2)
        return "sequenceDiagram\n  Client->>API_Gateway: Request\n  API_Gateway->>Auth_Service: Validate";
      return "sequenceDiagram\n  Client->>API_Gateway: Request\n  API_Gateway->>Auth_Service: Validate\n  Auth_Service->>DB: Query\n  Auth_Service->>Cache: Set\n  API_Gateway-->>Client: Token";
    }

    if (templateName.includes("ERD") || templateName.includes("Database")) {
      if (step === 1) return "erDiagram\n  CLIENT ||--o{ SESSION : creates";
      if (step === 2)
        return "erDiagram\n  CLIENT ||--o{ SESSION : creates\n  SESSION ||--|| DATABASE : validates";
      return "erDiagram\n  CLIENT ||--o{ SESSION : creates\n  SESSION ||--|| DATABASE : validates\n  SESSION }|--|| REDIS_CACHE : stores\n  CLIENT { string id\n string token }";
    }

    if (templateName.includes("Mind Map")) {
      if (step === 1) return "mindmap\n  root((Checkout))\n    Client";
      if (step === 2)
        return "mindmap\n  root((Checkout))\n    Client\n    Gateway";
      return "mindmap\n  root((Checkout))\n    Client\n    Gateway\n      Auth Service\n        Database\n        Redis Cache";
    }

    if (templateName.includes("Timeline")) {
      if (step === 1)
        return "timeline\n  title Checkout\n  Step 1 : Client Request";
      if (step === 2)
        return "timeline\n  title Checkout\n  Step 1 : Client Request\n  Step 2 : Gateway Route";
      return "timeline\n  title Checkout\n  Step 1 : Client Request\n  Step 2 : Gateway Route\n  Step 3 : Validation & Cache";
    }

    if (step === 1)
      return "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;";
    if (step === 2)
      return "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];";
    return "graph TD;\n  Client-->API_Gateway;\n  API_Gateway-->Auth_Service;\n  Auth_Service-->DB[(PostgreSQL)];\n  Auth_Service-->Cache{Redis};\n  Auth_Service-->|Token|Client;";
  };

  const runSimulationTick = () => {
    // 🚀 PHYSICAL BLOCK: Aborts instantly if pause state or stop state is active
    if (isPausedRef.current) {
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
      return;
    }
    if (stopTriggeredRef.current) {
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
      return;
    }

    let i = simulationIndex.current;
    i += Math.floor(Math.random() * 5) + 2;
    if (i > fullTranscript.length) i = fullTranscript.length;
    simulationIndex.current = i;
    setTranscript(fullTranscript.slice(0, i));

    if (i > 80 && !milestones.current.summary) {
      milestones.current.summary = true;
      setMeetingNotes((prev) => ({
        ...prev,
        summary:
          "The team is mapping out the secure checkout authentication flow...",
      }));
      setEditableMermaid(getDiagramForTemplate(1));
    }
    if (i > 200 && !milestones.current.takeaways) {
      milestones.current.takeaways = true;
      setMeetingNotes((prev) => ({
        ...prev,
        takeaways: "• Frontend interactions are secured via API Gateway.",
      }));
      setEditableMermaid(getDiagramForTemplate(2));
    }
    if (i > 300 && !milestones.current.decisions) {
      milestones.current.decisions = true;
      setMeetingNotes((prev) => ({
        ...prev,
        decisions: "1. Cache active sessions into Redis.",
      }));
      setEditableMermaid(getDiagramForTemplate(3));
    }
    if (i > 400 && !milestones.current.actions) {
      milestones.current.actions = true;
      setActionItems([
        { id: 1, text: "Configure API Gateway routing rules", done: false },
        { id: 2, text: "Setup Redis caching", done: false },
      ]);
    }
  };

  const forceStartSimulation = (scrapedTitle) => {
    // 🚀 Prevent stray heartbeats from restarting the interval after a stop
    if (stopTriggeredRef.current) return;
    if (
      status === "recording" ||
      status === "processing" ||
      status === "paused"
    )
      return;

    if (scrapedTitle && typeof scrapedTitle === "string")
      setCapturedTitle(scrapedTitle);
    else setCapturedTitle("");

    setActiveTab("workspace");
    setIsExtensionActive(true);
    setStatus("recording");
    stopTriggeredRef.current = false;
    setProcessingType("audio");

    isPausedRef.current = false;

    setTranscript("");
    setTimer(0);
    timerRef.current = 0;
    simulationIndex.current = 0;
    milestones.current = {
      summary: false,
      takeaways: false,
      decisions: false,
      actions: false,
    };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaid("");
    setCurrentAudioUrl(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;

    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(runSimulationTick, 100);
  };

  const handleStartLocalRecording = async () => {
    let stream = null;
    try {
      const constraints = {
        echoCancellation: audioConstraints.echoCancellation,
        noiseSuppression: audioConstraints.noiseSuppression,
      };
      if (selectedMic !== "default")
        constraints.deviceId = { exact: selectedMic };
      stream = await navigator.mediaDevices.getUserMedia({
        audio: constraints,
      });
    } catch (err) {
      console.warn("Spoly: Mic denied", err);
    }

    setActiveTab("workspace");
    setIsExtensionActive(false);
    setStatus("recording");
    stopTriggeredRef.current = false;
    setProcessingType("audio");

    isPausedRef.current = false;

    setTranscript("");
    setTimer(0);
    timerRef.current = 0;
    simulationIndex.current = 0;
    milestones.current = {
      summary: false,
      takeaways: false,
      decisions: false,
      actions: false,
    };
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaid("");
    setCurrentAudioUrl(null);
    setShowResumeScroll(false);
    isAutoScrolling.current = true;

    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(runSimulationTick, 100);

    if (stream) {
      setAudioStream(stream);

      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/webm" };
      }

      const recorder = new MediaRecorder(stream, options);
      localAudioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          localAudioChunks.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        try {
          const finalBlob = new Blob(localAudioChunks.current, {
            type: "audio/webm",
          });
          const audioUrl = window.URL.createObjectURL(finalBlob);

          setCurrentAudioUrl(audioUrl);
          finishProcessing("Live Capture", audioUrl);
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
      showToast("Mic unavailable or denied. Running AI Simulation mode.");
      localMediaRecorderRef.current = null;
    }
  };

  const toggleLocalPause = () => {
    if (status === "recording") {
      if (localMediaRecorderRef.current?.state === "recording")
        localMediaRecorderRef.current.pause();
      isPausedRef.current = true;
      setStatus("paused");
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
    } else if (status === "paused") {
      if (localMediaRecorderRef.current?.state === "paused")
        localMediaRecorderRef.current.resume();
      isPausedRef.current = false;
      setStatus("recording");
      if (!typingRef.current)
        typingRef.current = setInterval(runSimulationTick, 100);
    }
  };

  const handleStopLocalRecording = () => {
    if (stopTriggeredRef.current) return;

    // 🚀 ABSOLUTE LOCKDOWN: Instantly kill the typing intervals and prevent them from ever restarting
    stopTriggeredRef.current = true;
    isPausedRef.current = true;

    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    setStatus("processing");
    setAudioStream(null);

    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state !== "inactive"
    ) {
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
      alert(
        "⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!",
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      processFile(e.dataTransfer.files[0]);
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
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadRef.current);
        setStatus("processing");
        if (isImage) {
          setTimeout(() => finishProcessing(), 3000);
        } else {
          let i = 0;
          if (typingRef.current) clearInterval(typingRef.current);
          milestones.current = {
            summary: false,
            takeaways: false,
            decisions: false,
            actions: false,
          };
          typingRef.current = setInterval(() => {
            i += Math.floor(Math.random() * 20) + 15;
            setTranscript(fullTranscript.slice(0, i));
            if (!milestones.current.summary && i > 50) {
              milestones.current.summary = true;
              setMeetingNotes({
                summary: "Team mapped out secure checkout.",
                takeaways: "• Interactions via API Gateway.",
                decisions: "1. Use Redis.",
              });
              setEditableMermaid(getDiagramForTemplate(1));
              setActionItems([
                { id: 1, text: "Configure API Gateway", done: false },
              ]);
            }
            if (i >= fullTranscript.length) {
              clearInterval(typingRef.current);
              setTimeout(() => finishProcessing(), 1500);
            }
          }, 40);
        }
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const processYoutube = (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    setProcessingType("youtube");
    setFileName("Fetching YouTube Transcript...");
    setStatus("uploading");
    setUploadProgress(0);
    stopTriggeredRef.current = false;
    let progress = 0;
    if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadRef.current);
        setStatus("processing");
        let i = 0;
        if (typingRef.current) clearInterval(typingRef.current);
        milestones.current = {
          summary: false,
          takeaways: false,
          decisions: false,
          actions: false,
        };
        typingRef.current = setInterval(() => {
          i += Math.floor(Math.random() * 20) + 15;
          setTranscript(fullTranscript.slice(0, i));
          if (i >= fullTranscript.length) {
            clearInterval(typingRef.current);
            setTimeout(() => {
              finishProcessing("YouTube Video Notes", null);
              setYoutubeUrl("");
            }, 1500);
          }
        }, 40);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
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

  const removeContextFile = (index) => {
    setContextFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) setContextTheme(null);
      else setContextTheme(generateThemeFromFile(newFiles[0]));
      return newFiles;
    });
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
    capturedTitleRef.current = ""; // Reset Title
  };

  const triggerRemix = (template) => {
    setShowRemixMenu(false);
    setIsRemixing(true);
    setActiveAiTemplate(template);
    activeAiTemplateRef.current = template;

    setTimeout(() => {
      const newDiagram = getDiagramForTemplate(3);
      const newSummaryPrefix = `✨ Document dynamically restructured to fit the ${template.name} framework.`;
      const cleanOldSummary = meetingNotes.summary.replace(
        /^✨ Document dynamically restructured to fit the .*? framework\.\n\n/,
        "",
      );
      const newSummary = `${newSummaryPrefix}\n\n${cleanOldSummary}`;

      setMeetingNotes((prev) => ({ ...prev, summary: newSummary }));
      setEditableMermaid(newDiagram);

      setSavedNotes((prev) => {
        if (!prev || prev.length === 0) return prev;
        const updatedNotes = [...prev];
        let baseTitle = updatedNotes[0].title.replace(/^\[.*?\]\s*/, "");
        updatedNotes[0] = {
          ...updatedNotes[0],
          title: `[${template.name}] ${baseTitle}`,
          tags: [outputLanguage, template.category || "AI"],
          summary: newSummary,
          graph: newDiagram,
        };
        return updatedNotes;
      });

      setIsRemixing(false);
      showToast(`Successfully remixed to ${template.name}!`);
    }, 2500);
  };

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={`flex h-screen relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "text-slate-100 bg-[#0b0f19]" : "text-slate-900 bg-[#f8fafc]"}`}
    >
      <ScrollbarStyles />
      <WorkspaceMeshBackground
        isDarkMode={isDarkMode}
        customTheme={contextTheme}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${isDarkMode ? "bg-white text-slate-900 border-slate-200" : "bg-slate-900 text-white border-slate-700"}`}
          >
            <Sparkles size={18} className="text-amber-500" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar
        isDarkMode={isDarkMode}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleReset={handleReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedNote={setSelectedNote}
        user={user}
      />

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto overflow-x-hidden min-w-0">
        <header
          className={`px-8 py-6 flex justify-between items-center border-b sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-[#0b0f19]/80 backdrop-blur-md border-[#232a3b]" : "bg-white/30 backdrop-blur-md border-white/40"}`}
        >
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">
              {selectedNote
                ? selectedNote.title
                : activeTab === "workspace"
                  ? "Active Workspace"
                  : activeTab}
            </h1>
            <p
              className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              {selectedNote
                ? `Saved on ${selectedNote.date}`
                : new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {(status === "recording" || status === "paused") &&
              activeTab !== "workspace" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${isDarkMode ? "bg-[#131722]" : "bg-white"} ${status === "recording" ? (isDarkMode ? "shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/40" : "shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-300") : isDarkMode ? "shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/40" : "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-300"}`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${status === "paused" ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}
                  ></div>
                  <span
                    className={`font-mono text-sm font-bold tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {formatTime(timer)}
                  </span>

                  {!isExtensionActive && (
                    <>
                      <div
                        className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
                      ></div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={toggleLocalPause}
                          className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors ${status === "paused" ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" : isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
                          title={status === "paused" ? "Resume" : "Pause"}
                        >
                          {status === "paused" ? (
                            <Play size={14} fill="currentColor" />
                          ) : (
                            <Pause size={14} fill="currentColor" />
                          )}
                        </button>
                        <button
                          onClick={handleStopLocalRecording}
                          className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors"
                          title="Save & Stop"
                        >
                          <Square size={12} fill="currentColor" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

            {activeTab === "workspace" && status === "idle" && (
              <>
                <div
                  className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? "bg-[#131722] border border-[#232a3b]" : "bg-white border border-slate-200"}`}
                >
                  <Languages size={18} className="text-blue-500" />
                  <select
                    value={outputLanguage}
                    onChange={(e) => setOutputLanguage(e.target.value)}
                    className={`bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md text-sm font-bold cursor-pointer ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    <option
                      className={
                        isDarkMode
                          ? "bg-slate-800 text-slate-200"
                          : "bg-white text-slate-900"
                      }
                    >
                      English
                    </option>
                    <option
                      className={
                        isDarkMode
                          ? "bg-slate-800 text-slate-200"
                          : "bg-white text-slate-900"
                      }
                    >
                      Hindi
                    </option>
                    <option
                      className={
                        isDarkMode
                          ? "bg-slate-800 text-slate-200"
                          : "bg-white text-slate-900"
                      }
                    >
                      Spanish
                    </option>
                  </select>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${isDarkMode ? "bg-emerald-900/20 border border-emerald-800/50 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-700"}`}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
                  Ready
                </div>
              </>
            )}
            {selectedNote && (
              <button
                onClick={() => setSelectedNote(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0b0f19] ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}
              >
                <ChevronLeft size={16} /> Back to Library
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === "workspace" && !selectedNote && (
              <motion.div
                key="workspace-tab"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                {(status === "idle" || status === "uploading") && (
                  <motion.div
                    key="recording-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`shadow-xl rounded-2xl p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-white/70 backdrop-blur-xl border-white"}`}
                  >
                    <div
                      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3.5 rounded-xl shadow-sm border ${isDarkMode ? "bg-indigo-900/30 text-indigo-400 border-indigo-800/50" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
                        >
                          <Play size={24} className="animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold tracking-tight">
                            Initialize Workspace
                          </h2>
                          <p
                            className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            Select a data source to begin capturing intelligent
                            notes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeAiTemplate && status === "idle" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-sm ${isDarkMode ? "bg-indigo-900/20 border-indigo-800/30" : "bg-indigo-50 border-indigo-200"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 flex items-center justify-center rounded-xl ${isDarkMode ? "bg-indigo-900/50 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
                            >
                              {activeAiTemplate.icon}
                            </div>
                            <div>
                              <p
                                className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`}
                              >
                                Active Template
                              </p>
                              <h3
                                className={`text-lg font-bold ${isDarkMode ? "text-indigo-100" : "text-indigo-900"}`}
                              >
                                {activeAiTemplate.name}
                              </h3>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveAiTemplate(null)}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "hover:bg-indigo-900/50 text-indigo-400" : "hover:bg-indigo-200 text-indigo-600"}`}
                          >
                            <X size={20} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {status === "idle" && (
                      <motion.div
                        key="idle-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-6">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleToggleWidget}
                            className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] ${isWidgetDeployed ? (isDarkMode ? "bg-red-950/20 border-red-900" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-indigo-600" : "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"}`}
                          >
                            <div
                              className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isWidgetDeployed ? (isDarkMode ? "bg-[#0b0f19] border-red-900/50" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
                            >
                              <div
                                className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-red-600/40" : "bg-red-400/40") : isDarkMode ? "bg-purple-600/40" : "bg-purple-300/40"}`}
                              ></div>
                              <div
                                className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-orange-600/40" : "bg-orange-400/40") : isDarkMode ? "bg-indigo-600/40" : "bg-indigo-300/40"}`}
                              ></div>

                              <Sparkles
                                className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-orange-500/25" : "text-orange-500/20") : isDarkMode ? "text-purple-400/25" : "text-purple-500/20"}`}
                                strokeWidth="2"
                              />
                              <Workflow
                                className={`absolute right-6 top-4 w-24 h-24 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-red-500/25" : "text-red-500/20") : isDarkMode ? "text-indigo-400/25" : "text-indigo-500/20"}`}
                                strokeWidth="2"
                              />

                              <div
                                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isWidgetDeployed ? (isDarkMode ? "bg-red-950 border-red-800 text-red-400" : "bg-white border-red-200 text-red-600") : isDarkMode ? "bg-[#131722] border-indigo-900/50 text-indigo-400" : "bg-white border-slate-100 text-indigo-600"}`}
                              >
                                {isWidgetDeployed ? (
                                  <X size={32} />
                                ) : (
                                  <Puzzle size={32} />
                                )}
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3
                                className={`text-xl font-bold mb-2 transition-colors ${isWidgetDeployed ? (isDarkMode ? "text-red-300" : "text-red-900") : isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-700"}`}
                              >
                                {isWidgetDeployed
                                  ? "Close Extension"
                                  : "Web Record"}
                              </h3>
                              <p
                                className={`text-sm font-medium leading-relaxed pr-8 ${isWidgetDeployed ? (isDarkMode ? "text-red-400/80" : "text-red-700/80") : isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                {isWidgetDeployed
                                  ? "Hide the Spoly widget."
                                  : "Inject the Spoly bot into the screen to capture any Google Meet or web audio."}
                              </p>
                            </div>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleStartLocalRecording}
                            className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"}`}
                          >
                            <div
                              className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
                            >
                              <div
                                className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-blue-600/40" : "bg-blue-400/40"}`}
                              ></div>
                              <div
                                className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-cyan-600/40" : "bg-cyan-400/40"}`}
                              ></div>

                              <Headphones
                                className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-blue-400/25" : "text-blue-500/20"}`}
                                strokeWidth="2"
                              />
                              <Activity
                                className={`absolute right-6 top-4 w-24 h-24 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-cyan-400/25" : "text-cyan-500/20"}`}
                                strokeWidth="2"
                              />

                              <div
                                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-blue-900/50 text-blue-400" : "bg-white border-slate-100 text-blue-600"}`}
                              >
                                <Mic size={32} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3
                                className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}
                              >
                                Device Audio
                              </h3>
                              <p
                                className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                Capture an in-person meeting, lecture, or
                                conversation directly through your microphone.
                              </p>
                            </div>
                          </motion.button>

                          <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                            }}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-[#131722] ${isDragging ? (isDarkMode ? "border-emerald-400 bg-emerald-900/20" : "border-emerald-400 bg-emerald-50") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50" : "bg-white border-slate-300 hover:border-emerald-400 shadow-sm"}`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => {
                                if (e.target.files.length)
                                  processFile(e.target.files[0]);
                              }}
                              accept="audio/*,video/*,image/*"
                              className="hidden"
                            />
                            <div
                              className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? "bg-emerald-900/30 border-emerald-800" : "bg-emerald-100/50 border-emerald-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
                            >
                              <div
                                className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-emerald-600/40" : "bg-emerald-400/40"}`}
                              ></div>
                              <div
                                className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-teal-600/40" : "bg-teal-400/40"}`}
                              ></div>

                              <Database
                                className={`absolute left-6 bottom-2 w-20 h-20 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-emerald-400/25" : "text-emerald-500/20"}`}
                                strokeWidth="2"
                              />
                              <FileText
                                className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-teal-400/25" : "text-teal-500/20"}`}
                                strokeWidth="2"
                              />

                              <div
                                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? "bg-[#131722] border-emerald-800 text-emerald-400" : "bg-white border-emerald-200 text-emerald-600") : isDarkMode ? "bg-[#131722] border-slate-800 text-slate-300" : "bg-white border-slate-100 text-slate-600"}`}
                              >
                                <ImagePlus
                                  size={32}
                                  className={isDragging ? "animate-bounce" : ""}
                                />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3
                                className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-700"}`}
                              >
                                {isDragging ? "Drop File Here" : "Upload File"}
                              </h3>
                              <p
                                className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                Post-process an existing audio recording or
                                image of a whiteboard.
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-red-500/50" : "bg-white border-slate-200 hover:border-red-300 shadow-sm"}`}
                          >
                            <div
                              className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
                            >
                              <div
                                className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-red-600/40" : "bg-red-400/40"}`}
                              ></div>
                              <div
                                className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-orange-600/40" : "bg-orange-400/40"}`}
                              ></div>

                              <PlayCircle
                                className={`absolute left-6 bottom-2 w-20 h-20 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-red-400/25" : "text-red-500/20"}`}
                                strokeWidth="2"
                              />
                              <Video
                                className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-orange-400/25" : "text-orange-500/20"}`}
                                strokeWidth="2"
                              />

                              <div
                                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-red-900/50 text-red-400" : "bg-white border-slate-100 text-red-600"}`}
                              >
                                <Youtube size={32} />
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col w-full relative z-20">
                              <h3
                                className={`text-xl font-bold mb-3 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-red-400" : "text-slate-800 group-hover:text-red-600"}`}
                              >
                                YouTube Link
                              </h3>
                              <form
                                onSubmit={processYoutube}
                                className="w-full relative mt-auto group/form"
                              >
                                <input
                                  type="text"
                                  placeholder="Paste video URL here..."
                                  value={youtubeUrl}
                                  onChange={(e) =>
                                    setYoutubeUrl(e.target.value)
                                  }
                                  className={`w-full text-sm pl-4 pr-12 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-white placeholder-slate-500 group-hover/form:border-red-500/50" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 group-hover/form:border-red-300"}`}
                                />
                                <button
                                  type="submit"
                                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${youtubeUrl ? "bg-red-500 text-white hover:bg-red-600 shadow-md" : isDarkMode ? "text-slate-600 bg-transparent" : "text-slate-400 bg-transparent"}`}
                                >
                                  <ArrowRight size={16} />
                                </button>
                              </form>
                            </div>
                          </motion.div>
                        </div>

                        <div
                          className={`group rounded-2xl p-6 transition-colors border relative overflow-hidden ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-white border-slate-200 shadow-sm"}`}
                        >
                          <div
                            className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-indigo-600/20 group-hover:bg-indigo-500/30" : "bg-indigo-300/30 group-hover:bg-indigo-300/40"}`}
                          ></div>
                          <div
                            className={`absolute bottom-0 left-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-purple-600/20 group-hover:bg-purple-500/30" : "bg-purple-300/30 group-hover:bg-purple-300/40"}`}
                          ></div>

                          <FolderSearch
                            className={`absolute right-10 top-2 w-32 h-32 transform rotate-12 transition-all duration-700 pointer-events-none ${isDarkMode ? "text-indigo-400 opacity-20" : "text-indigo-500 opacity-15"}`}
                            strokeWidth="1.5"
                          />
                          <div className="relative z-10">
                            <div
                              className={`flex items-center gap-2 mb-4 font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}
                            >
                              <FileUp
                                size={20}
                                className={
                                  isDarkMode
                                    ? "text-indigo-400"
                                    : "text-indigo-500"
                                }
                              />{" "}
                              Add Pre-Context Documents
                            </div>
                            <p
                              className={`text-sm mb-4 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Upload a Syllabus, PRD, or past notes so the AI
                              understands specific terminology before generating
                              the diagram.
                            </p>
                            <button
                              onClick={() => contextInputRef.current.click()}
                              className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1f2e] ${isDraggingContext ? (isDarkMode ? "border-indigo-500 bg-indigo-900/20" : "border-indigo-500 bg-indigo-50") : isDarkMode ? "border-[#232a3b] bg-[#131722] hover:bg-[#0b0f19]" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingContext(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDraggingContext(false);
                              }}
                              onDrop={handleContextDrop}
                            >
                              <input
                                type="file"
                                multiple
                                ref={contextInputRef}
                                onChange={(e) => {
                                  if (e.target.files.length) {
                                    const file = e.target.files[0];
                                    setContextFiles((prev) => [
                                      ...prev,
                                      ...Array.from(e.target.files),
                                    ]);
                                    setContextTheme(
                                      generateThemeFromFile(file),
                                    );
                                    showToast(
                                      "Context Attached! Theme adjusted.",
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                              <span
                                className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                <UploadCloud size={16} /> Drag & Drop PDFs/Docs
                                here
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {status === "uploading" && (
                      <motion.div
                        key="uploading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10 gap-6 w-full max-w-lg mx-auto"
                      >
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${processingType === "youtube" ? (isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600") : isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                        >
                          {processingType === "image" ? (
                            <ImageIcon size={28} />
                          ) : processingType === "youtube" ? (
                            <Youtube size={28} />
                          ) : (
                            <FileAudio size={28} />
                          )}
                        </div>
                        <div className="text-center w-full">
                          <p className="font-bold text-lg tracking-tight mb-1 truncate px-4">
                            {fileName}
                          </p>
                          <p
                            className={`font-medium text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {processingType === "youtube"
                              ? "Fetching Transcript from YouTube..."
                              : "Uploading to Spoly Servers..."}
                          </p>
                          <div
                            className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
                          >
                            <motion.div
                              className={`h-full ${processingType === "youtube" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ ease: "linear" }}
                            />
                          </div>
                          <p
                            className={`text-right text-xs font-bold mt-2 ${processingType === "youtube" ? (isDarkMode ? "text-red-400" : "text-red-600") : isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                          >
                            {Math.floor(uploadProgress)}%
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {(status === "recording" ||
                  status === "processing" ||
                  status === "paused") && (
                  <motion.div
                    key="live-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid xl:grid-cols-12 gap-8 h-[75vh]"
                  >
                    <div
                      className={`xl:col-span-4 flex flex-col h-full shadow-sm rounded-[2rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      <div
                        className={`relative p-5 flex items-center justify-between gap-4 border-b ${isDarkMode ? "bg-gradient-to-r from-[#0b0f19] to-[#131722] border-[#2A2F3D]" : "bg-gradient-to-r from-slate-50 to-white border-slate-200"}`}
                      >
                        <div
                          className={`absolute left-0 w-32 h-full blur-[40px] opacity-20 pointer-events-none transition-colors duration-1000 ${status === "recording" ? globalSpeakerColor : status === "paused" ? "bg-amber-500" : ""}`}
                        ></div>

                        <div className="flex items-center gap-3 shrink-0 z-10">
                          <div
                            className={`w-3 h-3 rounded-full ${status === "paused" ? "bg-amber-500" : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`}
                          ></div>
                          <h2
                            className={`font-mono text-2xl sm:text-3xl font-medium tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
                          >
                            {formatTime(timer)}
                          </h2>
                        </div>

                        <div className="flex-1 hidden sm:flex justify-center items-center px-2 h-8 overflow-hidden z-10 shrink-0">
                          <LiveAudioVisualizer
                            stream={audioStream}
                            isRecording={status === "recording"}
                            colorClass={
                              status === "paused"
                                ? "bg-amber-500"
                                : globalSpeakerColor
                            }
                          />
                        </div>

                        {!isExtensionActive &&
                          (status === "recording" || status === "paused") && (
                            <div className="flex items-center gap-2 z-10 shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleLocalPause}
                                className={`flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors ${status === "paused" ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" : isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
                                title={status === "paused" ? "Resume" : "Pause"}
                              >
                                {status === "paused" ? (
                                  <Play
                                    size={16}
                                    fill="currentColor"
                                    className="ml-0.5"
                                  />
                                ) : (
                                  <Pause size={16} fill="currentColor" />
                                )}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStopLocalRecording}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] transition-colors"
                                title="Save & Stop"
                              >
                                <Square size={14} fill="currentColor" />
                              </motion.button>
                            </div>
                          )}
                      </div>

                      <div
                        className={`p-4 px-6 border-b flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isDarkMode ? "bg-[#131722]/80 border-[#2A2F3D] text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                      >
                        <List size={14} /> Live Transcript
                      </div>

                      <div className="relative flex-1 min-h-0 bg-transparent">
                        <div
                          ref={transcriptContainerRef}
                          onScroll={handleTranscriptScroll}
                          className={`absolute inset-0 overflow-y-auto custom-scrollbar p-6 ${isDarkMode ? "bg-[#1a1f2e]" : "bg-white"}`}
                          style={{
                            maskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%)",
                            WebkitMaskImage:
                              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%)",
                          }}
                        >
                          <p
                            className={`font-sans font-medium leading-relaxed text-sm pr-2 pt-6 pb-12 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                          >
                            {transcript}
                            {status === "recording" && (
                              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse rounded-sm"></span>
                            )}
                          </p>
                          <div ref={transcriptEndRef} />
                        </div>

                        <AnimatePresence>
                          {showResumeScroll && (
                            <motion.button
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              onClick={() => {
                                isAutoScrolling.current = true;
                                setShowResumeScroll(false);
                                if (transcriptContainerRef.current) {
                                  transcriptContainerRef.current.scrollTop =
                                    transcriptContainerRef.current.scrollHeight;
                                }
                              }}
                              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-[0_4px_14px_rgba(59,130,246,0.4)] flex items-center gap-2 z-20 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                            >
                              <ArrowDown size={14} /> Resume Auto-Scroll
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div
                      className={`xl:col-span-8 shadow-sm rounded-[2rem] p-8 flex flex-col relative transition-colors border ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      <div
                        className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDarkMode ? "border-[#2A2F3D]" : "border-slate-100"}`}
                      >
                        <Zap
                          size={24}
                          className={
                            status === "recording"
                              ? "animate-pulse text-blue-500"
                              : status === "paused"
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }
                        />
                        <h3 className="font-bold text-xl tracking-tight">
                          {status === "recording"
                            ? "AI generating notes..."
                            : "Finalizing Document..."}
                        </h3>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        <div className="space-y-2">
                          <div
                            className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                          >
                            <AlignLeft size={16} /> Summary
                          </div>
                          <div
                            className={`p-5 rounded-2xl text-sm leading-relaxed border shadow-inner min-h-[100px] ${isDarkMode ? "text-slate-300 bg-[#0b0f19] border-[#2A2F3D]" : "text-slate-600 bg-slate-50 border-slate-100"}`}
                          >
                            {meetingNotes.summary ? (
                              meetingNotes.summary
                            ) : (
                              <div className="space-y-3 pt-1 w-full opacity-70">
                                <div
                                  className={`h-2.5 w-full rounded-full animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                ></div>
                                <div
                                  className={`h-2.5 w-5/6 rounded-full animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                ></div>
                                <div
                                  className={`h-2.5 w-4/6 rounded-full animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div
                            className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
                          >
                            <ListChecks size={16} /> Action Items
                          </div>
                          <ul className="space-y-2">
                            {actionItems.length > 0
                              ? actionItems.map((item) => (
                                  <li
                                    key={item.id}
                                    onClick={() => toggleActionItem(item.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${item.done ? (isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] opacity-50" : "bg-slate-50 border-slate-200 opacity-60") : isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                                  >
                                    <div className="mt-0.5">
                                      {item.done ? (
                                        <CheckCircle
                                          size={18}
                                          className="text-emerald-500"
                                        />
                                      ) : (
                                        <Circle size={18} />
                                      )}
                                    </div>
                                    <span
                                      className={`font-medium text-sm ${item.done ? "line-through text-slate-500" : isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                                    >
                                      {item.text}
                                    </span>
                                  </li>
                                ))
                              : [1, 2].map((i) => (
                                  <li
                                    key={i}
                                    className={`flex items-center gap-3 p-4 rounded-xl border opacity-70 ${isDarkMode ? "border-[#2A2F3D] bg-[#131722]/50" : "border-slate-200 bg-white/50"}`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full animate-pulse shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                    ></div>
                                    <div
                                      className={`h-2.5 rounded-full animate-pulse w-3/4 ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                    ></div>
                                  </li>
                                ))}
                          </ul>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div
                            className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                          >
                            <Workflow size={16} /> Live Diagram Generation
                          </div>
                          <div
                            className={`p-6 rounded-2xl border shadow-inner flex items-center justify-center min-h-[250px] overflow-hidden ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-100"}`}
                          >
                            {editableMermaid ? (
                              <MermaidDiagram
                                chart={editableMermaid}
                                isDarkMode={isDarkMode}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-4 w-full opacity-60">
                                <div
                                  className={`w-16 h-12 rounded-xl animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                ></div>
                                <div
                                  className={`w-0.5 h-8 animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                ></div>
                                <div className="flex gap-8">
                                  <div
                                    className={`w-16 h-12 rounded-xl animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                  ></div>
                                  <div
                                    className={`w-16 h-12 rounded-xl animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 🌟 FIX: overflow-hidden removed from the outer parent div here */}
                {status === "complete" && (
                  <motion.div
                    key="success-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-5xl mx-auto space-y-8"
                  >
                    <AnimatePresence mode="wait">
                      {isRemixing ? (
                        <motion.div
                          key="remixing-loader"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl border ${isDarkMode ? "bg-[#131722] border-indigo-500/30" : "bg-white border-indigo-200"}`}
                        >
                          <div
                            className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${isDarkMode ? "bg-indigo-600/20" : "bg-indigo-400/20"}`}
                          ></div>
                          <RefreshCw
                            size={48}
                            className={`animate-spin mb-6 relative z-10 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
                          />
                          <h2
                            className={`text-3xl font-extrabold tracking-tight mb-3 relative z-10 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                          >
                            Remixing your notes...
                          </h2>
                          <p
                            className={`font-medium relative z-10 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            Applying the{" "}
                            <strong
                              className={
                                isDarkMode
                                  ? "text-indigo-300"
                                  : "text-indigo-700"
                              }
                            >
                              {activeAiTemplate?.name}
                            </strong>{" "}
                            framework to the transcript.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="success-dashboard"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="space-y-8"
                        >
                          {/* 🌟 FIX: overflow-hidden added to the absolute background div *only*, removed from the card */}
                          <div
                            className={`rounded-[2.5rem] relative border ${isDarkMode ? "bg-[#0b0f19] border-emerald-500/20 shadow-[0_20px_60px_rgba(16,185,129,0.1)]" : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl border-transparent"}`}
                          >
                            {/* Glowing Orbs for Premium Dark Mode */}
                            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                              <div
                                className={`absolute -top-24 -right-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-emerald-600/15" : "bg-white/20"}`}
                              ></div>
                              <div
                                className={`absolute -bottom-24 -left-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-teal-600/15" : "bg-white/0"}`}
                              ></div>
                            </div>

                            <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
                              <div className="flex items-center gap-6">
                                <div
                                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${isDarkMode ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/20 text-white border border-white/20"}`}
                                >
                                  <CheckCircle2 size={32} />
                                </div>
                                <div>
                                  <h2
                                    className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-2 ${isDarkMode ? "text-emerald-50" : "text-white"}`}
                                  >
                                    Session Saved!
                                  </h2>
                                  <p
                                    className={`font-medium ${isDarkMode ? "text-emerald-200/70" : "text-emerald-50"}`}
                                  >
                                    Generated using{" "}
                                    <strong className="text-white">
                                      {activeAiTemplate
                                        ? activeAiTemplate.name
                                        : "Smart Document"}
                                    </strong>{" "}
                                    in {outputLanguage}.
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setShowRemixMenu(!showRemixMenu)
                                    }
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold border transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${isDarkMode ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-200 hover:bg-emerald-800/60 focus:ring-offset-[#0b0f19]" : "bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-600 focus:ring-offset-emerald-500"}`}
                                  >
                                    <RefreshCw size={18} /> Remix Format
                                  </button>
                                  <AnimatePresence>
                                    {showRemixMenu && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute top-full right-0 mt-3 w-72 border rounded-2xl shadow-2xl z-50 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                                      >
                                        <div
                                          className={`p-3 border-b text-xs font-bold uppercase tracking-widest ${isDarkMode ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}
                                        >
                                          Select Template to Remix
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                                          {templatesDB.map((t) => (
                                            <button
                                              key={t.id}
                                              onClick={() => triggerRemix(t)}
                                              className={`w-full text-left px-3 py-3 rounded-xl mb-1 last:mb-0 flex items-center gap-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-50 text-slate-700"}`}
                                            >
                                              <span
                                                className={
                                                  getTheme(t.theme, isDarkMode)
                                                    .text
                                                }
                                              >
                                                {t.icon}
                                              </span>{" "}
                                              {t.name}
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedNote(savedNotes[0]);
                                    setStatus("idle");
                                  }}
                                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${isDarkMode ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400 focus:ring-offset-[#0b0f19]" : "bg-white text-emerald-600 hover:bg-slate-50 focus:ring-offset-emerald-500"}`}
                                >
                                  <FileText size={18} /> View Full Note
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div
                              className={`rounded-[2rem] p-8 border shadow-sm ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                            >
                              <div
                                className={`flex items-center gap-2 font-bold mb-4 tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                              >
                                <AlignLeft
                                  size={18}
                                  className={
                                    isDarkMode
                                      ? "text-blue-400"
                                      : "text-blue-600"
                                  }
                                />{" "}
                                Extracted Summary
                              </div>
                              <p
                                className={`text-sm leading-relaxed line-clamp-4 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                              >
                                {savedNotes[0]?.summary}
                              </p>
                            </div>

                            <div
                              className={`rounded-[2rem] p-8 border shadow-sm ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                            >
                              <div
                                className={`flex items-center gap-2 font-bold mb-4 tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                              >
                                <ListChecks
                                  size={18}
                                  className={
                                    isDarkMode
                                      ? "text-emerald-400"
                                      : "text-emerald-600"
                                  }
                                />{" "}
                                Pending Tasks
                              </div>
                              {actionItems.length > 0 ? (
                                <ul className="space-y-3">
                                  {actionItems.slice(0, 3).map((item) => (
                                    <li
                                      key={item.id}
                                      className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                    >
                                      <Circle
                                        size={16}
                                        className="mt-0.5 shrink-0 opacity-50"
                                      />
                                      <span className="line-clamp-2">
                                        {item.text}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p
                                  className={`text-sm italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                >
                                  No action items detected.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-center mt-12 pb-6">
                            <button
                              onClick={handleReset}
                              className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? "bg-slate-800 text-white shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_50px_rgba(37,99,235,0.4)] dark:focus:ring-offset-[#0b0f19]" : "bg-white text-slate-800 shadow-xl border border-slate-200 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)]"}`}
                            >
                              <div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r pointer-events-none ${isDarkMode ? "from-blue-600 to-indigo-600" : "from-blue-50 to-indigo-50"}`}
                              ></div>
                              <span
                                className={`relative z-10 flex items-center gap-2 transition-colors ${isDarkMode ? "group-hover:text-white" : "group-hover:text-blue-700"}`}
                              >
                                <PlusCircle
                                  size={22}
                                  className={`transition-colors ${isDarkMode ? "text-blue-400 group-hover:text-white" : "text-blue-500 group-hover:text-blue-600"}`}
                                />{" "}
                                Start New Recording
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* MODULAR TABS */}
            {activeTab === "notes" && !selectedNote && (
              <motion.div
                key="notes-tab"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
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
              </motion.div>
            )}

            {selectedNote && (
              <motion.div
                key="detail-tab"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <NoteDetailView
                  isDarkMode={isDarkMode}
                  selectedNote={selectedNote}
                  exportFormat={exportFormat}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === "templates" && (
              <motion.div
                key="templates-tab"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
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
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
