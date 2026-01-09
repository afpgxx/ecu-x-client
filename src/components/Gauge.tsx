import React, { useRef, useEffect, useState } from 'react';
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
  value,
  min,
  max,
  variant = 'rpm'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(200);
  
  // 监听容器尺寸变化，确保指针和表盘同步缩放
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // 取较小值确保正方形
        const size = Math.min(rect.width, rect.height);
        setContainerSize(size);
      }
    };
    
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  // Gauge configuration based on variant
  // 表盘在精灵图中的位置（基于 800% 宽度的百分比）
  const config = {
    rpm: {
      // 精灵图裁剪参数 (相对于单个表盘宽度)
      spriteIndex: 4.3, // 在精灵图中的索引位置
      startAngle: 235.5,
      endAngle: 484,
    },
    tps: {
      spriteIndex: 5.385,
      startAngle: 235,
      endAngle: 485,
    },
    afr: {
      spriteIndex: 6.475,
      startAngle: 246.8,
      endAngle: 473.3,
    }
  };

  const currentConfig = config[variant];
  
  // Calculate rotation
  const totalAngle = currentConfig.endAngle - currentConfig.startAngle;
  const valueClamped = Math.min(max, Math.max(min, value));
  const valueRatio = (valueClamped - min) / (max - min);
  const currentAngle = currentConfig.startAngle + (valueRatio * totalAngle);

  // SVG viewBox 使用固定值，通过 CSS 缩放到容器大小
  const svgSize = 200;
  const center = svgSize / 2;
  const needleLength = svgSize * 0.41;
  const needleBaseWidth = 4;

  // Needle shape
  const tipX = center;
  const tipY = center - needleLength;
  const baseLeftX = center - needleBaseWidth;
  const baseLeftY = center;
  const baseRightX = center + needleBaseWidth;
  const baseRightY = center;

  return (
    <div className="flex flex-col items-center justify-between w-full h-full select-none">
      {/* Gauge Area */}
      <div ref={containerRef} className="relative flex-1 w-full min-h-0 flex items-center justify-center">
         {/* 固定正方形容器 */}
         <div 
           className="relative"
           style={{ 
             width: containerSize, 
             height: containerSize,
           }}
         >
           {/* Background Image - 使用 clip-path 裁剪精灵图 */}
           <div 
              className="absolute bg-no-repeat"
              style={{
                width: containerSize,
                height: containerSize,
                backgroundImage: `url(${assetDigitalFont})`,
                // 精灵图宽度 = 容器宽度 * 8 (因为有8个表盘)
                backgroundSize: `${containerSize * 8}px ${containerSize * 1.05}px`,
                // 水平偏移到正确的表盘
                backgroundPosition: `-${containerSize * currentConfig.spriteIndex}px -${containerSize * 0.025}px`,
              }}
           />
           
           {/* Needle Layer (SVG) */}
           <svg 
             viewBox={`0 0 ${svgSize} ${svgSize}`} 
             className="absolute inset-0 drop-shadow-xl pointer-events-none"
             style={{ width: containerSize, height: containerSize }}
           >
              <defs>
                 <filter id={`dropShadow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
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
                    filter={`url(#dropShadow-${variant})`}
                  />
                  {/* Needle Counterweight/Tail */}
                  <path
                    d={`M ${baseLeftX} ${baseLeftY} L ${center} ${center + 15} L ${baseRightX} ${baseRightY} Z`}
                    fill="#ef4444"
                    filter={`url(#dropShadow-${variant})`}
                  />
              </g>

              {/* Center Cap */}
              <circle cx={center} cy={center} r={6} fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <circle cx={center} cy={center} r={2} fill="#000" />
          </svg>
          
          {/* Digital Readout Section */}
          <div 
            className="absolute left-0 right-0 flex flex-col items-center z-20 pointer-events-none" 
            style={{ top: `${containerSize * 0.62}px` }}
          >
            <div 
              className="text-white font-bold uppercase tracking-widest"
              style={{ fontSize: containerSize * 0.06 }}
            >
              {variant === 'rpm' ? 'RPM' : variant === 'tps' ? 'TPS' : 'OG AFR'}
            </div>
            <div 
              className="border border-gray-700/50 rounded shadow-inner text-center flex justify-center items-center"
              style={{ padding: `${containerSize * 0.01}px ${containerSize * 0.04}px` }}
            >
                <span 
                  className="text-blue-400 font-digital font-bold leading-none tracking-wider drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]"
                  style={{ fontSize: containerSize * 0.07 }}
                >
                    {variant === 'afr' ? value.toFixed(2) : Math.round(value)}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};