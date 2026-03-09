import React from 'react';
import { motion } from 'framer-motion';

export const ScrollbarStyles = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(100, 116, 139, 0.6); }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(51, 65, 85, 0.6); }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(71, 85, 105, 0.8); }
  `}</style>
);

export const WorkspaceMeshBackground = ({ isDarkMode, customTheme }) => {
  // Use custom theme colors if a file is uploaded, otherwise use the default blue/indigo
  const glow1 = customTheme ? (isDarkMode ? customTheme.d1 : customTheme.l1) : (isDarkMode ? 'bg-blue-900/10' : 'bg-blue-200/30');
  const glow2 = customTheme ? (isDarkMode ? customTheme.d2 : customTheme.l2) : (isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-200/20');
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500">
      <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? "bg-[#0b0f19]" : "bg-[#f8fafc]"}`}></div>
      <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 45, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className={`absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[100px] will-change-transform transform-gpu transition-colors duration-1000 ${glow1}`} />
      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className={`absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] will-change-transform transform-gpu transition-colors duration-1000 ${glow2}`} />
    </div>
  );
};

export const AudioWaveform = ({ isRecording, color = "bg-blue-500" }) => (
  <div className="flex items-center gap-1.5 h-8">
    {[...Array(7)].map((_, i) => (
      <motion.div key={`wave-${i}`} animate={isRecording ? { height: ["20%", "100%", "30%", "80%", "20%"] } : { height: "15%" }} transition={isRecording ? { duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }} className={`w-1.5 ${color} rounded-full`} />
    ))}
  </div>
);

export const getTheme = (theme, dark) => {
  const themes = {
    blue: dark ? { iconBg: "bg-[#131722] text-blue-400 border-blue-900/50", hover: "hover:border-blue-500/50 shadow-blue-500/10", text: "text-blue-400", borderGlow: "from-blue-600 via-indigo-500 to-cyan-400", glow1: "bg-blue-600/40", glow2: "bg-cyan-600/40", accent: "from-blue-500" } : { iconBg: "bg-blue-50/80 text-blue-600 border-blue-200", hover: "hover:border-blue-400 shadow-blue-500/10", text: "text-blue-600", borderGlow: "from-blue-400 via-indigo-400 to-cyan-300", glow1: "bg-blue-400/40", glow2: "bg-cyan-300/40", accent: "from-blue-400" },
    purple: dark ? { iconBg: "bg-[#131722] text-purple-400 border-purple-900/50", hover: "hover:border-purple-500/50 shadow-purple-500/10", text: "text-purple-400", borderGlow: "from-purple-600 via-fuchsia-500 to-pink-400", glow1: "bg-purple-600/40", glow2: "bg-fuchsia-600/40", accent: "from-purple-500" } : { iconBg: "bg-purple-50/80 text-purple-600 border-purple-200", hover: "hover:border-purple-400 shadow-purple-500/10", text: "text-purple-600", borderGlow: "from-purple-400 via-fuchsia-400 to-pink-300", glow1: "bg-purple-400/40", glow2: "bg-fuchsia-300/40", accent: "from-purple-400" },
    emerald: dark ? { iconBg: "bg-[#131722] text-emerald-400 border-emerald-900/50", hover: "hover:border-emerald-500/50 shadow-emerald-500/10", text: "text-emerald-400", borderGlow: "from-emerald-600 via-teal-500 to-green-400", glow1: "bg-emerald-600/40", glow2: "bg-teal-600/40", accent: "from-emerald-500" } : { iconBg: "bg-emerald-50/80 text-emerald-600 border-emerald-200", hover: "hover:border-emerald-400 shadow-emerald-500/10", text: "text-emerald-600", borderGlow: "from-emerald-400 via-teal-400 to-green-300", glow1: "bg-emerald-400/40", glow2: "bg-teal-300/40", accent: "from-emerald-400" },
    amber: dark ? { iconBg: "bg-[#131722] text-amber-400 border-amber-900/50", hover: "hover:border-amber-500/50 shadow-amber-500/10", text: "text-amber-400", borderGlow: "from-amber-600 via-orange-500 to-yellow-400", glow1: "bg-amber-600/40", glow2: "bg-orange-600/40", accent: "from-amber-500" } : { iconBg: "bg-amber-50/80 text-amber-600 border-amber-200", hover: "hover:border-amber-400 shadow-amber-500/10", text: "text-amber-600", borderGlow: "from-amber-400 via-orange-400 to-yellow-300", glow1: "bg-amber-400/40", glow2: "bg-orange-300/40", accent: "from-amber-400" },
    rose: dark ? { iconBg: "bg-[#131722] text-rose-400 border-rose-900/50", hover: "hover:border-rose-500/50 shadow-rose-500/10", text: "text-rose-400", borderGlow: "from-rose-600 via-pink-500 to-red-400", glow1: "bg-rose-600/40", glow2: "bg-pink-600/40", accent: "from-rose-500" } : { iconBg: "bg-rose-50/80 text-rose-600 border-rose-200", hover: "hover:border-rose-400 shadow-rose-500/10", text: "text-rose-600", borderGlow: "from-rose-400 via-pink-400 to-red-300", glow1: "bg-rose-400/40", glow2: "bg-pink-300/40", accent: "from-rose-400" },
  };
  return themes[theme] || themes["blue"];
};

