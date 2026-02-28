import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { 
  ToggleLeft, ToggleRight, Moon, Globe, Database, Mic, 
  FileJson, Trash2, AlertTriangle, Monitor, Sliders, ShieldCheck
} from 'lucide-react';

export default function SettingsView({ 
  user, settingsToggles, setSettingsToggles, showToast, 
  isDarkMode, setIsDarkMode, exportFormat, setExportFormat,
  selectedMic, setSelectedMic, audioConstraints, setAudioConstraints
}) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [audioDevices, setAudioDevices] = useState([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);
      } catch (err) {
        console.warn("Could not fetch audio devices", err);
      }
    };
    getDevices();
  }, []);

  const handleClearCache = () => {
    if (window.confirm("Are you sure? This will clear all local settings and refresh the app.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'appearance', icon: Monitor, label: 'Appearance' },
    { id: 'capture', icon: Sliders, label: 'Capture Settings' },
    { id: 'integrations', icon: Database, label: 'Integrations' },
    { id: 'account', icon: ShieldCheck, label: 'Account & Data' }
  ];

  return (
    <motion.div 
      key="settings-tab" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <h2 className={`text-3xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workspace Settings</h2>
        <p className={`font-medium text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your account, hardware, and workflow preferences.</p>
      </div>
      
      <div className={`flex flex-col md:flex-row shadow-lg rounded-[2rem] overflow-hidden transition-colors min-h-[500px] border ${isDarkMode ? 'bg-[#131722]/90 backdrop-blur-xl border-[#232a3b]' : 'bg-white/80 backdrop-blur-xl border-slate-200/60'}`}>
        
        {/* SIDEBAR NAVIGATION */}
        <div className={`w-full md:w-64 p-6 flex flex-col gap-2 border-r ${isDarkMode ? 'bg-[#0b0f19]/50 border-[#232a3b]' : 'bg-slate-50/50 border-slate-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 px-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Categories</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all border ${
                activeTab === tab.id 
                  ? (isDarkMode ? 'bg-[#1a1f2e] text-white border-[#232a3b] shadow-sm' : 'bg-white text-indigo-700 border-slate-200 shadow-sm')
                  : (isDarkMode ? 'text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200 border-transparent' : 'text-slate-500 hover:bg-white hover:text-slate-800 border-transparent')
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? (isDarkMode ? "text-indigo-400" : "text-indigo-600") : ""} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            
            {/* --- APPEARANCE TAB --- */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Display Preferences</h3>
                
                <div className={`flex items-start justify-between rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-[#131722] border-slate-700 text-slate-300' : 'bg-slate-100 border-transparent text-slate-600'}`}><Moon size={18}/></div>
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Dark Mode</p>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Toggle workspace color scheme.</p>
                    </div>
                  </div>
                  <button onClick={() => { setIsDarkMode(!isDarkMode); showToast(isDarkMode ? "Light Mode Enabled" : "Dark Mode Enabled"); }} className="mt-1">
                    {isDarkMode ? <ToggleRight size={36} className="text-blue-500 drop-shadow-sm" /> : <ToggleLeft size={36} className="text-slate-300" />}
                  </button>
                </div>

                <div className={`flex flex-col justify-between rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-800/30 text-indigo-400' : 'bg-indigo-50 border-transparent text-indigo-600'}`}><FileJson size={18}/></div>
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Copy Format</p>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>How 'Copy All' formats your clipboard.</p>
                    </div>
                  </div>
                  <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-slate-100 border-transparent'}`}>
                    <button onClick={() => { setExportFormat('markdown'); showToast("Set to Markdown"); }} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors border ${exportFormat === 'markdown' ? (isDarkMode ? 'bg-[#1a1f2e] text-white shadow-sm border-transparent' : 'bg-white text-indigo-700 shadow-sm border-slate-200') : (isDarkMode ? 'text-slate-400 hover:text-slate-200 border-transparent' : 'text-slate-500 hover:text-slate-700 border-transparent')}`}>Markdown</button>
                    <button onClick={() => { setExportFormat('plaintext'); showToast("Set to Plain Text"); }} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors border ${exportFormat === 'plaintext' ? (isDarkMode ? 'bg-[#1a1f2e] text-white shadow-sm border-transparent' : 'bg-white text-indigo-700 shadow-sm border-slate-200') : (isDarkMode ? 'text-slate-400 hover:text-slate-200 border-transparent' : 'text-slate-500 hover:text-slate-700 border-transparent')}`}>Plain Text</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- CAPTURE TAB --- */}
            {activeTab === 'capture' && (
              <motion.div key="capture" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Audio Engine</h3>

                <div className={`flex flex-col justify-between rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-800/30 text-emerald-400' : 'bg-emerald-50 border-transparent text-emerald-600'}`}><Mic size={18}/></div>
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Hardware Input</p>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Select the microphone used for local recording.</p>
                    </div>
                  </div>
                  <select value={selectedMic} onChange={(e) => { setSelectedMic(e.target.value); showToast("Microphone updated!"); }} className={`w-full text-sm font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 border ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    {audioDevices.length === 0 ? (
                      <option value="default">Default System Mic</option>
                    ) : (
                      audioDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className={`flex items-start justify-between rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                  <div>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Echo Cancellation</p>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Reduces speaker feedback. Disable if using a professional headset.</p>
                  </div>
                  <button onClick={() => { setAudioConstraints(p => ({...p, echoCancellation: !p.echoCancellation})); showToast("Echo Cancellation updated"); }}>
                    {audioConstraints.echoCancellation ? <ToggleRight size={36} className="text-emerald-500 drop-shadow-sm" /> : <ToggleLeft size={36} className="text-slate-400" />}
                  </button>
                </div>

                <div className={`flex items-start justify-between rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-white border-slate-200'}`}>
                  <div>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Noise Suppression</p>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Filters out background hums and typing sounds.</p>
                  </div>
                  <button onClick={() => { setAudioConstraints(p => ({...p, noiseSuppression: !p.noiseSuppression})); showToast("Noise Suppression updated"); }}>
                    {audioConstraints.noiseSuppression ? <ToggleRight size={36} className="text-emerald-500 drop-shadow-sm" /> : <ToggleLeft size={36} className="text-slate-400" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- INTEGRATIONS TAB --- */}
            {activeTab === 'integrations' && (
              <motion.div key="integrations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Connected Apps</h3>
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between transition-colors rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b] hover:border-blue-800' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-xl shadow-inner flex items-center justify-center font-black text-xl border ${isDarkMode ? 'bg-[#131722] text-slate-300 border-[#232a3b]' : 'bg-slate-50 text-slate-800 border-slate-200'}`}>N</div>
                    <div>
                      <p className={`font-bold text-lg ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Notion Workspace</p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Push saved notes directly to Notion.</p>
                    </div>
                  </div>
                  <button onClick={() => { setSettingsToggles(t => ({...t, notion: !t.notion})); showToast(settingsToggles.notion ? "Notion Sync Disabled" : "Notion Sync Enabled"); }} className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${settingsToggles.notion ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                      {settingsToggles.notion ? 'Connected' : 'Disconnected'}
                    </span>
                    {settingsToggles.notion ? <ToggleRight size={40} className={isDarkMode ? 'text-blue-500 drop-shadow-sm' : 'text-blue-600 drop-shadow-sm'} /> : <ToggleLeft size={40} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* --- ACCOUNT & DATA TAB --- */}
            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Profile & Data</h3>
                
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl p-6 gap-4 border ${isDarkMode ? 'bg-[#1a1f2e] border-[#232a3b]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`p-1 rounded-full shadow-sm border ${isDarkMode ? 'bg-[#131722] border-[#232a3b]' : 'bg-white border-slate-100'}`}>
                      <UserButton appearance={{ elements: { avatarBox: "w-14 h-14" } }} />
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.fullName || "Spoly User"}</p>
                      <p className={`font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-widest rounded-md border ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>Pro Plan</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => showToast("Opening Account Portal...")} className={`w-full sm:w-auto px-6 py-2.5 font-bold rounded-xl shadow-sm transition-colors border ${isDarkMode ? 'bg-[#131722] border-[#232a3b] text-slate-300 hover:bg-[#0b0f19]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                    Manage Account
                  </button>
                </div>

                <div className={`flex items-center justify-between rounded-2xl p-5 shadow-sm border mt-8 ${isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-4">
                    <AlertTriangle size={24} className={isDarkMode ? 'text-red-600' : 'text-red-500'} />
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Clear Local Data</p>
                      <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Wipe all cached settings and notes.</p>
                    </div>
                  </div>
                  <button onClick={handleClearCache} className={`px-5 py-2.5 font-bold rounded-xl transition-colors border flex items-center gap-2 ${isDarkMode ? 'bg-[#131722] text-red-400 hover:bg-[#0b0f19] hover:text-red-300 border-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border-red-200'}`}>
                    <Trash2 size={16}/> Clear Cache
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}