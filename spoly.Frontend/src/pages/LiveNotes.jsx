// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useUser } from "@clerk/clerk-react";
// import {
//   Mic,
//   Square,
//   UploadCloud,
//   FileText,
//   ListChecks,
//   Workflow,
//   PlusCircle,
//   CheckCircle2,
//   Zap,
//   Puzzle,
//   X,
//   FileAudio,
//   Code,
//   Copy,
//   CheckCircle,
//   Circle,
//   ArrowRight,
//   PlayCircle,
//   PauseCircle,
//   AlignLeft,
//   Sparkles,
//   Database,
//   Trash2,
//   Layers,
//   ChevronLeft,
//   List,
//   ImageIcon,
//   ImagePlus,
//   Languages,
//   FileUp,
//   RefreshCw,
//   Headphones,
//   Youtube,
//   Play,
//   Pause,
//   Activity,
//   Video,
//   FolderSearch,
//   Maximize2,
//   ArrowDown,
//   Loader2,
// } from "lucide-react";

// import {
//   ScrollbarStyles,
//   WorkspaceMeshBackground,
//   AudioWaveform,
//   getTheme,
// } from "../utils/uiHelpers";
// import {
//   templatesDB,
//   initialFolders,
//   templateCategories,
// } from "../utils/constants";
// import Sidebar from "../components/Sidebar";
// import LibraryTab from "../components/LibraryTab";
// import NoteDetailView from "../components/NoteDetailView";
// import TemplatesTab from "../components/TemplatesTab";
// import SettingsView from "../components/SettingsView";
// import MermaidDiagram from "../components/MermaidDiagram";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const decodeBase64ToBlob = async (base64Data) => {
//   try {
//     const res = await fetch(base64Data);
//     return await res.blob();
//   } catch (e) {
//     try {
//       const byteString = atob(base64Data.split(",")[1]);
//       const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++)
//         ia[i] = byteString.charCodeAt(i);
//       return new Blob([ab], { type: mimeString });
//     } catch (err) {
//       console.error("Hybrid Decoding Failed:", err);
//       return null;
//     }
//   }
// };

// const parseBackendDiagrams = (diagramString) => {
//   let processedDiagrams = [];
//   let processedFlashcards = [];
//   if (!diagramString || diagramString === "API FAILED")
//     return { processedDiagrams, processedFlashcards };

//   try {
//     const parsedData = JSON.parse(diagramString);
//     const rawDiagrams = parsedData.diagrams || [];
//     processedFlashcards = parsedData.flashcards || [];

//     processedDiagrams = rawDiagrams
//       .map((diag) => {
//         let generatedGraph = diag.code || "";
//         const match = generatedGraph.match(
//           /\x60\x60\x60(?:mermaid)?\s*([\s\S]*?)\x60\x60\x60/i,
//         );
//         if (match) generatedGraph = match[1];

//         generatedGraph = generatedGraph
//           .replace(/\x60\x60\x60/g, "")
//           .replace(/^---[\s\S]*?---/g, "")
//           .replace(/^(title=|title\s+:).*$/gim, "")
//           .replace(/^[ \t]*note\s+.*$/gim, "")
//           .replace(/\\"/g, "")
//           .trim();

//         const lowerGraph = generatedGraph.toLowerCase();

//         if (
//           lowerGraph.startsWith("graph") ||
//           lowerGraph.startsWith("flowchart")
//         ) {
//           generatedGraph = generatedGraph
//             .replace(/(graph|flowchart)\s+([A-Z]{2,})\s+(.+)/gim, "$1 $2\n$3")
//             .replace(/\|[^|]+\|/g, "")
//             .replace(/->>/g, "-->")
//             .replace(/([A-Za-z0-9_\]])\s*:\s*[^"'\n]+/g, "$1")
//             .replace(/\[\[/g, "[")
//             .replace(/\]\]/g, "]")
//             .replace(/\(\(/g, "(")
//             .replace(/\)\)/g, ")")
//             .replace(/\b(end)([A-Za-z0-9_\[])/gi, "$1\n$2")
//             .replace(
//               /\[(.*?)\]/g,
//               (match, innerText) =>
//                 `["${innerText.replace(/["'\\[\]:]/g, "").trim()}"]`,
//             );
//         } else if (lowerGraph.startsWith("gantt")) {
//           generatedGraph =
//             "timeline\n  title Timeline Overview\n  Processing\n    Data Extracted";
//         } else if (lowerGraph.startsWith("sequencediagram")) {
//           generatedGraph = generatedGraph
//             .replace(/(sequenceDiagram)(?![\n\s])/gim, "$1\n")
//             .replace(/:\s*$/gm, ": (Action)")
//             .replace(/([^\n])\s*\b(end|loop|alt|opt|par)\b/gi, "$1\n$2")
//             .replace(/\b(end)\s+([A-Za-z0-9_])/gi, "end\n$2");

//           generatedGraph = generatedGraph
//             .split("\n")
//             .filter((line) => {
//               const l = line.trim();
//               if (!l) return false;
//               if (
//                 l.toLowerCase() === "sequencediagram" ||
//                 l.includes("->>") ||
//                 /^(participant|actor|note|loop|end|alt|else|opt|par)/i.test(l)
//               )
//                 return true;
//               return false;
//             })
//             .join("\n");
//         } else if (lowerGraph.startsWith("mindmap")) {
//           const mmLines = generatedGraph.split("\n");
//           let cleanedMmLines = [];
//           let hasRoot = false;
//           for (let line of mmLines) {
//             if (!line.trim()) continue;
//             if (line.trim().toLowerCase() === "mindmap") {
//               cleanedMmLines.push("mindmap");
//               continue;
//             }
//             let safeLine = line
//               .replace(/["'\\]/g, "")
//               .replace(/\(\(\(/g, "((")
//               .replace(/\)\)\)/g, "))")
//               .replace(/\[\[\[/g, "[")
//               .replace(/\]\]\]/g, "]");
//             if (!hasRoot) {
//               let rootText = safeLine.trim();
//               if (!rootText.includes("((") && !rootText.includes("["))
//                 rootText = `root((${rootText.replace(/^root/i, "").trim() || "Central Concept"}))`;
//               else if (!rootText.toLowerCase().startsWith("root"))
//                 rootText = `root${rootText}`;
//               cleanedMmLines.push("  " + rootText);
//               hasRoot = true;
//             } else {
//               cleanedMmLines.push(
//                 safeLine.match(/^\s*/)[0].length <= 2
//                   ? "    " + safeLine.trim()
//                   : safeLine,
//               );
//             }
//           }
//           generatedGraph = cleanedMmLines.join("\n");
//         } else if (lowerGraph.startsWith("erdiagram")) {
//           generatedGraph = generatedGraph.replace(
//             /(erDiagram)(?![\n\s])/gim,
//             "$1\n",
//           );
//         } else if (lowerGraph.startsWith("timeline")) {
//           generatedGraph = generatedGraph.replace(
//             /(timeline)(?![\n\s])/gim,
//             "$1\n",
//           );
//         }

//         const isFlowchart =
//           lowerGraph.startsWith("graph") || lowerGraph.startsWith("flowchart");
//         generatedGraph = generatedGraph
//           .split("\n")
//           .map((line) => {
//             let l = line.trimRight();
//             if (
//               isFlowchart &&
//               !l.includes("-->") &&
//               !l.includes("---") &&
//               l.includes("[")
//             )
//               l = l.replace(/^([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*\[/, "$1$2[");
//             return l;
//           })
//           .filter((line) => line.length > 0)
//           .join("\n");

//         return { title: diag.title || "Diagram", code: generatedGraph };
//       })
//       .filter((diag) => diag.code.length > 5);
//   } catch (e) {
//     console.error("Failed to parse diagram/flashcard JSON:", e);
//   }
//   return { processedDiagrams, processedFlashcards };
// };

// const Flashcard = ({ front, back, isDarkMode }) => {
//   const [isFlipped, setIsFlipped] = useState(false);
//   return (
//     <div
//       className="w-full h-64 cursor-pointer perspective-1000 group"
//       onClick={() => setIsFlipped(!isFlipped)}
//     >
//       <motion.div
//         className="relative w-full h-full transition-all duration-500 shadow-sm preserve-3d group-hover:shadow-md rounded-2xl"
//         animate={{ rotateY: isFlipped ? 180 : 0 }}
//       >
//         <div
//           className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-800"}`}
//         >
//           <div
//             className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
//           >
//             Q
//           </div>
//           <h3 className="text-xl font-bold">{front}</h3>
//           <p
//             className={`absolute bottom-4 text-xs font-medium opacity-50 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//           >
//             Click to flip
//           </p>
//         </div>
//         <div
//           className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 ${isDarkMode ? "bg-indigo-900/20 border-indigo-500/30 text-indigo-100" : "bg-indigo-50 border-indigo-200 text-indigo-900"}`}
//           style={{ transform: "rotateY(180deg)" }}
//         >
//           <div
//             className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-indigo-500/40 text-white" : "bg-indigo-200 text-indigo-800"}`}
//           >
//             A
//           </div>
//           <p className="text-lg font-medium">{back}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const loadingTrivia = [
//   "Did you know? The first computer bug was an actual moth found in a relay in 1947.",
//   "Take a deep breath... Inhale for 4 seconds, exhale for 4 seconds.",
//   "Spoly's AI is currently analyzing semantic patterns to generate your flowchart.",
//   "Mermaid.js was created to let developers write diagrams like they write code.",
//   "Stretch your shoulders! Good posture improves focus and energy.",
//   "Fact: AI models 'think' in tokens, which are roughly pieces of words.",
//   "Structuring your notes... separating the signal from the noise.",
// ];

// const generateThemeFromFile = (file) => {
//   if (!file) return null;
//   const palettes = [
//     {
//       d1: "bg-rose-900/20",
//       d2: "bg-orange-900/20",
//       l1: "bg-rose-300/30",
//       l2: "bg-orange-300/30",
//     },
//     {
//       d1: "bg-emerald-900/20",
//       d2: "bg-teal-900/20",
//       l1: "bg-emerald-300/30",
//       l2: "bg-teal-300/30",
//     },
//     {
//       d1: "bg-purple-900/20",
//       d2: "bg-pink-900/20",
//       l1: "bg-purple-300/30",
//       l2: "bg-pink-300/30",
//     },
//     {
//       d1: "bg-amber-900/20",
//       d2: "bg-red-900/20",
//       l1: "bg-amber-300/30",
//       l2: "bg-red-300/30",
//     },
//   ];
//   const hash =
//     file.name.charCodeAt(0) +
//     file.name.charCodeAt(file.name.length - 1) +
//     file.size;
//   return palettes[hash % palettes.length];
// };

// const pageVariants = {
//   initial: { opacity: 0, y: 15 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
//   exit: { opacity: 0, y: -10, transition: { duration: 0.1, ease: "easeIn" } },
// };

// const formatGeneratedNotes = (text, isDarkMode) => {
//   if (!text) return "No notes returned from backend.";

//   return text.split("\n").map((line, index) => {
//     const trimmedLine = line.trim();
//     if (!trimmedLine) return <div key={index} className="h-3"></div>;

//     const formatBold = (str) => {
//       const parts = str.split(/(\*\*.*?\*\*)/g);
//       return parts.map((part, i) => {
//         if (part.startsWith("**") && part.endsWith("**")) {
//           return (
//             <strong
//               key={i}
//               className={`font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
//             >
//               {part.slice(2, -2)}
//             </strong>
//           );
//         }
//         return part;
//       });
//     };

//     if (trimmedLine.match(/^(?:📌|#)\s+(.*)/)) {
//       const titleText = trimmedLine
//         .replace(/^(?:📌|#)\s*/, "")
//         .replace(/\*\*/g, "");
//       return (
//         <div key={index} className="mt-8 mb-4 first:mt-0">
//           <h2
//             className={`text-2xl font-extrabold tracking-tight flex items-center gap-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
//           >
//             <span
//               className={`w-1.5 h-6 rounded-full shadow-sm ${isDarkMode ? "bg-indigo-500 shadow-indigo-500/20" : "bg-indigo-600 shadow-indigo-600/20"}`}
//             ></span>
//             {titleText}
//           </h2>
//           <div
//             className={`mt-4 w-full h-px ${isDarkMode ? "bg-gradient-to-r from-slate-800 to-transparent" : "bg-gradient-to-r from-slate-200 to-transparent"}`}
//           ></div>
//         </div>
//       );
//     }
//     if (trimmedLine.startsWith("## ")) {
//       const subtitleText = trimmedLine
//         .replace(/^##\s*/, "")
//         .replace(/\*\*/g, "");
//       return (
//         <h3
//           key={index}
//           className={`text-xl font-bold mt-6 mb-3 tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
//         >
//           {subtitleText}
//         </h3>
//       );
//     }
//     if (trimmedLine.startsWith("### ")) {
//       const minorText = trimmedLine.replace(/^###\s*/, "").replace(/\*\*/g, "");
//       return (
//         <h4
//           key={index}
//           className={`text-lg font-bold mt-6 mb-2 uppercase tracking-wide ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
//         >
//           {minorText}
//         </h4>
//       );
//     }
//     if (trimmedLine.match(/^[•\-*]\s+/)) {
//       const bulletText = trimmedLine.replace(/^[•\-*]\s*/, "");
//       return (
//         <div key={index} className="flex items-start gap-3 mb-2 ml-1 group">
//           <div
//             className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isDarkMode ? "bg-slate-700 group-hover:bg-indigo-400" : "bg-slate-300 group-hover:bg-indigo-500"}`}
//           ></div>
//           <div
//             className={`flex-1 text-base leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
//           >
//             {formatBold(bulletText)}
//           </div>
//         </div>
//       );
//     }
//     return (
//       <p
//         key={index}
//         className={`text-base mb-3 leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
//       >
//         {formatBold(trimmedLine)}
//       </p>
//     );
//   });
// };

// export default function LiveNotes() {
//   const { user } = useUser();
//   const [activeTab, setActiveTab] = useState("workspace");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [toast, setToast] = useState(null);

//   const [isDarkMode, setIsDarkMode] = useState(
//     () => localStorage.getItem("spoly_dark") === "true",
//   );
//   const [exportFormat, setExportFormat] = useState(
//     () => localStorage.getItem("spoly_export") || "markdown",
//   );
//   const [settingsToggles, setSettingsToggles] = useState({ notion: false });
//   const [selectedMic, setSelectedMic] = useState(
//     () => localStorage.getItem("spoly_mic") || "default",
//   );
//   const [audioConstraints, setAudioConstraints] = useState(() => {
//     const saved = localStorage.getItem("spoly_audio");
//     return saved
//       ? JSON.parse(saved)
//       : { echoCancellation: true, noiseSuppression: true };
//   });

//   const [contextTheme, setContextTheme] = useState(null);

//   useEffect(() => {
//     localStorage.setItem("spoly_dark", isDarkMode);
//     if (isDarkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [isDarkMode]);

//   useEffect(
//     () => localStorage.setItem("spoly_export", exportFormat),
//     [exportFormat],
//   );
//   useEffect(
//     () => localStorage.setItem("spoly_mic", selectedMic),
//     [selectedMic],
//   );
//   useEffect(
//     () => localStorage.setItem("spoly_audio", JSON.stringify(audioConstraints)),
//     [audioConstraints],
//   );

//   const [status, setStatus] = useState("idle");
//   const [successView, setSuccessView] = useState("notes");
//   const [triviaIndex, setTriviaIndex] = useState(0);

