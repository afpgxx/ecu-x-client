import React from 'react';

interface VerticalBarProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  warningThreshold?: number;
  color?: string; // New prop for custom color
}

export const VerticalBar: React.FC<VerticalBarProps> = ({
  label,
  value,
  unit = '',
  min,
  max,
  warningThreshold,
  color = 'bg-gray-200' // Default fallback
}) => {
  // Calculate percentage
  const range = max - min;
  const clampedValue = Math.max(min, Math.min(max, value));
  const percent = ((clampedValue - min) / range) * 100;

  // Color logic: 
  // 1. Red if above warning threshold.
  // 2. Else use the provided custom color.
  let barColor = color;
  
  if (warningThreshold && value > warningThreshold) {
    barColor = 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]';
  } else {
     // Add a subtle glow matching the bar color (simplified approach relies on CSS opacity/blending or just generic shadow)
     // We append a generic white glow for visibility, or relies on the consumer to pass a shadow class if they want specific color glow.
     // For now, we keep the bar color simple.
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Label Header */}
      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider truncate w-full text-center">{label}</div>
      
      {/* Numeric Value */}
      <div className="text-sm font-mono font-bold text-white mb-1 tabular-nums">
        {value.toFixed(unit ? 1 : 0)}<span className="text-[10px] text-gray-500 ml-0.5">{unit}</span>
      </div>
      
      {/* Bar and Scale Container */}
      <div className="relative flex-1 flex gap-0 w-full">
        {/* Scale markers with values - positioned outside on the left */}
        <div className="h-full flex flex-col justify-between py-1 pr-0.5">
           {[...Array(17)].map((_, i) => {
             const isMajor = i % 4 === 0;
             if (isMajor) {
               const majorIndex = i / 4;
               const markerValue = max - (majorIndex * (max - min) / 4);
               return (
                 <div key={i} className="flex items-center justify-end gap-1 h-[1px]">
                   <span className="text-[10px] font-mono text-gray-200 font-bold w-6 text-right leading-none">{markerValue.toFixed(0)}</span>
                   <div className="w-1.5 h-[1px] bg-gray-400"></div>
                 </div>
               );
             } else {
               return (
                 <div key={i} className="flex items-center justify-end gap-1 h-[1px]">
                   <div className="w-1 h-[1px] bg-gray-600"></div>
                 </div>
               );
             }
           })}
        </div>
        
        {/* Bar Container */}
        <div className="relative flex-1 bg-white rounded-sm border border-gray-600 overflow-hidden">
          {/* Fill */}
          <div 
            className={`absolute bottom-0 w-full transition-all duration-300 ease-out ${barColor} shadow-[0_-2px_10px_rgba(255,255,255,0.15)]`}
            style={{ height: `${percent}%` }}
          />
        </div>
      </div>
      
      {/* Min/Max Labels - Removed as they are now on the scale */}
    </div>
  );
};