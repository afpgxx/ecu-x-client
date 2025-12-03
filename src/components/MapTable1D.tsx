import React, { useEffect, useRef , useState } from 'react';

interface MapTable1DProps {
  headers: number[]; // X轴值（例如 RPM）
  data: number[];    // 行数据值
  activeValue: number; // 当前高亮值（例如当前 RPM）
  xLabel: string;    // X轴标签
  yLabel: string;    // 行头标签
  colorMode?: 'heatmap' | 'dark'; // 颜色模式：热力图 或 深色统一样式
  onCellChange: (row: number, col: number, value: number) => void; // 可选的单元格变更回调
  min?: number;      // 最小值
  max?: number;      // 最大值
}

// Helper to map value to Heatmap Color (Blue -> Green -> Yellow -> Red)
const getHeatmapColor = (value: number, min: number, max: number) => {
  if (max === min) return 'hsl(120, 60%, 45%)'; // Default Green if flat data
  
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const hue = (1 - ratio) * 240; 
  return `hsl(${hue}, 85%, 60%)`; 
};

export const MapTable1D: React.FC<MapTable1DProps> = ({
  headers,
  data,
  activeValue,
  xLabel,
  yLabel,
  colorMode = 'heatmap',
  onCellChange,
  min = 0,
  max = 999.99, // Default max to a large number
}) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [, setOriginalValue] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find active column index based on closest value
  const activeColIndex = headers.reduce((prev, curr, i) => 
    Math.abs(curr - activeValue) < Math.abs(headers[prev] - activeValue) ? i : prev, 0
  );

  // Auto-scroll to active cell
  useEffect(() => {
    if (activeRef.current) {
      // Changed to 'auto' and 'nearest' to prevent jittering
      activeRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [activeColIndex]);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  return (
    <div className="flex flex-col w-full h-full select-none overflow-hidden theme-bg-panel-alt text-xs">
      
      {/* Header Row (X-Axis Labels) */}
      <div className="flex w-full theme-bg-header theme-border border-b">
        <div className="w-24 flex-shrink-0 p-1 flex items-center justify-center font-bold theme-bg-panel-alt theme-text-muted theme-border border-r">
          {xLabel}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {headers.map((val, i) => (
                <div 
                    key={i}
                    className={`flex-1 flex items-center justify-center font-bold transition-colors duration-150 last:border-0 theme-border border-r theme-text-primary ${
                      i === activeColIndex ? 'theme-bg-accent-blue' : 'theme-bg-header'
                    }`}
                >
                    {val}
                </div>
                ))}
            </div>
        </div>
      </div>

      {/* Data Row */}
      <div className="flex-1 flex overflow-y-auto scrollbar-thin">
        <div className="flex w-full h-12">
           
           {/* Row Label */}
            <div className="w-24 flex-shrink-0 flex items-center justify-center font-bold theme-bg-header theme-text-secondary theme-border border-r border-b">
              {yLabel}
           </div>

           {/* 数据单元格 */}
           <div className="flex-1 flex">
                {data.map((cellValue, i) => {
                const isActive = i === activeColIndex;
                const bg = colorMode === 'heatmap'
                  ? getHeatmapColor(cellValue, min, max)
                  : 'var(--bg-cell)';
                return (
                  <div
                    key={i}
                    ref={isActive ? activeRef : null}
                    className={`flex-1 flex items-center justify-center font-bold cursor-pointer theme-border border-r border-b relative ${
                      isActive ? 'z-10 shadow-lg' : ''
                    } ${colorMode === 'dark' ? 'theme-text-primary' : ''}`}
                    style={{
                      backgroundColor: bg,
                      color: colorMode === 'heatmap' ? '#000' : undefined,
                      fontSize: 'var(--text-xs)'
                    }}
                    onClick={() => {
                      setEditingIndex(i);
                      setInputValue(cellValue.toString());
                      setOriginalValue(cellValue);
                    }}
                  >
                    {isActive && <div className="absolute inset-0 border-2 border-white pointer-events-none"></div>}
                    {editingIndex === i ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={() => {
                          let val = parseFloat(inputValue);
                          if (isNaN(val)) val = cellValue;
                          if (min !== undefined) val = Math.max(min, val);
                          if (max !== undefined) val = Math.min(max, val);
                          onCellChange(0, i, val);
                          setEditingIndex(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            let val = parseFloat(inputValue);
                            if (isNaN(val)) val = cellValue;
                            if (min !== undefined) val = Math.max(min, val);
                            if (max !== undefined) val = Math.min(max, val);
                            onCellChange(0, i, val);
                            setEditingIndex(null);
                          } else if (e.key === 'Escape') {
                            // 按ESC时不保存，直接退出编辑
                            setEditingIndex(null);
                          }
                        }}
                        className="w-full h-full px-2 py-0.5 rounded-md border-2 border-blue-500 focus:border-orange-500 text-right text-base font-mono text-blue-200 shadow-inner outline-none transition-all duration-150 select-all ring-0 focus:bg-[#23272e] focus:text-white-300"
                        style={{ fontSize : 10, backgroundColor: bg, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
                      />
                    ) : (
                      cellValue.toFixed(2)
                    )}
                  </div>
                );
              })}
           </div>
        </div>
        
          {/* 空白填充区 */}
          <div className="flex-1 theme-bg-panel-alt"></div>
      </div>
    </div>
  );
};