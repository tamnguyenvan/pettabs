import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  key: string;
  name: string;
}

interface ZenDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
}

const ZenDropdown: React.FC<ZenDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-xs font-medium mb-1 text-white/80">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 pr-10 
              focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all appearance-none 
              cursor-pointer text-white
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/15'}
          `}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.key} value={option.key} className="bg-gray-800 text-white">
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};

export default ZenDropdown;
