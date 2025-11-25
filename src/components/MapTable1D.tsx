import React, { useEffect, useRef } from 'react';

interface MapTable1DProps {
  headers: number[]; // The X-axis values (e.g., RPM)
  data: number[];    // The row data values
  activeValue: number; // The current live value to highlight (e.g., current RPM)
  xLabel: string;    // Label for the X-axis (e.g. "RPM")
  yLabel: string;    // Label for the row header (e.g. "TIME")
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
  yLabel
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
        <div className="flex w-full h-12"> {/* Fixed height for the single row */}
           
           {/* Row Label */}
           <div className="w-24 flex-shrink-0 flex items-center justify-center border-r border-gray-700 bg-gray-800 text-gray-300 font-bold border-b border-gray-700">
              {yLabel}
           </div>

           {/* Data Cells */}
           <div className="flex-1 flex">
                {data.map((cellValue, i) => {
                    const isActive = i === activeColIndex;
                    const bg = getHeatmapColor(cellValue, minVal, maxVal);
                    
                    return (
                        <div
                            key={i}
                            ref={isActive ? activeRef : null}
                            className={`flex-1 min-w-[48px] flex items-center justify-center text-black font-bold border-r border-b border-black/10 cursor-pointer text-sm
                                ${isActive ? 'ring-2 ring-white z-10 scale-105 shadow-lg' : 'opacity-90 hover:opacity-100'}`}
                            style={{ backgroundColor: bg }}
                        >
                            {cellValue.toFixed(2)}
                        </div>
                    );
                })}
           </div>
        </div>
        
        {/* Empty space filler below the row */}
        <div className="flex-1 bg-[#16181c]"></div>
      </div>
    </div>
  );
};