//   const timerRef = useRef(0);
//   const [transcript, setTranscript] = useState("");
//   const [outputLanguage, setOutputLanguage] = useState("English");

//   const [contextFiles, setContextFiles] = useState([]);
//   const [isDraggingContext, setIsDraggingContext] = useState(false);
//   const contextInputRef = useRef(null);

//   const [audioStream, setAudioStream] = useState(null);
//   const capturedTitleRef = useRef("");

//   const [activeAiTemplate, setActiveAiTemplate] = useState(null);
//   const activeAiTemplateRef = useRef(null);

//   useEffect(() => {
//     activeAiTemplateRef.current = activeAiTemplate;
//   }, [activeAiTemplate]);

//   const [processingType, setProcessingType] = useState("audio");
//   const [isWidgetDeployed, setIsWidgetDeployed] = useState(false);
//   const [isExtensionActive, setIsExtensionActive] = useState(false);
//   const [globalSpeakerColor, setGlobalSpeakerColor] = useState("bg-blue-500");
//   const [youtubeUrl, setYoutubeUrl] = useState("");

//   const localMediaRecorderRef = useRef(null);
//   const localAudioChunks = useRef([]);
//   const extensionAudioChunksRef = useRef([]);

//   const chunkIntervalRef = useRef(null);
//   const isFinalizingRef = useRef(false);
//   const isPausedRef = useRef(false);

//   const fileInputRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
//   const uploadRef = useRef(null);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [templateFilter, setTemplateFilter] = useState("All");

//   const [notesViewMode, setNotesViewMode] = useState("grid");
//   const [folders, setFolders] = useState(initialFolders);
//   const [activeFolderId, setActiveFolderId] = useState("all");
//   const [dragOverFolder, setDragOverFolder] = useState(null);
//   const [isAddingFolder, setIsAddingFolder] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");

//   const [meetingNotes, setMeetingNotes] = useState({
//     summary: "",
//     takeaways: "",
//     decisions: "",
//   });
//   const [actionItems, setActionItems] = useState([]);
//   const [editableMermaids, setEditableMermaids] = useState([]);
//   const [editableFlashcards, setEditableFlashcards] = useState([]);
//   const [savedNotes, setSavedNotes] = useState([]);

//   // 🚀 Fetch notes from MongoDB on page load
//   useEffect(() => {
//     if (!user) return;

//     const fetchMyNotes = async () => {
//       try {
//         const response = await fetch(
//           `${BACKEND_URL}/api/notes/user/${user.id}`,
//         );
//         const data = await response.json();

//         if (data.success && data.notes) {
//           const formattedNotes = data.notes.map((n) => {
//             const parsedDiagramData = JSON.parse(
//               n.diagram_data || '{"diagrams":[],"flashcards":[]}',
//             );
//             return {
//               id: n.id,
//               title: n.source_type,
//               folderId: "all",
//               date: new Date(n.created_at).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               }),
//               duration: "Saved Note",
//               items: 0,
//               tags: ["AI"],
//               summary: n.generated_notes,
//               graphs: parsedDiagramData.diagrams || [],
//               flashcards: parsedDiagramData.flashcards || [],
//               audioUrl: null,
//             };
//           });
//           setSavedNotes(formattedNotes);
//         }
//       } catch (err) {
//         console.error("Failed to load notes from MongoDB", err);
//       }
//     };

//     fetchMyNotes();
//   }, [user]);

//   useEffect(() => {
//     let interval;
//     if (status === "processing") {
//       interval = setInterval(
//         () => setTriviaIndex((prev) => (prev + 1) % loadingTrivia.length),
//         4500,
//       );
//     }
//     return () => clearInterval(interval);
//   }, [status]);

//   useEffect(() => {
//     let interval = null;
//     if (status === "recording") {
//       interval = setInterval(() => (timerRef.current += 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [status]);

//   const processAudioChunkWithBackend = async (blob) => {
//     try {
//       if (isFinalizingRef.current) return;
//       if (!blob || blob.size < 100) return;

//       const formData = new FormData();
//       formData.append("file", blob, "chunk.webm");
//       formData.append(
//         "template",
//         activeAiTemplateRef.current?.name || "AI Auto-Detect",
//       );

//       const response = await fetch(`${BACKEND_URL}/api/notes/generate`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         if (isFinalizingRef.current) return;
//         const data = await response.json();
//         if (data.transcript) setTranscript(data.transcript);
//         if (data.notes)
//           setMeetingNotes((prev) => ({ ...prev, summary: data.notes }));
//       }
//     } catch (e) {
//       console.error("Live chunk skipped due to rate limit/error.");
//     }
//   };

//   const forceStartSimulation = (scrapedTitle) => {
//     if (
//       isFinalizingRef.current ||
//       status === "recording" ||
//       status === "processing" ||
//       status === "paused"
//     )
//       return;
//     if (scrapedTitle && typeof scrapedTitle === "string")
//       capturedTitleRef.current = scrapedTitle;
//     else capturedTitleRef.current = "";

//     setActiveTab("workspace");
//     setIsExtensionActive(true);
//     setStatus("recording");
//     isFinalizingRef.current = false;
//     setProcessingType("audio");
//     timerRef.current = 0;

//     setTranscript("");
//     setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
//     setActionItems([]);
//     setEditableMermaids([]);
//     setEditableFlashcards([]);
//     setCurrentAudioUrl(null);
//     extensionAudioChunksRef.current = [];
//   };

//   const handleStartLocalRecording = async () => {
//     if (
//       localMediaRecorderRef.current &&
//       localMediaRecorderRef.current.state !== "inactive"
//     ) {
//       try {
//         localMediaRecorderRef.current.onstop = null;
//         localMediaRecorderRef.current.ondataavailable = null;
//         localMediaRecorderRef.current.stop();
//       } catch (e) {}
//     }
//     localMediaRecorderRef.current = null;

//     if (audioStream) {
//       audioStream.getTracks().forEach((t) => t.stop());
//     }

//     let stream = null;
//     try {
//       const constraints = {
//         echoCancellation: audioConstraints.echoCancellation,
//         noiseSuppression: audioConstraints.noiseSuppression,
//       };
//       if (selectedMic !== "default")
//         constraints.deviceId = { exact: selectedMic };
//       stream = await navigator.mediaDevices.getUserMedia({
//         audio: constraints,
//       });
//     } catch (err) {
//       console.warn("Spoly: Mic denied", err);
//     }

//     setActiveTab("workspace");
//     setIsExtensionActive(false);
//     setStatus("recording");
//     isFinalizingRef.current = false;
//     setProcessingType("audio");
//     timerRef.current = 0;

//     setTranscript("");
//     setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
//     setActionItems([]);
//     setEditableMermaids([]);
//     setEditableFlashcards([]);
//     setCurrentAudioUrl(null);
//     localAudioChunks.current = [];

//     if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

//     if (stream) {
//       setAudioStream(stream);
//       let options = {};
//       if (MediaRecorder.isTypeSupported("audio/webm"))
//         options = { mimeType: "audio/webm" };

//       const recorder = new MediaRecorder(stream, options);
//       const recorderSessionId = Date.now();
//       recorder._spolySessionId = recorderSessionId;

//       recorder.ondataavailable = async (e) => {
//         if (e.data && e.data.size > 0) {
//           localAudioChunks.current.push(e.data);
//           const chunkBlob = new Blob(localAudioChunks.current, {
//             type: "audio/webm",
//           });
//           await processAudioChunkWithBackend(chunkBlob);
//         }
//       };

//       recorder.onstop = async () => {
//         if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

//         if (
//           localMediaRecorderRef.current &&
//           localMediaRecorderRef.current._spolySessionId !== recorderSessionId
//         ) {
//           stream.getTracks().forEach((t) => t.stop());
//           return;
//         }

//         try {
//           const finalBlob = new Blob(localAudioChunks.current, {
//             type: "audio/webm",
//           });
//           const generatedUrl = window.URL.createObjectURL(finalBlob);
//           setCurrentAudioUrl(generatedUrl);
//           await processAudioWithBackend(
//             finalBlob,
//             "Live Capture",
//             generatedUrl,
//           );
//         } catch (err) {
//           finishProcessing("Live Capture", null);
//         } finally {
//           stream.getTracks().forEach((t) => t.stop());
//           if (
//             localMediaRecorderRef.current &&
//             localMediaRecorderRef.current._spolySessionId === recorderSessionId
//           ) {
//             localMediaRecorderRef.current = null;
//           }
//         }
//       };

//       recorder.start(5000);
//       localMediaRecorderRef.current = recorder;
//     } else {
//       showToast("Mic unavailable or denied.");
//       localMediaRecorderRef.current = null;
//     }
//   };

//   const handleStopLocalRecording = () => {
//     if (isFinalizingRef.current) return;

//     if (isExtensionActive) {
//       window.postMessage({ type: "SPOLY_REMOTE_STOP_EXTENSION" }, "*");
//     } else {
//       isFinalizingRef.current = true;
//       setStatus("processing");
//       if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

//       const currentRecorder = localMediaRecorderRef.current;
//       if (currentRecorder && currentRecorder.state !== "inactive") {
//         currentRecorder.requestData();
//         setTimeout(() => {
//           try {
//             if (currentRecorder.state !== "inactive") {
//               currentRecorder.stop();
//             }
//           } catch (e) {
//             finishProcessing("Live Capture");
//           }
//         }, 100);
//       } else {
//         setTimeout(() => finishProcessing("Live Capture"), 2000);
//       }
//     }
//   };

//   const stopLocalRef = useRef(handleStopLocalRecording);
//   useEffect(() => {
//     stopLocalRef.current = handleStopLocalRecording;
//   }, [isExtensionActive, status]);

//   const forceStartRef = useRef(forceStartSimulation);
//   useEffect(() => {
//     forceStartRef.current = forceStartSimulation;
//   }, [status]);

//   const pauseLocalRef = useRef((isPaused) => {
//     if (isFinalizingRef.current) return;
//     isPausedRef.current = isPaused;
//     setStatus(isPaused ? "paused" : "recording");
//   });

//   useEffect(() => {
//     const handleMessage = (e) => {
//       const type = e.data?.type;

//       if (
//         type === "SPOLY_RECORDING_STARTED" ||
//         type === "SPOLY_HEARTBEAT_LIVE"
//       ) {
//         if (
//           e.data.title &&
//           e.data.title.trim() !== "" &&
//           e.data.title !== "Live Web Capture"
//         ) {
//           capturedTitleRef.current = e.data.title;
//         }
//         if (e.data.speakerState)
//           setGlobalSpeakerColor(
//             e.data.speakerState === "sys" ? "bg-purple-500" : "bg-blue-500",
//           );
//         forceStartRef.current(e.data.title);
//       } else if (type === "INTERNAL_SYNC_UI") {
//         if (e.data.isLive === false) {
//           stopLocalRef.current();
//         } else {
//           pauseLocalRef.current(e.data.isPaused);
//         }
//       } else if (type === "SPOLY_RECEIVE_CHUNK") {
//         if (isFinalizingRef.current) return;

//         const index = e.data.index;
//         const processBase64 = async () => {
//           try {
//             const decodedBlob = await decodeBase64ToBlob(e.data.audioData);
//             if (decodedBlob && decodedBlob.size > 0) {
//               extensionAudioChunksRef.current[index] = decodedBlob;

//               if (!extensionAudioChunksRef.current[0]) return;

//               const validChunks = extensionAudioChunksRef.current.filter(
//                 (b) => b,
//               );
//               const accumulatedBlob = new Blob(validChunks, {
//                 type: "audio/webm",
//               });
//               processAudioChunkWithBackend(accumulatedBlob);
//             }
//           } catch (err) {}
//         };
//         processBase64();
//       } else if (
//         type === "SPOLY_RECORDING_STOPPED" ||
//         type === "SPOLY_UPLOAD_COMPLETE"
//       ) {
//         if (isFinalizingRef.current) return;
//         isFinalizingRef.current = true;
//         setStatus("processing");

//         setTimeout(() => {
//           const validChunks = extensionAudioChunksRef.current.filter((b) => b);
//           if (validChunks.length > 0) {
//             const finalBlob = new Blob(validChunks, { type: "audio/webm" });
//             const finalUrl = window.URL.createObjectURL(finalBlob);
//             setCurrentAudioUrl(finalUrl);
//             processAudioWithBackend(
//               finalBlob,
//               capturedTitleRef.current || "Extension Capture",
//               finalUrl,
//             );
//           } else {
//             finishProcessing(capturedTitleRef.current || "Live Capture");
//           }
//         }, 800);
//       }
//     };
//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   const showToast = (message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   };

//   const formatTime = (sec) => {
//     const m = Math.floor(sec / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (sec % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   const handleAddFolder = (e) => {
//     if (e.key === "Enter" && newFolderName.trim()) {
//       const colors = [
//         "text-emerald-500",
//         "text-purple-500",
//         "text-pink-500",
//         "text-cyan-500",
//         "text-rose-500",
//         "text-indigo-500",
//       ];
//       const randomColor = colors[Math.floor(Math.random() * colors.length)];
//       const newFolder = {
//         id: `folder_${Date.now()}`,
//         name: newFolderName.trim(),
//         color: randomColor,
//         isDefault: false,
//       };
//       setFolders((prev) => [...prev, newFolder]);
//       setNewFolderName("");
//       setIsAddingFolder(false);
//       showToast(`Folder "${newFolder.name}" created!`);
//     }
//   };

//   const handleDeleteFolder = (e, folderId) => {
//     e.stopPropagation();
//     const folderName = folders.find((f) => f.id === folderId)?.name;
//     if (
//       window.confirm(
//         `Are you sure you want to delete the "${folderName}" folder?\n\nAny notes inside will be safely moved back to "All Notes".`,
//       )
//     ) {
//       setSavedNotes((prev) =>
//         prev.map((n) =>
//           n.folderId === folderId ? { ...n, folderId: "all" } : n,
//         ),
//       );
//       setFolders((prev) => prev.filter((f) => f.id !== folderId));
//       if (activeFolderId === folderId) setActiveFolderId("all");
//       showToast("Folder deleted.");
//     }
//   };

//   const finishProcessing = (
//     customTitle = null,
//     overrideAudioUrl = null,
//     fetchedData = null,
//   ) => {
//     setStatus("complete");
//     setIsExtensionActive(false);
//     setIsWidgetDeployed(false);
//     setAudioStream(null);
//     isFinalizingRef.current = false;
//     showToast(
//       processingType === "image"
//         ? "Whiteboard Converted Successfully!"
//         : `Processed!`,
//     );

//     let finalTitle =
//       capturedTitleRef.current ||
//       `Live Session ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
//     if (customTitle && customTitle !== "Live Capture") finalTitle = customTitle;
//     if (activeAiTemplate)
//       finalTitle = `[${activeAiTemplate.name}] ${finalTitle}`;

//     const newNote = {
//       id: Date.now().toString(),
//       title: finalTitle,
//       folderId: "all",
//       date: new Date().toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }),
//       duration: formatTime(timerRef.current),
//       items: actionItems.length,
//       tags: [outputLanguage, activeAiTemplate?.category || "AI"],
//       summary:
//         fetchedData?.summary ||
//         meetingNotes.summary ||
//         "Summary generation failed.",
//       graphs: fetchedData?.graphs || editableMermaids,
//       flashcards: fetchedData?.flashcards || editableFlashcards,
//       audioUrl: overrideAudioUrl || currentAudioUrl,
//     };
//     setSavedNotes((prev) => [newNote, ...prev]);

