import React, { useState } from 'react';
import { Mic, Square, Download, Image as ImageIcon } from 'lucide-react';
import MermaidDiagram from '../components/MermaidDiagram';

const LiveNotes = () => {
  const [isRecording, setIsRecording] = useState(false);
  
  // Dummy data to simulate the live incoming structure
  const [transcript, setTranscript] = useState("We need to implement a microservices architecture. First, the client sends a request to the API Gateway. Then, the API Gateway routes it to the Auth Service for validation...");
  const [structuredNotes, setStructuredNotes] = useState([
    { title: "System Architecture Update", points: ["Move to Microservices", "Use API Gateway for routing", "Auth Service handles validation"] }
  ]);
  
  const sampleMermaid = `
    graph TD;
      Client-->API_Gateway;
      API_Gateway-->Auth_Service;
      Auth_Service-->Database;
  `;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Left Panel: Controls & Raw Transcript */}
      <div className="w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Live Meeting</h2>
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
              isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Live Transcript</h3>
          <p className="text-gray-700 leading-relaxed">
            {transcript}
            {isRecording && <span className="animate-pulse ml-1 text-blue-500">▋</span>}
          </p>
        </div>
      </div>

      {/* Right Panel: Structured Notes & Diagrams (Inspired by Lecture2Note Layouts) */}
      <div className="w-2/3 p-6 overflow-y-auto bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Structured Notes</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium">
            <Download size={16} /> Export PDF
          </button>
        </div>

        <div className="space-y-6">
          {/* Notes Block */}
          {structuredNotes.map((note, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">{note.title}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {note.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Diagram Block */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <ImageIcon size={18} className="text-blue-500"/>
                <h3 className="text-lg font-bold text-gray-900">Generated Flowchart</h3>
             </div>
             <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4">
               <MermaidDiagram chart={sampleMermaid} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNotes;