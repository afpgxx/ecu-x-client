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
  const radius = size / 2 - 5; // Slightly larger face, less padding
  const strokeWidth = 12; // Thinner bezel
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
          stroke={isMajor ? "#e5e7eb" : "#4b5563"}
          strokeWidth={isMajor ? 2 : 1}
        />
      );

      if (isMajor) {
        // Move text closer to the ticks (larger radius) to reduce crowding
        const textRadius = innerRadius - 25; 
        const textPos = polarToCartesian(center, center, textRadius, angle);
        const tickValue = min + (tickRatio * (max - min));
        
        ticks.push(
          <text
            key={`text-${i}`}
            x={textPos.x}
            y={textPos.y}
            fill="#9ca3af"
            fontSize="10" // Smaller font
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
  const needleLength = innerRadius - 15; // Slightly shorter to not cover numbers
  const needleTip = polarToCartesian(center, center, needleLength, currentAngle);
  const needleBaseWidth = 5;
  const baseLeft = polarToCartesian(center, center, needleBaseWidth, currentAngle - 90);
  const baseRight = polarToCartesian(center, center, needleBaseWidth, currentAngle + 90);

  return (
    <div className="relative w-full h-full flex items-center justify-center aspect-square select-none">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-2xl">
        <defs>
           <linearGradient id={`face-grad-${label}`} x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#374151" />
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

        {/* Outer Bezel */}
        <circle cx={center} cy={center} r={radius} fill={`url(#face-grad-${label})`} stroke="#4b5563" strokeWidth="3" />
        <circle cx={center} cy={center} r={radius - 3} fill="none" stroke="#000" strokeWidth="1" />

        {/* Redline Arc */}
        {dangerStart && (
          <path
            d={`M ${polarToCartesian(center, center, innerRadius - 4, startAngle + ((dangerStart - min)/(max-min)) * totalAngle).x} 
               ${polarToCartesian(center, center, innerRadius - 4, startAngle + ((dangerStart - min)/(max-min)) * totalAngle).y}
               A ${innerRadius - 4} ${innerRadius - 4} 0 0 1 
               ${polarToCartesian(center, center, innerRadius - 4, endAngle).x}
               ${polarToCartesian(center, center, innerRadius - 4, endAngle).y}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}

        {/* Ticks */}
        {renderTicks()}

        {/* Needle */}
        <path
          d={`M ${baseLeft.x} ${baseLeft.y} L ${needleTip.x} ${needleTip.y} L ${baseRight.x} ${baseRight.y} Z`}
          fill="#f97316"
          filter="url(#dropShadow)"
        />
        <circle cx={center} cy={center} r={6} fill="#374151" stroke="#f97316" strokeWidth="2" />

      </svg>
      
      {/* Digital Readout Overlay - Moved Lower */}
      <div className="absolute bottom-[18%] flex flex-col items-center pointer-events-none">
        <div className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-white text-3xl font-digital font-bold leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {value < 10 && value % 1 !== 0 ? value.toFixed(1) : Math.round(value)}
        </div>
        <div className="text-gray-500 text-[8px] mt-0.5 font-medium">{unit}</div>
      </div>
    </div>
  );
};