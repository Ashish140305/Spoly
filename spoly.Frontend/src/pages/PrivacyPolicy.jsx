import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, ArrowLeft, ShieldCheck } from "lucide-react";

const GlobalMeshBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8fafc]">
    <motion.div
      animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-200/40 blur-3xl will-change-transform transform-gpu"
    />
  </div>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative overflow-hidden selection:bg-blue-300 selection:text-blue-900">
      <GlobalMeshBackground />
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-[1600px] mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Mic className="text-white" size={22} />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
            Spoly
          </span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <ShieldCheck className="text-emerald-500 w-12 h-12" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-[2.5rem] p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
          <p className="text-lg font-medium text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Data Collection & Audio Processing
            </h2>
            <p>
              Spoly requires access to your microphone and system audio to
              generate transcripts and diagrams. Audio files uploaded or
              recorded via our service are processed securely.{" "}
              <strong>We do not store your raw audio data</strong> after the
              transcription and formatting processes are successfully completed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. AI Model Training
            </h2>
            <p>
              We strictly respect your intellectual property.{" "}
              <strong>
                We do not use your personal meeting transcripts, code snippets,
                or generated diagrams to train our foundational AI models.
              </strong>{" "}
              Your data remains private to your workspace.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Data Security
            </h2>
            <p>
              All data transmitted between your browser and our servers is
              encrypted in transit using industry-standard TLS. Data at rest
              (such as your saved notes and diagrams) is encrypted within our
              database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Third-Party Services
            </h2>
            <p>
              We use trusted third-party providers (such as Clerk for
              authentication). These services only receive the data strictly
              necessary to perform their functions and are bound by stringent
              confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about how your data is handled, please
              contact our security team at{" "}
              <a
                href="mailto:privacy@spoly.app"
                className="text-blue-600 font-bold hover:underline"
              >
                privacy@spoly.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
