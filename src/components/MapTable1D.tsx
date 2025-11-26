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
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold transition-colors duration-150 last:border-0 theme-border border-r theme-text-primary ${
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
                  ? getHeatmapColor(cellValue, minVal, maxVal) 
                  : 'var(--bg-cell)';
                    
                    return (
                        <div
                            key={i}
                            ref={isActive ? activeRef : null}
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold cursor-pointer theme-border border-r border-b ${
                      isActive ? 'ring-2 ring-white z-10 scale-105 shadow-lg' : ''
                    } ${colorMode === 'dark' ? 'theme-text-primary' : ''}`}
                    style={{ 
                      backgroundColor: bg, 
                      color: colorMode === 'heatmap' ? '#000' : undefined,
                      fontSize: 'var(--text-xs)'
                    }}
                        >
                            {cellValue.toFixed(2)}
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