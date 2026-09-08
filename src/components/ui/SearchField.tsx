import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = 'खोजें... (विचार, संदेश, सामग्री)',
  onClear,
  onSubmit,
  className = '',
  autoFocus = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-[#5C6773] pointer-events-none flex items-center">
          <Search size={18} strokeWidth={2} />
        </span>

        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-[46px] pl-10 pr-10 bg-white border border-[#E8E5DF] rounded-xl text-[15px] text-[#1F2421] placeholder:text-[#8C96A3] focus:outline-none focus:border-[#16325C] focus:ring-2 focus:ring-[#16325C]/10 transition-all"
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="खोज साफ़ करें"
            className="absolute right-3 p-1 rounded-full text-[#8C96A3] hover:text-[#1F2421] hover:bg-[#F6F4EE] tap-active transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
