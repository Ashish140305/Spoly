import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && chart) {
      mermaid.contentLoaded();
      mermaid.render(`mermaid-svg-${Date.now()}`, chart).then((result) => {
        ref.current.innerHTML = result.svg;
      });
    }
  }, [chart]);

  return <div className="flex justify-center my-4" ref={ref} />;
};

export default MermaidDiagram;