import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface DropDownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value) || null;

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={`inline-flex w-full justify-between items-center gap-x-1.5 rounded-md px-3 py-3 text-sm font-medium text-white shadow-xs ring-1 ring-inset ring-gray-600 hover:bg-custom-hover transition-colors ${
            isOpen ? 'ring-white' : ''
          }`}
          onClick={toggleDropdown}
          aria-expanded="true"
          aria-haspopup="true"
          id="dropdown-button"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown 
            className={`-mr-1 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        className={`absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-custom-dark shadow-lg ring-1 ring-gray-700 focus:outline-none ${
          isOpen
            ? 'transition ease-out duration-100 transform opacity-100 scale-100'
            : 'transition ease-in duration-75 transform opacity-0 scale-95 pointer-events-none'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdown-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {options.map((option) => (
            <button
              key={option.value}
              className={`block w-full px-4 py-2 text-left text-sm ${
                value === option.value
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-custom-hover'
              }`}
              role="menuitem"
              tabIndex={-1}
              onClick={() => handleOptionClick(option.value)}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 text-blue-400" aria-hidden="true" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropDown;