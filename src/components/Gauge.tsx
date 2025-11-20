import React from 'react';

interface GaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  majorTicks?: number;
  minorTicks?: number;
  dangerStart?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  label,
  value,
  min,
  max,
  unit,
  majorTicks = 8,
  minorTicks = 4,
  dangerStart
}) => {
  // Use a viewBox for responsive SVG
  const size = 200;
  const center = size / 2;
  const radius = size / 2 - 10; // Slightly smaller to fit stroke
  const strokeWidth = 10; 
  const innerRadius = radius - strokeWidth;
  
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  
  const valueClamped = Math.min(max, Math.max(min, value));
  const valueRatio = (valueClamped - min) / (max - min);
  const currentAngle = startAngle + (valueRatio * totalAngle);

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (r * Math.cos(angleInRadians)),
      y: cy + (r * Math.sin(angleInRadians))
    };
  };

  const renderTicks = () => {
    const ticks = [];
    const totalTicks = majorTicks * (minorTicks + 1);
    
    for (let i = 0; i <= totalTicks; i++) {
      const isMajor = i % (minorTicks + 1) === 0;
      const tickRatio = i / totalTicks;
      const angle = startAngle + (tickRatio * totalAngle);
      
      // Ticks styling
      const rStart = isMajor ? innerRadius - 12 : innerRadius - 8;
      const rEnd = innerRadius - 2;
      
      const p1 = polarToCartesian(center, center, rStart, angle);
      const p2 = polarToCartesian(center, center, rEnd, angle);
      
      ticks.push(
        <line
          key={`tick-${i}`}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={isMajor ? "#9ca3af" : "#4b5563"}
          strokeWidth={isMajor ? 2 : 1}
        />
      );

      if (isMajor) {
        // Move text closer to the ticks
        const textRadius = innerRadius - 24; 
        const textPos = polarToCartesian(center, center, textRadius, angle);
        const tickValue = min + (tickRatio * (max - min));
        
        ticks.push(
          <text
            key={`text-${i}`}
            x={textPos.x}
            y={textPos.y}
            fill="#6b7280"
            fontSize="9"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {Math.round(tickValue)}
          </text>
        );
      }
    }
    return ticks;
  };

  // Needle Calculations
  const needleLength = innerRadius - 10;
  const needleTip = polarToCartesian(center, center, needleLength, currentAngle);
  const needleBaseWidth = 4;
  const baseLeft = polarToCartesian(center, center, needleBaseWidth, currentAngle - 90);
  const baseRight = polarToCartesian(center, center, needleBaseWidth, currentAngle + 90);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full select-none py-1">
      {/* Gauge SVG Area */}
      <div className="relative flex-1 w-full min-h-0 flex items-center justify-center">
         <svg viewBox={`0 0 ${size} ${size}`} className="max-h-full max-w-full w-auto h-auto drop-shadow-xl">
            <defs>
               <linearGradient id={`face-grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#272b33" />
                 <stop offset="100%" stopColor="#111827" />
               </linearGradient>
               <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                 <feOffset dx="1" dy="1" result="offsetblur"/>
                 <feComponentTransfer>
                   <feFuncA type="linear" slope="0.5"/>
                 </feComponentTransfer>
                 <feMerge> 
                   <feMergeNode/>
                   <feMergeNode in="SourceGraphic"/> 
                 </feMerge>
               </filter>
            </defs>

            <circle cx={center} cy={center} r={radius} fill={`url(#face-grad-${label})`} stroke="#374151" strokeWidth="2" />
            <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#1f2937" strokeWidth="1" />

            {dangerStart && (
              <path
                d={`M ${polarToCartesian(center, center, innerRadius - 4, startAngle + ((dangerStart - min)/(max-min)) * totalAngle).x} 
                   ${polarToCartesian(center, center, innerRadius - 4, startAngle + ((dangerStart - min)/(max-min)) * totalAngle).y}
                   A ${innerRadius - 4} ${innerRadius - 4} 0 0 1 
                   ${polarToCartesian(center, center, innerRadius - 4, endAngle).x}
                   ${polarToCartesian(center, center, innerRadius - 4, endAngle).y}`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}

            {renderTicks()}

            <path
              d={`M ${baseLeft.x} ${baseLeft.y} L ${needleTip.x} ${needleTip.y} L ${baseRight.x} ${baseRight.y} Z`}
              fill="#f97316"
              filter="url(#dropShadow)"
            />
            <circle cx={center} cy={center} r={5} fill="#374151" stroke="#f97316" strokeWidth="2" />
            <circle cx={center} cy={center} r={2} fill="#111827" />
         </svg>
         
         {/* Small Unit Label Inside Gauge - Non-obstructive */}
         <div className="absolute bottom-[20%] text-[9px] text-gray-600 font-medium pointer-events-none opacity-75">{unit}</div>
      </div>
      
      {/* Digital Readout Section - Separated below */}
      <div className="flex flex-col items-center justify-center z-10 mt-[-8px] w-full">
        <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">{label}</div>
        <div className="bg-[#0d0f11] border border-gray-700/50 rounded px-4 py-0.5 shadow-inner min-w-[40%] text-center flex justify-center items-center">
             <span className="text-blue-400 text-xl font-digital font-bold leading-none tracking-wider drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]">
                {value < 10 && value % 1 !== 0 ? value.toFixed(1) : Math.round(value)}
             </span>
        </div>
      </div>
    </div>
  );
};