//     // 🚀 Send the final output to MongoDB
//     if (user) {
//       const diagramDataToSave = JSON.stringify({
//         diagrams: fetchedData?.graphs || editableMermaids,
//         flashcards: fetchedData?.flashcards || editableFlashcards,
//       });

//       fetch(`${BACKEND_URL}/api/notes/save`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           clerk_id: user.id,
//           source_type: finalTitle,
//           transcript: fetchedData?.transcript || transcript || "No transcript",
//           notes: fetchedData?.summary || meetingNotes.summary,
//           diagram_data: diagramDataToSave,
//         }),
//       }).catch((err) => console.error("MongoDB Save Error:", err));
//     }
//   };

//   const processAudioWithBackend = async (
//     audioBlob,
//     defaultTitle,
//     overrideAudioUrl = null,
//   ) => {
//     try {
//       if (!audioBlob || audioBlob.size < 100) {
//         finishProcessing(defaultTitle, overrideAudioUrl);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", audioBlob, "recording.webm");
//       formData.append(
//         "template",
//         activeAiTemplateRef.current?.name || "AI Auto-Detect",
//       );

//       // 🟢 ADD THIS BLOCK: Append context files
//       if (contextFiles && contextFiles.length > 0) {
//         contextFiles.forEach((file) => {
//           formData.append("context_files", file);
//         });
//       }

//       const response = await fetch(`${BACKEND_URL}/api/notes/generate`, {
//         method: "POST",
//         body: formData,
//       });
//       if (!response.ok) throw new Error(`Server returned ${response.status}`);

//       const data = await response.json();
//       const generatedTranscript =
//         data.transcript || "No transcript returned by the AI.";
//       const generatedSummary = data.notes || "No notes generated by the AI.";

//       const { processedDiagrams, processedFlashcards } = parseBackendDiagrams(
//         data.diagram,
//       );

//       setTranscript(generatedTranscript);
//       setMeetingNotes({
//         summary: generatedSummary,
//         takeaways: "",
//         decisions: "",
//       });
//       setEditableMermaids(processedDiagrams);
//       setEditableFlashcards(processedFlashcards);

//       finishProcessing(defaultTitle, overrideAudioUrl || currentAudioUrl, {
//         transcript: generatedTranscript,
//         summary: generatedSummary,
//         graphs: processedDiagrams,
//         flashcards: processedFlashcards,
//       });
//     } catch (error) {
//       console.error("Backend Error:", error);
//       showToast("Error processing with backend.");
//       const errorMsg = `🚨 API Error: Could not generate notes.\nDetails: ${error.message}\nMake sure your FastAPI backend is running at ${BACKEND_URL}/api/notes/generate`;

//       setTranscript("Error connecting to backend API.");
//       setMeetingNotes({ summary: errorMsg, takeaways: "", decisions: "" });
//       finishProcessing(defaultTitle, overrideAudioUrl || currentAudioUrl, {
//         transcript: "Error",
//         summary: errorMsg,
//         graphs: [],
//         flashcards: [],
//       });
//     }
//   };

//   const toggleLocalPause = () => {
//     if (status === "recording") {
//       if (localMediaRecorderRef.current?.state === "recording")
//         localMediaRecorderRef.current.pause();
//       setStatus("paused");
//     } else if (status === "paused") {
//       if (localMediaRecorderRef.current?.state === "paused")
//         localMediaRecorderRef.current.resume();
//       setStatus("recording");
//     }
//   };

//   const handleToggleWidget = () => {
//     if (document.getElementById("spoly-extension-marker")) {
//       window.postMessage({ type: "SPOLY_TOGGLE_WIDGET" }, "*");
//       setIsWidgetDeployed(!isWidgetDeployed);
//     } else
//       alert(
//         "⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!",
//       );
//   };

//   const handleContextDrop = (e) => {
//     e.preventDefault();
//     setIsDraggingContext(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       setContextFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
//       setContextTheme(generateThemeFromFile(file));
//       showToast(`Context Attached! Theme adjusted.`);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
//       processFile(e.dataTransfer.files[0]);
//   };

//   const processFile = (file) => {
//     const isImage = file.type.startsWith("image/");
//     setProcessingType(isImage ? "image" : "audio");
//     setFileName(file.name);
//     setStatus("uploading");
//     setUploadProgress(0);
//     isFinalizingRef.current = false;

//     const uploadedUrl = URL.createObjectURL(file);
//     if (!isImage) setCurrentAudioUrl(uploadedUrl);

//     let progress = 0;
//     if (uploadRef.current) clearInterval(uploadRef.current);
//     uploadRef.current = setInterval(async () => {
//       progress += Math.random() * 15 + 5;
//       if (progress >= 100) {
//         progress = 100;
//         clearInterval(uploadRef.current);
//         setStatus("processing");
//         if (isImage) setTimeout(() => finishProcessing(), 3000);
//         else await processAudioWithBackend(file, file.name, uploadedUrl);
//       }
//       setUploadProgress(Math.min(progress, 100));
//     }, 200);
//   };

//   // 🚀 The Extension Proxy for YouTube
//   const processYoutube = async (e) => {
//     e.preventDefault();
//     if (!youtubeUrl.trim()) return;

//     // Extract Video ID
//     const match = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
//     if (!match) {
//       alert("Invalid YouTube URL.");
//       return;
//     }
//     const videoId = match[1];

//     setProcessingType("youtube");
//     setFileName("Extension is fetching Transcript...");
//     setStatus("uploading");
//     setUploadProgress(0);
//     isFinalizingRef.current = false;

//     let progress = 0;
//     if (uploadRef.current) clearInterval(uploadRef.current);
//     uploadRef.current = setInterval(() => {
//       progress += Math.random() * 5;
//       setUploadProgress(Math.min(progress, 40));
//     }, 500);

//     const handleYtResult = async (event) => {
//       if (event.data.type === "SPOLY_YT_RESULT") {
//         window.removeEventListener("message", handleYtResult);

//         if (!event.data.success) {
//           clearInterval(uploadRef.current);
//           setStatus("idle");
//           alert("⚠️ Extension Failed to fetch transcript: " + event.data.error);
//           return;
//         }

//         setFileName("AI is Analyzing Transcript...");
//         setUploadProgress(50);

//         try {
//           const formData = new FormData();
//           formData.append("transcript", event.data.text);
//           formData.append(
//             "template",
//             activeAiTemplateRef.current?.name || "AI Auto-Detect",
//           );

//           // 🟢 ADD THIS BLOCK: Append context files
//           if (contextFiles && contextFiles.length > 0) {
//             contextFiles.forEach((file) => {
//               formData.append("context_files", file);
//             });
//           }

//           const response = await fetch(
//             `${BACKEND_URL}/api/notes/process-text`,
//             {
//               method: "POST",
//               body: formData,
//             },
//           );

//           clearInterval(uploadRef.current);
//           setUploadProgress(100);
//           setStatus("processing");

//           if (!response.ok)
//             throw new Error(`Server returned Code ${response.status}`);

//           const data = await response.json();
//           if (data.error) throw new Error(data.error);

//           setTranscript(data.transcript || "");
//           setMeetingNotes({
//             summary: data.notes || "",
//             takeaways: "",
//             decisions: "",
//           });

//           const { processedDiagrams, processedFlashcards } =
//             parseBackendDiagrams(data.diagram);
//           setEditableMermaids(processedDiagrams);
//           setEditableFlashcards(processedFlashcards);

//           setTimeout(() => {
//             finishProcessing("YouTube Video Notes", null, {
//               transcript: data.transcript,
//               summary: data.notes,
//               graphs: processedDiagrams,
//               flashcards: processedFlashcards,
//             });
//             setYoutubeUrl("");
//           }, 1000);
//         } catch (err) {
//           clearInterval(uploadRef.current);
//           alert("⚠️ Processing Failed!\n\nDetails: " + err.message);
//           setStatus("idle");
//         }
//       }
//     };

//     window.addEventListener("message", handleYtResult);
//     window.postMessage({ type: "SPOLY_FETCH_YT_TRANSCRIPT", videoId }, "*");
//   };

//   const handleReset = () => {
//     if (
//       localMediaRecorderRef.current &&
//       localMediaRecorderRef.current.state !== "inactive"
//     ) {
//       try {
//         localMediaRecorderRef.current.onstop = null;
//         localMediaRecorderRef.current.ondataavailable = null;
//         localMediaRecorderRef.current.stop();
//       } catch (e) {}
//     }
//     localMediaRecorderRef.current = null;
//     localAudioChunks.current = [];

//     if (audioStream) {
//       audioStream.getTracks().forEach((t) => t.stop());
//     }

//     isFinalizingRef.current = false;
//     setStatus("idle");
//     setTranscript("");
//     timerRef.current = 0;
//     setFileName("");
//     setUploadProgress(0);
//     setIsExtensionActive(false);
//     setIsWidgetDeployed(false);
//     setAudioStream(null);
//     setSuccessView("notes");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     setActiveTab("workspace");
//     setActionItems([]);
//     setContextFiles([]);
//     setEditableMermaids([]);
//     setEditableFlashcards([]);
//     setContextTheme(null);
//     capturedTitleRef.current = "";
//     extensionAudioChunksRef.current = [];
//     if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);
//   };

//   return (
//     <div
//       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
//       className={`flex h-screen relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "text-slate-100 bg-[#0b0f19]" : "text-slate-900 bg-[#f8fafc]"}`}
//     >
//       <ScrollbarStyles />
//       <WorkspaceMeshBackground
//         isDarkMode={isDarkMode}
//         customTheme={contextTheme}
//       />

//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             key="toast"
//             initial={{ opacity: 0, y: -20, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: -20, x: "-50%" }}
//             className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${isDarkMode ? "bg-white text-slate-900 border-slate-200" : "bg-slate-900 text-white border-slate-700"}`}
//           >
//             <Sparkles size={18} className="text-amber-500" /> {toast}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <Sidebar
//         isDarkMode={isDarkMode}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//         handleReset={handleReset}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         setSelectedNote={setSelectedNote}
//         user={user}
//       />

//       <main className="relative z-10 flex flex-col flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
//         <header
//           className={`px-8 py-6 flex justify-between items-center border-b sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-[#0b0f19]/80 backdrop-blur-md border-[#232a3b]" : "bg-white/30 backdrop-blur-md border-white/40"}`}
//         >
//           <div>
//             <h1 className="text-2xl font-extrabold tracking-tight capitalize">
//               {selectedNote
//                 ? selectedNote.title
//                 : activeTab === "workspace"
//                   ? "Active Workspace"
//                   : activeTab}
//             </h1>
//             <p
//               className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//             >
//               {selectedNote
//                 ? `Saved on ${selectedNote.date}`
//                 : new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             {(status === "recording" || status === "paused") &&
//               activeTab !== "workspace" && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${isDarkMode ? "bg-[#131722]" : "bg-white"} ${status === "recording" ? (isDarkMode ? "shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/40" : "shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-300") : isDarkMode ? "shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/40" : "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-300"}`}
//                 >
//                   <div
//                     className={`w-2.5 h-2.5 rounded-full ${status === "paused" ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}
//                   ></div>
//                   <span
//                     className={`font-bold text-sm tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
//                   >
//                     {status === "paused" ? "Paused" : "Recording Active"}
//                   </span>
//                   {!isExtensionActive && (
//                     <>
//                       <div
//                         className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
//                       ></div>
//                       <div className="flex items-center gap-1.5">
//                         <button
//                           onClick={toggleLocalPause}
//                           className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${status === "paused" ? "bg-amber-500/20 text-amber-500" : "hover:bg-slate-800 text-slate-300"}`}
//                         >
//                           {status === "paused" ? (
//                             <Play size={14} fill="currentColor" />
//                           ) : (
//                             <Pause size={14} fill="currentColor" />
//                           )}
//                         </button>
//                         <button
//                           onClick={handleStopLocalRecording}
//                           className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
//                         >
//                           <Square size={12} fill="currentColor" />
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </motion.div>
//               )}

//             {activeTab === "workspace" && status === "idle" && (
//               <>
//                 <div
//                   className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-colors ${isDarkMode ? "bg-[#131722] border border-[#232a3b]" : "bg-white border border-slate-200"}`}
//                 >
//                   <Languages size={18} className="text-blue-500" />
//                   <select
//                     value={outputLanguage}
//                     onChange={(e) => setOutputLanguage(e.target.value)}
//                     className={`bg-transparent border-none focus:outline-none text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
//                   >
//                     <option
//                       className={
//                         isDarkMode
//                           ? "bg-slate-800 text-slate-200"
//                           : "bg-white text-slate-900"
//                       }
//                     >
//                       English
//                     </option>
//                   </select>
//                 </div>
//                 <div
//                   className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${isDarkMode ? "bg-emerald-900/20 border border-emerald-800/50 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-700"}`}
//                 >
//                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>{" "}
//                   Ready
//                 </div>
//               </>
//             )}
//             {selectedNote && (
//               <button
//                 onClick={() => setSelectedNote(null)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all focus:outline-none ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}
//               >
//                 <ChevronLeft size={16} /> Back to Library
//               </button>
//             )}
//           </div>
//         </header>

//         <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8 pb-32">
//           <AnimatePresence mode="wait">
//             {activeTab === "workspace" && !selectedNote && (
//               <motion.div
//                 key="workspace-tab"
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="space-y-8"
//               >
//                 {(status === "idle" || status === "uploading") && (
//                   <motion.div
//                     key="recording-panel"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className={`shadow-xl rounded-2xl p-8 space-y-8 relative overflow-hidden transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-white/70 backdrop-blur-xl border-white"}`}
//                   >
//                     <div
//                       className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b pb-6 ${isDarkMode ? "border-[#232a3b]" : "border-slate-100"}`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`p-3.5 rounded-xl shadow-sm border ${isDarkMode ? "bg-indigo-900/30 text-indigo-400 border-indigo-800/50" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
//                         >
//                           <Play size={24} className="animate-pulse" />
//                         </div>
//                         <div>
//                           <h2 className="text-2xl font-extrabold tracking-tight">
//                             Initialize Workspace
//                           </h2>
//                           <p
//                             className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                           >
//                             Select a data source to begin capturing intelligent
//                             notes.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {status === "idle" && (
//                       <motion.div
//                         key="idle-buttons"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-6"
//                       >
//                         <div className="grid grid-cols-1 gap-6 pt-2 pb-2 md:grid-cols-2">
//                           <motion.button
//                             whileHover={{ scale: 1.02, y: -4 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={handleToggleWidget}
//                             className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] ${isWidgetDeployed ? (isDarkMode ? "bg-red-950/20 border-red-900" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-indigo-600" : "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"}`}
//                           >
//                             <div
//                               className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isWidgetDeployed ? (isDarkMode ? "bg-[#0b0f19] border-red-900/50" : "bg-red-50 border-red-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
//                             >
//                               <div
//                                 className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-red-600/40" : "bg-red-400/40") : isDarkMode ? "bg-purple-600/40" : "bg-purple-300/40"}`}
//                               ></div>
//                               <div
//                                 className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isWidgetDeployed ? (isDarkMode ? "bg-orange-600/40" : "bg-orange-400/40") : isDarkMode ? "bg-indigo-600/40" : "bg-indigo-300/40"}`}
//                               ></div>

