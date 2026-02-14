import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { 
  motion, useScroll, useSpring, useMotionValue, 
  useTransform, useMotionTemplate, AnimatePresence 
} from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { 
  Mic, Layout, Workflow, ChevronRight, CheckCircle2, 
  UploadCloud, Cpu, FileText, Users, GraduationCap, Code,
  Star, Quote, ChevronDown, Check, Zap, Sparkles
} from 'lucide-react';

// --- Shared Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- Performance-Optimized Global Background ---
const GlobalMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div 
      animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-200/50 blur-3xl will-change-transform transform-gpu"
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0], x: [0, 30, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/50 blur-3xl will-change-transform transform-gpu"
    />
    <motion.div 
      animate={{ y: [0, -30, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[10%] left-[20%] w-[70vw] h-[50vw] rounded-full bg-indigo-200/40 blur-3xl will-change-transform transform-gpu"
    />
  </div>
);

// --- 1. Trusted By Carousel ---
const TrustedByCarousel = () => {
  const logos = ["Acme Corp", "GlobalTech", "Nexus", "Quantum", "Horizon", "Pinnacle", "Acme Corp", "GlobalTech"];
  return (
    <div className="w-full py-12 overflow-hidden border-y border-white/40 bg-white/20 backdrop-blur-sm mt-12 transform-gpu">
      <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
      <div className="flex w-[200%] animate-[slide_30s_linear_infinite] items-center">
        {logos.map((logo, i) => (
          <div key={i} className="flex-1 flex justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <span className="text-2xl font-black text-slate-800 tracking-tighter">{logo}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
};

// --- 2. Feature & Step Cards (From Previous Iteration) ---
const Card3DTilt = ({ feature, index }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ perspective: 1000 }} className="relative w-full z-10 will-change-transform"
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative h-full w-full rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-lg p-8 shadow-sm transition-shadow hover:shadow-[0_20px_40px_rgba(37,99,235,0.07)] overflow-hidden group transform-gpu">
        <motion.div className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu" style={{ background: useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, transparent 50%)`, mixBlendMode: "overlay" }} />
        <motion.div style={{ transform: "translateZ(30px)" }} className="relative z-20 transform-gpu">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const MagneticStepCard = ({ step, index }) => {
  const iconRef = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 100, damping: 20 }), ySpring = useSpring(y, { stiffness: 100, damping: 20 });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={(e) => {
        if (!iconRef.current) return;
        const { left, top, width, height } = iconRef.current.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2), dy = e.clientY - (top + height / 2);
        if (Math.abs(dx) < 100 && Math.abs(dy) < 100) { x.set(dx * 0.3); y.set(dy * 0.3); } else { x.set(0); y.set(0); }
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="flex flex-col items-center group relative p-8 rounded-[2.5rem] bg-white/30 backdrop-blur-md border border-white/50 shadow-sm hover:bg-white/50 transition-colors duration-300 will-change-transform transform-gpu"
    >
      <motion.div ref={iconRef} style={{ x: xSpring, y: ySpring }} className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white mb-8 shadow-lg relative z-10 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow duration-300 transform-gpu">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>{React.cloneElement(step.icon, { size: 36 })}</motion.div>
      </motion.div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900">{step.title}</h3>
      <p className="text-slate-600 leading-relaxed px-2 text-lg font-medium">{step.desc}</p>
    </motion.div>
  );
};

// --- 3. Testimonial Card ---
const TestimonialCard = ({ quote, author, role, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
    className="bg-white/50 backdrop-blur-md border border-white/60 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:bg-white/80 transition-all duration-300 group"
  >
    <div className="flex gap-1 text-amber-400 mb-6 group-hover:scale-105 transition-transform origin-left">
      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
    </div>
    <Quote className="text-indigo-200 w-12 h-12 absolute top-6 right-8 -z-10 group-hover:text-indigo-300 transition-colors" />
    <p className="text-slate-700 text-lg leading-relaxed font-medium mb-8 z-10 relative">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
        {author.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{author}</h4>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </div>
  </motion.div>
);

// --- 4. Pricing Card ---
const PricingCard = ({ tier, price, desc, features, isPro, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}
    className={`relative flex flex-col p-8 rounded-[2.5rem] border ${isPro ? 'border-blue-400 shadow-[0_20px_40px_rgba(37,99,235,0.15)] bg-white/90 scale-105 z-10' : 'border-white/60 bg-white/40 shadow-sm hover:bg-white/60'} backdrop-blur-xl transition-all duration-300`}
  >
    {isPro && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
        <Sparkles size={14} /> Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier}</h3>
    <p className="text-slate-500 font-medium mb-6 min-h-[48px]">{desc}</p>
    <div className="mb-8 border-b border-slate-200/50 pb-8">
      <span className="text-5xl font-black text-slate-900 tracking-tight">${price}</span>
      <span className="text-slate-500 font-medium">/mo</span>
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((feat, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
          <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
          <span>{feat}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-full font-bold text-lg transition-all ${isPro ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>
      Get Started
    </button>
  </motion.div>
);

// --- 5. Interactive FAQ Item ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/50">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left focus:outline-none group">
        <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0 border border-white">
          <ChevronDown className="text-slate-500 group-hover:text-blue-600" size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <p className="pb-6 text-slate-600 leading-relaxed font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Smooth Scroll Init
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-300 selection:text-blue-900 relative">
      <GlobalMeshBackground />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 z-[60] origin-left shadow-sm transform-gpu will-change-transform" style={{ scaleX }} />

      {/* --- Navbar --- */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-white/30 transition-all duration-300 transform-gpu">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Mic className="text-white" size={22} />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">Spoly</span>
        </motion.div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <SignedOut>
            <SignInButton mode="modal"><button className="hidden md:block text-base font-bold text-slate-700 hover:text-indigo-600 transition-colors">Log In</button></SignInButton>
            <SignUpButton mode="modal">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="text-base font-bold bg-slate-900/90 backdrop-blur-md text-white px-7 py-3 rounded-full shadow-md">Sign Up</motion.button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/live"><button className="text-base font-bold text-blue-600 hover:text-indigo-600 mr-2 md:mr-4 transition-colors">Workspace</button></Link>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10 shadow-sm" } }} />
          </SignedIn>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* --- Hero Section --- */}
        <section className="w-full max-w-7xl px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-20">
          <motion.div className="flex-1 text-center lg:text-left" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md text-blue-800 text-sm font-bold mb-8 border border-white/80 shadow-sm">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span></span>
              Spoly 1.0 is Live
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8 drop-shadow-sm">
              Notes & Diagrams <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Auto-Generated.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-2xl text-slate-700 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Record meetings. Spoly's AI instantly types transcripts, extracts action items, and draws Mermaid flowcharts for you.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <SignedOut>
                <SignUpButton mode="modal">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md">
                    Start for Free <ChevronRight size={24} />
                  </motion.button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link to="/live">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md">
                    Open Workspace <ChevronRight size={24} />
                  </motion.button>
                </Link>
              </SignedIn>
            </motion.div>
          </motion.div>

          <motion.div className="flex-1 relative w-full max-w-lg lg:max-w-none transform-gpu" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/80 relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-white/60 pb-4">
                 <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div><div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div><div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
                 </div>
                <div className="ml-auto flex items-center gap-2 text-sm text-slate-600 font-bold bg-white/60 px-3 py-1.5 rounded-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> RECORDING
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm border border-white">
                    <Mic size={20} className="text-blue-600 animate-pulse" />
                  </div>
                  <div className="bg-white/80 p-5 rounded-3xl rounded-tl-none border border-white text-base text-slate-800 shadow-sm w-full leading-relaxed font-medium">
                    "So the frontend calls the API gateway, which routes to Auth, and then hits the database."
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }} className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold text-base"><Workflow size={20} /> Flowchart Generated</div>
                  <div className="bg-white/80 rounded-xl p-4 text-sm font-mono text-slate-800 border border-white shadow-inner">graph TD;<br/>&nbsp;&nbsp;Frontend--&gt;API_Gateway;<br/>&nbsp;&nbsp;API_Gateway--&gt;Auth;<br/>&nbsp;&nbsp;Auth--&gt;Database;</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Trusted By Carousel --- */}
        <TrustedByCarousel />

        {/* --- How It Works --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 drop-shadow-sm">How Spoly <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Works</span></h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">Three steps to convert messy conversations into pristine documentation.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-16 text-center relative">
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }} className="hidden md:block absolute top-14 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-slate-300/60 -z-10 origin-left" />
            {[
              { icon: <UploadCloud />, title: "Capture Audio", desc: "Use the live recorder or upload Zoom/Meet files." },
              { icon: <Cpu />, title: "AI Analysis", desc: "We transcribe speech and parse key architectural intents." },
              { icon: <FileText />, title: "Notes Output", desc: "Get bulleted summaries and rendered Mermaid visuals instantly." }
            ].map((step, i) => <MagneticStepCard key={i} step={step} index={i} /> )}
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Supercharged capabilities</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">Engineered for speed, accuracy, and beautiful visual output.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Mic size={28}/>, title: "Live Transcription", desc: "Capture every word with high-accuracy speech-to-text directly from your browser." },
              { icon: <Layout size={28}/>, title: "Smart Summaries", desc: "Raw text is converted into clean, readable headings, bullet points, and action items." },
              { icon: <Workflow size={28}/>, title: "Mermaid Visuals", desc: "Spoly detects processes and system architectures, rendering flowcharts automatically." },
            ].map((feature, i) => <Card3DTilt key={i} feature={feature} index={i} /> )}
          </div>
        </section>

        {/* --- Testimonials / Wall of Love --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Loved by builders</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">See why students and professionals rely on Spoly for their meetings.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Spoly saved me hours of manual note-taking during my system architecture classes. The flowcharts generate instantly!", author: "Sarah Jenkins", role: "Computer Engineering Student" },
              { quote: "We use it for every sprint planning meeting. It grabs the action items and builds our database models automatically.", author: "David Chen", role: "Lead Software Engineer" },
              { quote: "I upload my recorded Zoom calls, click a button, and share the perfectly formatted PDF notes with my clients.", author: "Elena Rodriguez", role: "Product Manager" }
            ].map((test, i) => <TestimonialCard key={i} {...test} index={i} />)}
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">Start for free, upgrade when you need more power.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            <PricingCard index={0} tier="Hobby" price="0" desc="Perfect for individuals testing out the AI features." features={["5 hours of transcription/mo", "Basic summaries", "Community support"]} isPro={false} />
            <PricingCard index={1} tier="Pro" price="12" desc="For students and professionals who need unlimited access." features={["Unlimited transcription", "Advanced Mermaid exports", "Export to PDF/Markdown", "Priority support"]} isPro={true} />
            <PricingCard index={2} tier="Team" price="29" desc="For engineering teams sharing knowledge bases." features={["Everything in Pro", "Shared Workspaces", "Custom Diagram templates", "SSO Authentication"]} isPro={false} />
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="w-full max-w-3xl mx-auto px-6 py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Frequently asked questions</h2>
          </motion.div>
          <div className="bg-white/50 backdrop-blur-xl rounded-[2rem] border border-white/60 p-8 shadow-sm">
            {[
              { q: "Does it work with live Zoom and Google Meet calls?", a: "Yes! Spoly can capture your system audio or microphone input directly from the browser while you are on a call, transcribing and generating notes in real-time." },
              { q: "Can I upload pre-recorded audio or video files?", a: "Absolutely. You can upload MP3, MP4, or WAV files directly to your dashboard. Spoly will process them exactly as it does live audio." },
              { q: "What is Mermaid.js and how does it work here?", a: "Mermaid is a tool that renders diagrams from text. Spoly's AI analyzes your meeting context, writes the Mermaid syntax for you, and renders the flowchart directly in your notes." },
              { q: "Is my data secure?", a: "We take privacy seriously. Your transcripts are encrypted and we do not use your personal meeting data to train our foundational models." }
            ].map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </section>

        {/* --- Final Massive CTA --- */}
        <section className="w-full px-6 py-20 pb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 relative z-10 tracking-tight">Ready to stop taking notes?</h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto relative z-10 font-medium">Join thousands of users who are automating their documentation workflow today.</p>
            <SignedOut>
              <SignUpButton mode="modal">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-indigo-600 px-12 py-6 rounded-full text-2xl font-bold shadow-xl hover:shadow-2xl transition-all relative z-10">
                  Get Started for Free
                </motion.button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to="/live">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-indigo-600 px-12 py-6 rounded-full text-2xl font-bold shadow-xl hover:shadow-2xl transition-all relative z-10">
                  Go to your Workspace
                </motion.button>
              </Link>
            </SignedIn>
          </motion.div>
        </section>

      </div>

      {/* --- Footer --- */}
      <footer className="relative z-10 w-full pt-20 pb-12 px-6 bg-white/20 backdrop-blur-md border-t border-white/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-slate-300/50">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md"><Mic className="text-white" size={20} /></div>
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">Spoly</span>
            </div>
            <p className="max-w-md text-base leading-relaxed mb-8 font-medium text-slate-700">Transforming how teams capture knowledge with AI-driven transcriptions, structuring, and diagram generation.</p>
          </div>
          <div>
            <h4 className="text-slate-900 font-extrabold mb-6 text-lg">Product</h4>
            <ul className="space-y-4 text-base font-medium text-slate-600">
              <li><button className="hover:text-blue-600 transition-colors">Features</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Pricing</button></li>
              <li><button className="hover:text-blue-600 transition-colors">FAQ</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-extrabold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-base font-medium text-slate-600">
              <li><button className="hover:text-blue-600 transition-colors">About Us</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-medium text-slate-600">
          <p>© {new Date().getFullYear()} Spoly Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-700 bg-white/60 px-4 py-2 rounded-full shadow-sm border border-white">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
            <span className="text-sm font-bold">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;