import React from 'react';
import { DorkCategory, ALL_CATEGORIES } from '../types';
import { Check, Shield, ShieldAlert, Database, FileText, Lock, Server, Wifi, Code, Cloud, Terminal, Cpu, Zap } from 'lucide-react';

interface CategorySelectorProps {
  selected: DorkCategory[];
  onChange: (categories: DorkCategory[]) => void;
}

const CATEGORY_ICONS: Record<DorkCategory, React.ReactNode> = {
  [DorkCategory.INDEX]: <FileText size={20} />,
  [DorkCategory.DIRECTORY]: <Server size={20} />,
  [DorkCategory.LOGIN]: <Lock size={20} />,
  [DorkCategory.SQL]: <Database size={20} />,
  [DorkCategory.SENSITIVE]: <ShieldAlert size={20} />,
  [DorkCategory.ADMIN]: <Shield size={20} />,
  [DorkCategory.BACKUP]: <FileText size={20} />,
  [DorkCategory.DEVICES]: <Wifi size={20} />,
  [DorkCategory.CODE]: <Code size={20} />,
  [DorkCategory.CLOUD]: <Cloud size={20} />,
  [DorkCategory.PARAMETERS]: <Terminal size={20} />,
  [DorkCategory.TECH]: <Cpu size={20} />,
  [DorkCategory.CUSTOM]: <Zap size={20} />,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onChange }) => {
  
  const toggleCategory = (category: DorkCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter(c => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  const selectAll = () => onChange(ALL_CATEGORIES);
  const clearAll = () => onChange([]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-cyber-300 font-mono text-base uppercase tracking-wider font-bold">Target Vectors</h3>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={selectAll}
            className="text-sm text-cyber-400 hover:text-cyber-neon transition-colors font-mono font-medium"
          >
            [SELECT ALL]
          </button>
          <button 
            type="button"
            onClick={clearAll}
            className="text-sm text-cyber-400 hover:text-cyber-danger transition-colors font-mono font-medium"
          >
            [CLEAR]
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat);
          return (
            <button
              type="button"
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                relative group flex items-center gap-4 p-4 text-left transition-all duration-200 border rounded-md
                ${isSelected 
                  ? 'bg-cyber-600/30 border-cyber-neon text-cyber-neon shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                  : 'bg-cyber-800/50 border-cyber-700 text-gray-400 hover:border-cyber-400 hover:text-gray-200'}
              `}
            >
              <div className={`
                ${isSelected ? 'text-cyber-neon' : 'text-gray-500 group-hover:text-gray-300'}
              `}>
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="font-mono text-sm md:text-base font-semibold tracking-wide">{cat}</span>
              {isSelected && (
                <div className="absolute top-1.5 right-1.5">
                  <div className="w-2 h-2 bg-cyber-neon rounded-full shadow-[0_0_8px_#00f0ff]"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};