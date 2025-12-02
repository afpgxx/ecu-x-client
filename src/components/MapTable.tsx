import React, { useState, useEffect, useRef } from 'react';

interface MapTableProps {
  rpmPoints: number[];
  loadPoints: number[]; // This represents the Y-axis rows (could be Load, TPS, or Temp)
  data: number[][];
  activeRpm: number;
  activeLoad: number; // This represents the Y-axis active value
  yAxisUnit?: string; // e.g., "%", "kPa", "°C"
  cornerLabel?: string; // e.g., "负荷/转速"
  decimals?: number; // 小数点位数，默认为1
  value: number; // 默认为0
  min?: number;
  max?: number;
  onCellChange: (row: number, col: number, newValue: number) => void;
}

// Helper to map value to Heatmap Color (Blue -> Green -> Yellow -> Red)
const getHeatmapColor = (value: number, min: number, max: number) => {
  // Handle flat data (min === max) to avoid division by zero or weird colors
  if (min === max) return 'hsl(220, 70%, 85%)'; // A pleasant light blue/purple for uniform data

  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  // Hue mapping: Blue(240) -> Cyan(180) -> Green(120) -> Yellow(60) -> Red(0)
  // We map 240 (Low) to 0 (High)
  const hue = (1 - ratio) * 240; 
  return `hsl(${hue}, 85%, 60%)`; 
};

export const MapTable: React.FC<MapTableProps> = ({
  rpmPoints,
  loadPoints,
  data,
  activeRpm,
  activeLoad,
  yAxisUnit = '%',
  cornerLabel = '负荷/转速',
  decimals = 1,
  value = 0,
  min = 0,
  max = 16,
  onCellChange,
}) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);

  useEffect(() => {
    setInputValue((value ?? 0).toFixed(decimals));
  }, [value, decimals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      let newVal = parsed;
      if (min !== undefined) newVal = Math.max(min, newVal);
      if (max !== undefined) newVal = Math.min(max, newVal);
      setInputValue(newVal.toFixed(decimals));
    } else {
      setInputValue(value.toFixed(decimals));
    }
    onCellChange(editingCell!.row, editingCell!.col, parseFloat(inputValue));
    setEditingCell(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toFixed(decimals));
      onCellChange(editingCell!.row, editingCell!.col, parseFloat(inputValue));
      setEditingCell(null);
    }
  };
  // Find closest indices for highlighting
  // For RPM (X-axis)
  const activeColIndex = rpmPoints.reduce((prev, curr, i) => 
    Math.abs(curr - activeRpm) < Math.abs(rpmPoints[prev] - activeRpm) ? i : prev, 0
  );

  // For Y-axis (Load/Temp/etc)
  const activeRowIndex = loadPoints.reduce((prev, curr, i) => 
    Math.abs(curr - activeLoad) < Math.abs(loadPoints[prev] - activeLoad) ? i : prev, 0
  );

  // Calculate Min/Max for color scaling across the entire dataset
  let minVal = Number.MAX_VALUE;
  let maxVal = Number.MIN_VALUE;
  
  for(let r=0; r<data.length; r++) {
    for(let c=0; c<data[r].length; c++) {
        const v = data[r][c];
        if(v < minVal) minVal = v;
        if(v > maxVal) maxVal = v;
    }
  }
  
  // If grid is empty or invalid
  if (minVal === Number.MAX_VALUE) {
     minVal = 0; 
     maxVal = 0;
  }

  // Auto-scroll logic
  useEffect(() => {
    if (activeRef.current) {
      // Changed to 'auto' and 'nearest' to prevent jittering/shaking during rapid updates
      activeRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [activeRowIndex, activeColIndex]);

  // Focus input when editingCell changes
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 text-[11px] select-none overflow-hidden font-mono">
      
      {/* Header Row (X-Axis / RPM) */}
      <div className="flex w-full border-b border-gray-700 bg-gray-800">
        {/* Corner Label */}
        <div className="w-16 flex-shrink-0 p-1 flex items-center justify-center border-r border-gray-700 bg-gray-900 text-gray-500 font-bold text-[10px] leading-tight text-center">
          {cornerLabel}
        </div>
        
        {/* X-Axis Values */}
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {rpmPoints.map((rpm, i) => (
                <div 
                    key={i} 
                    className={`flex-1 min-w-[42px] flex items-center justify-center font-bold transition-colors duration-150 border-r border-gray-700 last:border-0
                    ${i === activeColIndex ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                    {rpm}
                </div>
                ))}
            </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden scrollbar-thin">
        
        {/* Y-Axis Column */}
        <div className="flex flex-col w-16 flex-shrink-0 border-r border-gray-700 bg-gray-800">
          {loadPoints.map((val, i) => (
            <div 
              key={i} 
              className={`flex-1 min-h-[24px] flex items-center justify-center font-bold transition-colors duration-150 border-b border-gray-700 text-[10px]
              ${i === activeRowIndex ? 'bg-red-600 text-white' : 'text-gray-400'}`}
            >
              {val}{yAxisUnit}
            </div>
          ))}
        </div>

        {/* Data Grid */}
        <div className="flex-1 flex flex-col w-full">
           {data.map((row, rIdx) => (
             <div key={rIdx} className="flex-1 flex min-h-[24px]">
                {row.map((cellValue, cIdx) => {
                    const isActive = rIdx === activeRowIndex && cIdx === activeColIndex;
                    const bg = getHeatmapColor(cellValue, minVal, maxVal);
                    
                    return (
                        <div
                            key={cIdx}
                            ref={isActive ? activeRef : null}
                            className={`flex-1 min-w-[42px] flex items-center justify-center text-gray-900 font-bold border-r border-b border-black/10 cursor-pointer relative
                            ${isActive ? 'z-10' : 'opacity-90 hover:opacity-100'}`}
                            style={{ backgroundColor: bg }}
                        >
                            {/* Active Selection Highlight Border */}
                            {isActive && <div className="absolute inset-0 border-2 border-white pointer-events-none shadow-lg"></div>}
                            {editingCell && editingCell.row === rIdx && editingCell.col === cIdx ? (
                              <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyDown={handleInputKeyDown}
                                autoFocus
                                className="w-full h-full px-2 py-0.5 rounded-md border-2 border-blue-500 focus:border-orange-500 text-right text-base font-mono text-blue-200 shadow-inner outline-none transition-all duration-150 select-all ring-0 focus:bg-[#23272e] focus:text-orange-300"
                                style={{ fontSize: 12, color: 'black', minWidth: 42, textAlign: 'center', fontVariantNumeric: 'tabular-nums', backgroundColor: bg }}
                              />
                          ) : (
                            <span 
                              className={`flex-1 min-w-[42px] flex items-center justify-center text-gray-900 font-bold border-r border-black/10 cursor-pointer relative
                                ${isActive ? 'z-10' : 'opacity-90 hover:opacity-100'}`}
                              style={{ fontSize: 12 }}
                              onClick={() => {
                                setEditingCell({ row: rIdx, col: cIdx });
                                setInputValue(cellValue.toFixed(decimals));
                              }}
                            >
                              {cellValue.toFixed(decimals)}
                            </span>
                          )}
                        </div>
                    );
                })}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};