export const getTemplateBackground = (id, colorClass) => {
  const baseClass = `absolute right-0 bottom-0 w-64 h-64 transition-transform duration-700 group-hover:scale-110 opacity-[0.05] dark:opacity-[0.10] ${colorClass}`;
  
  switch (id) {
    case 1: // AI Auto-Detect (Neural Nodes)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20,80 L50,50 L80,20 M50,50 L80,80" /><circle cx="50" cy="50" r="4" fill="currentColor"/><circle cx="20" cy="80" r="3"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="80" r="3"/></svg>);
    case 2: // Mind Map (Branching)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 50 Q 50 50 80 20 M20 50 Q 50 50 80 80 M20 50 L 80 50" /><circle cx="20" cy="50" r="4" fill="currentColor"/><circle cx="80" cy="20" r="3"/><circle cx="80" cy="50" r="3"/><circle cx="80" cy="80" r="3"/></svg>);
    case 3: // Timeline (Straight line with nodes)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 50 L 90 50 M 30 40 L 30 60 M 50 30 L 50 70 M 70 40 L 70 60" /><circle cx="10" cy="50" r="3" fill="currentColor"/><circle cx="90" cy="50" r="3" fill="currentColor"/></svg>);
    case 4: // Microservices (Connected blocks)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="25" y="25" width="20" height="20" rx="4" /><rect x="55" y="55" width="20" height="20" rx="4" /><path d="M45 35 L 65 35 L 65 55" strokeDasharray="3 3" /><circle cx="65" cy="35" r="2" fill="currentColor"/></svg>);
    case 5: // Database ERD (Cylinder storage)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="50" cy="30" rx="20" ry="8" /><path d="M30 30 L 30 70 A 20 8 0 0 0 70 70 L 70 30" /><path d="M30 50 A 20 8 0 0 0 70 50" opacity="0.5"/></svg>);
    case 6: // Medical (Pulse / Heartbeat)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 50 L 30 50 L 40 20 L 60 80 L 70 50 L 90 50" strokeLinejoin="round" /></svg>);
    case 7: // Legal (Scale/Document clauses)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M30 20 L 70 20 L 70 80 L 30 80 Z" /><line x1="40" y1="40" x2="60" y2="40"/><line x1="40" y1="50" x2="60" y2="50"/><line x1="40" y1="60" x2="50" y2="60"/></svg>);
    case 8: // Sales (Trending Up Graph)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,80 40,50 60,60 80,20" strokeLinecap="round" strokeLinejoin="round" /><circle cx="80" cy="20" r="4" fill="currentColor"/></svg>);
    case 9: // Creative (Venn Diagram / Overlapping ideas)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="40" cy="40" r="25" opacity="0.6"/><circle cx="65" cy="40" r="25" opacity="0.6"/><circle cx="52.5" cy="65" r="25" opacity="0.6"/></svg>);
    case 10: // HR Candidate (Org chart)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="50" cy="25" r="8"/><path d="M50 33 L 50 60 M 50 60 L 25 80 M 50 60 L 75 80"/><circle cx="25" cy="80" r="6"/><circle cx="75" cy="80" r="6"/></svg>);
    case 11: // Daily Standup (Checkboxes / Tasks)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="20" y="20" width="12" height="12" rx="2"/><line x1="40" y1="26" x2="80" y2="26"/><rect x="20" y="44" width="12" height="12" rx="2"/><line x1="40" y1="50" x2="70" y2="50"/><rect x="20" y="68" width="12" height="12" rx="2"/><line x1="40" y1="74" x2="80" y2="74"/></svg>);
    case 12: // Weekly Sync (Calendar Grid)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="20" y="20" width="60" height="60" rx="4"/><line x1="20" y1="40" x2="80" y2="40"/><line x1="20" y1="60" x2="80" y2="60"/><line x1="40" y1="40" x2="40" y2="80"/><line x1="60" y1="40" x2="60" y2="80"/></svg>);
    case 13: // Flashcard (Stacked Cards)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="30" y="35" width="45" height="35" rx="3" transform="rotate(-10 50 50)" opacity="0.5"/><rect x="25" y="30" width="50" height="40" rx="3"/></svg>);
    case 14: // Math/Physics (Pythagorean/Geometric)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="30,80 70,80 30,20" /><rect x="30" y="70" width="10" height="10" /><path d="M45 50 A 20 20 0 0 1 50 80" strokeDasharray="3 3"/></svg>);
    case 15: // SWOT Analysis (4 Quadrants)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="15" y="15" width="70" height="70" rx="4"/><line x1="50" y1="15" x2="50" y2="85"/><line x1="15" y1="50" x2="85" y2="50"/><circle cx="32.5" cy="32.5" r="4"/><path d="M63 28 L 73 38 M 63 38 L 73 28"/></svg>);
    case 16: // Client Onboarding (Staircase / Steps)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 85 L 35 85 L 35 60 L 60 60 L 60 35 L 85 35" strokeLinejoin="round"/><circle cx="85" cy="35" r="4" fill="currentColor"/></svg>);
    case 17: // System Sequence Diagram (Vertical Lifelines)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="30" y1="20" x2="30" y2="80" strokeDasharray="4 4"/><line x1="70" y1="20" x2="70" y2="80" strokeDasharray="4 4"/><path d="M30 40 L 65 40"/><polygon points="65,37 70,40 65,43" fill="currentColor"/><path d="M70 60 L 35 60"/><polygon points="35,57 30,60 35,63" fill="currentColor"/></svg>);
    case 18: // Bug Triage (Spiderweb / Glitch)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.3"/><line x1="50" y1="38" x2="40" y2="20"/><line x1="50" y1="38" x2="60" y2="20"/><line x1="38" y1="50" x2="20" y2="40"/><line x1="62" y1="50" x2="80" y2="40"/><line x1="42" y1="58" x2="30" y2="80"/><line x1="58" y1="58" x2="70" y2="80"/></svg>);
    case 19: // SOAP Note (Clipboard layout)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="25" y="25" width="50" height="65" rx="4"/><line x1="35" y1="40" x2="65" y2="40"/><line x1="35" y1="55" x2="65" y2="55"/><line x1="35" y1="70" x2="55" y2="70"/><rect x="40" y="15" width="20" height="10" rx="2"/></svg>);
    case 20: // Therapy (Brain waves / Loops)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 50 Q 35 10 50 50 T 80 50" /><path d="M20 60 Q 35 90 50 60 T 80 60" opacity="0.5"/></svg>);
    case 21: // Deposition (Quote / Transcript)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M30 30 L 80 30 M30 50 L 80 50 M30 70 L 60 70" /><path d="M15 30 L 15 70" strokeWidth="4"/></svg>);
    case 22: // Compliance (Shield & Check)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M50 20 L80 35 L80 60 Q80 80 50 90 Q20 80 20 60 L20 35 Z"/><path d="M40 55 L47 62 L60 45"/></svg>);
    case 23: // Video Storyboard (Film Strip)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="20" y="25" width="60" height="50" rx="2"/><line x1="35" y1="25" x2="35" y2="75"/><line x1="65" y1="25" x2="65" y2="75"/><circle cx="27.5" cy="35" r="2" fill="currentColor"/><circle cx="27.5" cy="50" r="2" fill="currentColor"/><circle cx="27.5" cy="65" r="2" fill="currentColor"/><circle cx="72.5" cy="35" r="2" fill="currentColor"/><circle cx="72.5" cy="50" r="2" fill="currentColor"/><circle cx="72.5" cy="65" r="2" fill="currentColor"/></svg>);
    case 24: // UX Research (Magnifying Glass over Data)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="45" cy="45" r="15"/><line x1="56" y1="56" x2="75" y2="75" strokeWidth="3"/><path d="M25 25 L 35 25 M 65 25 L 75 25 M 25 75 L 35 75" opacity="0.4"/></svg>);
    case 25: // Employee 1-on-1 (Intersecting Bubbles)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="40" cy="50" r="20" /><circle cx="60" cy="50" r="20" opacity="0.6"/><path d="M40 45 L 40 55 M 60 45 L 60 55"/></svg>);
    case 26: // Exit Interview (Door & Arrow)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="25" y="20" width="40" height="60" rx="2"/><line x1="50" y1="50" x2="80" y2="50"/><polyline points="70,40 80,50 70,60" strokeLinejoin="round"/></svg>);
    default: // Fallback Geometric
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1"><rect x="20" y="20" width="60" height="60" rx="8" opacity="0.5" strokeDasharray="4 4" /><circle cx="50" cy="50" r="15" /></svg>);
  }
};

export const getTagStyles = (tag, isDark) => {
  const t = tag.toLowerCase();
  if (t.includes("urgent") || t.includes("bug")) return isDark ? 'bg-red-900/30 text-red-400 border-red-800/50' : 'bg-red-100 text-red-700 border-red-200';
  if (t.includes("engineering") || t.includes("backend")) return isDark ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-blue-100 text-blue-700 border-blue-200';
  if (t.includes("social") || t.includes("marketing")) return isDark ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-purple-100 text-purple-700 border-purple-200';
  if (t.includes("done") || t.includes("success")) return isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return isDark ? 'text-slate-400 bg-[#131722] border-[#232a3b]' : 'text-slate-500 bg-slate-50 border-slate-200';
};