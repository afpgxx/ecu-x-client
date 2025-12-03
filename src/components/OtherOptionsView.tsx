import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { ParamRow } from './ParamRow';

export const OtherOptionsView: React.FC = () => {
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

   // State for parameters (simplified for demo)
   const [params, setParams] = useState({
     throttleMin: 0, throttleMax: 0, idleMinInjCold: 0, idleMinInjHot: 0, idleAutoAngle: 0, idleAutoInj: 0,
     idleSteps: 0, fanTemp: 0, o2Work: 0, o2Delay: 0, o2Rpm: 0, o2Inj: 0,
     startEnrichRpm: 0, idleHoleMax: 0, idleHoleMin: 0, idleHoleMaxAdj: 0
   });

   const updateParam = (key: keyof typeof params, val: number) => {
     setParams(prev => ({ ...prev, [key]: val }));
   };

   // Grid Data Logic
   const getGridData = () => {
     if (activeSubTab === t.otherOptions_tab_startEnrich) {
       return {
         cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
         rows: [
           { label: t.otherOptions_row_delayed, values: Array(11).fill('0') },
           { label: t.otherOptions_row_injVeAdd, values: Array(11).fill('0') },
           { label: t.otherOptions_row_notStartedAdd, values: Array(11).fill('0') },
         ]
       };
     }
     if (activeSubTab === t.otherOptions_tab_iatComp) {
       return {
         cols: ['-14°C', '-7°C', '0°C', '7°C', '14°C', '21°C', '28°C', '35°C', '42°C', '49°C', '56°C'],
         rows: [
           { label: t.otherOptions_row_injVeComp, values: Array(11).fill('0') },
         ]
       };
     }
     if (activeSubTab === t.otherOptions_tab_mapComp) {
       const cols = [];
       for(let i=0; i<=120; i+=12) cols.push(`${i} KPa`);
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_motorStep, values: Array(cols.length).fill('0') }
         ]
       };
     }
     if (activeSubTab === t.otherOptions_tab_extAdj) {
       const cols = ['0%', '0.5%', '3%', '6%', '12%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%', 'ALL'];
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_injAdjPct, values: Array(cols.length).fill('0') },
           { label: t.otherOptions_row_ignAdjDeg, values: Array(cols.length).fill('0') },
         ]
       };
     }
     // Default: Temp-Idle Motor
     return {
       cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
       rows: [
         { label: t.otherOptions_row_stepTime, values: Array(11).fill('0') },
         { label: t.otherOptions_row_injVe, values: Array(11).fill('0') },
       ]
     };
   };

   const { cols, rows } = getGridData();

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
               <div className="flex h-8 text-xs border-b border-gray-700">
                  <div className="w-28 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10">
                     {topLeftHeader}
                  </div>
                  {cols.map((col, i) => (
                     <div key={i} className="flex-1 min-w-[60px] bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center">
                        {col}
                     </div>
                  ))}
               </div>
               {rows.map((row, rIndex) => (
                  <div key={rIndex} className="flex h-8 text-xs border-b border-gray-700 last:border-0">
                     <div className="w-28 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10 truncate px-1" title={row.label}>
                        {row.label}
                     </div>
                     {row.values.map((val, cIndex) => (
                        <div key={cIndex} className="flex-1 min-w-[60px] bg-[#111316] text-white font-bold flex items-center justify-center border-r border-gray-700 hover:bg-gray-800 cursor-pointer">
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