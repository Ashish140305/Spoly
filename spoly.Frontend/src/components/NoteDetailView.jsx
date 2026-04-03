import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlignLeft,
  Workflow,
  Download,
  Clock,
  Calendar,
  CheckSquare,
  Layers,
} from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";

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

const generateMarkdown = (note) => {
  let md = `# ${note.title || "Spoly Note"}\n\n`;
  md += `**Date:** ${note.date} | **Duration:** ${note.duration || "00:00"}\n\n`;
  md += `---\n\n`;

  if (note.summary) {
    md += `## Notes\n\n`;
    md += `${note.summary}\n\n`;
  }

  let validDiagrams = [];
  if (note.graphs && Array.isArray(note.graphs) && note.graphs.length > 0) {
    validDiagrams = note.graphs;
  } else if (
    note.graph &&
    typeof note.graph === "string" &&
    note.graph !== "API FAILED"
  ) {
    validDiagrams = [{ title: "Saved Flowchart", code: note.graph }];
  }

  if (validDiagrams.length > 0) {
    md += `## Diagrams\n\n`;
    validDiagrams.forEach((diag) => {
      md += `### ${diag.title}\n\n`;
      md += "```mermaid\n";
      md += `${diag.code}\n`;
      md += "```\n\n";
    });
  }

  if (note.flashcards && note.flashcards.length > 0) {
    md += `## Flashcards\n\n`;
    note.flashcards.forEach((card, i) => {
      md += `**Q${i + 1}:** ${card.front}\n\n`;
      md += `**A${i + 1}:** ${card.back}\n\n`;
    });
  }

  return md;
};

const formatGeneratedNotes = (text, isDarkMode) => {
  if (!text) return "No notes available.";

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
              className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    if (trimmedLine.startsWith("📌") || trimmedLine.startsWith("#")) {
      const titleText = trimmedLine.replace(/^[📌#]+\s*/, "");
      return (
        <h3
          key={index}
          className={`text-xl font-extrabold mt-6 mb-3 border-b pb-2 ${isDarkMode ? "text-blue-400 border-blue-500/20" : "text-blue-600 border-blue-200"}`}
        >
          {titleText}
        </h3>
      );
    }

    if (
      trimmedLine.startsWith("•") ||
      trimmedLine.startsWith("-") ||
      trimmedLine.startsWith("*")
    ) {
      const bulletText = trimmedLine.replace(/^[•\-*]\s*/, "");
      return (
        <div key={index} className="flex items-start gap-3 mb-2 ml-1">
          <div
            className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
          ></div>
          <div className="flex-1 leading-relaxed">{formatBold(bulletText)}</div>
        </div>
      );
    }

    return (
      <p key={index} className="mb-3 leading-relaxed">
        {formatBold(trimmedLine)}
      </p>
    );
  });
};

export default function NoteDetailView({
  isDarkMode,
  selectedNote,
  exportFormat,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState("notes");

  const handleExport = () => {
    if (!selectedNote) return;

    try {
      // Generate the markdown content
      const content = generateMarkdown(selectedNote);

      // Determine extension based on settings (defaults to .md)
      const isTxt = exportFormat === "txt" || exportFormat === "text";
      const fileExtension = isTxt ? "txt" : "md";
      const mimeType = isTxt ? "text/plain" : "text/markdown";

      // Create a Blob containing the text data
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Create a hidden anchor tag to trigger the download
      const a = document.createElement("a");
      a.href = url;

      // Sanitize the title to make a clean filename (removes special chars)
      const safeTitle = (selectedNote.title || "spoly_note")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      a.download = `${safeTitle}.${fileExtension}`;

      // Trigger download and cleanup
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Exported as .${fileExtension.toUpperCase()}`);
    } catch (err) {
      console.error("Export failed:", err);
      showToast("Failed to export notes.");
    }
  };

  if (!selectedNote) return null;

  let validDiagrams = [];
  if (
    selectedNote.graphs &&
    Array.isArray(selectedNote.graphs) &&
    selectedNote.graphs.length > 0
  ) {
    validDiagrams = selectedNote.graphs;
  } else if (
    selectedNote.graph &&
    typeof selectedNote.graph === "string" &&
    selectedNote.graph !== "API FAILED"
  ) {
    validDiagrams = [{ title: "Saved Flowchart", code: selectedNote.graph }];
  }

  const hasFlashcards =
    selectedNote.flashcards && selectedNote.flashcards.length > 0;

  return (
    <div className="max-w-6xl pb-20 mx-auto space-y-6">
      <div
        className={`p-6 rounded-2xl border shadow-sm flex flex-wrap gap-6 items-center justify-between ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
      >
        <div className="flex gap-6">
          <div
            className={`flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            <Calendar size={16} className="text-blue-500" />
            <span className="text-sm font-medium">{selectedNote.date}</span>
          </div>
          <div
            className={`flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            <Clock size={16} className="text-amber-500" />
            <span className="text-sm font-medium">
              {selectedNote.duration || "00:00"} Duration
            </span>
          </div>
        </div>

        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${isDarkMode ? "bg-[#1a1f2e] hover:bg-[#2A2F3D] text-slate-200 border border-[#2A2F3D]" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"}`}
        >
          <Download size={16} /> Export Notes
        </button>
      </div>

      <div className="flex justify-center mb-2">
        <div
          className={`inline-flex rounded-full p-1 border shadow-sm ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
        >
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === "notes" ? (isDarkMode ? "bg-blue-600 text-white shadow-md" : "bg-blue-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
          >
            <AlignLeft size={16} /> Structured Notes
          </button>

          {validDiagrams.length > 0 && (
            <button
              onClick={() => setActiveTab("diagram")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === "diagram" ? (isDarkMode ? "bg-emerald-600 text-white shadow-md" : "bg-emerald-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Workflow size={16} /> Multi-Diagram View
            </button>
          )}

          {hasFlashcards && (
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === "flashcards" ? (isDarkMode ? "bg-indigo-600 text-white shadow-md" : "bg-indigo-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Layers size={16} /> Practice Flashcards
            </button>
          )}
        </div>
      </div>

      <div
        className={`rounded-[2rem] p-8 border shadow-sm flex flex-col min-h-[60vh] w-full transition-all duration-500 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
      >
        {activeTab === "notes" ? (
          <div
            className={`text-sm md:text-base leading-relaxed overflow-y-auto custom-scrollbar pr-4 flex-1 w-full ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            {formatGeneratedNotes(selectedNote.summary, isDarkMode)}
          </div>
        ) : activeTab === "flashcards" ? (
          <div className="grid w-full h-full grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
            {selectedNote.flashcards.map((card, index) => (
              <Flashcard
                key={index}
                front={card.front}
                back={card.back}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full h-full pr-2 space-y-8 overflow-auto custom-scrollbar">
            {validDiagrams.map((diag, index) => (
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
                  <MermaidDiagram chart={diag.code} isDarkMode={isDarkMode} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
