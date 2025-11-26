import React, { useEffect, useRef } from 'react';

interface MapTable1DProps {
  headers: number[]; // X轴值（例如 RPM）
  data: number[];    // 行数据值
  activeValue: number; // 当前高亮值（例如当前 RPM）
  xLabel: string;    // X轴标签
  yLabel: string;    // 行头标签
  colorMode?: 'heatmap' | 'dark'; // 颜色模式：热力图 或 深色统一样式
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
  colorMode = 'heatmap'
}) => {
  const activeRef = useRef<HTMLDivElement>(null);

  // Find active column index based on closest value
  const activeColIndex = headers.reduce((prev, curr, i) => 
    Math.abs(curr - activeValue) < Math.abs(headers[prev] - activeValue) ? i : prev, 0
  );

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);

  // Auto-scroll to active cell
  useEffect(() => {
    if (activeRef.current) {
      // Changed to 'auto' and 'nearest' to prevent jittering
      activeRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [activeColIndex]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 text-[11px] select-none overflow-hidden">
      
      {/* Header Row (X-Axis Labels) */}
      <div className="flex w-full border-b border-gray-700 bg-gray-800">
        <div className="w-24 flex-shrink-0 p-1 flex items-center justify-center border-r border-gray-700 bg-gray-900 text-gray-400 font-bold">
          {xLabel}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {headers.map((val, i) => (
                <div 
                    key={i} 
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold transition-colors duration-150 border-r border-gray-700 last:border-0
                    ${i === activeColIndex ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
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
           <div className="w-24 flex-shrink-0 flex items-center justify-center border-r border-gray-700 bg-gray-800 text-gray-300 font-bold border-b border-gray-700">
              {yLabel}
           </div>

             {/* 数据单元格 */}
           <div className="flex-1 flex">
                {data.map((cellValue, i) => {
                    const isActive = i === activeColIndex;
                const bg = colorMode === 'heatmap' 
                  ? getHeatmapColor(cellValue, minVal, maxVal) 
                  : '#111316';
                    
                    return (
                        <div
                            key={i}
                            ref={isActive ? activeRef : null}
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold border-r border-b cursor-pointer text-sm
                      ${isActive ? 'ring-2 ring-white z-10 scale-105 shadow-lg' : ''}
                      ${colorMode === 'heatmap' ? 'text-black border-black/10' : 'text-white border-gray-700 hover:bg-[#1a1d24]'}
                    `}
                    style={{ backgroundColor: bg }}
                        >
                            {cellValue.toFixed(2)}
                        </div>
                    );
                })}
           </div>
        </div>
        
          {/* 空白填充区 */}
          <div className="flex-1 bg-[#16181c]"></div>
      </div>
    </div>
  );
};