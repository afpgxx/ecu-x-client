import React, { useEffect, useRef } from 'react';
import { theme } from '../theme';

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
    <div className="flex flex-col w-full h-full select-none overflow-hidden" style={{ backgroundColor: theme.colors.bgPanelAlt, fontSize: theme.fonts.sizeXs }}>
      
      {/* Header Row (X-Axis Labels) */}
      <div className="flex w-full" style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgHeader }}>
        <div className="w-24 flex-shrink-0 p-1 flex items-center justify-center font-bold" style={{ borderRight: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgPanelAlt, color: theme.colors.textMuted }}>
          {xLabel}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {headers.map((val, i) => (
                <div 
                    key={i}
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold transition-colors duration-150 last:border-0`}
                    style={{
                      borderRight: `1px solid ${theme.colors.border}`,
                      backgroundColor: i === activeColIndex ? theme.colors.accentBlue : theme.colors.bgHeader,
                      color: theme.colors.textPrimary
                    }}
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
            <div className="w-24 flex-shrink-0 flex items-center justify-center font-bold" style={{ borderRight: `1px solid ${theme.colors.border}`, borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgHeader, color: theme.colors.textSecondary }}>
              {yLabel}
           </div>

             {/* 数据单元格 */}
           <div className="flex-1 flex">
                {data.map((cellValue, i) => {
                    const isActive = i === activeColIndex;
                const bg = colorMode === 'heatmap' 
                  ? getHeatmapColor(cellValue, minVal, maxVal) 
                  : theme.colors.bgCell;
                    
                    return (
                        <div
                            key={i}
                            ref={isActive ? activeRef : null}
                    className={`flex-1 min-w-[48px] flex items-center justify-center font-bold cursor-pointer ${isActive ? 'ring-2 ring-white z-10 scale-105 shadow-lg' : ''}`}
                    style={{ backgroundColor: bg, color: colorMode === 'heatmap' ? '#000' : theme.colors.textPrimary, borderRight: colorMode === 'heatmap' ? '1px solid rgba(0,0,0,0.1)' : `1px solid ${theme.colors.border}`, borderBottom: colorMode === 'heatmap' ? '1px solid rgba(0,0,0,0.1)' : `1px solid ${theme.colors.border}`, fontSize: theme.fonts.sizeXs }}
                        >
                            {cellValue.toFixed(2)}
                        </div>
                    );
                })}
           </div>
        </div>
        
          {/* 空白填充区 */}
          <div className="flex-1" style={{ backgroundColor: theme.colors.bgPanelAlt }}></div>
      </div>
    </div>
  );
};