//                               <Sparkles
//                                 className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-orange-500/25" : "text-orange-500/20") : isDarkMode ? "text-purple-400/25" : "text-purple-500/20"}`}
//                                 strokeWidth="2"
//                               />
//                               <Workflow
//                                 className={`absolute right-6 top-4 w-24 h-24 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isWidgetDeployed ? (isDarkMode ? "text-red-500/25" : "text-red-500/20") : isDarkMode ? "text-indigo-400/25" : "text-indigo-500/20"}`}
//                                 strokeWidth="2"
//                               />

//                               <div
//                                 className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isWidgetDeployed ? (isDarkMode ? "bg-red-950 border-red-800 text-red-400" : "bg-white border-red-200 text-red-600") : isDarkMode ? "bg-[#131722] border-indigo-900/50 text-indigo-400" : "bg-white border-slate-100 text-indigo-600"}`}
//                               >
//                                 {isWidgetDeployed ? (
//                                   <X size={32} />
//                                 ) : (
//                                   <Puzzle size={32} />
//                                 )}
//                               </div>
//                             </div>
//                             <div className="relative z-20 flex flex-col flex-1 w-full p-6">
//                               <h3
//                                 className={`text-xl font-bold mb-2 transition-colors ${isWidgetDeployed ? (isDarkMode ? "text-red-300" : "text-red-900") : isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-700"}`}
//                               >
//                                 {isWidgetDeployed
//                                   ? "Close Extension"
//                                   : "Web Record"}
//                               </h3>
//                               <p
//                                 className={`text-sm font-medium leading-relaxed pr-8 ${isWidgetDeployed ? (isDarkMode ? "text-red-400/80" : "text-red-700/80") : isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                               >
//                                 {isWidgetDeployed
//                                   ? "Hide the Spoly widget."
//                                   : "Inject the Spoly bot into the screen to capture any Google Meet or web audio."}
//                               </p>
//                             </div>
//                           </motion.button>

//                           <motion.button
//                             whileHover={{ scale: 1.02, y: -4 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={handleStartLocalRecording}
//                             className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#131722] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"}`}
//                           >
//                             <div
//                               className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
//                             >
//                               <div
//                                 className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-blue-600/40" : "bg-blue-400/40"}`}
//                               ></div>
//                               <Headphones
//                                 className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-blue-400/25" : "text-blue-500/20"}`}
//                                 strokeWidth="2"
//                               />
//                               <div
//                                 className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-blue-900/50 text-blue-400" : "bg-white border-slate-100 text-blue-600"}`}
//                               >
//                                 <Mic size={32} />
//                               </div>
//                             </div>
//                             <div className="relative z-20 flex flex-col flex-1 w-full p-6">
//                               <h3
//                                 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-800 group-hover:text-blue-700"}`}
//                               >
//                                 Device Audio
//                               </h3>
//                               <p
//                                 className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                               >
//                                 Capture an in-person meeting, lecture, or
//                                 conversation directly through your microphone.
//                               </p>
//                             </div>
//                           </motion.button>
//                         </div>

//                         <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2">
//                           <motion.div
//                             whileHover={{ scale: 1.02, y: -4 }}
//                             whileTap={{ scale: 0.97 }}
//                             onDragOver={(e) => {
//                               e.preventDefault();
//                               setIsDragging(true);
//                             }}
//                             onDragLeave={(e) => {
//                               e.preventDefault();
//                               setIsDragging(false);
//                             }}
//                             onDrop={handleDrop}
//                             onClick={() => fileInputRef.current.click()}
//                             className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus:within:ring-offset-[#131722] ${isDragging ? (isDarkMode ? "border-emerald-400 bg-emerald-900/20" : "border-emerald-400 bg-emerald-50") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50" : "bg-white border-slate-300 hover:border-emerald-400 shadow-sm"}`}
//                           >
//                             <input
//                               type="file"
//                               ref={fileInputRef}
//                               onChange={(e) => {
//                                 if (e.target.files.length)
//                                   processFile(e.target.files[0]);
//                               }}
//                               accept="audio/*,video/*,image/*"
//                               className="hidden"
//                             />
//                             <div
//                               className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDragging ? (isDarkMode ? "bg-emerald-900/30 border-emerald-800" : "bg-emerald-100/50 border-emerald-200") : isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
//                             >
//                               <div
//                                 className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-emerald-600/40" : "bg-emerald-400/40"}`}
//                               ></div>
//                               <div
//                                 className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-teal-600/40" : "bg-teal-400/40"}`}
//                               ></div>

//                               <Database
//                                 className={`absolute left-6 bottom-2 w-20 h-20 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-emerald-400/25" : "text-emerald-500/20"}`}
//                                 strokeWidth="2"
//                               />
//                               <FileText
//                                 className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-teal-400/25" : "text-teal-500/20"}`}
//                                 strokeWidth="2"
//                               />

//                               <div
//                                 className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDragging ? (isDarkMode ? "bg-[#131722] border-emerald-800 text-emerald-400" : "bg-white border-emerald-200 text-emerald-600") : isDarkMode ? "bg-[#131722] border-slate-800 text-slate-300" : "bg-white border-slate-100 text-slate-600"}`}
//                               >
//                                 <ImagePlus
//                                   size={32}
//                                   className={isDragging ? "animate-bounce" : ""}
//                                 />
//                               </div>
//                             </div>
//                             <div className="relative z-20 flex flex-col flex-1 w-full p-6">
//                               <h3
//                                 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-700"}`}
//                               >
//                                 {isDragging ? "Drop File Here" : "Upload File"}
//                               </h3>
//                               <p
//                                 className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                               >
//                                 Post-process an existing audio recording or
//                                 image.
//                               </p>
//                             </div>
//                           </motion.div>

//                           <motion.div
//                             whileHover={{ scale: 1.02, y: -4 }}
//                             className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[260px] ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-red-500/50" : "bg-white border-slate-200 hover:border-red-300 shadow-sm"}`}
//                           >
//                             <div
//                               className={`w-full h-32 relative flex items-center justify-center overflow-hidden border-b ${isDarkMode ? "bg-[#0b0f19] border-[#232a3b]" : "bg-slate-50 border-slate-100"}`}
//                             >
//                               <div
//                                 className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-red-600/40" : "bg-red-400/40"}`}
//                               ></div>
//                               <div
//                                 className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full transition-colors duration-700 ${isDarkMode ? "bg-orange-600/40" : "bg-orange-400/40"}`}
//                               ></div>

//                               <PlayCircle
//                                 className={`absolute left-6 bottom-2 w-20 h-20 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-red-400/25" : "text-red-500/20"}`}
//                                 strokeWidth="2"
//                               />
//                               <Video
//                                 className={`absolute right-6 top-4 w-20 h-20 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-orange-400/25" : "text-orange-500/20"}`}
//                                 strokeWidth="2"
//                               />

//                               <div
//                                 className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-red-900/50 text-red-400" : "bg-white border-slate-100 text-red-600"}`}
//                               >
//                                 <Youtube size={32} />
//                               </div>
//                             </div>
//                             <div className="relative z-20 flex flex-col flex-1 w-full p-6">
//                               <h3
//                                 className={`text-xl font-bold mb-3 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-red-400" : "text-slate-800 group-hover:text-red-600"}`}
//                               >
//                                 YouTube Link
//                               </h3>
//                               <form
//                                 onSubmit={processYoutube}
//                                 className="relative w-full mt-auto group/form"
//                               >
//                                 <input
//                                   type="text"
//                                   placeholder="Paste video URL here..."
//                                   value={youtubeUrl}
//                                   onChange={(e) =>
//                                     setYoutubeUrl(e.target.value)
//                                   }
//                                   className={`w-full text-sm pl-4 pr-12 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-white placeholder-slate-500 group-hover/form:border-red-500/50" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 group-hover/form:border-red-300"}`}
//                                 />
//                                 <button
//                                   type="submit"
//                                   className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${youtubeUrl ? "bg-red-500 text-white hover:bg-red-600 shadow-md" : isDarkMode ? "text-slate-600 bg-transparent" : "text-slate-400 bg-transparent"}`}
//                                 >
//                                   <ArrowRight size={16} />
//                                 </button>
//                               </form>
//                             </div>
//                           </motion.div>
//                         </div>

//                         <div
//                           className={`group rounded-2xl p-6 transition-colors border relative overflow-hidden ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-white border-slate-200 shadow-sm"}`}
//                         >
//                           <div
//                             className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-indigo-600/20 group-hover:bg-indigo-500/30" : "bg-indigo-300/30 group-hover:bg-indigo-300/40"}`}
//                           ></div>
//                           <div
//                             className={`absolute bottom-0 left-0 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${isDarkMode ? "bg-purple-600/20 group-hover:bg-purple-500/30" : "bg-purple-300/30 group-hover:bg-purple-300/40"}`}
//                           ></div>

//                           <FolderSearch
//                             className={`absolute right-10 top-2 w-32 h-32 transform rotate-12 transition-all duration-700 pointer-events-none ${isDarkMode ? "text-indigo-400 opacity-20" : "text-indigo-500 opacity-15"}`}
//                             strokeWidth="1.5"
//                           />
//                           <div className="relative z-10">
//                             <div
//                               className={`flex items-center gap-2 mb-4 font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}
//                             >
//                               <FileUp
//                                 size={20}
//                                 className={
//                                   isDarkMode
//                                     ? "text-indigo-400"
//                                     : "text-indigo-500"
//                                 }
//                               />{" "}
//                               Add Pre-Context Documents
//                             </div>
//                             <p
//                               className={`text-sm mb-4 font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                             >
//                               Upload a Syllabus, PRD, or past notes so the AI
//                               understands specific terminology before generating
//                               the diagram.
//                             </p>
//                             <button
//                               onClick={() => contextInputRef.current.click()}
//                               className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1f2e] ${isDraggingContext ? (isDarkMode ? "border-indigo-500 bg-indigo-900/20" : "border-indigo-500 bg-indigo-50") : isDarkMode ? "border-[#232a3b] bg-[#131722] hover:bg-[#0b0f19]" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
//                               onDragOver={(e) => {
//                                 e.preventDefault();
//                                 setIsDraggingContext(true);
//                               }}
//                               onDragLeave={(e) => {
//                                 e.preventDefault();
//                                 setIsDraggingContext(false);
//                               }}
//                               onDrop={handleContextDrop}
//                             >
//                               <input
//                                 type="file"
//                                 multiple
//                                 ref={contextInputRef}
//                                 onChange={(e) => {
//                                   if (e.target.files.length) {
//                                     const file = e.target.files[0];
//                                     setContextFiles((prev) => [
//                                       ...prev,
//                                       ...Array.from(e.target.files),
//                                     ]);
//                                     setContextTheme(
//                                       generateThemeFromFile(file),
//                                     );
//                                     showToast(
//                                       "Context Attached! Theme adjusted.",
//                                     );
//                                   }
//                                 }}
//                                 className="hidden"
//                               />
//                               <span
//                                 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                               >
//                                 <UploadCloud size={16} /> Drag & Drop PDFs/Docs
//                                 here
//                               </span>
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}

//                     {status === "uploading" && (
//                       <motion.div
//                         key="uploading"
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="flex flex-col items-center justify-center w-full max-w-lg gap-6 py-10 mx-auto"
//                       >
//                         <div
//                           className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${processingType === "youtube" ? (isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600") : isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}
//                         >
//                           {processingType === "image" ? (
//                             <ImageIcon size={28} />
//                           ) : processingType === "youtube" ? (
//                             <Youtube size={28} />
//                           ) : (
//                             <FileAudio size={28} />
//                           )}
//                         </div>
//                         <div className="w-full text-center">
//                           <p className="px-4 mb-1 text-lg font-bold tracking-tight truncate">
//                             {fileName}
//                           </p>
//                           <p
//                             className={`font-medium text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                           >
//                             {processingType === "youtube"
//                               ? "Fetching Transcript from YouTube..."
//                               : "Uploading to Spoly Servers..."}
//                           </p>
//                           <div
//                             className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
//                           >
//                             <motion.div
//                               className={`h-full ${processingType === "youtube" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
//                               initial={{ width: 0 }}
//                               animate={{ width: `${uploadProgress}%` }}
//                               transition={{ ease: "linear" }}
//                             />
//                           </div>
//                           <p
//                             className={`text-right text-xs font-bold mt-2 ${processingType === "youtube" ? (isDarkMode ? "text-red-400" : "text-red-600") : isDarkMode ? "text-blue-400" : "text-blue-600"}`}
//                           >
//                             {Math.floor(uploadProgress)}%
//                           </p>
//                         </div>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 )}

//                 {(status === "recording" ||
//                   status === "processing" ||
//                   status === "paused") && (
//                   <motion.div
//                     key="live-panel"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="grid xl:grid-cols-1 gap-8 h-[75vh]"
//                   >
//                     <div
//                       className={`flex flex-col h-full shadow-sm rounded-[2rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//                     >
//                       <div
//                         className={`relative p-5 flex items-center justify-between gap-4 border-b ${isDarkMode ? "bg-gradient-to-r from-[#0b0f19] to-[#131722] border-[#2A2F3D]" : "bg-gradient-to-r from-slate-50 to-white border-slate-200"}`}
//                       >
//                         <h2
//                           className={`font-bold text-xl tracking-tight flex items-center gap-3 ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
//                         >
//                           {status === "paused" ? (
//                             <>
//                               <PauseCircle className="animate-pulse" />{" "}
//                               Recording Paused
//                             </>
//                           ) : status === "recording" ? (
//                             <>
//                               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>{" "}
//                               Recording Live Audio
//                             </>
//                           ) : (
//                             <>
//                               <Sparkles className="text-blue-500" /> AI
//                               Processing
//                             </>
//                           )}
//                         </h2>

//                         {status !== "processing" && (
//                           <button
//                             onClick={handleStopLocalRecording}
//                             className="flex items-center gap-2 px-6 py-2 font-bold text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
//                           >
//                             <Square size={14} fill="currentColor" /> Stop &
//                             Generate
//                           </button>
//                         )}
//                       </div>

//                       {status === "recording" && transcript && (
//                         <div className="flex-1 p-8 mt-2 overflow-y-auto custom-scrollbar">
//                           <h3
//                             className={`font-bold text-lg mb-2 flex items-center gap-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
//                           >
//                             <Activity size={18} className="animate-pulse" />{" "}
//                             Live Transcription
//                           </h3>
//                           <p
//                             className={`text-sm mb-8 opacity-80 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
//                           >
//                             {transcript}
//                           </p>

//                           {meetingNotes.summary && (
//                             <>
//                               <h3
//                                 className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
//                               >
//                                 <Sparkles size={18} className="animate-pulse" />{" "}
//                                 AI Processing Preview
//                               </h3>
//                               <div
//                                 className={`p-5 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
//                               >
//                                 {formatGeneratedNotes(
//                                   meetingNotes.summary,
//                                   isDarkMode,
//                                 )}
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       )}

//                       {status === "processing" && (
//                         <div className="relative flex flex-col items-center justify-center flex-1 px-8 space-y-8 overflow-hidden text-center">
//                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
//                             <motion.div
//                               animate={{ rotate: 360 }}
//                               transition={{
//                                 repeat: Infinity,
//                                 duration: 10,
//                                 ease: "linear",
//                               }}
//                               className="w-96 h-96 border-[1px] border-blue-500 rounded-full border-dashed"
//                             ></motion.div>
//                             <motion.div
//                               animate={{ rotate: -360 }}
//                               transition={{
//                                 repeat: Infinity,
//                                 duration: 15,
//                                 ease: "linear",
//                               }}
//                               className="absolute w-[30rem] h-[30rem] border-[1px] border-indigo-500 rounded-full border-dashed"
//                             ></motion.div>
//                           </div>

