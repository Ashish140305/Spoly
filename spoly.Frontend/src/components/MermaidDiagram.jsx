import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart, isDarkMode }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Initialize Mermaid with a CUSTOM Dark Theme matching your UI
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default", // 🚀 Enforced dark mode logic
      themeVariables: isDarkMode ? {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        // Base Colors
        background: "transparent",
        primaryColor: "#1e293b",       // Slate 800 (Node background)
        primaryTextColor: "#f8fafc",   // Slate 50 (Node text)
        primaryBorderColor: "#6366f1", // Indigo 500 (Node border)
        lineColor: "#818cf8",          // Slate 500 (Arrows and lines)
        secondaryColor: "#0f172a",     // Slate 900
        tertiaryColor: "#334155",      // Slate 700
        textColor: "#ffffff",
        
        // Flowchart Specific
        nodeBorder: "#6366f1",
        mainBkg: "#1e293b",
        
        // Sequence Diagram Specific
        actorBkg: "#1e293b",
        actorBorder: "#6366f1",
        actorTextColor: "#f8fafc",
        signalColor: "#94a3b8",        // Slate 400
        signalTextColor: "#e2e8f0",    // Slate 200
        noteBkg: "#334155",
        noteBorder: "#475569",
        noteTextColor: "#f8fafc",
        
        // Mindmap Specific (Beautiful branch colors)
        c1: "#3b82f6", // Blue 500
        c2: "#10b981", // Emerald 500
        c3: "#8b5cf6", // Violet 500
        c4: "#f59e0b", // Amber 500
        c5: "#ec4899", // Pink 500
        
        // ER Diagram Specific
        entityBkg: "#1e293b",
        entityBorder: "#6366f1",
        attributeBkgOdd: "#0f172a",
        attributeBkgEven: "#1e293b",
      } : {
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      },

      // 🚀 NUCLEAR CSS OVERRIDE: Kills black nodes and forces visible arrows
      themeCSS: isDarkMode ? `
        /* --- FLOWCHART --- */
        .edgePath .path { stroke: #818cf8 !important; stroke-width: 2.5px !important; fill: none !important; }
        .marker { fill: #818cf8 !important; stroke: #818cf8 !important; }
        .edgeLabel { background-color: #0f172a !important; color: #ffffff !important; font-weight: 600; padding: 4px; border-radius: 4px; }
        
        /* --- MINDMAP (THE BLACK NODE KILLER) --- */
        .mindmap-edges path { stroke: #818cf8 !important; stroke-width: 3px !important; fill: none !important; }
        g[class^="mindmap-node"] * {
            fill: #1e293b !important; 
            stroke: #818cf8 !important; 
            stroke-width: 2px !important; 
        }
        g[class^="mindmap-node"] text { 
            fill: #ffffff !important; 
            stroke: none !important; 
            font-weight: 600 !important; 
        }

        /* --- SEQUENCE DIAGRAM --- */
        .messageLine0, .messageLine1 { stroke: #818cf8 !important; stroke-width: 2px !important; fill: none !important; }
        #arrowhead { fill: #818cf8 !important; }
        .actor { fill: #1e293b !important; stroke: #818cf8 !important; stroke-width: 2px !important; }
        .actor-man line, .actor-man circle { stroke: #818cf8 !important; fill: #1e293b !important; }
        .messageText { fill: #ffffff !important; stroke: none !important; font-weight: 500; }
        
        /* --- TIMELINE --- */
        .timeline-node { fill: #1e293b !important; stroke: #818cf8 !important; stroke-width: 2px !important; }
        .timeline-edge { stroke: #818cf8 !important; stroke-width: 3px !important; fill: none !important;}
      ` : "",
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      if (!chart) return;
      
      try {
        setError(false);
        await mermaid.parse(chart);
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Spoly Mermaid Parse Error:", err);
        setError(true);
      }
    };

    renderDiagram();
  }, [chart, isDarkMode]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center bg-red-500/5 rounded-xl border border-red-500/20">
        <p className="text-red-400 font-bold text-sm">Diagram Syntax Error</p>
        <code className="text-[10px] text-slate-500 mt-2 block break-all">{chart.substring(0, 100)}...</code>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-auto p-8 [&>svg]:block [&>svg]:m-auto [&>svg]:max-w-full"
    />
  );
}