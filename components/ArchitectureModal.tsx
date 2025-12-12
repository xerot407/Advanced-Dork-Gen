import React from 'react';
import { X, Cpu, Database, Globe, Shield, ArrowRight, Code, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Globe className="text-cyber-neon" size={24} />,
      title: "1. Vector Acquisition",
      desc: "Target domain & scan categories are captured from the UI."
    },
    {
      icon: <Code className="text-cyber-warning" size={24} />,
      title: "2. Context Construction",
      desc: "Engine constructs a 'God-Mode' prompt, enforcing complex operator usage and specific exclusions."
    },
    {
      icon: <Cpu className="text-cyber-danger" size={24} />,
      title: "3. Neural Processing",
      desc: "Payload sent to Gemini 2.5 Flash. AI simulates an offensive engineer to hypothesize vulnerability paths."
    },
    {
      icon: <Layers className="text-cyber-300" size={24} />,
      title: "4. Data Sanitization",
      desc: "Raw output is scrubbed of Markdown using Regex and validated against the JSON schema."
    },
    {
      icon: <Database className="text-cyber-success" size={24} />,
      title: "5. Intel Rendering",
      desc: "Structured intelligence is mapped to React components with intent classification."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cyber-900/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-cyber-800 border border-cyber-600 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-cyber-700 bg-cyber-900/50">
          <div className="flex items-center gap-3">
            <Shield className="text-cyber-neon" size={24} />
            <h2 className="text-2xl font-mono font-bold text-white tracking-wider">SYSTEM ARCHITECTURE</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-matrix-pattern">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            
            {/* Flowchart */}
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-cyber-700 md:hidden"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 relative">
                {/* Connecting Line for Desktop */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyber-700 -z-10 hidden md:block transform -translate-y-1/2"></div>

                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex md:flex-col items-center gap-4 md:gap-4 w-full md:w-1/5 bg-cyber-800/80 md:bg-transparent p-4 md:p-0 rounded-lg border border-cyber-700/50 md:border-none z-10">
                    <div className="w-12 h-12 rounded-full bg-cyber-900 border-2 border-cyber-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 group hover:border-cyber-neon transition-colors duration-300">
                      {step.icon}
                    </div>
                    <div className="md:text-center">
                      <h3 className="font-mono text-cyber-neon font-bold text-sm uppercase mb-1">{step.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical details box */}
            <div className="mt-8 p-6 bg-cyber-900/50 rounded-lg border border-cyber-700/50 font-mono text-sm text-gray-400">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Code size={16} /> CORE_LOGIC :: geminiService.ts
              </h3>
              <p className="mb-2">
                <span className="text-purple-400">const</span> <span className="text-blue-400">generateDorks</span> = <span className="text-purple-400">async</span> (target, categories) ={'>'} {'{'}
              </p>
              <div className="pl-4 border-l border-gray-700 space-y-1">
                <p>1. <span className="text-green-400">Construct_Prompt</span>(Role="Offensive Engineer", Constraints="No Basic Dorks");</p>
                <p>2. <span className="text-yellow-400">await</span> genAI.generateContent(<span className="text-orange-400">"gemini-2.5-flash"</span>, payload);</p>
                <p>3. <span className="text-blue-400">cleanJsonOutput</span>(response.text); <span className="text-gray-500">// Regex Strip Markdown</span></p>
                <p>4. <span className="text-purple-400">return</span> JSON.<span className="text-blue-400">parse</span>(sanitizedData);</p>
              </div>
              <p className="mt-2">{'}'}</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cyber-900 border-t border-cyber-700 text-center">
          <p className="text-xs text-cyber-500 font-mono">PROCESS EXECUTION TIME: ~1.2s - 2.5s</p>
        </div>
      </div>
    </div>
  );
};