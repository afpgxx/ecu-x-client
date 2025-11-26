import React, { useState } from 'react';

interface ParamRowProps {
  label?: string;
  value: string | number;
  unit?: string;
  highlighted?: boolean;
  onChange?: (val: string) => void;
}

export const ParamRow: React.FC<ParamRowProps> = ({ label, value, unit, highlighted = true, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) onChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center border-b border-gray-700 last:border-0 h-8 text-xs">
      {label && <div className="flex-[2] px-2 text-gray-400 font-medium truncate border-r border-gray-700 h-full flex items-center justify-end bg-[#2d323a]">{label}</div>}
      <div 
        className={`flex-1 px-2 font-mono font-bold h-full flex items-center justify-center cursor-pointer ${highlighted ? 'bg-[#111316] text-white' : 'text-gray-300 bg-[#1f2329]'}`}
        onClick={() => highlighted && setIsEditing(true)}
      >
         {isEditing && highlighted ? (
           <input 
             autoFocus
             className="w-full h-full bg-transparent text-center outline-none text-white"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onBlur={handleBlur}
             onKeyDown={handleKeyDown}
           />
         ) : (
           value
         )}
      </div>
      {unit !== undefined && <div className="w-16 text-center text-gray-500 font-medium border-l border-gray-700 h-full flex items-center justify-center bg-[#2d323a]">{unit}</div>}
    </div>
  );
};