//                           <motion.div
//                             animate={{ scale: [1, 1.1, 1] }}
//                             transition={{
//                               repeat: Infinity,
//                               duration: 2,
//                               ease: "easeInOut",
//                             }}
//                             className={`p-6 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] ${isDarkMode ? "bg-[#131722] border border-blue-900/50" : "bg-white border border-blue-100"}`}
//                           >
//                             <Loader2
//                               size={48}
//                               className="text-blue-500 animate-spin"
//                             />
//                           </motion.div>

//                           <div>
//                             <h3 className="mb-2 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
//                               Architecting your Notes...
//                             </h3>
//                             <p
//                               className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//                             >
//                               Groq is currently synthesizing the audio and
//                               generating structured data.
//                             </p>
//                           </div>

//                           <AnimatePresence mode="wait">
//                             <motion.div
//                               key={triviaIndex}
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: -10 }}
//                               className={`mt-8 max-w-md p-5 rounded-2xl border backdrop-blur-sm ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-slate-300" : "bg-slate-50/80 border-slate-200 text-slate-700"}`}
//                             >
//                               <p className="text-sm font-medium leading-relaxed">
//                                 <Sparkles
//                                   size={16}
//                                   className="inline mr-2 text-amber-400"
//                                 />
//                                 {loadingTrivia[triviaIndex]}
//                               </p>
//                             </motion.div>
//                           </AnimatePresence>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}

//                 {status === "complete" && (
//                   <motion.div
//                     key="success-panel"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     className="max-w-6xl mx-auto space-y-8"
//                   >
//                     <div
//                       className={`rounded-[2.5rem] relative border ${isDarkMode ? "bg-[#0b0f19] border-emerald-500/20 shadow-[0_20px_60px_rgba(16,185,129,0.1)]" : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl border-transparent"}`}
//                     >
//                       <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
//                         <div
//                           className={`absolute -top-24 -right-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-emerald-600/15" : "bg-white/20"}`}
//                         ></div>
//                         <div
//                           className={`absolute -bottom-24 -left-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-teal-600/15" : "bg-white/0"}`}
//                         ></div>
//                       </div>
//                       <div className="relative z-20 flex flex-col items-center justify-between gap-6 p-8 md:flex-row">
//                         <div className="flex items-center gap-6">
//                           <div
//                             className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${isDarkMode ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/20 text-white border border-white/20"}`}
//                           >
//                             <CheckCircle2 size={32} />
//                           </div>
//                           <div>
//                             <h2
//                               className={`text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? "text-emerald-50" : "text-white"}`}
//                             >
//                               Session Saved Successfully!
//                             </h2>
//                             <p
//                               className={`font-medium ${isDarkMode ? "text-emerald-200/70" : "text-emerald-50"}`}
//                             >
//                               Your backend data has been successfully mapped to
//                               the UI.
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => {
//                             isFinalizingRef.current = false;
//                             setSelectedNote(savedNotes[0]);
//                             setStatus("idle");
//                           }}
//                           className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${isDarkMode ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400" : "bg-white text-emerald-600 hover:bg-slate-50"}`}
//                         >
//                           <FileText size={18} /> Add to Library
//                         </button>
//                       </div>
//                     </div>

//                     <div className="flex justify-center mb-6">
//                       <div
//                         className={`inline-flex rounded-full p-1 border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//                       >
//                         <button
//                           onClick={() => setSuccessView("notes")}
//                           className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "notes" ? (isDarkMode ? "bg-blue-600 text-white shadow-md" : "bg-blue-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
//                         >
//                           <AlignLeft size={16} /> Structured Notes
//                         </button>

//                         {editableMermaids.length > 0 && (
//                           <button
//                             onClick={() => setSuccessView("diagram")}
//                             className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "diagram" ? (isDarkMode ? "bg-emerald-600 text-white shadow-md" : "bg-emerald-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
//                           >
//                             <Workflow size={16} /> Multi-Diagram View
//                           </button>
//                         )}

//                         {editableFlashcards.length > 0 && (
//                           <button
//                             onClick={() => setSuccessView("flashcards")}
//                             className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "flashcards" ? (isDarkMode ? "bg-indigo-600 text-white shadow-md" : "bg-indigo-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
//                           >
//                             <Layers size={16} /> Practice Flashcards
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <div
//                       className={`rounded-[2rem] p-8 border shadow-sm flex flex-col min-h-[600px] w-full transition-all duration-500 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
//                     >
//                       {successView === "notes" ? (
//                         <div
//                           className={`text-sm md:text-base leading-relaxed overflow-y-auto custom-scrollbar pr-4 flex-1 w-full ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
//                         >
//                           {formatGeneratedNotes(
//                             meetingNotes.summary,
//                             isDarkMode,
//                           )}
//                         </div>
//                       ) : successView === "flashcards" ? (
//                         <div className="grid w-full h-full grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
//                           {editableFlashcards.map((card, index) => (
//                             <Flashcard
//                               key={index}
//                               front={card.front}
//                               back={card.back}
//                               isDarkMode={isDarkMode}
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="flex-1 w-full h-full pr-2 space-y-8 overflow-auto custom-scrollbar">
//                           {editableMermaids.map((diag, index) => (
//                             <div
//                               key={index}
//                               className={`block p-6 rounded-xl border w-full ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-100"}`}
//                             >
//                               <h4
//                                 className={`font-bold mb-4 border-b pb-2 ${isDarkMode ? "text-emerald-400 border-emerald-500/20" : "text-emerald-600 border-emerald-200"}`}
//                               >
//                                 {diag.title}
//                               </h4>
//                               <div className="w-full h-[400px]">
//                                 <MermaidDiagram
//                                   chart={diag.code}
//                                   isDarkMode={isDarkMode}
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex justify-center pb-6 mt-12">
//                       <button
//                         onClick={handleReset}
//                         className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? "bg-slate-800 text-white shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_50px_rgba(37,99,235,0.4)] dark:focus:ring-offset-[#0b0f19]" : "bg-white text-slate-800 shadow-xl border border-slate-200 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)]"}`}
//                       >
//                         <div
//                           className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r pointer-events-none ${isDarkMode ? "from-blue-600 to-indigo-600" : "from-blue-50 to-indigo-50"}`}
//                         ></div>
//                         <span
//                           className={`relative z-10 flex items-center gap-2 transition-colors ${isDarkMode ? "group-hover:text-white" : "group-hover:text-blue-700"}`}
//                         >
//                           <PlusCircle
//                             size={22}
//                             className={`transition-colors ${isDarkMode ? "text-blue-400 group-hover:text-white" : "text-blue-500 group-hover:text-blue-600"}`}
//                           />{" "}
//                           Start New Recording
//                         </span>
//                       </button>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             )}

//             {/* MODULAR TABS */}
//             {activeTab === "notes" && !selectedNote && (
//               <motion.div
//                 key="notes-tab"
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 <LibraryTab
//                   isDarkMode={isDarkMode}
//                   folders={folders}
//                   activeFolderId={activeFolderId}
//                   setActiveFolderId={setActiveFolderId}
//                   isAddingFolder={isAddingFolder}
//                   setIsAddingFolder={setIsAddingFolder}
//                   newFolderName={newFolderName}
//                   setNewFolderName={setNewFolderName}
//                   handleAddFolder={handleAddFolder}
//                   handleDeleteFolder={handleDeleteFolder}
//                   dragOverFolder={dragOverFolder}
//                   setDragOverFolder={setDragOverFolder}
//                   setSavedNotes={setSavedNotes}
//                   savedNotes={savedNotes}
//                   showToast={showToast}
//                   searchQuery={searchQuery}
//                   setSearchQuery={setSearchQuery}
//                   notesViewMode={notesViewMode}
//                   setNotesViewMode={setNotesViewMode}
//                   setSelectedNote={setSelectedNote}
//                 />
//               </motion.div>
//             )}

//             {selectedNote && (
//               <motion.div
//                 key="detail-tab"
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 <NoteDetailView
//                   isDarkMode={isDarkMode}
//                   selectedNote={selectedNote}
//                   exportFormat={exportFormat}
//                   showToast={showToast}
//                 />
//               </motion.div>
//             )}

//             {activeTab === "templates" && (
//               <motion.div
//                 key="templates-tab"
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 <TemplatesTab
//                   isDarkMode={isDarkMode}
//                   templateFilter={templateFilter}
//                   setTemplateFilter={setTemplateFilter}
//                   templateCategories={templateCategories}
//                   templatesDB={templatesDB}
//                   setActiveAiTemplate={setActiveAiTemplate}
//                   setActiveTab={setActiveTab}
//                   showToast={showToast}
//                 />
//               </motion.div>
//             )}

//             {activeTab === "settings" && (
//               <motion.div
//                 key="settings-tab"
//                 variants={pageVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//               >
//                 <SettingsView
//                   user={user}
//                   settingsToggles={settingsToggles}
//                   setSettingsToggles={setSettingsToggles}
//                   showToast={showToast}
//                   isDarkMode={isDarkMode}
//                   setIsDarkMode={setIsDarkMode}
//                   exportFormat={exportFormat}
//                   setExportFormat={setExportFormat}
//                   selectedMic={selectedMic}
//                   setSelectedMic={setSelectedMic}
//                   audioConstraints={audioConstraints}
//                   setAudioConstraints={setAudioConstraints}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//     </div>
//   );
// }

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
  Loader2,
  HelpCircle,
} from "lucide-react";

