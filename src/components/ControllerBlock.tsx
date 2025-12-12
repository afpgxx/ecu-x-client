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
      className="flex flex-col items-center h-full py-2 select-none"
      onWheel={handleWheel}
    >
      {/* Top Button */}
      <button 
        onClick={handleIncrement}
        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#6b7280] to-[#374151] hover:from-[#7f8896] hover:to-[#4b5563] flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform border border-gray-600 mb-2"
      >
        <Plus size={12} strokeWidth={3} />
      </button>

      {/* Digital Screen */}
      <div className="flex-1 w-full bg-[#b8bcbf] rounded border-1 border-[#1f2937] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden mx-1 min-h-[72px]">
        <div className="flex items-baseline z-0 w-full justify-center px-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="font-digital text-black tracking-normal bg-transparent border-none outline-none text-center w-full"
              style={{ fontSize: 'clamp(3.5rem, 3vw, 2.5rem)' }}
              autoFocus
            />
          ) : (
            <span 
                className="font-digital text-black tracking-normal cursor-pointer w-full text-center"
                style={{ fontSize: 'clamp(1.5rem, 10vw, 2.5rem)' }}
                onClick={() => setIsEditing(true)}
            >
              {unit === '%' ? (value >= 0 ? '+' : '') : ''}{value.toFixed(decimals)}
            </span>
          )}
          {unit && !isEditing && <span className="text-gray-800 text-[10px] font-bold absolute top-0.5 right-1 font-sans">{unit}</span>}
        </div>
      </div>

      {/* Bottom Button */}
      <button 
        onClick={handleDecrement}
        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#6b7280] to-[#374151] hover:from-[#7f8896] hover:to-[#4b5563] flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform border border-gray-600 mt-2"
      >
        <Minus size={12} strokeWidth={3} />
      </button>

      {/* Label */}
      <div className="text-[12px] text-gray-300 font-bold mt-2 text-center leading-none">{label}</div>
    </div>
  );
};
