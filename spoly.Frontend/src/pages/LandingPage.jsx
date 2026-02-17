import React, { useEffect, useRef, useState, useLayoutEffect, Children } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { motion, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Mic, Layout, Workflow, ChevronRight, CheckCircle2, UploadCloud, Cpu, FileText, Code, Star, Quote, ChevronDown, Zap, Sparkles, Search, User, Volume2, Terminal, Download } from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';
import BubbleMenu from '../components/BubbleMenu';

// ==========================================
// 1. DATA & CONSTANTS
// ==========================================
const navItems = [
  { label: 'home', href: '#hero', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  { label: 'features', href: '#features', ariaLabel: 'Features', rotation: 8, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
  { label: 'developers', href: '#developers', ariaLabel: 'Developers', rotation: 8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } },
  { label: 'pricing', href: '#pricing', ariaLabel: 'Pricing', rotation: 8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
  { label: 'faq', href: '#faq', ariaLabel: 'FAQ', rotation: 8, hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } }
];

const initialTestimonials = [
  { quote: "Spoly saved me hours of manual note-taking during my system architecture classes.", author: "Sarah Jenkins", role: "Computer Engineering Student" },
  { quote: "We use it for every sprint planning meeting. It grabs the action items automatically.", author: "David Chen", role: "Lead Software Engineer" },
  { quote: "I upload my recorded Zoom calls, click a button, and share the perfectly formatted PDF notes.", author: "Elena Rodriguez", role: "Product Manager" },
  { quote: "The Mermaid.js integration is flawless. I speak my system design out loud, and Spoly draws it perfectly.", author: "Marcus Thorne", role: "DevOps Architect" },
  { quote: "A lifesaver for our remote team. Automatically turning chaotic brainstorming into flowcharts is magic.", author: "Priya Patel", role: "Product Owner" }
];

const codeSnippets = [
  { file: "architecture.mmd", code: "graph LR;\n  A[Client] --> B(API Gateway);\n  B --> C{Auth Service};\n  C --> D[(Database)];", mermaid: "graph LR; A[Client]-->B(API Gateway); B-->C{Auth Service}; C-->D[(Database)];" },
  { file: "database.mmd", code: "graph TD;\n  App --> DB[(PostgreSQL)];\n  App --> Cache{Redis};\n  DB --> Backup[S3 Bucket];", mermaid: "graph TD; App-->DB[(PostgreSQL)]; App-->Cache{Redis}; DB-->Backup[S3];" },
  { file: "deployment.mmd", code: "graph LR;\n  Git[GitHub] --> Build(Actions);\n  Build --> Test{Tests Pass?};\n  Test -->|Yes| Deploy[AWS];", mermaid: "graph LR; Git[GitHub]-->Build(Actions); Build-->Test{Tests Pass?}; Test-->|Yes|Deploy[AWS];" }
];

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

// ==========================================
// 2. UI UTILITIES
// ==========================================
export const Step = ({ children }) => <div className="w-full h-full flex flex-col items-center justify-center px-4">{children}</div>;

const Stepper = ({ step = 1, onStepChange, backButtonText = "Previous", nextButtonText = "Next", children }) => {
  const [currentStep, setCurrentStep] = useState(step);
  const [direction, setDirection] = useState(1); 
  useEffect(() => { if (step > currentStep) setDirection(1); else if (step < currentStep) setDirection(-1); setCurrentStep(step); }, [step]);
  const steps = Children.toArray(children);
  const totalSteps = steps.length;
  const handleNext = () => { if (currentStep < totalSteps) { setDirection(1); const next = currentStep + 1; setCurrentStep(next); if (onStepChange) onStepChange(next); } };
  const handlePrev = () => { if (currentStep > 1) { setDirection(-1); const prev = currentStep - 1; setCurrentStep(prev); if (onStepChange) onStepChange(prev); } };

  return (
    <div className="w-full mx-auto flex flex-col relative z-10 bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-[3rem] p-8 md:p-14">
      <div className="relative flex w-full justify-between items-center mb-12 px-2 md:px-8">
        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-200 rounded-full -translate-y-1/2 -z-20" />
        <motion.div className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full -translate-y-1/2 -z-10" initial={{ width: 0 }} animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} transition={{ duration: 0.4, ease: "easeInOut" }} />
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          return (
            <div key={stepNumber} className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ scale: isActive ? 1.2 : 1 }} transition={{ duration: 0.3 }} className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center font-extrabold text-base md:text-lg shadow-sm transition-colors duration-300 ${ isActive || isCompleted ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white border-slate-300 text-slate-400' }`}>
                {isCompleted ? <CheckCircle2 size={24} className="text-white" /> : stepNumber}
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={currentStep} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full flex flex-col items-center justify-center text-center">
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-between items-center w-full mt-10 px-2">
        <button onClick={handlePrev} disabled={currentStep === 1} className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${ currentStep === 1 ? 'opacity-0 cursor-default pointer-events-none' : 'bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow-md' }`}>&larr; {backButtonText}</button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          {currentStep === totalSteps ? 'Finish' : nextButtonText} {currentStep !== totalSteps && <span>&rarr;</span>}
        </motion.button>
      </div>
    </div>
  );
};

const Typewriter = ({ text, delay = 0, cursor = false, speed = 0.05 }) => (
  <motion.span initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: speed, delayChildren: delay } } }}>
    {text.split('').map((char, i) => (<motion.span key={i} variants={{ hidden: { display: "none" }, visible: { display: "inline" } }}>{char === " " ? "\u00A0" : char}</motion.span>))}
    {cursor && <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="inline-block w-[0.1em] h-[0.9em] bg-blue-600 ml-2 align-middle -mt-2" />}
  </motion.span>
);

const ShinyText = ({ text }) => (
  <span className="relative inline-block overflow-hidden rounded-full">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">{text}</span>
    <motion.span initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }} className="absolute inset-0 z-10 block bg-gradient-to-r from-transparent via-white/80 to-transparent w-1/3 -skew-x-12" />
  </span>
);

// ==========================================
// 3. PHYSICS & TRACKING
// ==========================================
const botPhysics = { stiffness: 100, damping: 20, mass: 1 }; 
const eyePhysics = { stiffness: 150, damping: 20, mass: 0.5 };

const useStableMouseTracking = (botRef, maxMove = 15, dampFactor = 35) => {
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!botRef.current) return;
        try {
          const rect = botRef.current.getBoundingClientRect();
          const distX = e.clientX - (rect.left + rect.width / 2);
          const distY = e.clientY - (rect.top + rect.height / 2);
          const rawDist = Math.hypot(distX, distY);
          if (rawDist < 4) { mouseX.set(0); mouseY.set(0); return; } 
          const angle = Math.atan2(distY, distX);
          const distance = Math.min(rawDist / dampFactor, maxMove); 
          if (isFinite(distance) && isFinite(angle)) { mouseX.set(Math.cos(angle) * distance); mouseY.set(Math.sin(angle) * distance); }
        } catch (err) {}
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(frameId); };
  }, [mouseX, mouseY, maxMove, dampFactor]);
  return { mouseX, mouseY };
};

// ==========================================
// 4. MASCOTS
// ==========================================
const SpolyBot = ({ onInteract }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef);
  const headX = useSpring(mouseX, botPhysics), headY = useSpring(mouseY, botPhysics);
  const eyeX = useSpring(mouseX, eyePhysics), eyeY = useSpring(mouseY, eyePhysics);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => { const i = setInterval(() => { if (Math.random() > 0.5) { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); } }, 4000); return () => clearInterval(i); }, []);
  const handlePoke = () => { setIsClicked(true); setIsBlinking(true); if (onInteract) onInteract(); setTimeout(() => setIsBlinking(false), 150); setTimeout(() => setIsBlinking(true), 250); setTimeout(() => setIsBlinking(false), 400); setTimeout(() => setIsClicked(false), 500); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-40 w-32" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">Click Sandbox!<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45" /></motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isClicked ? { y: -25, scale: 1.05 } : { y: [0, -10, 0] }} transition={isClicked ? { type: "spring", stiffness: 400, damping: 10 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }} onClick={handlePoke} className="flex flex-col items-center cursor-pointer drop-shadow-2xl">
        <div className="w-1.5 h-6 bg-slate-300 relative rounded-t-full"><div className="absolute -top-3 -left-1.5 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" /></div>
        <motion.div style={{ x: headX, y: headY, rotate: useTransform(headX, [-15, 15], [-5, 5]) }} className="w-28 h-18 bg-white border-2 border-slate-200 shadow-md rounded-t-[2.5rem] rounded-b-2xl flex items-center justify-center relative z-10 overflow-hidden py-3">
          <div className="w-24 h-10 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden shadow-inner border border-slate-700">
            <motion.div style={{ x: eyeX, y: eyeY }} className="flex gap-4 items-center justify-center w-full h-full">
               <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} transition={{ duration: 0.1 }} className="w-4 h-6 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
               <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} transition={{ duration: 0.1 }} className="w-4 h-6 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            </motion.div>
          </div>
        </motion.div>
        <motion.div style={{ x: useTransform(headX, v => v * 0.4) }} className="w-16 h-10 bg-slate-100 border-2 border-slate-200 rounded-b-3xl shadow-inner -mt-3 z-0 flex items-center justify-center relative overflow-hidden">
           <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-2" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const CodeyBot = ({ onInteract }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 8, 45);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => { const i = setInterval(() => { if (Math.random() > 0.5) { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); } }, 3500); return () => clearInterval(i); }, []);
  const handleClick = () => { setIsSpinning(true); if(onInteract) onInteract(); setTimeout(() => setIsSpinning(false), 700); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-36 w-40" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-green-400 text-sm font-mono px-4 py-2 rounded-md whitespace-nowrap shadow-xl pointer-events-none">Click to cycle code!</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isSpinning ? { rotateZ: 360, y: -20 } : { y: [0, -8, 0] }} transition={isSpinning ? { duration: 0.7, ease: "backOut" } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }} onClick={handleClick} className="cursor-pointer drop-shadow-2xl relative">
        <div className="absolute -top-5 left-6 w-2 h-8 bg-slate-700 rounded-t-full -rotate-[20deg] origin-bottom shadow-inner" />
        <div className="absolute -top-5 right-6 w-2 h-8 bg-slate-700 rounded-t-full rotate-[20deg] origin-bottom shadow-inner" />
        <motion.div className="w-32 h-28 bg-slate-800 border-[4px] border-slate-600 shadow-2xl rounded-2xl flex flex-col items-center justify-center relative overflow-hidden z-10">
          <div className="absolute top-2 right-3 flex gap-2"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
          <div className="w-24 h-14 bg-[#0d1117] rounded-lg mt-3 flex items-center justify-center border-b-2 border-slate-900 shadow-inner overflow-hidden relative">
             <motion.div style={{ x: lookX, y: lookY }} className="flex flex-col items-center justify-center w-full h-full relative z-10 pt-1">
                <div className="flex gap-4">
                  <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} transition={{ duration: 0.1 }} className="w-3.5 h-5 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} transition={{ duration: 0.1 }} className="w-3.5 h-5 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                </div>
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "steps(2)" }} className="w-4 h-1.5 bg-green-400 mt-1.5 rounded-sm" />
             </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FlowBot = ({ onActivateFlow }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 8, 40);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => { if (isActive) return; setIsActive(true); if(onActivateFlow) onActivateFlow(); setTimeout(() => setIsActive(false), 4500); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-32 w-32 cursor-pointer drop-shadow-2xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50">Run Pipeline</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isActive ? { scale: 1.1, rotate: 180 } : { y: [0, -8, 0] }} transition={isActive ? { duration: 0.5, type: "spring" } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="relative flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-[-15px] rounded-full border border-blue-200/50">
           <div className="w-3 h-3 bg-blue-400 rounded-sm absolute top-0 left-1/2 -ml-1.5" />
           <div className="w-3 h-3 bg-indigo-400 rounded-sm absolute bottom-0 left-1/2 -ml-1.5" />
        </motion.div>
        <div className={`w-20 h-20 rounded-3xl border-[4px] shadow-inner flex items-center justify-center relative z-10 overflow-hidden transition-colors duration-500 ${isActive ? 'bg-blue-500 border-blue-400' : 'bg-slate-800 border-slate-600'}`}>
          <motion.div style={{ x: lookX, y: lookY }} className="flex gap-2"><div className="w-4 h-2 bg-white rounded-full" /><div className="w-4 h-2 bg-white rounded-full" /></motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const CloudyBot = ({ onInteract }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 15, 30);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMagic, setIsMagic] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => { const i = setInterval(() => { if (!isMagic && Math.random() > 0.6) { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); } }, 3000); return () => clearInterval(i); }, [isMagic]);
  const handleClick = () => { if (isMagic) return; setIsMagic(true); if(onInteract) onInteract(); setTimeout(() => setIsMagic(false), 6000); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-40 w-56 cursor-pointer drop-shadow-2xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
      <AnimatePresence>{isHovered && !isMagic && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl pointer-events-none z-50">Reveal AI Secrets! ✨</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isMagic ? { y: -50, scaleX: [1, 1.4, 0.8, 1.1, 1], scaleY: [1, 0.6, 1.2, 0.9, 1] } : { y: [-5, 5], scaleX: [1, 1.05, 0.95], scaleY: [1, 0.95, 1.05] }} transition={isMagic ? { duration: 0.8, ease: "easeOut" } : { duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} className="relative">
        <AnimatePresence>
          {isMagic && [...Array(8)].map((_, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], y: -50 - Math.random() * 80, x: (Math.random() - 0.5) * 120, scale: 1 + Math.random(), rotate: Math.random() * 180 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute top-0 left-1/2 text-amber-400 text-2xl z-0 pointer-events-none drop-shadow-lg">✨</motion.div> ))}
        </AnimatePresence>
        <div className="w-44 h-24 bg-white rounded-full flex items-center justify-center border-b-4 border-indigo-100 relative z-10">
          <div className="absolute -top-8 left-4 w-20 h-20 bg-white rounded-full z-0" />
          <div className="absolute -top-10 right-8 w-24 h-24 bg-white rounded-full z-0" />
          <div className="absolute -top-3 right-1 w-14 h-14 bg-white rounded-full z-0" />
          <motion.div style={{ x: lookX, y: lookY }} className="flex gap-6 items-center relative z-20 mt-4">
             {isMagic ? (<><span className="text-2xl font-bold text-indigo-600">^</span><span className="text-2xl font-bold text-indigo-600">^</span></>) : (<><motion.div animate={{ scaleY: isBlinking ? 0 : 1 }} className="w-5 h-5 bg-indigo-600 rounded-full shadow-inner" /><motion.div animate={{ scaleY: isBlinking ? 0 : 1 }} className="w-5 h-5 bg-indigo-600 rounded-full shadow-inner" /></>)}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const ChatBot = ({ onShuffle }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 12, 35);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => { const i = setInterval(() => { if (Math.random() > 0.5) { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); } }, 4500); return () => clearInterval(i); }, []);
  const handleClick = () => { setIsBouncing(true); if(onShuffle) onShuffle(); setTimeout(() => setIsBouncing(false), 500); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-32 w-32 cursor-pointer drop-shadow-2xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl pointer-events-none z-50">Read more!</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isBouncing ? { y: -20, scale: 1.1, rotate: [0, -10, 10, 0] } : { y: [0, -8, 0] }} transition={isBouncing ? { type: "spring", stiffness: 400 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative flex flex-col items-center">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-5 -right-3 w-8 h-8 bg-white rounded-full border-[3px] border-pink-200 flex items-center justify-center shadow-md z-20"><span className="text-pink-500 text-xs">💖</span></motion.div>
        <div className="w-24 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-[2rem] rounded-bl-md border-[3px] border-pink-200 flex flex-col items-center justify-center shadow-[inset_0_-5px_15px_rgba(0,0,0,0.1)] relative z-10">
           <motion.div style={{ x: lookX, y: lookY }} className="flex gap-4 items-center">
              <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} className="w-3.5 h-6 bg-slate-900 rounded-full relative"><div className="w-1.5 h-2 bg-white absolute top-1 right-0.5 rounded-full" /></motion.div>
              <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} className="w-3.5 h-6 bg-slate-900 rounded-full relative"><div className="w-1.5 h-2 bg-white absolute top-1 right-0.5 rounded-full" /></motion.div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const VaultBot = ({ isYearly, intensity = 0, onHoldStart, onHoldEnd }) => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 12, 35);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isHovered, setIsHovered] = useState(false);

  const spinDuration = Math.max(0.1, 3.5 - (intensity * 3));
  const eyeScale = 1 + (intensity * 0.8);

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-32 w-32 cursor-pointer drop-shadow-xl select-none" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); onHoldEnd(); }} onPointerDown={onHoldStart} onPointerUp={onHoldEnd}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl pointer-events-none z-50">{isYearly ? "Show Monthly" : "Show Yearly"}</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="w-24 h-24 bg-slate-300 rounded-2xl border-4 border-slate-400 shadow-[inset_0_10px_20px_rgba(255,255,255,0.8)] flex items-center justify-center relative overflow-hidden">
           <motion.div animate={{ rotate: isYearly ? 180 : 0 }} transition={{ type: "spring", stiffness: 100 }} className="w-16 h-16 rounded-full border-4 border-dashed border-slate-500 flex items-center justify-center bg-slate-200">
              <motion.div style={{ x: lookX, y: lookY }} className="w-10 h-10 bg-slate-800 rounded-full flex gap-1.5 items-center justify-center border-2 border-slate-400 shadow-inner overflow-hidden">
                 <motion.div animate={{ rotate: intensity > 0 ? 360 : 0 }} transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }} className="w-full h-full flex items-center justify-center gap-1.5">
                    <motion.div animate={{ scale: eyeScale }} className="w-2 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <motion.div animate={{ scale: eyeScale }} className="w-2 h-3 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                 </motion.div>
              </motion.div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const QuestBot = () => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 12, 35);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const tips = [
    { q: "Mermaid Syntax?", a: "Pro Tip: Use 'graph LR' for left-to-right flowcharts, or 'graph TD' for top-down layouts!" },
    { q: "Audio Tricks?", a: "For the best AI results, clearly speak keywords like 'database', 'frontend', or 'API gateway'." },
    { q: "AI Secrets?", a: "Spoly uses advanced LLM parsing to detect architectural intent while ignoring random small talk." }
  ];

  useEffect(() => { const i = setInterval(() => { if (Math.random() > 0.5) { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); } }, 4500); return () => clearInterval(i); }, []);

  return (
    <div className="relative z-50 flex items-end justify-center h-48 w-72">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8, x: -20, y: 20 }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.8, x: -20, y: 20 }} className="absolute bottom-10 right-[80%] w-72 bg-white rounded-2xl rounded-br-none shadow-2xl border border-slate-200 p-5 mb-4 z-[200]">
            {!activeChat ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-slate-800 mb-2">Want a Spoly Pro-Tip?</p>
                {tips.map((item, i) => <button key={i} onClick={(e) => { e.stopPropagation(); setActiveChat(item.a); }} className="text-left text-xs bg-blue-50 text-blue-700 py-2.5 px-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 font-medium">💡 {item.q}</button>)}
              </div>
            ) : (
              <div className="flex flex-col gap-3 min-h-[120px]">
                <p className="text-sm text-slate-700 leading-relaxed break-words whitespace-normal"><Typewriter key={activeChat} text={activeChat} speed={0.02} /></p>
                <button onClick={(e) => { e.stopPropagation(); setActiveChat(null); }} className="text-xs text-slate-400 hover:text-slate-600 font-bold self-start flex items-center gap-1 mt-auto">&larr; Back</button>
              </div>
            )}
            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center">
        <motion.div ref={botRef} animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} onClick={() => setIsChatOpen(!isChatOpen)} className="cursor-pointer drop-shadow-2xl relative">
          {!isChatOpen && <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-10 -right-4 text-amber-500 font-black text-5xl drop-shadow-md z-50">?</motion.div>}
          <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-[4px] overflow-hidden relative shadow-[inset_0_-10px_20px_rgba(251,191,36,0.3)] transition-colors duration-300 ${isChatOpen ? 'bg-amber-100 border-amber-400' : 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300'}`}>
             <motion.div style={{ x: lookX, y: lookY }} className="flex gap-1.5 items-center justify-center w-full mt-3">
                <div className="w-9 h-9 rounded-full border-[4px] border-amber-600 flex items-center justify-center bg-white shadow-sm z-10 relative">
                   <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} className="w-3.5 h-3.5 bg-amber-900 rounded-full" />
                   <div className="absolute top-1 left-1.5 w-2 h-2 bg-white rounded-full opacity-60" />
                </div>
                <div className="w-2 h-1.5 bg-amber-600 -mx-2 z-0" />
                <div className="w-7 h-7 rounded-full border-[4px] border-amber-600 flex items-center justify-center bg-white shadow-sm z-10 relative">
                   <motion.div animate={{ scaleY: isBlinking ? 0.1 : 1 }} className="w-2.5 h-2.5 bg-amber-900 rounded-full" />
                   <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BoostBot = () => {
  const botRef = useRef(null);
  const { mouseX, mouseY } = useStableMouseTracking(botRef, 12, 35);
  const lookX = useSpring(mouseX, eyePhysics), lookY = useSpring(mouseY, eyePhysics);
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => { if (isLaunching) return; setIsLaunching(true); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => setIsLaunching(false), 2000); };

  return (
    <div className="relative z-50 flex flex-col items-center justify-end h-[220px] w-32 cursor-pointer drop-shadow-2xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleLaunch}>
      <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute top-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl pointer-events-none z-50">Back to top!</motion.div>}</AnimatePresence>
      <motion.div ref={botRef} animate={isLaunching ? { y: -50, scale: 1.05 } : { y: [0, -8, 0], scale: 1 }} transition={isLaunching ? { type: "spring", stiffness: 200 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center mt-auto">
        <div className="w-20 h-24 bg-white rounded-t-full rounded-b-2xl border-[4px] border-slate-300 flex flex-col items-center pt-4 relative overflow-hidden z-10 shadow-inner">
           <div className="w-12 h-12 bg-slate-800 rounded-full border-[4px] border-indigo-200 flex items-center justify-center shadow-inner overflow-hidden relative">
              <motion.div style={{ x: lookX, y: lookY }} className="flex gap-1.5"><div className="w-2.5 h-3 bg-cyan-400 rounded-full" /><div className="w-2.5 h-3 bg-cyan-400 rounded-full" /></motion.div>
              <div className="absolute top-1 left-2 w-8 h-2 bg-white/20 rounded-full -rotate-12" />
           </div>
        </div>
        <motion.div animate={{ scaleY: isLaunching ? 4 : [1, 1.4, 1] }} transition={{ duration: isLaunching ? 0.2 : 0.4, repeat: isLaunching ? 0 : Infinity }} className="w-8 h-10 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-b-full origin-top -mt-2 z-0" />
      </motion.div>
    </div>
  );
};

// ==========================================
// 5. BACKGROUNDS & UTILS
// ==========================================
const GSAPBubbles = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.glass-bubble').forEach((bubble) => {
        gsap.set(bubble, { x: gsap.utils.random(0, window.innerWidth), y: gsap.utils.random(window.innerHeight, window.innerHeight + 500), scale: gsap.utils.random(0.3, 1), opacity: 0 });
        gsap.to(bubble, { y: -200, x: `+=${gsap.utils.random(-100, 100)}`, opacity: gsap.utils.random(0.05, 0.25), duration: gsap.utils.random(15, 25), repeat: -1, ease: "none", delay: gsap.utils.random(0, 5), modifiers: { x: x => `${parseFloat(x) + Math.sin(parseFloat(x) * 0.03) * 3}px` } });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{[...Array(12)].map((_, i) => <div key={i} className="glass-bubble absolute w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] will-change-transform" />)}</div>;
};

const InteractiveMouseGlow = () => {
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(() => { mouseX.set(e.clientX); mouseY.set(e.clientY); }); };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(frameId); };
  }, [mouseX, mouseY]);
  return <motion.div className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300 will-change-transform" style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.05), transparent 80%)` }} />;
};

const GlobalMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-200/40 blur-3xl will-change-transform transform-gpu" />
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0], x: [0, 30, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/40 blur-3xl will-change-transform transform-gpu" />
    <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[10%] left-[20%] w-[70vw] h-[50vw] rounded-full bg-indigo-200/30 blur-3xl will-change-transform transform-gpu" />
  </div>
);

const CommandPalette = ({ isOpen, setIsOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/40" onClick={() => setIsOpen(false)}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100"><Search className="text-slate-400" size={20} /><input autoFocus placeholder="Search documentation..." className="w-full bg-transparent outline-none text-lg text-slate-900" /></div>
          <div className="p-2 max-h-[400px] overflow-y-auto"><div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</div><SignInButton mode="modal"><button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"><User size={18} /> Sign In / Sign Up</button></SignInButton></div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const InteractiveSandbox = ({ exportItems, autoStart, onComplete }) => {
  const [step, setStep] = useState('idle');
  const [transcript, setTranscript] = useState("");
  const fullText = "Create a login flow: User submits form, Auth service validates, then redirects to Dashboard.";
  const startDemo = () => { setStep('recording'); setTranscript(""); let i = 0; const interval = setInterval(() => { i += Math.floor(Math.random() * 3) + 1; setTranscript(fullText.slice(0, i)); if (i >= fullText.length) { clearInterval(interval); setTimeout(() => { setStep('visualizing'); if(onComplete) onComplete(); }, 600); } }, 60); };
  useEffect(() => { if (autoStart && step === 'idle') startDemo(); }, [autoStart]);

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-xl mt-8 z-30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Zap className="text-blue-500" size={20}/> AI Live Engine Preview</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startDemo} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition-all">
           {step === 'recording' ? <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/> : <Volume2 size={16}/>} {step === 'recording' ? 'Processing...' : 'Run Live Demo'}
        </motion.button>
      </div>
      <div className="space-y-4">
        <div className="min-h-[70px] p-4 bg-slate-50 rounded-2xl font-mono text-sm text-slate-700 border border-slate-100 shadow-inner flex flex-col justify-center">
          <div className="flex items-center gap-2"><span>{transcript || "Click 'Run Live Demo' to simulate speech..."}</span></div>
        </div>
        <AnimatePresence>
          {step === 'visualizing' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 relative">
               <div className="absolute top-4 right-4 z-20"><BubbleMenu logo={<div className="bg-white hover:bg-slate-50 text-blue-600 shadow-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"><Download size={14}/> Export</div>} items={exportItems} menuBg="#ffffff" menuContentColor="#111111" animationDuration={0.4} /></div>
               <div className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Rendered Graph</div>
               <div className="bg-white rounded-xl p-4 shadow-sm overflow-x-auto border border-blue-50 relative z-10"><div className="min-w-[300px] flex justify-center"><MermaidDiagram chart="graph LR; User-->Auth; Auth-->Dashboard;" /></div></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ==========================================
// 6. LAYOUT COMPONENTS
// ==========================================
const TrustedByCarousel = () => (
  <div className="w-full py-12 overflow-hidden border-y border-white/40 bg-white/20 backdrop-blur-sm mt-12 transform-gpu relative z-10">
    <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
    <div className="flex w-[200%] animate-[slide_30s_linear_infinite] items-center">
      {["Acme Corp", "GlobalTech", "Nexus", "Quantum", "Horizon", "Pinnacle", "Acme Corp", "GlobalTech"].map((logo, i) => <div key={i} className="flex-1 flex justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"><span className="text-2xl font-black text-slate-800 tracking-tighter">{logo}</span></div>)}
    </div>
    <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
  </div>
);

const Card3DTilt = ({ feature, index, isFlipped }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25 }), mouseYSpring = useSpring(y, { stiffness: 100, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]), rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]), glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.1 }} onMouseMove={(e) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5); }} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ perspective: 1000, rotateX, rotateY }} className="relative w-full h-[320px] z-10 will-change-transform">
      <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} style={{ transformStyle: "preserve-3d" }} className="w-full h-full relative">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-lg border border-white/60 shadow-sm rounded-[2rem] p-8 flex flex-col items-start group hover:shadow-xl transition-shadow" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <motion.div className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]" style={{ background: useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, transparent 50%)`, mixBlendMode: "overlay" }} />
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md">{feature.icon}</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400 shadow-2xl rounded-[2rem] p-8 flex flex-col items-center justify-center text-center overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
          <Sparkles className="text-amber-300 mb-4 relative z-10" size={40} />
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{feature.backTitle}</h3>
          <p className="text-indigo-100 font-medium leading-relaxed relative z-10">{feature.backDesc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role }) => (
  <motion.div className="bg-white/50 backdrop-blur-md border border-white/60 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:bg-white/80 transition-all duration-300 group h-full flex flex-col justify-between">
    <div>
       <div className="flex gap-1 text-amber-400 mb-6 group-hover:scale-105 transition-transform origin-left">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
       <Quote className="text-indigo-200 w-12 h-12 absolute top-6 right-8 -z-10 group-hover:text-indigo-300 transition-colors" />
       <p className="text-slate-700 text-lg leading-relaxed font-medium mb-8 z-10 relative">"{quote}"</p>
    </div>
    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">{author.charAt(0)}</div><div><h4 className="font-bold text-slate-900">{author}</h4><p className="text-sm text-slate-500">{role}</p></div></div>
  </motion.div>
);

const PricingCard = ({ tier, price, desc, features, isPro, isYearly }) => {
  const displayPrice = isYearly ? Math.floor(price * 12 * 0.8) : price;
  return (
    <div className={`relative flex flex-col p-8 rounded-[2.5rem] border ${isPro ? 'border-blue-400 shadow-[0_20px_40px_rgba(37,99,235,0.15)] bg-white/90 scale-105 z-10' : 'border-white/60 bg-white/40 shadow-sm hover:bg-white/60'} backdrop-blur-xl transition-all duration-300 w-full h-full`}>
      {isPro && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg"><Sparkles size={14} /> Most Popular</div>}
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier}</h3><p className="text-slate-500 font-medium mb-6 min-h-[48px]">{desc}</p>
      <div className="mb-8 border-b border-slate-200/50 pb-8">
        <span className="text-5xl font-black text-slate-900 tracking-tight">${displayPrice}</span>
        <span className="text-slate-500 font-medium">/{isYearly ? 'yr' : 'mo'}</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">{features.map((feat, i) => <li key={i} className="flex items-start gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} /><span>{feat}</span></li>)}</ul>
      <button className={`w-full py-4 rounded-full font-bold text-lg transition-all ${isPro ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>Get Started</button>
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-slate-200/50">
    <button onClick={onToggle} className="w-full py-6 flex items-center justify-between text-left focus:outline-none group">
      <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{question}</span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0 border border-white"><ChevronDown className="text-slate-500 group-hover:text-blue-600" size={20} /></motion.div>
    </button>
    <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden"><p className="pb-6 text-slate-600 leading-relaxed font-medium">{answer}</p></motion.div>}</AnimatePresence>
  </div>
);

// ==========================================
// 7. MAIN PAGE COMPONENT
// ==========================================
const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [autoStartSandbox, setAutoStartSandbox] = useState(false);
  
  const [codeIndex, setCodeIndex] = useState(0);
  const [testiStartIndex, setTestiStartIndex] = useState(0);
  const [teamSize, setTeamSize] = useState(1);
  const [isYearlyPricing, setIsYearlyPricing] = useState(false);
  const [stepperStep, setStepperStep] = useState(1);
  const [isMagicFlipped, setIsMagicFlipped] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const holdTimer = useRef(null);
  const holdStartTime = useRef(0);

  const startVaultHold = (e) => {
    e.preventDefault();
    holdStartTime.current = Date.now();
    holdTimer.current = setInterval(() => { setTeamSize(prev => prev >= 50 ? 1 : prev + 1); }, 40); 
  };
  const stopVaultHold = () => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    if (Date.now() - holdStartTime.current < 200) { setIsYearlyPricing(prev => !prev); }
  };

  const visibleTestimonials = [
    initialTestimonials[testiStartIndex % initialTestimonials.length],
    initialTestimonials[(testiStartIndex + 1) % initialTestimonials.length],
    initialTestimonials[(testiStartIndex + 2) % initialTestimonials.length]
  ];

  const handleShuffleTestimonials = () => setTestiStartIndex(prev => prev + 1);
  const runPipelineAnimation = () => { setStepperStep(1); setTimeout(() => setStepperStep(2), 1500); setTimeout(() => setStepperStep(3), 3000); };
  const handleSandboxOpen = () => { setShowSandbox(true); setAutoStartSandbox(true); setTimeout(() => { document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100); };

  const fabItems = [
    { label: 'Quick Search', action: () => setIsSearchOpen(true), rotation: -5, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } },
    { label: 'API Specs', action: () => document.getElementById('developers')?.scrollIntoView({behavior: 'smooth'}), rotation: 5, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
    { label: 'Share', action: () => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }, rotation: -5, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  ];

  const sandboxExportItems = [
    { label: 'Copy SVG', action: () => alert('SVG Copied!'), rotation: -5, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
    { label: 'Save PNG', action: () => alert('Downloading PNG...'), rotation: 5, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
  ];

  useLayoutEffect(() => {
    if (window.location.hash) { window.history.replaceState(null, '', window.location.pathname); }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => { const down = (e) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsSearchOpen((open) => !open); }}; document.addEventListener('keydown', down); return () => document.removeEventListener('keydown', down); }, []);
  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true }); function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);

  const baseTeamPrice = 29;
  const dynamicTeamPrice = baseTeamPrice + (teamSize > 1 ? (teamSize - 1) * 10 : 0);
  const hoursSaved = teamSize * 15;
  const vaultIntensity = teamSize / 50; 

  return (
    <div className="font-sans selection:bg-blue-300 selection:text-blue-900 bg-[#f8fafc] text-slate-900 min-h-screen relative overflow-hidden">
      <CommandPalette isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
      <GlobalMeshBackground />
      <GSAPBubbles />
      <InteractiveMouseGlow />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 z-[60] origin-left shadow-sm transform-gpu will-change-transform" style={{ scaleX }} />

      <div className="fixed bottom-8 right-8 z-[100]">
        <BubbleMenu
          initialOpen={false}
          logo={<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-2xl text-white hover:scale-105 transition-transform border border-slate-700"><Terminal size={32} className="text-blue-400" /></div>}
          items={fabItems} menuBg="#0f172a" menuContentColor="#ffffff" animationDuration={0.4}
        />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-5 w-full max-w-[1600px] mx-auto border-b border-slate-200/50 transition-all duration-300 transform-gpu">
        <div className="relative z-50">
          <BubbleMenu
            initialOpen={true}
            logo={<div className="flex items-center gap-3 cursor-pointer pr-2"><div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"><Mic className="text-white" size={22} /></div><span className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm hidden sm:block">Spoly</span></div>}
            items={navItems} menuAriaLabel="Toggle navigation" menuBg="#ffffff" menuContentColor="#111111" animationEase="back.out(1.5)" animationDuration={0.5} staggerDelay={0.12}
          />
        </div>
        <div className="flex items-center gap-4 md:gap-8 z-50 mr-12 md:mr-24">
          <SignedOut>
            <SignInButton mode="modal"><button className="hidden md:block text-base font-bold text-slate-700 hover:text-indigo-600 transition-colors">Log In</button></SignInButton>
            <SignUpButton mode="modal"><motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="text-base font-bold bg-slate-900/90 backdrop-blur-md text-white px-7 py-3 rounded-full shadow-md">Sign Up</motion.button></SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/live"><button className="text-base font-bold text-blue-600 hover:text-indigo-600 mr-2 md:mr-4 transition-colors">Workspace</button></Link>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm" } }} />
          </SignedIn>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* --- Hero Section --- */}
        <section id="hero" className="w-full max-w-[1600px] mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-20 relative z-20">
          <motion.div className="flex-1 flex flex-col items-start text-left z-30" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md text-blue-800 text-sm font-bold mb-8 border border-white/80 shadow-sm overflow-hidden">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span></span>
              <ShinyText text="Spoly 1.0 is Live" />
            </motion.div>
            
            <h1 className="text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8 drop-shadow-sm min-h-[140px] text-left">
              <Typewriter text="Notes & Diagrams" delay={0.1} /> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 inline-block">
                 <Typewriter text="Auto-Generated." delay={0.8} cursor={true} />
              </span>
            </h1>
            
            <motion.p variants={fadeInUp} className="text-2xl text-slate-700 mb-12 max-w-2xl leading-relaxed font-medium mt-4 text-left">Record meetings. Spoly's AI instantly types transcripts, extracts action items, and draws Mermaid flowcharts for you.</motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 justify-start w-full">
              <SignedOut><SignUpButton mode="modal"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md hover:shadow-lg">Start for Free <ChevronRight size={24} /></motion.button></SignUpButton></SignedOut>
              <SignedIn><Link to="/live"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md hover:shadow-lg">Open Workspace <ChevronRight size={24} /></motion.button></Link></SignedIn>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSandboxOpen} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md border border-slate-200 hover:bg-slate-50 group">
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Zap size={24} className="text-amber-500 group-hover:scale-110 transition-transform" /></motion.div>Try Sandbox
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div className="flex-1 relative w-full max-w-lg lg:max-w-none transform-gpu z-30 mt-16 lg:mt-0 flex flex-col" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="flex justify-end pr-10 -mb-6 relative z-20 hidden md:flex"><SpolyBot onInteract={handleSandboxOpen} /></div>
            <motion.div whileHover="hover" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/80 relative z-10 overflow-hidden">
              <motion.div variants={{ hover: { top: ["-10%", "110%", "-10%"] } }} transition={{ duration: 2.5, ease: "linear", repeat: Infinity }} className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-50 pointer-events-none opacity-0 group-hover:opacity-100 hidden md:block" style={{ top: "-10%", boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }} />
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4"><div className="flex gap-2"><div className="w-3.5 h-3.5 rounded-full bg-red-400"></div><div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div><div className="w-3.5 h-3.5 rounded-full bg-green-400"></div></div><div className="ml-auto flex items-center gap-2 text-sm text-slate-600 font-bold bg-white/60 px-3 py-1.5 rounded-full border border-slate-100"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> RECORDING</div></div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm border border-white"><Mic size={20} className="text-blue-600 animate-pulse" /></div>
                  <div className="bg-white/80 p-5 rounded-3xl rounded-tl-none border border-white text-base text-slate-800 shadow-sm w-full leading-relaxed font-medium">"So the frontend calls the API gateway, which routes to Auth, and then hits the database."</div>
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }} className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm relative overflow-hidden"><div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold text-base"><Workflow size={20} /> Flowchart Generated</div><div className="bg-white/80 rounded-xl p-4 text-sm font-mono text-slate-800 border border-white shadow-inner">graph TD;<br/>&nbsp;&nbsp;Frontend--&gt;API_Gateway;<br/>&nbsp;&nbsp;API_Gateway--&gt;Auth;<br/>&nbsp;&nbsp;Auth--&gt;Database;</div></motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <AnimatePresence>
          {showSandbox && (
            <motion.section id="sandbox-section" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full max-w-5xl mx-auto px-6 overflow-visible z-40 relative">
              <InteractiveSandbox exportItems={sandboxExportItems} autoStart={autoStartSandbox} onComplete={() => setAutoStartSandbox(false)} />
            </motion.section>
          )}
        </AnimatePresence>

        <TrustedByCarousel />

        {/* --- How It Works --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="flex flex-col items-center justify-center mb-8 relative z-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-slate-900 drop-shadow-sm text-center">How Spoly <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span></h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium text-center">Three steps to convert messy conversations into pristine documentation.</p>
          </motion.div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="absolute -top-20 right-4 md:-top-16 md:-right-8 z-50 hidden md:block group">
               <FlowBot onActivateFlow={runPipelineAnimation} />
               <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">Auto-Play</div>
            </div>
            <Stepper step={stepperStep} onStepChange={setStepperStep} backButtonText="Previous Step" nextButtonText="Next Step">
              <Step>
                <div className="flex flex-col items-center text-center py-6">
                   <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-inner"><UploadCloud size={48} /></div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">1. Capture Audio</h3>
                   <p className="text-lg text-slate-600 max-w-md">Hit record during your meeting, or easily upload your pre-recorded Zoom, Google Meet, or Microsoft Teams files.</p>
                </div>
              </Step>
              <Step>
                <div className="flex flex-col items-center text-center py-6">
                   <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 shadow-inner"><Cpu size={48} /></div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">2. AI Analysis</h3>
                   <p className="text-lg text-slate-600 max-w-md">Our engine transcribes the speech, extracts key action items, and intelligently detects architectural intent from the conversation.</p>
                </div>
              </Step>
              <Step>
                <div className="flex flex-col items-center text-center py-6">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-inner"><FileText size={48} /></div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">3. Notes Output</h3>
                   <p className="text-lg text-slate-600 max-w-md">You instantly receive perfectly formatted markdown notes, alongside a beautifully rendered Mermaid.js diagram.</p>
                </div>
              </Step>
            </Stepper>
          </div>
        </section>

        {/* --- Developers Technical Split-View Section --- */}
        <section id="developers" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl border border-slate-800 flex flex-col lg:flex-row gap-12 items-start relative">
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <div>
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6 border border-blue-500/20"><Code size={32} className="text-blue-400" /></div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Built for Developers</h3>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed">Spoly doesn't just take plain text notes. It detects architectural patterns and system components, automatically writing <span className="text-blue-400 font-mono text-sm px-1.5 py-0.5 bg-blue-900/30 rounded">Mermaid.js</span> syntax behind the scenes.</p>
              </div>

              <div className="w-full flex flex-col mt-4">
                <div className="flex justify-end pr-10 -mb-6 relative z-20 hidden md:flex"><CodeyBot onInteract={() => setCodeIndex(prev => (prev + 1) % 3)} /></div>
                <div className="bg-[#0d1117] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] relative z-10">
                  <div className="h-12 bg-slate-800/80 border-b border-slate-700 flex items-center px-4 gap-2">
                     <div className="flex gap-2"><span className="w-3 h-3 rounded-full bg-red-500/80"></span><span className="w-3 h-3 rounded-full bg-amber-500/80"></span><span className="w-3 h-3 rounded-full bg-green-500/80"></span></div>
                     <span className="text-xs text-slate-400 ml-4 font-mono tracking-wider">{codeSnippets[codeIndex].file}</span>
                  </div>
                  <div className="p-6 font-mono text-sm md:text-base text-blue-300 overflow-x-auto whitespace-pre h-36 flex items-center">
                    <AnimatePresence mode="wait">
                       <motion.div key={codeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                          {codeSnippets[codeIndex].code}
                       </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 flex items-center justify-center mt-12 lg:mt-0 h-full">
              <div className="w-full h-full min-h-[400px] bg-white rounded-[2rem] p-6 shadow-[0_0_50px_rgba(59,130,246,0.1)] border border-slate-200 overflow-x-auto flex items-center justify-center">
                 <AnimatePresence mode="wait">
                    <motion.div key={codeIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="min-w-[400px] flex justify-center py-8">
                      <MermaidDiagram chart={codeSnippets[codeIndex].mermaid} />
                    </motion.div>
                 </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="flex flex-col items-center justify-center mb-10 relative">
            <div className="mb-2 hidden md:block"><CloudyBot onInteract={() => { setIsMagicFlipped(true); setTimeout(() => setIsMagicFlipped(false), 6000); }} /></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm text-center">Supercharged capabilities</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium text-center">Engineered for speed, accuracy, and beautiful visual output.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Mic size={28}/>, title: "Live Transcription", desc: "Capture every word with high-accuracy speech-to-text directly from your browser.", backTitle: "Powered by Whisper", backDesc: "Real-time speech recognition model optimized for technical jargon and complex developer terminology." },
              { icon: <Layout size={28}/>, title: "Smart Summaries", desc: "Raw text is converted into clean, readable headings, bullet points, and action items.", backTitle: "Context-Aware LLM", backDesc: "Our custom pipeline doesn't just read words—it understands architecture, databases, and structural relationships." },
              { icon: <Workflow size={28}/>, title: "Mermaid Visuals", desc: "Spoly detects processes and system architectures, rendering flowcharts automatically.", backTitle: "Live Syntax Rendering", backDesc: "Converts natural language into 100% compliant Mermaid.js code, rendering SVGs natively in the browser." },
            ].map((feature, i) => <Card3DTilt key={i} feature={feature} index={i} isFlipped={isMagicFlipped} /> )}
          </div>
        </section>

        {/* --- Testimonials / Wall of Love --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="flex flex-col md:flex-row items-end justify-between gap-8 mb-10 border-b border-slate-200 pb-6">
            <div>
               <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm">Loved by builders</h2>
               <p className="text-xl text-slate-700 max-w-xl font-medium">See why students and professionals rely on Spoly for their meetings.</p>
            </div>
            <div className="hidden md:flex relative z-50"><ChatBot onShuffle={handleShuffleTestimonials} /></div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visibleTestimonials.map((test, i) => (
                <motion.div key={test.author} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <TestimonialCard {...test} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section id="pricing" className="w-full max-w-7xl mx-auto px-6 py-12 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-sm mt-4">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium text-center mb-10">Start for free, upgrade when you need more power.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="w-full max-w-xl bg-white/50 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Company Size</p>
                    <p className="text-2xl font-black text-blue-600">{teamSize} {teamSize === 1 ? 'Seat' : 'Seats'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Hours Saved</p>
                    <p className="text-2xl font-black text-emerald-500">{hoursSaved} hrs/mo</p>
                  </div>
                </div>
                <input type="range" min="1" max="50" value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 pointer-events-none md:pointer-events-auto" />
              </div>
              <div className="hidden md:flex flex-col items-center">
                 <VaultBot isYearly={isYearlyPricing} intensity={vaultIntensity} onHoldStart={startVaultHold} onHoldEnd={stopVaultHold} />
                 <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-center leading-tight">Hold to add seats<br/>Tap to toggle Yearly</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end pt-4">
            <PricingCard index={0} isYearly={false} tier="Hobby" price={0} desc="Perfect for individuals testing out the AI features." features={["5 hours of transcription/mo", "Basic summaries", "Community support"]} isPro={false} />
            <PricingCard index={1} isYearly={isYearlyPricing} tier="Pro" price={12} desc="For students and professionals who need unlimited access." features={["Unlimited transcription", "Advanced Mermaid exports", "Export to PDF/Markdown", "Priority support"]} isPro={true} />
            <PricingCard index={2} isYearly={isYearlyPricing} tier="Team" price={dynamicTeamPrice} desc="Dynamic pricing for engineering teams sharing knowledge bases." features={["Everything in Pro", "Shared Workspaces", "Custom Diagram templates", "SSO Authentication"]} isPro={false} />
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section id="faq" className="w-full max-w-3xl mx-auto px-6 py-20 relative z-20">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 pb-8 border-b border-slate-200">
            <div><h2 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm ml-4">Frequently asked questions</h2></div>
            <div className="hidden md:block -mb-10 relative z-50"><QuestBot /></div>
          </div>
          <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] border border-white/60 p-8 shadow-sm">
            {[
              { q: "Does it work with live Zoom and Google Meet calls?", a: "Yes! Spoly can capture your system audio or microphone input directly from the browser while you are on a call, transcribing and generating notes in real-time." },
              { q: "Can I upload pre-recorded audio or video files?", a: "Absolutely. You can upload MP3, MP4, or WAV files directly to your dashboard. Spoly will process them exactly as it does live audio." },
              { q: "What is Mermaid.js and how does it work here?", a: "Mermaid is a tool that renders diagrams from text. Spoly's AI analyzes your meeting context, writes the Mermaid syntax for you, and renders the flowchart directly in your notes." },
              { q: "Is my data secure?", a: "We take privacy seriously. Your transcripts are encrypted and we do not use your personal meeting data to train our foundational models." }
            ].map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} isOpen={openFaqIndex === i} onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} />)}
          </div>
        </section>

        {/* --- Final Massive CTA --- */}
        <section className="w-full px-6 py-20 pb-32 relative z-20">
          <div className="w-full flex justify-center relative z-50 hidden md:flex h-40"><BoostBot /></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-16 md:p-24 text-center shadow-2xl relative overflow-hidden mt-8">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 relative z-10 tracking-tight mt-6">Ready to stop taking notes?</h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto relative z-10 font-medium">Join thousands of users who are automating their documentation workflow today.</p>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6">
               <SignedOut><SignUpButton mode="modal"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-indigo-600 px-12 py-6 rounded-full text-2xl font-bold shadow-xl hover:shadow-2xl transition-all">Get Started for Free</motion.button></SignUpButton></SignedOut>
               <SignedIn><Link to="/live"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-indigo-600 px-12 py-6 rounded-full text-2xl font-bold shadow-xl hover:shadow-2xl transition-all">Go to your Workspace</motion.button></Link></SignedIn>
            </div>
          </motion.div>
        </section>

      </div>

      {/* --- Footer --- */}
      <footer className="relative z-20 w-full pt-16 pb-12 px-6 bg-white/20 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-slate-300/50">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"><Mic className="text-white" size={20} /></div><span className="text-3xl font-extrabold text-slate-900 tracking-tight">Spoly</span></div>
            <p className="max-w-md text-base leading-relaxed mb-8 font-medium text-slate-700">Transforming how teams capture knowledge with AI-driven transcriptions, structuring, and diagram generation.</p>
          </div>
          <div><h4 className="text-slate-900 font-extrabold mb-6 text-lg">Product</h4><ul className="space-y-4 text-base font-medium text-slate-600"><li><button onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})} className="hover:text-blue-600 transition-colors">Features</button></li><li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})} className="hover:text-blue-600 transition-colors">Pricing</button></li><li><button onClick={() => document.getElementById('faq')?.scrollIntoView({behavior:'smooth'})} className="hover:text-blue-600 transition-colors">FAQ</button></li></ul></div>
          <div><h4 className="text-slate-900 font-extrabold mb-6 text-lg">Company</h4><ul className="space-y-4 text-base font-medium text-slate-600"><li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li><li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li><li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li></ul></div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-medium text-slate-600">
          <p>© {new Date().getFullYear()} Spoly Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-700 bg-white/60 px-4 py-2 rounded-full shadow-sm border border-white"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span><span className="text-sm font-bold">All Systems Operational</span></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;