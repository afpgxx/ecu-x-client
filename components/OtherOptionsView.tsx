import React, { useState } from 'react';

const ParamRow = ({ label, value, unit, highlighted = true }: { label?: string, value: string | number, unit?: string, highlighted?: boolean }) => (
  <div className="flex items-center border-b border-gray-700 last:border-0 h-8 text-xs">
    {label && <div className="flex-[2] px-2 text-gray-300 truncate border-r border-gray-700 h-full flex items-center bg-[#2d323a]">{label}</div>}
    <div className={`flex-1 px-2 font-mono font-bold h-full flex items-center justify-center ${highlighted ? 'bg-[#fef08a] text-red-600' : 'text-gray-300 bg-[#1f2329]'}`}>
       {value}
    </div>
    {unit !== undefined && <div className="w-12 text-center text-gray-400 border-l border-gray-700 h-full flex items-center justify-center bg-[#2d323a]">{unit}</div>}
  </div>
);

export const OtherOptionsView: React.FC = () => {
   const subTabs = ['温度-怠速电机关系', '启动加喷', '进气温度补偿喷油', '进气压力补偿怠速电机', '外部调节'];
   const [activeSubTab, setActiveSubTab] = useState('启动加喷');

   // Mock data for the bottom grid
   const bottomGridCols = Array(8).fill('0 Kpa');
   const bottomGridRows = [
      { label: 'ECT', values: Array(8).fill('0 Kpa') }, 
      { label: 'Voltage', values: ['0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08'] },
      { label: 'Voltage', values: ['0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08'] },
      { label: 'Voltage', values: ['0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08', '0.08'] },
   ];

   return (
      <div className="flex flex-col h-full bg-[#1f2329] p-2 gap-2 overflow-y-auto">
         {/* Top Section: 3 Parameter Blocks */}
         <div className="flex gap-2 h-[240px] shrink-0">
            {/* Block 1 */}
            <div className="flex-1 bg-[#16181c] border border-gray-600 flex flex-col">
               <div className="bg-[#2d323a] px-2 py-1 text-xs font-bold text-gray-400 border-b border-gray-600">怠速设置 A</div>
               <div className="flex-1 overflow-auto">
                  {[...Array(7)].map((_, i) => (
                     <ParamRow key={i} label="怠速转速(冷车)" value="1500" unit="RPM" />
                  ))}
               </div>
            </div>
            {/* Block 2 */}
            <div className="flex-1 bg-[#16181c] border border-gray-600 flex flex-col">
               <div className="bg-[#2d323a] px-2 py-1 text-xs font-bold text-gray-400 border-b border-gray-600">怠速设置 B</div>
               <div className="flex-1 overflow-auto">
                  <ParamRow label="怠速转速(冷车)" value="8000" unit="RPM" />
                  <ParamRow label="怠速转速(冷车)" value="1500" unit="RPM" />
                  <ParamRow label="怠速转速(冷车)" value="10" unit="%" />
                  <ParamRow label="怠速转速(冷车)" value="0" unit="RPM" />
                  <ParamRow label="怠速转速(冷车)" value="10" unit="%" />
                  <ParamRow label="怠速转速(冷车)" value="0" unit="RPM" />
                  <ParamRow label="怠速转速(冷车)" value="0" unit="RPM" />
               </div>
            </div>
            {/* Block 3 */}
            <div className="flex-1 bg-[#16181c] border border-gray-600 flex flex-col">
               <div className="bg-[#2d323a] px-2 py-1 text-xs font-bold text-gray-400 border-b border-gray-600">参数校正</div>
               <div className="flex-1 overflow-auto">
                  {[...Array(7)].map((_, i) => (
                     <div key={i} className="flex items-center border-b border-gray-700 last:border-0 h-8 text-xs">
                        <div className="flex-1 px-2 text-gray-400 bg-[#2d323a] h-full flex items-center justify-center border-r border-gray-700">0</div>
                        <div className="flex-1 px-2 font-bold text-red-600 bg-[#fef08a] h-full flex items-center justify-center border-r border-gray-700">0</div>
                        <div className="flex-1 px-2 text-gray-400 bg-[#2d323a] h-full flex items-center justify-center">0</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Middle Section: Sub Tabs */}
         <div className="flex gap-2 py-1 shrink-0 overflow-x-auto">
            {subTabs.map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-1.5 text-xs font-bold border rounded-sm whitespace-nowrap transition-colors
                     ${activeSubTab === tab 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                        : 'bg-[#2d323a] text-gray-300 border-gray-600 hover:bg-[#3a404b]'}`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* Bottom Section: Data Grid */}
         <div className="flex-1 bg-[#16181c] border border-gray-600 overflow-auto">
            <div className="min-w-max">
               <div className="flex h-8 text-xs border-b border-gray-600">
                  <div className="w-20 bg-[#2d323a] border-r border-gray-600 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10">
                     ECT
                  </div>
                  {bottomGridCols.map((col, i) => (
                     <div key={i} className="flex-1 min-w-[80px] bg-[#2d323a] border-r border-gray-600 text-gray-400 flex items-center justify-center border-gray-700">
                        {col}
                     </div>
                  ))}
               </div>
               {bottomGridRows.map((row, rIndex) => (
                  <div key={rIndex} className="flex h-8 text-xs border-b border-gray-700 last:border-0">
                     <div className="w-20 bg-[#2d323a] border-r border-gray-600 text-gray-300 flex items-center justify-center font-bold sticky left-0 z-10">
                        {row.label}
                     </div>
                     {row.values.map((val, cIndex) => (
                        <div key={cIndex} className="flex-1 min-w-[80px] bg-[#fef08a] text-red-600 font-bold flex items-center justify-center border-r border-gray-400/20 hover:bg-[#fde047] cursor-pointer">
                           {val}
                        </div>
                     ))}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};