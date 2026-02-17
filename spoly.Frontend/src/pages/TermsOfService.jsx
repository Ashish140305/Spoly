import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft, FileSignature } from 'lucide-react';

const GlobalMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0], x: [0, 30, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-200/40 blur-3xl will-change-transform transform-gpu" />
  </div>
);

const TermsOfService = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-hidden selection:bg-blue-300 selection:text-blue-900">
      <GlobalMeshBackground />
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-[1600px] mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"><Mic className="text-white" size={22} /></div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">Spoly</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"><ArrowLeft size={20} /> Back to Home</Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
            <FileSignature className="text-indigo-500 w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-[2.5rem] p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
            <p className="text-lg font-medium text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
            
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using Spoly, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                <p>Spoly provides AI-powered transcription and diagram generation software. We reserve the right to modify, suspend, or discontinue the service at any time without notice.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
                <p>You are responsible for all activities occurring under your account. You agree to not use the service for any illegal or unauthorized purpose. You must not record conversations without the explicit legal consent of all participating parties according to your local jurisdiction.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Payment and Subscriptions</h2>
                <p>Premium features are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Subscriptions automatically renew unless cancelled prior to the renewal date.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Account Termination</h2>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;