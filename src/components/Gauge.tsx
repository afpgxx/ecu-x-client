import React from 'react';
import assetDigitalFont from '../assets/Asset_Digital_Font.png';

interface GaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  variant?: 'rpm' | 'tps' | 'afr';
}

export const Gauge: React.FC<GaugeProps> = ({
  label,
  value,
  min,
  max,
  unit,
  variant = 'rpm'
}) => {
  // Gauge configuration based on variant
  // The sprite sheet contains 3 gauges side-by-side.
  // We use background-size: 300% 100% to scale the image so one gauge fits the container width.
  // Positions:
  // 0% 0 -> First gauge (Left)
  // 50% 0 -> Second gauge (Center)
  // 100% 0 -> Third gauge (Right)
  const config = {
    rpm: {
      bgPosition: '61.39% -10px', // Left gauge (RPM 0-15)
      startAngle: 232,
      endAngle: 487.5,
    },
    tps: {
      bgPosition: '76.9% -10px', // Center gauge (TPS 0-10)
      startAngle: 231.5,
      endAngle: 487.9,
    },
    afr: {
      bgPosition: '92.44% -10px', // Right gauge (AFR 9-18)
      startAngle: 243.8,
      endAngle: 475.7,
    }
  };

  const currentConfig = config[variant];
  
  // Calculate rotation
  const totalAngle = currentConfig.endAngle - currentConfig.startAngle;
  const valueClamped = Math.min(max, Math.max(min, value));
  const valueRatio = (valueClamped - min) / (max - min);
  const currentAngle = currentConfig.startAngle + (valueRatio * totalAngle);

  // Needle dimensions
  const size = 200;
  const center = size / 2;
  const needleLength = size * 0.41; // Adjust based on image
  const needleBaseWidth = 4;

  // Needle shape (pointing UP at 0 degrees, will be rotated)
  // Tip at (center, center - length)
  const tipX = center;
  const tipY = center - needleLength;
  const baseLeftX = center - needleBaseWidth;
  const baseLeftY = center;
  const baseRightX = center + needleBaseWidth;
  const baseRightY = center;

  return (
    <div className="flex flex-col items-center justify-between w-full h-full select-none py-1">
      {/* Gauge Area */}
      <div className="relative flex-1 w-full min-h-0 flex items-center justify-center aspect-square">
         {/* Background Image Container */}
         <div 
            className="absolute inset-0 w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${assetDigitalFont})`,
              backgroundSize: '800% 110%', 
              backgroundPosition: currentConfig.bgPosition
            }}
         />
         
         {/* Needle Layer (SVG) */}
         <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full drop-shadow-xl pointer-events-none">
            <defs>
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

            {/* Rotatable Needle Group */}
            <g style={{ 
                transform: `rotate(${currentAngle}deg)`, 
                transformOrigin: `${center}px ${center}px`,
                transition: 'transform 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}>
                {/* Needle Body */}
                <path
                  d={`M ${baseLeftX} ${baseLeftY} L ${tipX} ${tipY} L ${baseRightX} ${baseRightY} Z`}
                  fill="#ef4444"
                  filter="url(#dropShadow)"
                />
                {/* Needle Counterweight/Tail */}
                <path
                  d={`M ${baseLeftX} ${baseLeftY} L ${center} ${center + 15} L ${baseRightX} ${baseRightY} Z`}
                  fill="#ef4444"
                  filter="url(#dropShadow)"
                />
            </g>

            {/* Center Cap */}
            <circle cx={center} cy={center} r={6} fill="#1f2937" stroke="#374151" strokeWidth="1" />
            <circle cx={center} cy={center} r={2} fill="#000" />
        </svg>
        
        {/* Digital Readout Section */}
        <div className="flex flex-col items-center justify-center z-20 -mt-200 w-full">
          <div className="text-white-500 text-[10px] font-bold uppercase tracking-widest mb-0.5 translate-y-11">{label}</div>
          <div className="border border-gray-700/50 rounded px-4 py-0.5 shadow-inner min-w-[0%] text-center flex justify-center items-center gap-1 translate-y-10">
              <span className="text-blue-400 text-[11px] font-digital font-bold leading-none tracking-wider drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]">
                  {variant === 'afr' ? value.toFixed(2) : Math.round(value)}
              </span>
              <span className="text-gray-500 text-[10px] font-bold">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};