import React, { useState } from 'react';
import { Dork, SearchPlatform } from '../types';
import { Copy, ExternalLink, CheckCircle, Shield, Crosshair, Shuffle } from 'lucide-react';

interface DorkCardProps {
  dork: Dork;
  platform: SearchPlatform;
}

export const DorkCard: React.FC<DorkCardProps> = ({ dork, platform }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dork.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    let url = '';
    const q = encodeURIComponent(dork.query);

    switch (platform) {
      case SearchPlatform.GOOGLE:
        url = `https://www.google.com/search?q=${q}`;
        break;
      case SearchPlatform.BING:
        url = `https://www.bing.com/search?q=${q}`;
        break;
      case SearchPlatform.DUCKDUCKGO:
        url = `https://duckduckgo.com/?q=${q}`;
        break;
      case SearchPlatform.SHODAN:
        url = `https://www.shodan.io/search?query=${q}`;
        break;
      case SearchPlatform.GITHUB:
        url = `https://github.com/search?q=${q}&type=code`;
        break;
      case SearchPlatform.CENSYS:
        url = `https://search.censys.io/search?resource=hosts&q=${q}`;
        break;
      default:
        url = `https://www.google.com/search?q=${q}`;
    }
    
    window.open(url, '_blank');
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Offensive': return 'text-cyber-danger border-cyber-danger/30 bg-cyber-danger/10';
      case 'Defensive': return 'text-cyber-300 border-cyber-300/30 bg-cyber-300/10';
      default: return 'text-cyber-warning border-cyber-warning/30 bg-cyber-warning/10';
    }
  };
  
  const getIntentIcon = (intent: string) => {
     switch (intent) {
      case 'Offensive': return <Crosshair size={12} />;
      case 'Defensive': return <Shield size={12} />;
      default: return <Shuffle size={12} />;
    }
  };

  return (
    <div className="group relative bg-cyber-900 border border-cyber-700 hover:border-cyber-300/50 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,158,255,0.15)] flex flex-col h-full">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
           <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-cyber-900 bg-cyber-400 rounded-sm opacity-90">
            {dork.category}
          </span>
          {dork.intent && (
             <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-full border ${getIntentColor(dork.intent)}`}>
               {getIntentIcon(dork.intent)} {dork.intent}
             </span>
          )}
        </div>
        
        <div className="bg-cyber-800/50 p-5 rounded-md border border-cyber-800 mb-4 group-hover:border-cyber-600 transition-colors">
            <p className="font-mono text-cyber-neon text-lg md:text-xl break-all leading-relaxed select-all">
                {dork.query}
            </p>
        </div>

        <p className="text-gray-300 text-sm md:text-base font-sans mt-2 leading-relaxed">
          {dork.description}
        </p>
      </div>

      <div className="mt-6 flex gap-3 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-800 hover:bg-cyber-700 rounded-md text-sm font-mono text-gray-300 hover:text-white transition-colors border border-transparent hover:border-cyber-600"
        >
          {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-800 hover:bg-cyber-700 rounded-md text-sm font-mono text-gray-300 hover:text-white transition-colors border border-transparent hover:border-cyber-600"
        >
          <ExternalLink size={16} />
          OPEN {platform.toUpperCase()}
        </button>
      </div>
    </div>
  );
};