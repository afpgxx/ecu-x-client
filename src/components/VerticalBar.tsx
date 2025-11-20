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
      
      {/* Bar Container */}
      <div className="relative flex-1 w-6 bg-gray-800/50 rounded-sm border border-gray-700 overflow-hidden group backdrop-blur-sm">
        {/* Scale markers */}
        <div className="absolute right-0 top-0 h-full w-full flex flex-col justify-between py-1 px-[2px] pointer-events-none z-10 opacity-60">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="w-1.5 h-[1px] bg-gray-600 self-end"></div>
           ))}
        </div>
        
        {/* Fill */}
        <div 
          className={`absolute bottom-0 w-full transition-all duration-300 ease-out ${barColor} shadow-[0_-2px_10px_rgba(255,255,255,0.15)]`}
          style={{ height: `${percent}%` }}
        />
      </div>
      
      {/* Min/Max Labels */}
      <div className="flex justify-between w-8 text-[8px] text-gray-600 font-mono mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};