import {
  ScrollbarStyles,
  WorkspaceMeshBackground,
  AudioWaveform,
  getTheme,
} from "../utils/uiHelpers";
import {
  templatesDB as builtinTemplatesDB,
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

const decodeBase64ToBlob = async (base64Data) => {
  try {
    const res = await fetch(base64Data);
    return await res.blob();
  } catch (e) {
    try {
      const byteString = atob(base64Data.split(",")[1]);
      const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
      return new Blob([ab], { type: mimeString });
    } catch (err) {
      console.error("Hybrid Decoding Failed:", err);
      return null;
    }
  }
};

const parseBackendDiagrams = (diagramString) => {
  let processedDiagrams = [];
  let processedFlashcards = [];
  let processedMcqs = [];
  if (!diagramString || diagramString === "API FAILED")
    return { processedDiagrams, processedFlashcards, processedMcqs };

  try {
    const parsedData = JSON.parse(diagramString);
    const rawDiagrams = parsedData.diagrams || [];
    processedFlashcards = parsedData.flashcards || [];
    processedMcqs = parsedData.mcqs || [];

    processedDiagrams = rawDiagrams
      .map((diag) => {
        let generatedGraph = diag.code || "";
        const match = generatedGraph.match(
          /\`\`\`(?:mermaid)?\s*([\s\S]*?)\`\`\`/i,
        );
        if (match) generatedGraph = match[1];

        generatedGraph = generatedGraph
          .replace(/\`\`\`/g, "")
          .replace(/^---[\s\S]*?---/g, "")
          .replace(/^(title=|title\s+:).*$/gim, "")
          .replace(/^[ \t]*note\s+.*$/gim, "")
          .replace(/\\"/g, "")
          .trim();

        const lowerGraph = generatedGraph.toLowerCase();

        if (
          lowerGraph.startsWith("graph") ||
          lowerGraph.startsWith("flowchart")
        ) {
          generatedGraph = generatedGraph
            .replace(/(graph|flowchart)\s+([A-Z]{2,})\s+(.+)/gim, "$1 $2\n$3")
            .replace(/\|[^|]+\|/g, "")
            .replace(/->>/g, "-->")
            .replace(/([A-Za-z0-9_\]])\s*:\s*[^"'\n]+/g, "$1")
            .replace(/\[\[/g, "[")
            .replace(/\]\]/g, "]")
            .replace(/\(\(/g, "(")
            .replace(/\)\)/g, ")")
            .replace(/\b(end)([A-Za-z0-9_\[])/gi, "$1\n$2")
            .replace(
              /\[(.*?)\]/g,
              (match, innerText) =>
                `["${innerText.replace(/["'\\[\]:]/g, "").trim()}"]`,
            );
        } else if (lowerGraph.startsWith("gantt")) {
          generatedGraph =
            "timeline\n  title Timeline Overview\n  Processing\n    Data Extracted";
        } else if (lowerGraph.startsWith("sequencediagram")) {
          generatedGraph = generatedGraph
            .replace(/(sequenceDiagram)(?![\n\s])/gim, "$1\n")
            .replace(/:\s*$/gm, ": (Action)")
            .replace(/([^\n])\s*\b(end|loop|alt|opt|par)\b/gi, "$1\n$2")
            .replace(/\b(end)\s+([A-Za-z0-9_])/gi, "end\n$2");

          generatedGraph = generatedGraph
            .split("\n")
            .filter((line) => {
              const l = line.trim();
              if (!l) return false;
              if (
                l.toLowerCase() === "sequencediagram" ||
                l.includes("->>") ||
                /^(participant|actor|note|loop|end|alt|else|opt|par)/i.test(l)
              )
                return true;
              return false;
            })
            .join("\n");
        } else if (lowerGraph.startsWith("mindmap")) {
          const mmLines = generatedGraph.split("\n");
          let cleanedMmLines = [];
          let hasRoot = false;
          for (let line of mmLines) {
            if (!line.trim()) continue;
            if (line.trim().toLowerCase() === "mindmap") {
              cleanedMmLines.push("mindmap");
              continue;
            }
            let safeLine = line
              .replace(/["'\\]/g, "")
              .replace(/\(\(\(/g, "((")
              .replace(/\)\)\)/g, "))")
              .replace(/\[\[\[/g, "[")
              .replace(/\]\]\]/g, "]");
            if (!hasRoot) {
              let rootText = safeLine.trim();
              if (!rootText.includes("((") && !rootText.includes("["))
                rootText = `root((${rootText.replace(/^root/i, "").trim() || "Central Concept"}))`;
              else if (!rootText.toLowerCase().startsWith("root"))
                rootText = `root${rootText}`;
              cleanedMmLines.push("  " + rootText);
              hasRoot = true;
            } else {
              cleanedMmLines.push(
                safeLine.match(/^\s*/)[0].length <= 2
                  ? "    " + safeLine.trim()
                  : safeLine,
              );
            }
          }
          generatedGraph = cleanedMmLines.join("\n");
        } else if (lowerGraph.startsWith("erdiagram")) {
          generatedGraph = generatedGraph.replace(
            /(erDiagram)(?![\n\s])/gim,
            "$1\n",
          );
        } else if (lowerGraph.startsWith("timeline")) {
          generatedGraph = generatedGraph.replace(
            /(timeline)(?![\n\s])/gim,
            "$1\n",
          );
        }

        const isFlowchart =
          lowerGraph.startsWith("graph") || lowerGraph.startsWith("flowchart");
        generatedGraph = generatedGraph
          .split("\n")
          .map((line) => {
            let l = line.trimRight();
            if (
              isFlowchart &&
              !l.includes("-->") &&
              !l.includes("---") &&
              l.includes("[")
            )
              l = l.replace(/^([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*\[/, "$1$2[");
            return l;
          })
          .filter((line) => line.length > 0)
          .join("\n");

        return { title: diag.title || "Diagram", code: generatedGraph };
      })
      .filter((diag) => diag.code.length > 5);
  } catch (e) {
    console.error("Failed to parse diagram/flashcard JSON:", e);
  }
  return { processedDiagrams, processedFlashcards, processedMcqs };
};

const Flashcard = ({ front, back, isDarkMode }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className="w-full h-64 cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 shadow-sm preserve-3d group-hover:shadow-md rounded-2xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        <div
          className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div
            className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
          >
            Q
          </div>
          <h3 className="text-xl font-bold">{front}</h3>
          <p
            className={`absolute bottom-4 text-xs font-medium opacity-50 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Click to flip
          </p>
        </div>
        <div
          className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 ${isDarkMode ? "bg-indigo-900/20 border-indigo-500/30 text-indigo-100" : "bg-indigo-50 border-indigo-200 text-indigo-900"}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div
            className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-indigo-500/40 text-white" : "bg-indigo-200 text-indigo-800"}`}
          >
            A
          </div>
          <p className="text-lg font-medium">{back}</p>
        </div>
      </motion.div>
    </div>
  );
};

const MCQCard = ({ question, options, answer, isDarkMode }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div className={`w-full p-6 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl border-2 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-800"}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`mt-1 flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold rounded-md ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>Q</div>
        <h3 className="text-lg font-bold flex-1 leading-snug">{question}</h3>
      </div>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = String(opt).trim().toLowerCase() === String(answer).trim().toLowerCase();
          const showResult = selectedOption !== null;
          let btnClass = isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] hover:border-[#3b435b] text-slate-300" : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700";
          if (showResult) {
            if (isCorrect) btnClass = isDarkMode ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-400" : "bg-emerald-50 border-emerald-400 text-emerald-700";
            else if (isSelected && !isCorrect) btnClass = isDarkMode ? "bg-red-900/40 border-red-500/50 text-red-400" : "bg-red-50 border-red-400 text-red-700";
          }
          return (
            <button
              key={i}
              disabled={showResult}
              onClick={() => setSelectedOption(opt)}
              className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-300 ${btnClass} ${showResult && !isCorrect && !isSelected ? "opacity-30 grayscale" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const loadingTrivia = [
  "Did you know? The first computer bug was an actual moth found in a relay in 1947.",
  "Take a deep breath... Inhale for 4 seconds, exhale for 4 seconds.",
  "Spoly's AI is currently analyzing semantic patterns to generate your flowchart.",
  "Mermaid.js was created to let developers write diagrams like they write code.",
  "Stretch your shoulders! Good posture improves focus and energy.",
  "Fact: AI models 'think' in tokens, which are roughly pieces of words.",
  "Structuring your notes... separating the signal from the noise.",
];

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

const formatGeneratedNotes = (text, isDarkMode) => {
  if (!text) return "No notes returned from backend.";

  return text.split("\n").map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return <div key={index} className="h-3"></div>;

    const formatBold = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={i}
              className={`font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    if (trimmedLine.match(/^(?:📌|#)\s+(.*)/)) {
      const titleText = trimmedLine
        .replace(/^(?:📌|#)\s*/, "")
        .replace(/\*\*/g, "");
      return (
        <div key={index} className="mt-8 mb-4 first:mt-0">
          <h2
            className={`text-2xl font-extrabold tracking-tight flex items-center gap-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            <span
              className={`w-1.5 h-6 rounded-full shadow-sm ${isDarkMode ? "bg-indigo-500 shadow-indigo-500/20" : "bg-indigo-600 shadow-indigo-600/20"}`}
            ></span>
            {titleText}
          </h2>
          <div
            className={`mt-4 w-full h-px ${isDarkMode ? "bg-gradient-to-r from-slate-800 to-transparent" : "bg-gradient-to-r from-slate-200 to-transparent"}`}
          ></div>
        </div>
      );
    }
    if (trimmedLine.startsWith("## ")) {
      const subtitleText = trimmedLine
        .replace(/^##\s*/, "")
        .replace(/\*\*/g, "");
      return (
        <h3
          key={index}
          className={`text-xl font-bold mt-6 mb-3 tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
        >
          {subtitleText}
        </h3>
      );
    }
    if (trimmedLine.startsWith("### ")) {
      const minorText = trimmedLine.replace(/^###\s*/, "").replace(/\*\*/g, "");
      return (
        <h4
          key={index}
          className={`text-lg font-bold mt-6 mb-2 uppercase tracking-wide ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
        >
          {minorText}
        </h4>
      );
    }
    if (trimmedLine.match(/^[•\-*]\s+/)) {
      const bulletText = trimmedLine.replace(/^[•\-*]\s*/, "");
      return (
        <div key={index} className="flex items-start gap-3 mb-2 ml-1 group">
          <div
            className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isDarkMode ? "bg-slate-700 group-hover:bg-indigo-400" : "bg-slate-300 group-hover:bg-indigo-500"}`}
          ></div>
          <div
            className={`flex-1 text-base leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            {formatBold(bulletText)}
          </div>
        </div>
      );
    }
    return (
      <p
        key={index}
        className={`text-base mb-3 leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
      >
        {formatBold(trimmedLine)}
      </p>
    );
  });
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
  ); // --- CLOUD SYNC SETTINGS ---
  const [hasSyncedSettings, setHasSyncedSettings] = useState(false);

  useEffect(() => {
    if (user?.id && !hasSyncedSettings) {
      fetch(`http://127.0.0.1:8000/api/users/settings/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.settings && Object.keys(data.settings).length > 0) {
            const s = data.settings;
            if (s.isDarkMode !== undefined) setIsDarkMode(s.isDarkMode);
            if (s.exportFormat !== undefined) setExportFormat(s.exportFormat);
            if (s.selectedMic !== undefined) setSelectedMic(s.selectedMic);
            if (s.audioConstraints !== undefined)
              setAudioConstraints(s.audioConstraints);
            if (s.settingsToggles !== undefined)
              setSettingsToggles(s.settingsToggles);
          }
          setHasSyncedSettings(true);
        })
        .catch((err) => {
          console.error("Failed to sync settings from cloud", err);
          setHasSyncedSettings(true);
        });
    }
  }, [user?.id, hasSyncedSettings]);

  useEffect(() => {
    if (user?.id && hasSyncedSettings) {
      const payload = {
        clerk_id: user.id,
        settings: {
          isDarkMode,
          exportFormat,
          selectedMic,
          audioConstraints,
          settingsToggles,
        },
      };

      // Debounce saving slightly using setTimeout to avoid spamming the DB
      const handler = setTimeout(() => {
        fetch(`http://127.0.0.1:8000/api/users/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => console.error("Failed to save settings", err));
      }, 1000);

      return () => clearTimeout(handler);
    }
  }, [
    isDarkMode,
    exportFormat,
    selectedMic,
    audioConstraints,
    settingsToggles,
    user?.id,
    hasSyncedSettings,
  ]);
  // ---------------------------

  // --- CUSTOM TEMPLATES (MongoDB) ---
  const [customTemplates, setCustomTemplates] = useState([]);
  const [hasFetchedTemplates, setHasFetchedTemplates] = useState(false);

  useEffect(() => {
    if (user?.id && !hasFetchedTemplates) {
      fetch(`${BACKEND_URL}/api/templates/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.templates) setCustomTemplates(data.templates.map(t => ({ ...t, isCustom: true })));
          setHasFetchedTemplates(true);
        })
        .catch((err) => {
          console.error("Failed to fetch custom templates", err);
          setHasFetchedTemplates(true);
        });
    }
  }, [user?.id, hasFetchedTemplates]);

  const handleSaveCustomTemplate = async (templateData) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/templates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...templateData, clerk_id: user.id }),
      });
      const data = await res.json();
      if (data.success && data.template) {
        // Ensure isCustom flag is always present for the AI pipeline
        setCustomTemplates((prev) => [...prev, { ...data.template, isCustom: true }]);
        showToast("Custom template saved!");
      }
    } catch (err) {
      console.error("Failed to save template", err);
      showToast("Failed to save template.");
    }
  };

  const handleDeleteCustomTemplate = async (templateId) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/templates/${templateId}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId));
        showToast("Template deleted.");
      }
    } catch (err) {
      console.error("Failed to delete template", err);
      showToast("Failed to delete template.");
    }
  };

  const templatesDB = [...builtinTemplatesDB, ...customTemplates];
  // ------------------------------------

  const [status, setStatus] = useState("idle");
  const [successView, setSuccessView] = useState("notes");
  const [triviaIndex, setTriviaIndex] = useState(0);

  const timerRef = useRef(0);
  const [transcript, setTranscript] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("English");

  const [contextFiles, setContextFiles] = useState([]);
  const [isDraggingContext, setIsDraggingContext] = useState(false);
  const contextInputRef = useRef(null);

  const [audioStream, setAudioStream] = useState(null);
  const capturedTitleRef = useRef("");

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
  const extensionAudioChunksRef = useRef([]);

  const chunkIntervalRef = useRef(null);
  const isFinalizingRef = useRef(false);
  const isPausedRef = useRef(false);

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const uploadRef = useRef(null);

  const fakeProgressRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [templateFilter, setTemplateFilter] = useState("All");

  const [notesViewMode, setNotesViewMode] = useState("grid");
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [dragOverFolder, setDragOverFolder] = useState(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [meetingNotes, setMeetingNotes] = useState({
    summary: "",
    takeaways: "",
    decisions: "",
  });
  const [actionItems, setActionItems] = useState([]);
  const [editableMermaids, setEditableMermaids] = useState([]);
  const [editableFlashcards, setEditableFlashcards] = useState([]);
  const [editableMcqs, setEditableMcqs] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);

  // Fetch notes from MongoDB on page load
  useEffect(() => {
    if (!user) return;

    const fetchMyNotes = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/notes/user/${user.id}`,
        );
        const data = await response.json();

        if (data.success && data.notes) {
          const formattedNotes = data.notes.map((n) => {
            const parsedDiagramData = JSON.parse(
              n.diagram_data || '{"diagrams":[],"flashcards":[]}',
            );
            return {
              id: n.id,
              title: n.source_type,
              folderId: "all",
              date: new Date(n.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              duration: "Saved Note",
              items: 0,
              tags: ["AI"],
              summary: n.generated_notes,
              graphs: parsedDiagramData.diagrams || [],
              flashcards: parsedDiagramData.flashcards || [],
              mcqs: parsedDiagramData.mcqs || [],
              audioUrl: null,
            };
          });
          setSavedNotes(formattedNotes);
        }
      } catch (err) {
        console.error("Failed to load notes from MongoDB", err);
      }
    };

    fetchMyNotes();
  }, [user]);

  useEffect(() => {
    let interval;
    if (status === "processing") {
      interval = setInterval(
        () => setTriviaIndex((prev) => (prev + 1) % loadingTrivia.length),
        4500,
      );
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    let interval = null;
    if (status === "recording") {
      interval = setInterval(() => (timerRef.current += 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const processAudioChunkWithBackend = async (blob) => {
    try {
      if (isFinalizingRef.current) return;
      if (!blob || blob.size < 100) return;

      const formData = new FormData();
      formData.append("file", blob, "chunk.webm");
      formData.append(
        "template",
        activeAiTemplateRef.current?.name || "AI Auto-Detect",
      );
      if (
        activeAiTemplateRef.current?.isCustom &&
        activeAiTemplateRef.current?.prompt
      ) {
        formData.append("custom_prompt", activeAiTemplateRef.current.prompt);
      }

      const response = await fetch(`${BACKEND_URL}/api/notes/generate`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        if (isFinalizingRef.current) return;
        const data = await response.json();
        if (data.transcript) setTranscript(data.transcript);
        if (data.notes)
          setMeetingNotes((prev) => ({ ...prev, summary: data.notes }));
      }
    } catch (e) {
      console.error("Live chunk skipped due to rate limit/error.");
    }
  };

  const forceStartSimulation = (scrapedTitle) => {
    if (
      isFinalizingRef.current ||
      status === "recording" ||
      status === "processing" ||
      status === "paused"
    )
      return;
    if (scrapedTitle && typeof scrapedTitle === "string")
      capturedTitleRef.current = scrapedTitle;
    else capturedTitleRef.current = "";

    setActiveTab("workspace");
    setIsExtensionActive(true);
    setStatus("recording");
    isFinalizingRef.current = false;
    setProcessingType("audio");
    timerRef.current = 0;

    setTranscript("");
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaids([]);
    setEditableFlashcards([]);
    setCurrentAudioUrl(null);
    extensionAudioChunksRef.current = [];
  };

  const handleStartLocalRecording = async () => {
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        localMediaRecorderRef.current.onstop = null;
        localMediaRecorderRef.current.ondataavailable = null;
        localMediaRecorderRef.current.stop();
      } catch (e) {}
    }
    localMediaRecorderRef.current = null;

    if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop());
    }

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
    isFinalizingRef.current = false;
    setProcessingType("audio");
    timerRef.current = 0;

    setTranscript("");
    setMeetingNotes({ summary: "", takeaways: "", decisions: "" });
    setActionItems([]);
    setEditableMermaids([]);
    setEditableFlashcards([]);
    setCurrentAudioUrl(null);
    localAudioChunks.current = [];

    if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

    if (stream) {
      setAudioStream(stream);
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm"))
        options = { mimeType: "audio/webm" };

      const recorder = new MediaRecorder(stream, options);
      const recorderSessionId = Date.now();
      recorder._spolySessionId = recorderSessionId;

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0) {
          localAudioChunks.current.push(e.data);
          const chunkBlob = new Blob(localAudioChunks.current, {
            type: "audio/webm",
          });
          await processAudioChunkWithBackend(chunkBlob);
        }
      };

      recorder.onstop = async () => {
        if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

        if (
          localMediaRecorderRef.current &&
          localMediaRecorderRef.current._spolySessionId !== recorderSessionId
        ) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        try {
          const finalBlob = new Blob(localAudioChunks.current, {
            type: "audio/webm",
          });
          const generatedUrl = window.URL.createObjectURL(finalBlob);
          setCurrentAudioUrl(generatedUrl);
          await processAudioWithBackend(
            finalBlob,
            "Live Capture",
            generatedUrl,
          );
        } catch (err) {
          finishProcessing("Live Capture", null);
        } finally {
          stream.getTracks().forEach((t) => t.stop());
          if (
            localMediaRecorderRef.current &&
            localMediaRecorderRef.current._spolySessionId === recorderSessionId
          ) {
            localMediaRecorderRef.current = null;
          }
        }
      };

      recorder.start(5000);
      localMediaRecorderRef.current = recorder;
    } else {
      showToast("Mic unavailable or denied.");
      localMediaRecorderRef.current = null;
    }
  };

  const handleStopLocalRecording = () => {
    if (isFinalizingRef.current) return;

    if (isExtensionActive) {
      window.postMessage({ type: "SPOLY_REMOTE_STOP_EXTENSION" }, "*");
    } else {
      isFinalizingRef.current = true;
      setStatus("processing");
      if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);

      const currentRecorder = localMediaRecorderRef.current;
      if (currentRecorder && currentRecorder.state !== "inactive") {
        currentRecorder.requestData();
        setTimeout(() => {
          try {
            if (currentRecorder.state !== "inactive") {
              currentRecorder.stop();
            }
          } catch (e) {
            // 🟢 FIX: Do not save if it crashes
            setStatus("idle");
            isFinalizingRef.current = false;
            showToast("Recording crashed. Not saved.");
          }
        }, 100);
      } else {
        // 🟢 FIX: Do not save an empty note if no recorder is active
        setStatus("idle");
        isFinalizingRef.current = false;
        showToast("Recording was empty.");
      }
    }
  };

  const stopLocalRef = useRef(handleStopLocalRecording);
  useEffect(() => {
    stopLocalRef.current = handleStopLocalRecording;
  }, [isExtensionActive, status]);

  const forceStartRef = useRef(forceStartSimulation);
  useEffect(() => {
    forceStartRef.current = forceStartSimulation;
  }, [status]);

  const pauseLocalRef = useRef((isPaused) => {
    if (isFinalizingRef.current) return;
    isPausedRef.current = isPaused;
    setStatus(isPaused ? "paused" : "recording");
  });

  useEffect(() => {
    if (document.getElementById("spoly-extension-marker")) {
      setIsWidgetDeployed(Boolean(document.getElementById("spoly-fab-root")));
    }
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      const type = e.data?.type;

      if (
        type === "SPOLY_RECORDING_STARTED" ||
        type === "SPOLY_HEARTBEAT_LIVE"
      ) {
        if (
          e.data.title &&
          e.data.title.trim() !== "" &&
          e.data.title !== "Live Web Capture"
        ) {
          capturedTitleRef.current = e.data.title;
        }
        if (e.data.speakerState)
          setGlobalSpeakerColor(
            e.data.speakerState === "sys" ? "bg-purple-500" : "bg-blue-500",
          );
        forceStartRef.current(e.data.title);
      } else if (type === "INTERNAL_SYNC_UI") {
        if (e.data.isLive === false) {
          stopLocalRef.current();
        } else {
          pauseLocalRef.current(e.data.isPaused);
        }
      } else if (type === "SPOLY_WIDGET_STATUS") {
        setIsWidgetDeployed(Boolean(e.data.status));
      } else if (type === "SPOLY_RECEIVE_CHUNK") {
        if (isFinalizingRef.current) return;

        const index = e.data.index;
        const processBase64 = async () => {
          try {
            const decodedBlob = await decodeBase64ToBlob(e.data.audioData);
            if (decodedBlob && decodedBlob.size > 0) {
              extensionAudioChunksRef.current[index] = decodedBlob;

              if (!extensionAudioChunksRef.current[0]) return;

              const validChunks = extensionAudioChunksRef.current.filter(
                (b) => b,
              );
              const accumulatedBlob = new Blob(validChunks, {
                type: "audio/webm",
              });
              processAudioChunkWithBackend(accumulatedBlob);
            }
          } catch (err) {}
        };
        processBase64();
      } else if (
        type === "SPOLY_RECORDING_STOPPED" ||
        type === "SPOLY_UPLOAD_COMPLETE"
      ) {
        if (isFinalizingRef.current) return;
        isFinalizingRef.current = true;
        setStatus("processing");

        setTimeout(() => {
          const validChunks = extensionAudioChunksRef.current.filter((b) => b);
          if (validChunks.length > 0) {
            const finalBlob = new Blob(validChunks, { type: "audio/webm" });
            const finalUrl = window.URL.createObjectURL(finalBlob);
            setCurrentAudioUrl(finalUrl);
            processAudioWithBackend(
              finalBlob,
              capturedTitleRef.current || "Extension Capture",
              finalUrl,
            );
          } else {
            // 🟢 FIX: Do not save empty extension recordings to the library
            setStatus("idle");
            isFinalizingRef.current = false;
            showToast("Extension captured no audio.");
          }
        }, 800);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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

  const finishProcessing = (
    customTitle = null,
    overrideAudioUrl = null,
    fetchedData = null,
  ) => {
    setStatus("complete");
    setIsExtensionActive(false);
    setIsWidgetDeployed(false);
    setAudioStream(null);
    isFinalizingRef.current = false;
    showToast(
      processingType === "image"
        ? "Whiteboard Converted Successfully!"
        : `Processed!`,
    );

    let finalTitle =
      capturedTitleRef.current ||
      `Live Session ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (customTitle && customTitle !== "Live Capture") finalTitle = customTitle;
    if (activeAiTemplate)
      finalTitle = `[${activeAiTemplate.name}] ${finalTitle}`;

    const newNote = {
      id: Date.now().toString(),
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
        fetchedData?.summary ||
        meetingNotes.summary ||
        "Summary generation failed.",
      graphs: fetchedData?.graphs || editableMermaids,
      flashcards: fetchedData?.flashcards || editableFlashcards,
      mcqs: fetchedData?.mcqs || editableMcqs,
      audioUrl: overrideAudioUrl || currentAudioUrl,
    };
    setSavedNotes((prev) => [newNote, ...prev]);

    // Save the final output to MongoDB
    if (user) {
      const diagramDataToSave = JSON.stringify({
        diagrams: fetchedData?.graphs || editableMermaids,
        flashcards: fetchedData?.flashcards || editableFlashcards,
        mcqs: fetchedData?.mcqs || editableMcqs,
      });

      fetch(`${BACKEND_URL}/api/notes/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: user.id,
          source_type: finalTitle,
          transcript: fetchedData?.transcript || transcript || "No transcript",
          notes: fetchedData?.summary || meetingNotes.summary,
          diagram_data: diagramDataToSave,
        }),
      }).catch((err) => console.error("MongoDB Save Error:", err));
    }
  };

  const processAudioWithBackend = async (
    audioBlob,
    defaultTitle,
    overrideAudioUrl = null,
  ) => {
    try {
      if (!audioBlob || audioBlob.size < 100) {
        // 🟢 FIX: Abort instead of saving empty notes
        setStatus("idle");
        isFinalizingRef.current = false;
        showToast("Audio too short or empty. Not saved.");
        return;
      }

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append(
        "template",
        activeAiTemplateRef.current?.name || "AI Auto-Detect",
      );
      if (
        activeAiTemplateRef.current?.isCustom &&
        activeAiTemplateRef.current?.prompt
      ) {
        formData.append("custom_prompt", activeAiTemplateRef.current.prompt);
      }

      // Pre-Context Uploads functionality
      if (contextFiles && contextFiles.length > 0) {
        contextFiles.forEach((file) => {
          formData.append("context_files", file);
        });
      }

      const response = await fetch(`${BACKEND_URL}/api/notes/generate`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();

      // 🟢 FIX: Throw an error if the backend returns an error message
      if (data.error) throw new Error(data.error);

      const generatedTranscript =
        data.transcript || "No transcript returned by the AI.";
      const generatedSummary = data.notes || "No notes generated by the AI.";

      const { processedDiagrams, processedFlashcards, processedMcqs } = parseBackendDiagrams(
        data.diagram,
      );

      setTranscript(generatedTranscript);
      setMeetingNotes({
        summary: generatedSummary,
        takeaways: "",
        decisions: "",
      });
      setEditableMermaids(processedDiagrams);
      setEditableFlashcards(processedFlashcards);
      setEditableMcqs(processedMcqs);

      // Only call finish processing on absolute success!
      finishProcessing(defaultTitle, overrideAudioUrl || currentAudioUrl, {
        transcript: generatedTranscript,
        summary: generatedSummary,
        graphs: processedDiagrams,
        flashcards: processedFlashcards,
        mcqs: processedMcqs,
      });
    } catch (error) {
      console.error("Backend Error:", error);
      // 🟢 FIX: Do NOT call finishProcessing. Just reset to idle and alert the user.
      setStatus("idle");
      setIsExtensionActive(false);
      setIsWidgetDeployed(false);
      isFinalizingRef.current = false;
      alert(
        `🚨 Generation Failed!\nDetails: ${error.message}\n\nNote was not saved to Library.`,
      );
    }
  };

  const toggleLocalPause = () => {
    if (status === "recording") {
      if (localMediaRecorderRef.current?.state === "recording")
        localMediaRecorderRef.current.pause();
      setStatus("paused");
    } else if (status === "paused") {
      if (localMediaRecorderRef.current?.state === "paused")
        localMediaRecorderRef.current.resume();
      setStatus("recording");
    }
  };

  const handleToggleWidget = () => {
    if (document.getElementById("spoly-extension-marker")) {
      window.postMessage({ type: "SPOLY_TOGGLE_WIDGET" }, "*");
    } else
      alert(
        "⚠️ CONNECTION PENDING\n\nPlease completely refresh this page (F5), and try clicking the button again!",
      );
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
    isFinalizingRef.current = false;

    const uploadedUrl = URL.createObjectURL(file);
    if (!isImage) setCurrentAudioUrl(uploadedUrl);

    let progress = 0;
    if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(async () => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadRef.current);
        setStatus("processing");
        if (isImage) setTimeout(() => finishProcessing(), 3000);
        else await processAudioWithBackend(file, file.name, uploadedUrl);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const [textInput, setTextInput] = useState("");

  const processTextInput = async () => {
    if (!textInput.trim() || textInput.trim().length < 20) {
      showToast("Please enter at least 20 characters of text.");
      return;
    }

    setProcessingType("text");
    setStatus("uploading");
    setFileName("Processing your text input...");
    fakeProgressRef.current = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 90) {
          clearInterval(fakeProgressRef.current);
          return 90;
        }
        return p + 4;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("transcript", textInput.trim());
      formData.append(
        "template",
        activeAiTemplateRef.current?.name || "Standard Study Notes",
      );
      if (
        activeAiTemplateRef.current?.isCustom &&
        activeAiTemplateRef.current?.prompt
      ) {
        formData.append("custom_prompt", activeAiTemplateRef.current.prompt);
      }
      if (contextFiles && contextFiles.length > 0) {
        contextFiles.forEach((file) => {
          formData.append("context_files", file, file.name);
        });
      }

      const response = await fetch(`${BACKEND_URL}/api/notes/process-text`, {
        method: "POST",
        body: formData,
      });
      const fetchedData = await response.json();

      clearInterval(fakeProgressRef.current);
      setUploadProgress(100);

      let processedDiagrams = [];
      let processedFlashcards = [];
      let processedMcqs = [];
      try {
        const parsed =
          typeof fetchedData.diagram === "string"
            ? JSON.parse(fetchedData.diagram)
            : fetchedData.diagram;
        if (parsed?.diagrams) processedDiagrams = parsed.diagrams;
        if (parsed?.flashcards) processedFlashcards = parsed.flashcards;
        if (parsed?.mcqs) processedMcqs = parsed.mcqs;
      } catch {
        /* ignore parse errors */
      }

      const finalTitle = activeAiTemplate
        ? `[${activeAiTemplate.name}] Text Note`
        : "Text Note";

      setTimeout(() => {
        setMeetingNotes({
          summary: fetchedData.summary || fetchedData.notes || "",
          takeaways: "",
          decisions: "",
        });
        setEditableMermaids(processedDiagrams);
        setEditableFlashcards(processedFlashcards);
        setEditableMcqs(processedMcqs);

        finishProcessing(finalTitle, null, {
          transcript: textInput.trim(),
          summary: fetchedData.summary || fetchedData.notes || "",
          graphs: processedDiagrams,
          flashcards: processedFlashcards,
          mcqs: processedMcqs
        });
        setTextInput("");
      }, 800);
    } catch (err) {
      clearInterval(fakeProgressRef.current);
      console.error("Text processing error:", err);
      showToast("Failed to process text. Please try again.");
      setStatus("idle");
    }
  };

  // YouTube processing — Extension first with backend fallback
  const processYoutube = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    // Extract Video ID
    const match = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    if (!match) {
      alert("Invalid YouTube URL.");
      return;
    }
    const videoId = match[1];

    setProcessingType("youtube");
    setFileName("Fetching YouTube Transcript...");
    setStatus("uploading");
    setUploadProgress(0);
    isFinalizingRef.current = false;

    let progress = 0;
    if (uploadRef.current) clearInterval(uploadRef.current);
    uploadRef.current = setInterval(() => {
      progress += Math.random() * 5;
      setUploadProgress(Math.min(progress, 40));
    }, 500);

    // Helper: process the AI pipeline after we have a transcript (shared by both paths)
    const processTranscriptThroughAI = async (transcriptText) => {
      setFileName("AI is Analyzing Transcript...");
      setUploadProgress(50);

      const formData = new FormData();
      formData.append("transcript", transcriptText);
      formData.append(
        "template",
        activeAiTemplateRef.current?.name || "AI Auto-Detect",
      );
      if (
        activeAiTemplateRef.current?.isCustom &&
        activeAiTemplateRef.current?.prompt
      ) {
        formData.append(
          "custom_prompt",
          activeAiTemplateRef.current.prompt,
        );
      }

      if (contextFiles && contextFiles.length > 0) {
        contextFiles.forEach((file) => {
          formData.append("context_files", file);
        });
      }

      const response = await fetch(
        `${BACKEND_URL}/api/notes/process-text`,
        {
          method: "POST",
          body: formData,
        },
      );

      clearInterval(uploadRef.current);
      setUploadProgress(100);
      setStatus("processing");

      if (!response.ok)
        throw new Error(`Server returned Code ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setTranscript(data.transcript || "");
      setMeetingNotes({
        summary: data.notes || "",
        takeaways: "",
        decisions: "",
      });

      const { processedDiagrams, processedFlashcards, processedMcqs } =
        parseBackendDiagrams(data.diagram);
      setEditableMermaids(processedDiagrams);
      setEditableFlashcards(processedFlashcards);
      setEditableMcqs(processedMcqs);

      setTimeout(() => {
        finishProcessing("YouTube Video Notes", null, {
          transcript: data.transcript,
          summary: data.notes,
          graphs: processedDiagrams,
          flashcards: processedFlashcards,
          mcqs: processedMcqs,
        });
        setYoutubeUrl("");
      }, 1000);
    };

    // Helper: call the backend directly to fetch transcript + generate notes
    const processViaBackend = async () => {
      setFileName("Server is fetching YouTube Transcript...");
      try {
        const formData = new FormData();
        formData.append("url", youtubeUrl);
        formData.append(
          "template",
          activeAiTemplateRef.current?.name || "AI Auto-Detect",
        );
        if (
          activeAiTemplateRef.current?.isCustom &&
          activeAiTemplateRef.current?.prompt
        ) {
          formData.append("custom_prompt", activeAiTemplateRef.current.prompt);
        }
        if (contextFiles && contextFiles.length > 0) {
          contextFiles.forEach((file) => {
            formData.append("context_files", file);
          });
        }

        const response = await fetch(
          `${BACKEND_URL}/api/notes/youtube`,
          {
            method: "POST",
            body: formData,
          },
        );

        clearInterval(uploadRef.current);
        setUploadProgress(100);
        setStatus("processing");

        if (!response.ok)
          throw new Error(`Server returned Code ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setTranscript(data.transcript || "");
        setMeetingNotes({
          summary: data.notes || "",
          takeaways: "",
          decisions: "",
        });

        const { processedDiagrams, processedFlashcards, processedMcqs } =
          parseBackendDiagrams(data.diagram);
        setEditableMermaids(processedDiagrams);
        setEditableFlashcards(processedFlashcards);
        setEditableMcqs(processedMcqs);

        setTimeout(() => {
          finishProcessing("YouTube Video Notes", null, {
            transcript: data.transcript,
            summary: data.notes,
            graphs: processedDiagrams,
            flashcards: processedFlashcards,
            mcqs: processedMcqs,
          });
          setYoutubeUrl("");
        }, 1000);
      } catch (err) {
        clearInterval(uploadRef.current);
        alert("⚠️ YouTube Processing Failed!\n\nDetails: " + err.message);
        setStatus("idle");
      }
    };

    // Try extension first, fallback to backend after 5 seconds
    let extensionResponded = false;

    const handleYtResult = async (event) => {
      if (event.data.type === "SPOLY_YT_RESULT") {
        extensionResponded = true;
        window.removeEventListener("message", handleYtResult);

        if (!event.data.success) {
          // Extension failed — try backend directly
          console.warn("Extension failed, falling back to backend:", event.data.error);
          await processViaBackend();
          return;
        }

        try {
          await processTranscriptThroughAI(event.data.text);
        } catch (err) {
          clearInterval(uploadRef.current);
          alert("⚠️ Processing Failed!\n\nDetails: " + err.message);
          setStatus("idle");
        }
      }
    };

    window.addEventListener("message", handleYtResult);
    window.postMessage({ type: "SPOLY_FETCH_YT_TRANSCRIPT", videoId }, "*");

    // Fallback: if extension doesn't respond in 5 seconds, use backend directly
    setTimeout(async () => {
      if (!extensionResponded) {
        window.removeEventListener("message", handleYtResult);
        console.log("Extension not detected, using backend YouTube endpoint...");
        await processViaBackend();
      }
    }, 5000);
  };

  const handleReset = () => {
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        localMediaRecorderRef.current.onstop = null;
        localMediaRecorderRef.current.ondataavailable = null;
        localMediaRecorderRef.current.stop();
      } catch (e) {}
    }
    localMediaRecorderRef.current = null;
    localAudioChunks.current = [];

    if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop());
    }

    isFinalizingRef.current = false;
    setStatus("idle");
    setTranscript("");
    timerRef.current = 0;
    setFileName("");
    setUploadProgress(0);
    setIsExtensionActive(false);
    setIsWidgetDeployed(false);
    setAudioStream(null);
    setSuccessView("notes");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveTab("workspace");
    setActionItems([]);
    setContextFiles([]);
    setEditableMermaids([]);
    setEditableFlashcards([]);
    setEditableMcqs([]);
    setContextTheme(null);
    capturedTitleRef.current = "";
    extensionAudioChunksRef.current = [];
    if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);
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

      <main className="relative z-10 flex flex-col flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
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
                    className={`font-bold text-sm tracking-tight ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {status === "paused" ? "Paused" : "Recording Active"}
                  </span>
                  {!isExtensionActive && (
                    <>
                      <div
                        className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
                      ></div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={toggleLocalPause}
                          className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${status === "paused" ? "bg-amber-500/20 text-amber-500" : "hover:bg-slate-800 text-slate-300"}`}
                        >
                          {status === "paused" ? (
                            <Play size={14} fill="currentColor" />
                          ) : (
                            <Pause size={14} fill="currentColor" />
                          )}
                        </button>
                        <button
                          onClick={handleStopLocalRecording}
                          className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Square size={12} fill="currentColor" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

            {activeTab === "workspace" && (
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex items-center rounded-xl px-4 py-2 shadow-sm gap-2 transition-all hover:scale-105 hover:shadow-md cursor-pointer border ${isDarkMode ? "bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:border-indigo-400/50" : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-300"}`}
                title="Click to view or change the active AI template"
              >
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-xs font-bold truncate max-w-[140px]">
                  {activeAiTemplate ? activeAiTemplate.name : "AI Auto-Detect"}
                </span>
              </button>
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
                    className={`bg-transparent border-none focus:outline-none text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
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
                  </select>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors hidden sm:flex ${isDarkMode ? "bg-emerald-900/20 border border-emerald-800/50 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-700"}`}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>{" "}
                  Ready
                </div>
              </>
            )}
            {selectedNote && (
              <button
                onClick={() => setSelectedNote(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all focus:outline-none ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#232a3b] text-slate-200 border border-[#232a3b]" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent"}`}
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

                    {status === "idle" && (
                      <motion.div
                        key="idle-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-6 pt-2 pb-2 md:grid-cols-2">
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
                            <div className="relative z-20 flex flex-col flex-1 w-full p-6">
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
                              <Headphones
                                className={`absolute left-6 bottom-2 w-24 h-24 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-blue-400/25" : "text-blue-500/20"}`}
                                strokeWidth="2"
                              />
                              <div
                                className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border ${isDarkMode ? "bg-[#131722] border-blue-900/50 text-blue-400" : "bg-white border-slate-100 text-blue-600"}`}
                              >
                                <Mic size={32} />
                              </div>
                            </div>
                            <div className="relative z-20 flex flex-col flex-1 w-full p-6">
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
                        </div>

                        <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2">
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
                            className={`group relative flex flex-col text-left transition-all duration-300 hover:shadow-2xl border border-dashed cursor-pointer rounded-2xl overflow-hidden min-h-[260px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus:within:ring-offset-[#131722] ${isDragging ? (isDarkMode ? "border-emerald-400 bg-emerald-900/20" : "border-emerald-400 bg-emerald-50") : isDarkMode ? "bg-[#1a1f2e] border-[#232a3b] hover:border-emerald-500/50" : "bg-white border-slate-300 hover:border-emerald-400 shadow-sm"}`}
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
                            <div className="relative z-20 flex flex-col flex-1 w-full p-6">
                              <h3
                                className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-700"}`}
                              >
                                {isDragging ? "Drop File Here" : "Upload File"}
                              </h3>
                              <p
                                className={`text-sm font-medium leading-relaxed pr-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                              >
                                Post-process an existing audio recording or
                                image.
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
                            <div className="relative z-20 flex flex-col flex-1 w-full p-6">
                              <h3
                                className={`text-xl font-bold mb-3 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-red-400" : "text-slate-800 group-hover:text-red-600"}`}
                              >
                                YouTube Link
                              </h3>
                              <form
                                onSubmit={processYoutube}
                                className="relative w-full mt-auto group/form"
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

                        {/* ─── PRE-CONTEXT DOCUMENTS CARD ─── */}
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
                        className="flex flex-col items-center justify-center w-full max-w-lg gap-6 py-10 mx-auto"
                      >
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-2 ${processingType === "youtube" ? (isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600") : processingType === "text" ? (isDarkMode ? "bg-violet-900/30 text-violet-400" : "bg-violet-100 text-violet-600") : isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                        >
                          {processingType === "image" ? (
                            <ImageIcon size={28} />
                          ) : processingType === "youtube" ? (
                            <Youtube size={28} />
                          ) : processingType === "text" ? (
                            <FileText size={28} />
                          ) : (
                            <FileAudio size={28} />
                          )}
                        </div>
                        <div className="w-full text-center">
                          <p className="px-4 mb-1 text-lg font-bold tracking-tight truncate">
                            {fileName}
                          </p>
                          <p
                            className={`font-medium text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {processingType === "youtube"
                              ? "Fetching Transcript from YouTube..."
                              : processingType === "text"
                                ? "Processing your text with AI..."
                                : "Uploading to Spoly Servers..."}
                          </p>
                          <div
                            className={`w-full h-3 rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
                          >
                            <motion.div
                              className={`h-full ${processingType === "youtube" ? "bg-gradient-to-r from-red-500 to-orange-500" : processingType === "text" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
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
                    className="grid xl:grid-cols-1 gap-8 h-[75vh]"
                  >
                    <div
                      className={`flex flex-col h-full shadow-sm rounded-[2rem] border overflow-hidden transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      <div
                        className={`relative p-5 flex items-center justify-between gap-4 border-b ${isDarkMode ? "bg-gradient-to-r from-[#0b0f19] to-[#131722] border-[#2A2F3D]" : "bg-gradient-to-r from-slate-50 to-white border-slate-200"}`}
                      >
                        <h2
                          className={`font-bold text-xl tracking-tight flex items-center gap-3 ${status === "paused" ? "text-amber-500" : isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {status === "paused" ? (
                            <>
                              <PauseCircle className="animate-pulse" />{" "}
                              Recording Paused
                            </>
                          ) : status === "recording" ? (
                            <>
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>{" "}
                              Recording Live Audio
                            </>
                          ) : (
                            <>
                              <Sparkles className="text-blue-500" /> AI
                              Processing
                            </>
                          )}
                        </h2>

                        {status !== "processing" && (
                          <button
                            onClick={handleStopLocalRecording}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                          >
                            <Square size={14} fill="currentColor" /> Stop &
                            Generate
                          </button>
                        )}
                      </div>

                      {status === "recording" && transcript && (
                        <div className="flex-1 p-8 mt-2 overflow-y-auto custom-scrollbar">
                          <h3
                            className={`font-bold text-lg mb-2 flex items-center gap-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                          >
                            <Activity size={18} className="animate-pulse" />{" "}
                            Live Transcription
                          </h3>
                          <p
                            className={`text-sm mb-8 opacity-80 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                          >
                            {transcript}
                          </p>

                          {meetingNotes.summary && (
                            <>
                              <h3
                                className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
                              >
                                <Sparkles size={18} className="animate-pulse" />{" "}
                                AI Processing Preview
                              </h3>
                              <div
                                className={`p-5 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                              >
                                {formatGeneratedNotes(
                                  meetingNotes.summary,
                                  isDarkMode,
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {status === "processing" && (
                        <div className="relative flex flex-col items-center justify-center flex-1 px-8 space-y-8 overflow-hidden text-center">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 10,
                                ease: "linear",
                              }}
                              className="w-96 h-96 border-[1px] border-blue-500 rounded-full border-dashed"
                            ></motion.div>
                            <motion.div
                              animate={{ rotate: -360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 15,
                                ease: "linear",
                              }}
                              className="absolute w-[30rem] h-[30rem] border-[1px] border-indigo-500 rounded-full border-dashed"
                            ></motion.div>
                          </div>

                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut",
                            }}
                            className={`p-6 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] ${isDarkMode ? "bg-[#131722] border border-blue-900/50" : "bg-white border border-blue-100"}`}
                          >
                            <Loader2
                              size={48}
                              className="text-blue-500 animate-spin"
                            />
                          </motion.div>

                          <div>
                            <h3 className="mb-2 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                              Architecting your Notes...
                            </h3>
                            <p
                              className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Spoly is currently synthesizing the audio and
                              generating structured data.
                            </p>
                          </div>

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={triviaIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`mt-8 max-w-md p-5 rounded-2xl border backdrop-blur-sm ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-slate-300" : "bg-slate-50/80 border-slate-200 text-slate-700"}`}
                            >
                              <p className="text-sm font-medium leading-relaxed">
                                <Sparkles
                                  size={16}
                                  className="inline mr-2 text-amber-400"
                                />
                                {loadingTrivia[triviaIndex]}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {status === "complete" && (
                  <motion.div
                    key="success-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-6xl mx-auto space-y-8"
                  >
                    <div
                      className={`rounded-[2.5rem] relative border ${isDarkMode ? "bg-[#0b0f19] border-emerald-500/20 shadow-[0_20px_60px_rgba(16,185,129,0.1)]" : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl border-transparent"}`}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                        <div
                          className={`absolute -top-24 -right-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-emerald-600/15" : "bg-white/20"}`}
                        ></div>
                        <div
                          className={`absolute -bottom-24 -left-24 w-96 h-96 blur-[100px] rounded-full ${isDarkMode ? "bg-teal-600/15" : "bg-white/0"}`}
                        ></div>
                      </div>
                      <div className="relative z-20 flex flex-col items-center justify-between gap-6 p-8 md:flex-row">
                        <div className="flex items-center gap-6">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${isDarkMode ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/20 text-white border border-white/20"}`}
                          >
                            <CheckCircle2 size={32} />
                          </div>
                          <div>
                            <h2
                              className={`text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? "text-emerald-50" : "text-white"}`}
                            >
                              Session Saved Successfully!
                            </h2>
                            <p
                              className={`font-medium ${isDarkMode ? "text-emerald-200/70" : "text-emerald-50"}`}
                            >
                              Your backend data has been successfully mapped to
                              the UI.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            isFinalizingRef.current = false;
                            setSelectedNote(savedNotes[0]);
                            setStatus("idle");
                          }}
                          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${isDarkMode ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400" : "bg-white text-emerald-600 hover:bg-slate-50"}`}
                        >
                          <FileText size={18} /> Add to Library
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <div
                        className={`inline-flex rounded-full p-1 border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                      >
                        <button
                          onClick={() => setSuccessView("notes")}
                          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "notes" ? (isDarkMode ? "bg-blue-600 text-white shadow-md" : "bg-blue-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          <AlignLeft size={16} /> Structured Notes
                        </button>

                        {editableMermaids.length > 0 && (
                          <button
                            onClick={() => setSuccessView("diagram")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "diagram" ? (isDarkMode ? "bg-emerald-600 text-white shadow-md" : "bg-emerald-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            <Workflow size={16} /> Multi-Diagram View
                          </button>
                        )}

                        {editableFlashcards.length > 0 && (
                          <button
                            onClick={() => setSuccessView("flashcards")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "flashcards" ? (isDarkMode ? "bg-indigo-600 text-white shadow-md" : "bg-indigo-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            <Layers size={16} /> Practice Flashcards
                          </button>
                        )}

                        {editableMcqs.length > 0 && (
                          <button
                            onClick={() => setSuccessView("mcqs")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${successView === "mcqs" ? (isDarkMode ? "bg-indigo-600 text-white shadow-md" : "bg-indigo-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            <HelpCircle size={16} /> Practice MCQs
                          </button>
                        )}
                      </div>
                    </div>

                    <div
                      className={`rounded-[2rem] p-8 border shadow-sm flex flex-col min-h-[600px] w-full transition-all duration-500 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
                    >
                      {successView === "notes" ? (
                        <div
                          className={`text-sm md:text-base leading-relaxed overflow-y-auto custom-scrollbar pr-4 flex-1 w-full ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {formatGeneratedNotes(
                            meetingNotes.summary,
                            isDarkMode,
                          )}
                        </div>
                      ) : successView === "flashcards" ? (
                        <div className="grid w-full h-full grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
                          {editableFlashcards.map((card, index) => (
                            <Flashcard
                              key={index}
                              front={card.front}
                              back={card.back}
                              isDarkMode={isDarkMode}
                            />
                          ))}
                        </div>
                      ) : successView === "mcqs" ? (
                        <div className="grid w-full h-full grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
                          {editableMcqs.map((mcq, index) => (
                            <MCQCard
                              key={index}
                              question={mcq.question}
                              options={mcq.options || []}
                              answer={mcq.answer}
                              isDarkMode={isDarkMode}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 w-full h-full pr-2 space-y-8 overflow-auto custom-scrollbar">
                          {editableMermaids.map((diag, index) => (
                            <div
                              key={index}
                              className={`block p-6 rounded-xl border w-full ${isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D]" : "bg-slate-50 border-slate-100"}`}
                            >
                              <h4
                                className={`font-bold mb-4 border-b pb-2 ${isDarkMode ? "text-emerald-400 border-emerald-500/20" : "text-emerald-600 border-emerald-200"}`}
                              >
                                {diag.title}
                              </h4>
                              <div className="w-full h-[400px]">
                                <MermaidDiagram
                                  chart={diag.code}
                                  isDarkMode={isDarkMode}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center pb-6 mt-12">
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
                  clerkId={user?.id}
                  customTemplates={customTemplates}
                  onSaveCustomTemplate={handleSaveCustomTemplate}
                  onDeleteCustomTemplate={handleDeleteCustomTemplate}
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
