import React, { useState, useRef } from 'react';
import { generateDorks } from './services/geminiService';
import { DorkCategory, DorkCategoryResult, ALL_CATEGORIES, SearchPlatform } from './types';
import { CategorySelector } from './components/CategorySelector';
import { PlatformSelector } from './components/PlatformSelector';
import { DorkCard } from './components/DorkCard';
import { Search, Terminal, AlertTriangle, Loader2, Shield, Crosshair, Copy, FileJson, FileText, Table, Sparkles, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [target, setTarget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DorkCategory[]>(ALL_CATEGORIES);
  const [selectedPlatform, setSelectedPlatform] = useState<SearchPlatform>(SearchPlatform.GOOGLE);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DorkCategoryResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [smartSearch, setSmartSearch] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    if (!smartSearch && selectedCategories.length === 0) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateDorks(target, selectedCategories, selectedPlatform, smartSearch);
      setResults(data);
      // Smooth scroll to results after a short delay to allow rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to generate dorks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalDorks = results ? results.reduce((acc, cat) => acc + cat.dorks.length, 0) : 0;

  // Export Functions
  const exportData = (format: 'json' | 'csv' | 'txt') => {
    if (!results) return;
    
    let content = '';
    let mimeType = '';
    const filename = `omniscout_${target.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${selectedPlatform.toLowerCase()}_${new Date().toISOString().slice(0,10)}`;

    if (format === 'json') {
      content = JSON.stringify(results, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      content = 'Category,Intent,Platform,Description,Query\n';
      results.forEach(cat => {
        cat.dorks.forEach(dork => {
          // Escape quotes for CSV
          const safeQuery = dork.query.replace(/"/g, '""');
          const safeDesc = dork.description.replace(/"/g, '""');
          content += `"${cat.categoryName}","${dork.intent}","${selectedPlatform}","${safeDesc}","${safeQuery}"\n`;
        });
      });
      mimeType = 'text/csv';
    } else if (format === 'txt') {
      results.forEach(cat => {
        content += `=== ${cat.categoryName} ===\n`;
        cat.dorks.forEach(dork => {
          content += `[${dork.intent}] ${dork.description}\n${dork.query}\n\n`;
        });
        content += '-----------------------------------\n\n';
      });
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyAllDorks = () => {
    if (!results) return;
    const allQueries = results.flatMap(cat => cat.dorks.map(d => d.query)).join('\n');
    navigator.clipboard.writeText(allQueries);
    alert(`Copied ${totalDorks} queries to clipboard!`);
  };

  return (
    <div className="min-h-screen font-sans text-gray-200 matrix-bg pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-900/80 to-cyber-900 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Header */}
        <header className="mb-16 text-center relative">
          <div className="inline-flex items-center gap-4 mb-4 animate-pulse-fast">
             <Terminal className="text-cyber-neon" size={48} />
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
               OMNI<span className="text-cyber-neon">SCOUT</span> 360
             </h1>
          </div>
          <p className="text-cyber-400 font-mono text-lg max-w-3xl mx-auto mt-2 tracking-wide font-medium">
            ELITE RECONNAISSANCE & INTELLIGENCE GATHERING FRAMEWORK
          </p>
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-cyber-neon to-transparent mx-auto mt-8"></div>
        </header>

        {/* Input Section */}
        <div className="bg-cyber-800/80 backdrop-blur-md border border-cyber-700 rounded-xl p-8 md:p-10 shadow-2xl mb-16">
          <form onSubmit={handleGenerate}>
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                 <label htmlFor="target" className="block text-cyber-300 font-mono text-base uppercase tracking-widest font-bold">
                    {smartSearch ? 'Natural Language Intent' : 'Target Vector (Domain / IP)'}
                 </label>
                 
                 {/* Smart Search Toggle */}
                 <button
                    type="button"
                    onClick={() => setSmartSearch(!smartSearch)}
                    className={`
                      flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 font-mono text-sm
                      ${smartSearch 
                        ? 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                        : 'bg-cyber-900 border-cyber-700 text-gray-500 hover:text-gray-300'}
                    `}
                 >
                    <Brain size={16} className={smartSearch ? "animate-pulse" : ""} />
                    SMART SEARCH: {smartSearch ? 'ON' : 'OFF'}
                 </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                   {smartSearch ? (
                      <Sparkles className="text-cyber-warning animate-pulse" size={28} />
                   ) : (
                      <Search className="text-gray-500 group-focus-within:text-cyber-neon transition-colors" size={28} />
                   )}
                </div>
                <input
                  id="target"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={smartSearch 
                    ? "e.g., 'Find open cameras in Tokyo', 'Leaked admin credentials for Tesla'" 
                    : "e.g., tesla.com, 192.168.1.1"}
                  className={`
                    w-full bg-cyber-900 border text-white rounded-lg py-6 pl-16 pr-6 font-mono text-xl md:text-2xl focus:outline-none transition-all placeholder-gray-600 shadow-inner
                    ${smartSearch 
                      ? 'border-cyber-warning/50 focus:border-cyber-warning focus:ring-1 focus:ring-cyber-warning' 
                      : 'border-cyber-600 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon'}
                  `}
                />
              </div>
              {smartSearch && (
                <p className="mt-2 text-cyber-warning text-sm font-mono flex items-center gap-2">
                  <Sparkles size={12} /> AI will interpret your intent and auto-select relevant dorks.
                </p>
              )}
            </div>

            <div className="mb-10">
               <PlatformSelector selected={selectedPlatform} onChange={setSelectedPlatform} />
            </div>

            <div className={`mb-12 transition-all duration-500 ${smartSearch ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
               <h3 className="block text-cyber-300 font-mono text-base uppercase mb-4 tracking-widest font-bold flex items-center gap-2">
                 Select Scan Modules
                 {smartSearch && <span className="text-xs bg-cyber-warning text-cyber-900 px-2 py-0.5 rounded ml-2">AUTO-MANAGED BY AI</span>}
               </h3>
               <CategorySelector selected={selectedCategories} onChange={setSelectedCategories} />
            </div>

            <div className="flex justify-end pt-6 border-t border-cyber-700/50">
              <button
                type="submit"
                disabled={loading || !target.trim() || (!smartSearch && selectedCategories.length === 0)}
                className={`
                  relative overflow-hidden px-12 py-5 font-black font-mono tracking-widest uppercase rounded-md transition-all text-lg md:text-xl shadow-lg
                  ${loading || !target.trim() ? 'opacity-80 cursor-wait bg-gray-700 text-gray-400' : 
                    smartSearch 
                      ? 'bg-cyber-warning text-cyber-900 shadow-cyber-warning/20 hover:bg-white hover:shadow-[0_0_30px_rgba(255,174,0,0.6)] active:scale-95'
                      : 'bg-cyber-neon text-cyber-900 shadow-cyber-neon/20 hover:bg-white hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] active:scale-95'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center gap-4">
                    <Loader2 className="animate-spin" size={24} />
                    {smartSearch ? 'INTERPRETING INTENT...' : 'INITIALIZING AI RECON...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-4">
                    {smartSearch ? 'RUN SMART SCAN' : 'INITIATE SCAN'} 
                    {smartSearch ? <Brain size={24} /> : <Terminal size={24} />}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-xl flex items-center gap-6 text-red-200 mb-12 animate-pulse">
            <AlertTriangle size={40} />
            <div>
                <h4 className="font-bold text-red-100 text-lg uppercase tracking-wide mb-2">System Error</h4>
                <p className="text-lg font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div ref={resultsRef} className="space-y-16 animate-fade-in-up">
            
            {/* Results Toolbar */}
            <div className="bg-cyber-800/40 border border-cyber-700/50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-cyber-neon">///</span> SCAN RESULTS
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 font-mono">
                      TARGET: <span className="text-cyber-neon font-bold">{target}</span> | PLATFORM: <span className="text-cyber-warning font-bold">{selectedPlatform}</span> | MODE: <span className={smartSearch ? "text-cyber-warning font-bold" : "text-gray-400"}>{smartSearch ? 'SMART NLP' : 'STANDARD'}</span>
                  </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                 <button onClick={copyAllDorks} className="flex items-center gap-2 px-4 py-2 bg-cyber-700 hover:bg-cyber-600 rounded text-sm font-mono border border-cyber-600 transition-colors">
                    <Copy size={16} /> COPY ALL
                 </button>
                 <div className="w-px h-8 bg-cyber-600 mx-2 hidden md:block"></div>
                 <button onClick={() => exportData('json')} className="flex items-center gap-2 px-4 py-2 bg-cyber-900 hover:bg-cyber-800 rounded text-sm font-mono border border-cyber-700 hover:text-cyber-neon transition-colors">
                    <FileJson size={16} /> JSON
                 </button>
                 <button onClick={() => exportData('csv')} className="flex items-center gap-2 px-4 py-2 bg-cyber-900 hover:bg-cyber-800 rounded text-sm font-mono border border-cyber-700 hover:text-cyber-neon transition-colors">
                    <Table size={16} /> CSV
                 </button>
                 <button onClick={() => exportData('txt')} className="flex items-center gap-2 px-4 py-2 bg-cyber-900 hover:bg-cyber-800 rounded text-sm font-mono border border-cyber-700 hover:text-cyber-neon transition-colors">
                    <FileText size={16} /> TXT
                 </button>
              </div>
            </div>

            {/* Dork Lists */}
            {results.map((categoryResult) => (
              <div key={categoryResult.categoryName}>
                <h3 className="text-2xl font-mono text-cyber-300 mb-6 flex items-center gap-3 border-l-4 border-cyber-neon pl-4">
                  {categoryResult.categoryName}
                  <span className="text-sm bg-cyber-800 text-gray-400 px-2 py-1 rounded-full ml-2">
                    {categoryResult.dorks.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {categoryResult.dorks.map((dork, idx) => (
                    <DorkCard key={idx} dork={dork} platform={selectedPlatform} />
                  ))}
                </div>
              </div>
            ))}
            
            {results.length === 0 && !loading && (
              <div className="text-center py-32 text-gray-500 font-mono text-xl border border-dashed border-gray-700 rounded-xl">
                NO VECTORS FOUND FOR SELECTED PARAMETERS.
              </div>
            )}
          </div>
        )}
        
        {/* Footer info */}
        <div className="mt-32 text-center border-t border-cyber-800 pt-10 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex justify-center gap-8 mb-6">
                <Shield size={24} className="text-cyber-500" />
                <Crosshair size={24} className="text-cyber-500" />
            </div>
            <p className="text-cyber-600 text-sm font-mono uppercase tracking-wider font-semibold">
                OmniScout 360 &bull; Ethical Reconnaissance Only &bull; Use Responsibly
            </p>
        </div>
      </div>
    </div>
  );
};

export default App;