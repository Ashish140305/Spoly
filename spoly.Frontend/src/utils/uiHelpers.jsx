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

// 🌟 STRICT 1-TO-1 ID MAPPING: Guaranteed 100% Unique & Bolder Graphics
export const getTemplateBackground = (id, colorClass) => {
  // Increased opacity from 0.05 to 0.25 so the SVGs actually show up beautifully
  const baseClass = `absolute right-0 bottom-0 w-64 h-64 transition-transform duration-700 group-hover:scale-110 opacity-30 dark:opacity-[0.25] ${colorClass}`;
  
  switch (id) {
    case 1: // AI Auto-Detect (Neural Nodes)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20,80 L50,50 L80,20 M50,50 L80,80" /><circle cx="50" cy="50" r="8" fill="currentColor"/><circle cx="20" cy="80" r="5"/><circle cx="80" cy="20" r="5"/><circle cx="80" cy="80" r="5"/></svg>);
    case 2: // Mind Map (Branching)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 50 Q 50 50 80 20 M20 50 Q 50 50 80 80 M20 50 L 80 50" /><circle cx="20" cy="50" r="7" fill="currentColor"/><circle cx="80" cy="20" r="5"/><circle cx="80" cy="50" r="5"/><circle cx="80" cy="80" r="5"/></svg>);
    case 3: // Timeline (Straight line with nodes)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M10 50 L 90 50 M 30 40 L 30 60 M 50 30 L 50 70 M 70 40 L 70 60" /><circle cx="10" cy="50" r="5" fill="currentColor"/><circle cx="90" cy="50" r="5" fill="currentColor"/></svg>);
    case 4: // Microservices (Connected blocks)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="20" y="20" width="25" height="25" rx="6" /><rect x="55" y="55" width="25" height="25" rx="6" /><path d="M45 32 L 67 32 L 67 55" strokeDasharray="6 4" /><circle cx="67" cy="32" r="4" fill="currentColor"/></svg>);
    case 5: // Database ERD (Cylinder storage)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><ellipse cx="50" cy="30" rx="25" ry="10" /><path d="M25 30 L 25 70 A 25 10 0 0 0 75 70 L 75 30" /><path d="M25 50 A 25 10 0 0 0 75 50" opacity="0.5"/></svg>);
    case 6: // Medical (Pulse / Heartbeat)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M10 50 L 30 50 L 40 15 L 60 85 L 70 50 L 90 50" strokeLinejoin="round" strokeLinecap="round" /></svg>);
    case 7: // Legal (Scale/Document clauses)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M25 15 L 75 15 L 75 85 L 25 85 Z" /><line x1="40" y1="35" x2="60" y2="35" strokeWidth="4" strokeLinecap="round"/><line x1="40" y1="50" x2="60" y2="50" strokeWidth="4" strokeLinecap="round"/><line x1="40" y1="65" x2="50" y2="65" strokeWidth="4" strokeLinecap="round"/></svg>);
    case 8: // Sales (Trending Up Graph)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="15,85 40,55 60,65 85,25" strokeLinecap="round" strokeLinejoin="round" /><circle cx="85" cy="25" r="6" fill="currentColor"/></svg>);
    case 9: // Creative (Venn Diagram / Overlapping ideas)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="40" cy="40" r="25" opacity="0.8"/><circle cx="65" cy="40" r="25" opacity="0.8"/><circle cx="52.5" cy="65" r="25" opacity="0.8"/></svg>);
    case 10: // HR Candidate (Org chart)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="50" cy="25" r="10" fill="currentColor" opacity="0.3"/><path d="M50 35 L 50 65 M 50 65 L 20 85 M 50 65 L 80 85" strokeLinecap="round"/><circle cx="20" cy="85" r="8" fill="currentColor"/><circle cx="80" cy="85" r="8" fill="currentColor"/></svg>);
    case 11: // Daily Standup (Checkboxes / Tasks)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="15" y="20" width="15" height="15" rx="3"/><line x1="45" y1="27" x2="85" y2="27" strokeLinecap="round"/><rect x="15" y="45" width="15" height="15" rx="3" fill="currentColor" opacity="0.8"/><line x1="45" y1="52" x2="75" y2="52" strokeLinecap="round" opacity="0.5"/><rect x="15" y="70" width="15" height="15" rx="3"/><line x1="45" y1="77" x2="85" y2="77" strokeLinecap="round"/></svg>);
    case 12: // Weekly Sync (Calendar Grid)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="15" y="15" width="70" height="70" rx="6"/><line x1="15" y1="38" x2="85" y2="38"/><line x1="15" y1="62" x2="85" y2="62"/><line x1="38" y1="38" x2="38" y2="85"/><line x1="62" y1="38" x2="62" y2="85"/><rect x="21" y="44" width="11" height="11" rx="2" fill="currentColor" opacity="0.8"/></svg>);
    case 13: // Flashcard (Stacked Cards)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="35" y="30" width="50" height="40" rx="6" transform="rotate(-12 50 50)" opacity="0.4" fill="currentColor"/><rect x="20" y="25" width="55" height="45" rx="6"/></svg>);
    case 14: // Math/Physics (Pythagorean/Geometric)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="25,85 75,85 25,15" strokeLinejoin="round"/><rect x="25" y="70" width="15" height="15" /><path d="M45 45 A 30 30 0 0 1 55 85" strokeDasharray="6 4"/></svg>);
    case 15: // SWOT Analysis (4 Quadrants)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="15" y="15" width="70" height="70" rx="6"/><line x1="50" y1="15" x2="50" y2="85"/><line x1="15" y1="50" x2="85" y2="50"/><circle cx="32.5" cy="32.5" r="6" fill="currentColor"/><path d="M63 28 L 73 38 M 63 38 L 73 28" strokeLinecap="round"/></svg>);
    case 16: // Client Onboarding (Staircase / Steps)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M10 85 L 35 85 L 35 60 L 60 60 L 60 35 L 85 35" strokeLinejoin="round"/><circle cx="85" cy="35" r="6" fill="currentColor"/></svg>);
    case 17: // System Sequence Diagram (Vertical Lifelines)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><line x1="30" y1="15" x2="30" y2="85" strokeDasharray="8 6"/><line x1="70" y1="15" x2="70" y2="85" strokeDasharray="8 6"/><path d="M30 40 L 65 40" strokeLinecap="round"/><polygon points="65,36 72,40 65,44" fill="currentColor"/><path d="M70 65 L 35 65" strokeLinecap="round"/><polygon points="35,61 28,65 35,69" fill="currentColor"/></svg>);
    case 18: // Bug Triage (Spiderweb / Glitch)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3"/><line x1="50" y1="35" x2="35" y2="15" strokeLinecap="round"/><line x1="50" y1="35" x2="65" y2="15" strokeLinecap="round"/><line x1="35" y1="50" x2="15" y2="35" strokeLinecap="round"/><line x1="65" y1="50" x2="85" y2="35" strokeLinecap="round"/><line x1="40" y1="60" x2="25" y2="85" strokeLinecap="round"/><line x1="60" y1="60" x2="75" y2="85" strokeLinecap="round"/></svg>);
    case 19: // SOAP Note (Clipboard layout)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="25" y="25" width="50" height="65" rx="6"/><line x1="35" y1="45" x2="65" y2="45" strokeLinecap="round"/><line x1="35" y1="60" x2="65" y2="60" strokeLinecap="round"/><line x1="35" y1="75" x2="50" y2="75" strokeLinecap="round"/><rect x="40" y="15" width="20" height="12" rx="4" fill="currentColor" opacity="0.8"/></svg>);
    case 20: // Therapy (Brain waves / Loops)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M15 50 Q 35 5 50 50 T 85 50" strokeLinecap="round" /><path d="M15 65 Q 35 95 50 65 T 85 65" opacity="0.4" strokeLinecap="round"/></svg>);
    case 21: // Deposition (Quote / Transcript)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M35 30 L 85 30 M35 55 L 85 55 M35 80 L 65 80" strokeLinecap="round" /><path d="M15 25 L 15 85" strokeWidth="5" strokeLinecap="round"/></svg>);
    case 22: // Compliance (Shield & Check)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M50 15 L85 30 L85 60 Q85 85 50 95 Q15 85 15 60 L15 30 Z" strokeLinejoin="round"/><path d="M35 55 L45 65 L65 40" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 23: // Video Storyboard (Film Strip)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="15" y="25" width="70" height="50" rx="4"/><line x1="35" y1="25" x2="35" y2="75"/><line x1="65" y1="25" x2="65" y2="75"/><circle cx="25" cy="35" r="3" fill="currentColor"/><circle cx="25" cy="50" r="3" fill="currentColor"/><circle cx="25" cy="65" r="3" fill="currentColor"/><circle cx="75" cy="35" r="3" fill="currentColor"/><circle cx="75" cy="50" r="3" fill="currentColor"/><circle cx="75" cy="65" r="3" fill="currentColor"/></svg>);
    case 24: // UX Research (Magnifying Glass over Data)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="40" cy="40" r="20"/><line x1="55" y1="55" x2="80" y2="80" strokeWidth="5" strokeLinecap="round"/><path d="M20 20 L 30 20 M 60 20 L 70 20 M 20 70 L 30 70" opacity="0.4" strokeLinecap="round" strokeWidth="4"/></svg>);
    case 25: // Employee 1-on-1 (Intersecting Bubbles)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="35" cy="50" r="22" /><circle cx="65" cy="50" r="22" opacity="0.5" fill="currentColor"/><path d="M35 45 L 35 55 M 65 45 L 65 55" strokeLinecap="round" strokeWidth="4"/></svg>);
    case 26: // Exit Interview (Door & Arrow)
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="25" y="15" width="45" height="70" rx="4"/><line x1="10" y1="85" x2="85" y2="85" strokeWidth="4" strokeLinecap="round"/><circle cx="60" cy="50" r="5" fill="currentColor"/><path d="M30 40 L75 40 M65 30 L75 40 L65 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default: // Fallback Geometric
      return (<svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="20" y="20" width="60" height="60" rx="8" opacity="0.4" strokeDasharray="8 6" /><circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.8"/></svg>);
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