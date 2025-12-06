import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { ParamRow } from './ParamRow';

interface OtherOptionsViewProps {
  params: {
    throttleMin: number; throttleMax: number; idleMinInjCold: number; idleMinInjHot: number;
    idleAutoAngle: number; idleAutoInj: number; idleSteps: number; fanTemp: number;
    o2Work: number; o2Delay: number; o2Rpm: number; o2Inj: number;
    startEnrichRpm: number; idleHoleMax: number; idleHoleMin: number; idleHoleMaxAdj: number;
  };
  grids: {
    tempIdle: { stepTime: number[]; injVe: number[] };
    startEnrich: { delayed: number[]; injVeAdd: number[]; notStartedAdd: number[] };
    iatComp: { injVeComp: number[] };
    mapComp: { motorStep: number[] };
    extAdj: { injAdjPct: number[]; ignAdjDeg: number[] };
  };
  onParamsChange: (params: any) => void;
  onGridsChange: (grids: any) => void;
}

export const OtherOptionsView: React.FC<OtherOptionsViewProps> = ({ params, grids, onParamsChange, onGridsChange }) => {
   const { t } = useI18n();
   
   const subTabs = [
      t.otherOptions_tab_tempIdle,
      t.otherOptions_tab_startEnrich,
      t.otherOptions_tab_iatComp,
      t.otherOptions_tab_mapComp,
      t.otherOptions_tab_extAdj
   ];
   const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);
   const [extAdjMode, setExtAdjMode] = useState<'TPS' | 'RPM'>('TPS');
   const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
   const [inputValue, setInputValue] = useState('');

   const updateParam = (key: keyof typeof params, val: number) => {
     onParamsChange({ ...params, [key]: val });
   };

   // Grid Data Logic
   const getGridData = () => {
     if (activeSubTab === t.otherOptions_tab_startEnrich) {
       return {
         cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
         rows: [
           { label: t.otherOptions_row_delayed, values: grids.startEnrich.delayed },
           { label: t.otherOptions_row_injVeAdd, values: grids.startEnrich.injVeAdd },
           { label: t.otherOptions_row_notStartedAdd, values: grids.startEnrich.notStartedAdd },
         ],
         gridKey: 'startEnrich'
       };
     }
     if (activeSubTab === t.otherOptions_tab_iatComp) {
       return {
         cols: ['-14°C', '-7°C', '0°C', '7°C', '14°C', '21°C', '28°C', '35°C', '42°C', '49°C', '56°C'],
         rows: [
           { label: t.otherOptions_row_injVeComp, values: grids.iatComp.injVeComp },
         ],
         gridKey: 'iatComp'
       };
     }
     if (activeSubTab === t.otherOptions_tab_mapComp) {
       const cols = [];
       for(let i=0; i<=120; i+=12) cols.push(`${i} KPa`);
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_motorStep, values: grids.mapComp.motorStep }
         ],
         gridKey: 'mapComp'
       };
     }
     if (activeSubTab === t.otherOptions_tab_extAdj) {
       const cols = ['0%', '0.5%', '3%', '6%', '12%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%', 'ALL'];
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_injAdjPct, values: grids.extAdj.injAdjPct },
           { label: t.otherOptions_row_ignAdjDeg, values: grids.extAdj.ignAdjDeg },
         ],
         gridKey: 'extAdj'
       };
     }
     // Default: Temp-Idle Motor
     return {
       cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
       rows: [
         { label: t.otherOptions_row_stepTime, values: grids.tempIdle.stepTime },
         { label: t.otherOptions_row_injVe, values: grids.tempIdle.injVe },
       ],
       gridKey: 'tempIdle'
     };
   };

   const { cols, rows, gridKey } = getGridData() as any;

   const handleCellChange = (rowIndex: number, colIndex: number, value: number) => {
     const newGrids = { ...grids };
     const rowKey = Object.keys(grids[gridKey as keyof typeof grids])[rowIndex];
     // 创建数组的副本而不是直接修改
     const currentArray = (grids[gridKey as keyof typeof grids] as any)[rowKey];
     const newArray = [...currentArray];
     newArray[colIndex] = value;
     (newGrids[gridKey as keyof typeof grids] as any) = {
       ...(grids[gridKey as keyof typeof grids] as any),
       [rowKey]: newArray
     };
     onGridsChange(newGrids);
   };

   // Determine the top-left header label based on active tab
   let topLeftHeader = t.otherOptions_row_ect;
   if (activeSubTab === t.otherOptions_tab_iatComp) topLeftHeader = t.otherOptions_row_iat;
   if (activeSubTab === t.otherOptions_tab_mapComp) topLeftHeader = 'MAP';
   if (activeSubTab === t.otherOptions_tab_extAdj) topLeftHeader = extAdjMode;

   return (
      <div className="flex flex-col h-full bg-[#16181c] p-1 gap-1 overflow-y-auto">
         {/* Top Section: 3 Parameter Blocks */}
         <div className="flex gap-1 shrink-0">
            {/* Block 1 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_throttleMin} value={params.throttleMin} unit="V" onChange={(v) => updateParam('throttleMin', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_throttleMax} value={params.throttleMax} unit="V" onChange={(v) => updateParam('throttleMax', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleMinInjCold} value={params.idleMinInjCold} unit="ms" onChange={(v) => updateParam('idleMinInjCold', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleMinInjHot} value={params.idleMinInjHot} unit="ms" onChange={(v) => updateParam('idleMinInjHot', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleAutoAngle} value={params.idleAutoAngle} unit="∠°" onChange={(v) => updateParam('idleAutoAngle', v)} min={-30} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleAutoInj} value={params.idleAutoInj} unit="ms" onChange={(v) => updateParam('idleAutoInj', v)} min={0} max={99999} decimals={0} />
               </div>
            </div>
            {/* Block 2 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_idleSteps} value={params.idleSteps} unit="STEP" onChange={(v) => updateParam('idleSteps', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_fanTemp} value={params.fanTemp} unit="°C" onChange={(v) => updateParam('fanTemp', v)} min={-273.15} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Work} value={params.o2Work} unit="V" onChange={(v) => updateParam('o2Work', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Delay} value={params.o2Delay} unit="Second" onChange={(v) => updateParam('o2Delay', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Rpm} value={params.o2Rpm} unit="RPM" onChange={(v) => updateParam('o2Rpm', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Inj} value={params.o2Inj} unit="%" onChange={(v) => updateParam('o2Inj', v)} min={0} max={99999} decimals={0} />
               </div>
            </div>
            {/* Block 3 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_startEnrichRpm} value={params.startEnrichRpm} unit="RPM" onChange={(v) => updateParam('startEnrichRpm', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMax} value={params.idleHoleMax} unit="STEP" onChange={(v) => updateParam('idleHoleMax', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMin} value={params.idleHoleMin} unit="STEP" onChange={(v) => updateParam('idleHoleMin', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMaxAdj} value={params.idleHoleMaxAdj} unit="STEP" onChange={(v) => updateParam('idleHoleMaxAdj', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label="0" value={0} unit="0" highlighted={false} decimals={0} />
                  <ParamRow label="0" value={0} unit="0" highlighted={false} decimals={0} />
               </div>
            </div>
         </div>

         {/* Middle Section: Sub Tabs */}
         <div className="flex items-center justify-between bg-[#16181c] mt-1 shrink-0">
            <div className="flex gap-1 overflow-x-auto">
               {subTabs.map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveSubTab(tab)}
                     className={`px-2 py-1 text-[11px] font-bold border border-gray-700 whitespace-nowrap transition-colors
                        ${activeSubTab === tab 
                           ? 'bg-blue-600 text-white border-blue-500' 
                           : 'bg-[#23272e] text-gray-400 hover:bg-[#2d323a]'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            {/* Checkboxes for External Adjust */}
            {activeSubTab === t.otherOptions_tab_extAdj && (
               <div className="flex items-center gap-4 px-2 text-xs text-gray-300">
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={extAdjMode === 'TPS'} 
                        onChange={() => setExtAdjMode('TPS')}
                        className="accent-blue-600"
                     />
                     TPS
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={extAdjMode === 'RPM'} 
                        onChange={() => setExtAdjMode('RPM')}
                        className="accent-blue-600"
                     />
                     RPM
                  </label>
               </div>
            )}
         </div>

         {/* Bottom Section: Data Grid */}
         <div className="flex-1 border border-gray-700 overflow-auto bg-[#1e2126]">
            <div className="min-w-max">
               <div className="flex h-8 text-sm border-b border-gray-700">
                  <div className="w-28 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10">
                     {topLeftHeader}
                  </div>
                  {cols.map((col: any, i: number) => (
                     <div key={i} className="flex-1 min-w-[60px] bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center">
                        {col}
                     </div>
                  ))}
               </div>
               {rows.map((row: any, rIndex: number) => (
                  <div key={rIndex} className="flex h-8 text-sm border-b border-gray-700 last:border-0">
                     <div className="w-28 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10 truncate px-1" title={row.label}>
                        {row.label}
                     </div>
                     {row.values.map((val: number, cIndex: number) => (
                        <div 
                          key={cIndex} 
                          className="flex-1 min-w-[60px] bg-[#111316] text-white font-bold flex items-center justify-center border-r border-gray-700 hover:bg-gray-800 cursor-pointer"
                          onClick={() => {
                            setEditingCell({ row: rIndex, col: cIndex });
                            setInputValue(val.toString());
                          }}
                        >
                          {editingCell && editingCell.row === rIndex && editingCell.col === cIndex ? (
                            <input
                              autoFocus
                              type="text"
                              className="w-full h-full bg-blue-600 text-white text-center outline-none font-bold"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onBlur={() => {
                                const parsed = parseFloat(inputValue);
                                if (!isNaN(parsed)) {
                                  handleCellChange(rIndex, cIndex, parsed);
                                }
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const parsed = parseFloat(inputValue);
                                  if (!isNaN(parsed)) {
                                    handleCellChange(rIndex, cIndex, parsed);
                                  }
                                  setEditingCell(null);
                                } else if (e.key === 'Escape') {
                                  setEditingCell(null);
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                            />
                          ) : (
                            val
                          )}
                        </div>
                     ))}
                  </div>
               ))}

            </div>
         </div>
      </div>
   );
};