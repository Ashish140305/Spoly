import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/clerk-react";
import {
  ToggleLeft,
  ToggleRight,
  Moon,
  Globe,
  Database,
  Mic,
  FileJson,
  Trash2,
  AlertTriangle,
  Monitor,
  Sliders,
  ShieldCheck,
  Zap,
  LayoutGrid,
  MonitorPlay,
  FileText,
  LayoutDashboard,
  PictureInPicture,
} from "lucide-react";

// 🚀 Helper Component: Enforces 100% uniformity for every setting card
const SettingRow = ({
  icon: Icon,
  iconColorClass,
  title,
  description,
  children,
  isDarkMode,
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl p-5 shadow-sm border gap-4 transition-colors ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-white border-slate-200"}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg border shrink-0 ${iconColorClass}`}>
        <Icon size={18} />
      </div>
      <div>
        <p
          className={`font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
        >
          {title}
        </p>
        <p
          className={`text-xs mt-0.5 leading-relaxed max-w-sm ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}
        >
          {description}
        </p>
      </div>
    </div>
    <div className="w-full sm:w-auto flex-shrink-0 flex items-center sm:justify-end">
      {children}
    </div>
  </div>
);

export default function SettingsView({
  user,
  settingsToggles,
  setSettingsToggles,
  showToast,
  isDarkMode,
  setIsDarkMode,
  exportFormat,
  setExportFormat,
  selectedMic,
  setSelectedMic,
  audioConstraints,
  setAudioConstraints,
}) {
  const [activeTab, setActiveTab] = useState("appearance");
  const [audioDevices, setAudioDevices] = useState([]);

  // Load available microphones
  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput",
        );
        setAudioDevices(audioInputs);
      } catch (err) {
        console.warn("Could not fetch audio devices", err);
      }
    };
    getDevices();
  }, []);

  // Initialize all new workflow/appearance toggles from local storage
  useEffect(() => {
    setSettingsToggles((prev) => ({
      ...prev,
      reducedMotion: localStorage.getItem("spoly_reducedMotion") === "true",
      defaultView: localStorage.getItem("spoly_defaultView") || "grid",
      defaultLanguage:
        localStorage.getItem("spoly_defaultLanguage") || "English",
      startupTab: localStorage.getItem("spoly_startupTab") || "workspace",
      keepContext: localStorage.getItem("spoly_keepContext") === "true",
      autoPip: localStorage.getItem("spoly_autoPip") !== "false", // Default to true
    }));
  }, [setSettingsToggles]);

  const updateToggle = (key, defaultVal) => {
    const current =
      settingsToggles[key] !== undefined ? settingsToggles[key] : defaultVal;
    const newVal = !current;
    setSettingsToggles((prev) => ({ ...prev, [key]: newVal }));
    localStorage.setItem(`spoly_${key}`, newVal);
    showToast("Preference updated");
  };

  const updateSelect = (key, val) => {
    setSettingsToggles((prev) => ({ ...prev, [key]: val }));
    localStorage.setItem(`spoly_${key}`, val);
    showToast("Preference saved");
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        "Are you sure? This will clear all local settings and refresh the app.",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: "appearance", icon: Monitor, label: "Appearance" },
    { id: "workflow", icon: Zap, label: "Workflow" }, // Shortened slightly for better fit
    { id: "capture", icon: Sliders, label: "Capture Settings" },
    { id: "integrations", icon: Database, label: "Integrations" },
    { id: "account", icon: ShieldCheck, label: "Account & Data" },
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
        <h2
          className={`text-3xl font-extrabold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Workspace Settings
        </h2>
        <p
          className={`font-medium text-lg ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          Manage your account, hardware, and workflow preferences.
        </p>
      </div>

      <div
        className={`flex flex-col md:flex-row shadow-lg rounded-[2rem] overflow-hidden transition-colors min-h-[500px] border ${isDarkMode ? "bg-[#131722]/90 backdrop-blur-xl border-[#232a3b]" : "bg-white/80 backdrop-blur-xl border-slate-200/60"}`}
      >
        {/* 🚀 SIDEBAR NAVIGATION (FIXED FOR 100% UNIFORMITY) */}
        <div
          className={`w-full md:w-64 p-6 flex flex-col gap-2 border-r shrink-0 ${isDarkMode ? "bg-[#0b0f19]/50 border-[#232a3b]" : "bg-slate-50/50 border-slate-200"}`}
        >
          <p
            className={`text-xs font-bold uppercase tracking-widest mb-2 px-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Categories
          </p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 h-12 rounded-xl font-bold transition-all border text-left ${
                activeTab === tab.id
                  ? isDarkMode
                    ? "bg-[#1a1f2e] text-white border-[#232a3b] shadow-sm"
                    : "bg-white text-indigo-700 border-slate-200 shadow-sm"
                  : isDarkMode
                    ? "text-slate-400 hover:bg-[#1a1f2e] hover:text-slate-200 border-transparent"
                    : "text-slate-500 hover:bg-white hover:text-slate-800 border-transparent"
              }`}
            >
              <tab.icon
                size={18}
                className={`shrink-0 ${activeTab === tab.id ? (isDarkMode ? "text-indigo-400" : "text-indigo-600") : ""}`}
              />
              <span className="whitespace-nowrap truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* --- APPEARANCE TAB --- */}
            {activeTab === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                >
                  Display Preferences
                </h3>

                <SettingRow
                  icon={Moon}
                  iconColorClass={
                    isDarkMode
                      ? "bg-[#131722] border-slate-700 text-slate-300"
                      : "bg-slate-100 border-transparent text-slate-600"
                  }
                  title="Dark Mode"
                  description="Toggle workspace color scheme."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                      showToast(
                        isDarkMode ? "Light Mode Enabled" : "Dark Mode Enabled",
                      );
                    }}
                    className="w-full flex sm:justify-end"
                  >
                    {isDarkMode ? (
                      <ToggleRight
                        size={36}
                        className="text-blue-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>

                <SettingRow
                  icon={MonitorPlay}
                  iconColorClass={
                    isDarkMode
                      ? "bg-amber-900/20 border-amber-800/30 text-amber-400"
                      : "bg-amber-50 border-transparent text-amber-600"
                  }
                  title="Reduced Motion"
                  description="Disables animated backgrounds to save battery."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => updateToggle("reducedMotion", false)}
                    className="w-full flex sm:justify-end"
                  >
                    {settingsToggles.reducedMotion ? (
                      <ToggleRight
                        size={36}
                        className="text-amber-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>

                <SettingRow
                  icon={FileJson}
                  iconColorClass={
                    isDarkMode
                      ? "bg-indigo-900/20 border-indigo-800/30 text-indigo-400"
                      : "bg-indigo-50 border-transparent text-indigo-600"
                  }
                  title="Copy Format"
                  description="'Copy All' clipboard format."
                  isDarkMode={isDarkMode}
                >
                  <div
                    className={`flex w-full sm:w-64 p-1 rounded-xl border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-slate-100 border-transparent"}`}
                  >
                    <button
                      onClick={() => {
                        setExportFormat("markdown");
                        showToast("Set to Markdown");
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${exportFormat === "markdown" ? (isDarkMode ? "bg-[#1a1f2e] text-white shadow-sm border-transparent" : "bg-white text-indigo-700 shadow-sm border-slate-200") : isDarkMode ? "text-slate-400 hover:text-slate-200 border-transparent" : "text-slate-500 hover:text-slate-700 border-transparent"}`}
                    >
                      Markdown
                    </button>
                    <button
                      onClick={() => {
                        setExportFormat("plaintext");
                        showToast("Set to Plain Text");
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${exportFormat === "plaintext" ? (isDarkMode ? "bg-[#1a1f2e] text-white shadow-sm border-transparent" : "bg-white text-indigo-700 shadow-sm border-slate-200") : isDarkMode ? "text-slate-400 hover:text-slate-200 border-transparent" : "text-slate-500 hover:text-slate-700 border-transparent"}`}
                    >
                      Plain Text
                    </button>
                    <button
                      onClick={() => {
                        setExportFormat("pdf");
                        showToast("Set to PDF");
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${exportFormat === "pdf" ? (isDarkMode ? "bg-[#1a1f2e] text-white shadow-sm border-transparent" : "bg-white text-indigo-700 shadow-sm border-slate-200") : isDarkMode ? "text-slate-400 hover:text-slate-200 border-transparent" : "text-slate-500 hover:text-slate-700 border-transparent"}`}
                    >
                      PDF
                    </button>
                  </div>
                </SettingRow>

                <SettingRow
                  icon={LayoutGrid}
                  iconColorClass={
                    isDarkMode
                      ? "bg-pink-900/20 border-pink-800/30 text-pink-400"
                      : "bg-pink-50 border-transparent text-pink-600"
                  }
                  title="Default Library View"
                  description="Initial structure layout for Saved Notes."
                  isDarkMode={isDarkMode}
                >
                  <div
                    className={`flex w-full sm:w-48 p-1 rounded-xl border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-slate-100 border-transparent"}`}
                  >
                    <button
                      onClick={() => updateSelect("defaultView", "grid")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${settingsToggles.defaultView === "grid" ? (isDarkMode ? "bg-[#1a1f2e] text-white shadow-sm border-transparent" : "bg-white text-pink-700 shadow-sm border-slate-200") : isDarkMode ? "text-slate-400 hover:text-slate-200 border-transparent" : "text-slate-500 hover:text-slate-700 border-transparent"}`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => updateSelect("defaultView", "timeline")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${settingsToggles.defaultView === "timeline" ? (isDarkMode ? "bg-[#1a1f2e] text-white shadow-sm border-transparent" : "bg-white text-pink-700 shadow-sm border-slate-200") : isDarkMode ? "text-slate-400 hover:text-slate-200 border-transparent" : "text-slate-500 hover:text-slate-700 border-transparent"}`}
                    >
                      Timeline
                    </button>
                  </div>
                </SettingRow>
              </motion.div>
            )}

            {/* --- WORKFLOW & DEFAULTS TAB --- */}
            {activeTab === "workflow" && (
              <motion.div
                key="workflow"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                >
                  Application Defaults
                </h3>

                <SettingRow
                  icon={LayoutDashboard}
                  iconColorClass={
                    isDarkMode
                      ? "bg-purple-900/20 border-purple-800/30 text-purple-400"
                      : "bg-purple-50 border-transparent text-purple-600"
                  }
                  title="Startup Tab"
                  description="The screen that opens when you load Spoly."
                  isDarkMode={isDarkMode}
                >
                  <select
                    value={settingsToggles.startupTab || "workspace"}
                    onChange={(e) => updateSelect("startupTab", e.target.value)}
                    className={`w-full sm:w-48 text-sm font-bold rounded-xl p-2 outline-none focus:ring-2 focus:ring-purple-500 border ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    <option value="workspace">Workspace</option>
                    <option value="notes">Saved Notes</option>
                    <option value="templates">Templates</option>
                  </select>
                </SettingRow>

                <SettingRow
                  icon={Globe}
                  iconColorClass={
                    isDarkMode
                      ? "bg-cyan-900/20 border-cyan-800/30 text-cyan-400"
                      : "bg-cyan-50 border-transparent text-cyan-600"
                  }
                  title="Output Language"
                  description="Default language applied to generated AI notes."
                  isDarkMode={isDarkMode}
                >
                  <select
                    value={settingsToggles.defaultLanguage || "English"}
                    onChange={(e) =>
                      updateSelect("defaultLanguage", e.target.value)
                    }
                    className={`w-full sm:w-48 text-sm font-bold rounded-xl p-2 outline-none focus:ring-2 focus:ring-cyan-500 border ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </SettingRow>

                <SettingRow
                  icon={FileText}
                  iconColorClass={
                    isDarkMode
                      ? "bg-rose-900/20 border-rose-800/30 text-rose-400"
                      : "bg-rose-50 border-transparent text-rose-600"
                  }
                  title="Keep Context Documents"
                  description="Retain uploaded PDFs across multiple recordings."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => updateToggle("keepContext", false)}
                    className="w-full flex sm:justify-end"
                  >
                    {settingsToggles.keepContext ? (
                      <ToggleRight
                        size={36}
                        className="text-rose-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>

                <SettingRow
                  icon={PictureInPicture}
                  iconColorClass={
                    isDarkMode
                      ? "bg-blue-900/20 border-blue-800/30 text-blue-400"
                      : "bg-blue-50 border-transparent text-blue-600"
                  }
                  title="Auto-Launch PiP Widget"
                  description="Pop out floating widget when navigating away."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => updateToggle("autoPip", true)}
                    className="w-full flex sm:justify-end"
                  >
                    {settingsToggles.autoPip !== false ? (
                      <ToggleRight
                        size={36}
                        className="text-blue-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>
              </motion.div>
            )}

            {/* --- CAPTURE TAB --- */}
            {activeTab === "capture" && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                >
                  Audio Engine
                </h3>

                <SettingRow
                  icon={Mic}
                  iconColorClass={
                    isDarkMode
                      ? "bg-emerald-900/20 border-emerald-800/30 text-emerald-400"
                      : "bg-emerald-50 border-transparent text-emerald-600"
                  }
                  title="Hardware Input"
                  description="Select microphone used for local recording."
                  isDarkMode={isDarkMode}
                >
                  <select
                    value={selectedMic}
                    onChange={(e) => {
                      setSelectedMic(e.target.value);
                      showToast("Microphone updated!");
                    }}
                    className={`w-full sm:w-48 text-sm font-bold rounded-xl p-2 outline-none focus:ring-2 focus:ring-emerald-500 border ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    {audioDevices.length === 0 ? (
                      <option value="default">Default System Mic</option>
                    ) : (
                      audioDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Microphone ${audioDevices.indexOf(device) + 1}`}
                        </option>
                      ))
                    )}
                  </select>
                </SettingRow>

                <SettingRow
                  icon={Sliders}
                  iconColorClass={
                    isDarkMode
                      ? "bg-emerald-900/20 border-emerald-800/30 text-emerald-400"
                      : "bg-emerald-50 border-transparent text-emerald-600"
                  }
                  title="Echo Cancellation"
                  description="Reduces speaker feedback loops."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => {
                      setAudioConstraints((p) => ({
                        ...p,
                        echoCancellation: !p.echoCancellation,
                      }));
                      showToast("Echo Cancellation updated");
                    }}
                    className="w-full flex sm:justify-end"
                  >
                    {audioConstraints.echoCancellation ? (
                      <ToggleRight
                        size={36}
                        className="text-emerald-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>

                <SettingRow
                  icon={Sliders}
                  iconColorClass={
                    isDarkMode
                      ? "bg-emerald-900/20 border-emerald-800/30 text-emerald-400"
                      : "bg-emerald-50 border-transparent text-emerald-600"
                  }
                  title="Noise Suppression"
                  description="Filters out background hums and typing."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => {
                      setAudioConstraints((p) => ({
                        ...p,
                        noiseSuppression: !p.noiseSuppression,
                      }));
                      showToast("Noise Suppression updated");
                    }}
                    className="w-full flex sm:justify-end"
                  >
                    {audioConstraints.noiseSuppression ? (
                      <ToggleRight
                        size={36}
                        className="text-emerald-500 drop-shadow-sm"
                      />
                    ) : (
                      <ToggleLeft size={36} className="text-slate-400" />
                    )}
                  </button>
                </SettingRow>
              </motion.div>
            )}

            {/* --- INTEGRATIONS TAB --- */}
            {activeTab === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                >
                  Connected Apps
                </h3>

                <SettingRow
                  icon={Database}
                  iconColorClass={
                    isDarkMode
                      ? "bg-[#131722] text-slate-300 border-[#232a3b]"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }
                  title="Notion Workspace"
                  description="Push saved notes directly to Notion."
                  isDarkMode={isDarkMode}
                >
                  <button
                    onClick={() => {
                      setSettingsToggles((t) => ({ ...t, notion: !t.notion }));
                      showToast(
                        settingsToggles.notion
                          ? "Notion Sync Disabled"
                          : "Notion Sync Enabled",
                      );
                    }}
                    className="flex items-center justify-between w-full sm:w-auto gap-3"
                  >
                    <span
                      className={`text-sm font-bold ${settingsToggles.notion ? (isDarkMode ? "text-blue-400" : "text-blue-600") : isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {settingsToggles.notion ? "Connected" : "Disconnected"}
                    </span>
                    {settingsToggles.notion ? (
                      <ToggleRight
                        size={36}
                        className={
                          isDarkMode
                            ? "text-blue-500 drop-shadow-sm"
                            : "text-blue-600 drop-shadow-sm"
                        }
                      />
                    ) : (
                      <ToggleLeft
                        size={36}
                        className={
                          isDarkMode ? "text-slate-600" : "text-slate-300"
                        }
                      />
                    )}
                  </button>
                </SettingRow>
              </motion.div>
            )}

            {/* --- ACCOUNT & DATA TAB --- */}
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <h3
                  className={`text-xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                >
                  Profile & Data
                </h3>

                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl p-6 gap-4 border ${isDarkMode ? "bg-[#1a1f2e] border-[#232a3b]" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`p-1 rounded-full shadow-sm border ${isDarkMode ? "bg-[#131722] border-[#232a3b]" : "bg-white border-slate-100"}`}
                    >
                      <UserButton
                        appearance={{ elements: { avatarBox: "w-14 h-14" } }}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {user?.fullName || "Spoly User"}
                      </p>
                      <p
                        className={`font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {user?.primaryEmailAddress?.emailAddress ||
                          "user@example.com"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-widest rounded-md border ${isDarkMode ? "bg-blue-900/30 text-blue-400 border-blue-800/50" : "bg-blue-100 text-blue-700 border-blue-200"}`}
                        >
                          Pro Plan
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Opening Account Portal...")}
                    className={`w-full sm:w-auto px-6 py-2.5 font-bold rounded-xl shadow-sm transition-colors border ${isDarkMode ? "bg-[#131722] border-[#232a3b] text-slate-300 hover:bg-[#0b0f19]" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    Manage Account
                  </button>
                </div>

                <div className="mt-8">
                  <SettingRow
                    icon={AlertTriangle}
                    iconColorClass={
                      isDarkMode
                        ? "bg-red-900/20 border-red-800/30 text-red-400"
                        : "bg-red-50 border-transparent text-red-600"
                    }
                    title="Clear Local Data"
                    description="Wipe all cached settings and notes."
                    isDarkMode={isDarkMode}
                  >
                    <button
                      onClick={handleClearCache}
                      className={`px-4 py-2 font-bold rounded-xl transition-colors border flex items-center justify-center gap-2 w-full sm:w-auto ${isDarkMode ? "bg-[#131722] text-red-400 hover:bg-[#0b0f19] hover:text-red-300 border-[#232a3b]" : "bg-white text-red-600 hover:bg-slate-50 hover:text-red-700 border-slate-200 shadow-sm"}`}
                    >
                      <Trash2 size={16} /> Clear Cache
                    </button>
                  </SettingRow>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
