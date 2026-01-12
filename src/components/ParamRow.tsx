import React, { useState } from 'react';

interface ParamRowProps {
  label?: string;
  value: string | number;
  unit?: string;
  highlighted?: boolean;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  decimals?: number;
}

export const ParamRow: React.FC<ParamRowProps> = ({ 
  label, 
  value, 
  unit, 
  highlighted = true, 
  onChange,
  min = 0,
  max = 99999,
  decimals = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed)) {
        // 非法输入，恢复原值
        setInputValue(value.toString());
        setError(false);
        return;
      }
      // 限制在min-max范围内
      let validValue = Math.max(min, Math.min(max, parsed));
      validValue = Number(validValue.toFixed(decimals));
      setInputValue(validValue.toString());
      onChange(validValue);
      setError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
      setError(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 5) return;
    setInputValue(val);
    // 实时验证
    const parsed = parseFloat(val);
    if (val !== '' && (isNaN(parsed) || parsed < min || parsed > max)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-700 last:border-0 h-8 text-sm">
      {label && <div className="flex-[2] px-2 text-gray-400 font-medium truncate border-r border-gray-700 h-full flex items-center justify-end bg-[#2d323a]" title={label}>{label}</div>}
      <div 
        className={`flex-1 px-2 font-mono font-bold h-full flex items-center justify-center cursor-pointer ${
          error ? 'bg-red-900/30 text-red-400 ring-1 ring-red-500' : 
          highlighted ? 'bg-[#111316] text-white' : 'text-gray-300 bg-[#1f2329]'
        }`}
        onClick={() => highlighted && setIsEditing(true)}
        title={error ? `请输入 ${min} 到 ${max} 之间的数字` : undefined}
      >
         {isEditing && highlighted ? (
           <input 
             autoFocus
             type="text"
             className={`w-full h-full bg-transparent text-center outline-none ${
               error ? 'text-red-400' : 'text-white'
             }`}
             value={inputValue}
             onChange={handleInputChange}
             onBlur={handleBlur}
             onKeyDown={handleKeyDown}
             onFocus={(e) => e.target.select()}
           />
         ) : (
           typeof value === 'number' ? value.toFixed(decimals) : value
         )}
      </div>
      {unit !== undefined && <div className="w-16 text-center text-gray-500 font-medium border-l border-gray-700 h-full flex items-center justify-center bg-[#2d323a]">{unit}</div>}
    </div>
  );
};
