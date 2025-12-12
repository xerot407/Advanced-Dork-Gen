import React from 'react';
import { SearchPlatform } from '../types';
import { Globe, Search, Github, Radio, Server, Fingerprint } from 'lucide-react';

interface PlatformSelectorProps {
  selected: SearchPlatform;
  onChange: (platform: SearchPlatform) => void;
}

const PLATFORM_ICONS: Record<SearchPlatform, React.ReactNode> = {
  [SearchPlatform.GOOGLE]: <Search size={18} />,
  [SearchPlatform.BING]: <Globe size={18} />,
  [SearchPlatform.DUCKDUCKGO]: <Fingerprint size={18} />,
  [SearchPlatform.SHODAN]: <Radio size={18} />,
  [SearchPlatform.GITHUB]: <Github size={18} />,
  [SearchPlatform.CENSYS]: <Server size={18} />,
};

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-cyber-300 font-mono text-base uppercase tracking-wider font-bold">Intelligence Source</h3>
      <div className="flex flex-wrap gap-4">
        {Object.values(SearchPlatform).map((platform) => {
          const isSelected = selected === platform;
          return (
            <button
              type="button"
              key={platform}
              onClick={() => onChange(platform)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-md font-mono text-sm md:text-base font-bold tracking-wide transition-all duration-200 border
                ${isSelected 
                  ? 'bg-cyber-600 border-cyber-neon text-cyber-neon shadow-[0_0_15px_rgba(0,240,255,0.2)] scale-105' 
                  : 'bg-cyber-900 border-cyber-700 text-gray-500 hover:border-cyber-400 hover:text-gray-300'}
              `}
            >
              {PLATFORM_ICONS[platform]}
              {platform.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
};