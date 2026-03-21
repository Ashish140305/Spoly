import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart, isDarkMode }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Initialize Mermaid safely
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      if (!chart) return;
      
      try {
        setError(false);
        
        // 2. Validate the syntax BEFORE trying to render it
        await mermaid.parse(chart);
        
        // 3. Render the diagram
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Spoly Mermaid Parse Error:", err);
        // 4. Catch the error so it doesn't crash the whole React app
        setError(true);
      }
    };

    renderDiagram();
  }, [chart, isDarkMode]);

  // If the AI generated bad code, show a graceful fallback instead of a blank screen/crash
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-3 bg-red-500/10 rounded-xl border border-red-500/20">
        <p className="text-red-500 font-bold text-sm">
          ⚠️ Diagram Generation Failed
        </p>
        <p className="text-slate-500 text-xs max-w-xs">
          The AI generated invalid Mermaid syntax. Try generating the notes again.
        </p>
        <pre className="text-left text-[10px] text-red-400 bg-black/50 p-2 rounded w-full overflow-x-auto mt-2">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex justify-center items-center overflow-auto"
    />
  );
}