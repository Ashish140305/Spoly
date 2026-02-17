import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft, Users, Code, Zap } from 'lucide-react';

const GlobalMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-200/40 blur-3xl will-change-transform transform-gpu" />
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0], x: [0, 30, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/40 blur-3xl will-change-transform transform-gpu" />
  </div>
);

const AboutUs = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-hidden selection:bg-blue-300 selection:text-blue-900">
      <GlobalMeshBackground />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-[1600px] mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"><Mic className="text-white" size={22} /></div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">Spoly</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Builders.</span></h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">Spoly was born out of frustration. We were tired of losing hours to writing documentation, drawing flowcharts, and deciphering messy meeting notes.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-[3rem] p-8 md:p-14 space-y-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><Users size={32} /></div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">To eliminate the friction between having an idea and documenting it. We believe that engineers, product managers, and students should spend their time thinking and creating, not transcribing and formatting.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><Code size={32} /></div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">The Tech</h3>
              <p className="text-slate-600 leading-relaxed text-lg">By combining state-of-the-art speech-to-text models (like Whisper) with context-aware LLMs, we've built an engine that doesn't just hear words—it understands architecture. We native render Mermaid.js so you can go straight from voice to system design.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><Zap size={32} /></div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">The Future</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Spoly is evolving fast. We are constantly upgrading our pipeline to support more diagram types, deeper API integrations, and collaborative team workspaces. Join us on the journey to zero-effort documentation.</p>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;