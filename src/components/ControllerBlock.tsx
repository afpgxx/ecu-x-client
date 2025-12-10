import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';

interface ControllerBlockProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  decimals?: number;
  min?: number;
  max?: number;
}

export const ControllerBlock: React.FC<ControllerBlockProps> = ({ 
  label, 
  value, 
  onChange, 
  unit = '', 
  step = 1, 
  decimals = 0,
  min,
  max
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toFixed(decimals));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toFixed(decimals));
  }, [value, decimals]);

  const handleIncrement = () => {
    const newVal = value + step;
    if (max === undefined || newVal <= max) {
      onChange(Number(newVal.toFixed(decimals)));
    }
  };

  const handleDecrement = () => {
    const newVal = value - step;
    if (min === undefined || newVal >= min) {
      onChange(Number(newVal.toFixed(decimals)));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleIncrement();
    } else {
      handleDecrement();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      let newVal = parsed;
      if (min !== undefined) newVal = Math.max(min, newVal);
      if (max !== undefined) newVal = Math.min(max, newVal);
      onChange(Number(newVal.toFixed(decimals)));
    } else {
      setInputValue(value.toFixed(decimals));
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toFixed(decimals));
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="bg-[#0d0f11] rounded border border-gray-700 relative p-1.5 flex flex-col overflow-hidden"
      onWheel={handleWheel}
    >
      <div className="flex justify-between items-center mb-1 absolute top-1 right-1 left-1 px-1 z-10">
        <button 
          onClick={handleIncrement}
          className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600"
        >
          <Plus size={8} />
        </button>
        <button 
          onClick={handleDecrement}
          className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600"
        >
          <Minus size={8} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center pt-0">
        <div className="flex items-baseline translate-y-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="font-digital text-gray-200 tracking-tighter bg-transparent border-none outline-none text-center"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', width: 'clamp(6rem, 12vw, 8rem)' }}
              autoFocus
            />
          ) : (
            <span 
                className="font-digital text-gray-200 tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] cursor-pointer"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}
                onClick={() => setIsEditing(true)}
            >
              {unit === '%' ? (value >= 0 ? '+' : '') : ''}{value.toFixed(decimals)}
            </span>
          )}
          {unit && !isEditing && <span className="text-gray-500 text-[9px] font-bold ml-1">{unit}</span>}
        </div>
      </div>
      <div className="text-center text-[11px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-0 pb-0.5 truncate">{label}</div>
    </div>
  );
};
