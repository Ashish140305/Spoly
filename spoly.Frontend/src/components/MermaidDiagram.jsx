import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart, isDarkMode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chart) return;

    // Reset mermaid to avoid configuration collisions during re-renders
    mermaid.mermaidAPI.reset();

    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "base" : "default",
      themeVariables: isDarkMode
        ? {
            primaryColor: "#1e293b", // Slate-800 for nodes
            primaryTextColor: "#f8fafc", // Crisp white text
            primaryBorderColor: "#3b82f6", // Blue-500 borders
            lineColor: "#64748b", // Slate-500 arrows/lines
            secondaryColor: "#0f172a", // Slate-900 backgrounds
            tertiaryColor: "#1e293b", // Slate-800 accents
            fontFamily: "'Plus Jakarta Sans', sans-serif", // 🌟 FIX: Explicit font declaration
          }
        : {
            fontFamily: "'Plus Jakarta Sans', sans-serif", // 🌟 FIX: Explicit font declaration
          },
      // 🌟 FIX: Force extra padding inside every node so text never clips
      flowchart: {
        htmlLabels: true,
        padding: 20,
      },
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          const uniqueId = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(uniqueId, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          containerRef.current.innerHTML = `<p class="text-red-500 text-sm font-bold">Failed to render diagram. Check syntax.</p>`;
        }
      }
    };

    renderDiagram();
  }, [chart, isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center overflow-x-auto custom-scrollbar p-4"
    />
  );
}
