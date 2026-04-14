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
  HelpCircle,
} from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";
import html2pdf from "html2pdf.js";

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

const MCQCard = ({ question, options, answer, isDarkMode }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <div className={`w-full p-6 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl border-2 ${isDarkMode ? "bg-[#1a1f2e] border-[#2A2F3D] text-white" : "bg-white border-slate-200 text-slate-800"}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`mt-1 flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold rounded-md ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>Q</div>
        <h3 className="text-lg font-bold flex-1 leading-snug">{question}</h3>
      </div>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = String(opt).trim().toLowerCase() === String(answer).trim().toLowerCase();
          const showResult = selectedOption !== null;
          
          let btnClass = isDarkMode ? "bg-[#0b0f19] border-[#2A2F3D] hover:border-[#3b435b] text-slate-300" : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700";
          if (showResult) {
            if (isCorrect) btnClass = isDarkMode ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-400" : "bg-emerald-50 border-emerald-400 text-emerald-700";
            else if (isSelected && !isCorrect) btnClass = isDarkMode ? "bg-red-900/40 border-red-500/50 text-red-400" : "bg-red-50 border-red-400 text-red-700";
          }

          return (
            <button
              key={i}
              disabled={showResult}
              onClick={() => setSelectedOption(opt)}
              className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-300 ${btnClass} ${(showResult && !isCorrect && !isSelected) ? "opacity-30 grayscale" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
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

  if (note.mcqs && note.mcqs.length > 0) {
    md += `## Multiple Choice Questions\n\n`;
    note.mcqs.forEach((mcq, i) => {
      md += `**Q${i + 1}:** ${mcq.question}\n\n`;
      mcq.options.forEach((opt) => {
        md += `- ${opt}\n`;
      });
      md += `\n**Answer:** ${mcq.answer}\n\n`;
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
      // Sanitize the title to make a clean filename (removes special chars)
      const safeTitle = (selectedNote.title || "spoly_note")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      if (exportFormat === "pdf") {
        showToast("Generating PDF...");

        // Create a hidden temporary container
        const container = document.createElement("div");
        container.style.padding = "40px";
        container.style.fontFamily = "'Inter', sans-serif";
        container.style.color = "#1e293b";
        container.style.backgroundColor = "#ffffff";

        // Build HTML content safely
        let htmlContent = `
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">${selectedNote.title || "Spoly Note"}</h1>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 24px;">Date: ${selectedNote.date} | Duration: ${selectedNote.duration || "00:00"}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        `;

        if (selectedNote.summary) {
          // Format summary simply (convert ** to bold, etc)
          const formattedSummary = selectedNote.summary
            .split("\n")
            .map((line) => {
              const trimmed = line.trim();
              if (!trimmed) return "<br/>";
              let mdParsed = trimmed.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>",
              );
              if (trimmed.startsWith("📌") || trimmed.startsWith("#"))
                return `<h3 style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #2563eb;">${mdParsed.replace(/^[📌#]+\s*/, "")}</h3>`;
              if (
                trimmed.startsWith("•") ||
                trimmed.startsWith("-") ||
                trimmed.startsWith("*")
              )
                return `<li style="margin-bottom: 6px; margin-left: 20px;">${mdParsed.replace(/^[•\-*]\s*/, "")}</li>`;
              return `<p style="margin-bottom: 12px; line-height: 1.6;">${mdParsed}</p>`;
            })
            .join("");

          htmlContent += `
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Structured Notes</h2>
            <div style="font-size: 14px;">${formattedSummary}</div>
          `;
        }

        // Add Flashcards directly to document if they exist
        if (selectedNote.flashcards && selectedNote.flashcards.length > 0) {
          htmlContent += `
            <div style="page-break-before: always;"></div>
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Practice Flashcards</h2>
          `;

          selectedNote.flashcards.forEach((card, index) => {
            htmlContent += `
              <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
                <p style="font-weight: bold; margin-bottom: 8px;"><span style="color: #4f46e5;">Q${index + 1}:</span> ${card.front}</p>
                <p><span style="color: #059669; font-weight: bold;">A${index + 1}:</span> ${card.back}</p>
              </div>
            `;
          });
        }

        // Add MCQs directly to document if they exist
        if (selectedNote.mcqs && selectedNote.mcqs.length > 0) {
          htmlContent += `
            <div style="page-break-before: always;"></div>
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Practice MCQs</h2>
          `;

          selectedNote.mcqs.forEach((mcq, index) => {
            const optionsHtml = (mcq.options || []).map(opt => `<li style="margin-bottom: 4px;">${opt}</li>`).join('');
            htmlContent += `
              <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
                <p style="font-weight: bold; margin-bottom: 8px;"><span style="color: #4f46e5;">Q${index + 1}:</span> ${mcq.question}</p>
                <ul style="margin-left: 20px; margin-bottom: 12px; font-size: 14px;">${optionsHtml}</ul>
                <p><span style="color: #059669; font-weight: bold;">Answer:</span> ${mcq.answer}</p>
              </div>
            `;
          });
        }

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
          validDiagrams = [
            { title: "Saved Flowchart", code: selectedNote.graph },
          ];
        }

        if (validDiagrams.length > 0) {
          htmlContent += `
            <div style="page-break-before: always;"></div>
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Diagrams (Mermaid Code)</h2>
          `;
          validDiagrams.forEach((diag) => {
            htmlContent += `
              <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${diag.title}</h3>
              <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; word-break: break-all;">${diag.code}</pre>
            `;
          });
        }

        container.innerHTML = htmlContent;

        const opt = {
          margin: 0.5,
          filename: `${safeTitle}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf()
          .set(opt)
          .from(container)
          .save()
          .then(() => {
            showToast("PDF Exported Successfully!");
          });

        return; // Exit here
      }

      // Generate the markdown content for standard exports
      const content = generateMarkdown(selectedNote);

      // Determine extension based on settings
      const isTxt =
        exportFormat === "txt" ||
        exportFormat === "text" ||
        exportFormat === "plaintext";
      const fileExtension = isTxt ? "txt" : "md";
      const mimeType = isTxt ? "text/plain" : "text/markdown";

      // Create a Blob containing the text data
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Create a hidden anchor tag to trigger the download
      const a = document.createElement("a");
      a.href = url;
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
  const hasMcqs =
    selectedNote.mcqs && selectedNote.mcqs.length > 0;

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

          {hasMcqs && (
            <button
              onClick={() => setActiveTab("mcqs")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === "mcqs" ? (isDarkMode ? "bg-indigo-600 text-white shadow-md" : "bg-indigo-500 text-white shadow-md") : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              <HelpCircle size={16} /> Practice MCQs
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
        ) : activeTab === "mcqs" ? (
          <div className="grid w-full h-full grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3">
            {selectedNote.mcqs.map((mcq, index) => (
              <MCQCard
                key={index}
                question={mcq.question}
                options={mcq.options || []}
                answer={mcq.answer}
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
