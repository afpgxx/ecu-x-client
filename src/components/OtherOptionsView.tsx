import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

interface ParamRowProps {
  label?: string;
  value: string | number;
  unit?: string;
  highlighted?: boolean;
  onChange?: (val: string) => void;
}

const ParamRow: React.FC<ParamRowProps> = ({ label, value, unit, highlighted = true, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) onChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center border-b border-gray-700 last:border-0 h-8 text-xs">
      {label && <div className="flex-[2] px-2 text-gray-400 font-medium truncate border-r border-gray-700 h-full flex items-center justify-end bg-[#2d323a]">{label}</div>}
      <div 
        className={`flex-1 px-2 font-mono font-bold h-full flex items-center justify-center cursor-pointer ${highlighted ? 'bg-[#111316] text-white' : 'text-gray-300 bg-[#1f2329]'}`}
        onClick={() => highlighted && setIsEditing(true)}
      >
         {isEditing && highlighted ? (
           <input 
             autoFocus
             className="w-full h-full bg-transparent text-center outline-none text-white"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onBlur={handleBlur}
             onKeyDown={handleKeyDown}
           />
         ) : (
           value
         )}
      </div>
      {unit !== undefined && <div className="w-16 text-center text-gray-500 font-medium border-l border-gray-700 h-full flex items-center justify-center bg-[#2d323a]">{unit}</div>}
    </div>
  );
};

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

   // State for parameters (simplified for demo)
   const [params, setParams] = useState({
     throttleMin: '0', throttleMax: '0', idleMinInjCold: '0', idleMinInjHot: '0', idleAutoAngle: '0', idleAutoInj: '0',
     idleSteps: '0', fanTemp: '0', o2Work: '0', o2Delay: '0', o2Rpm: '0', o2Inj: '0',
     startEnrichRpm: '0', idleHoleMax: '0', idleHoleMin: '0', idleHoleMaxAdj: '0'
   });

   const updateParam = (key: keyof typeof params, val: string) => {
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

   return (
      <div className="flex flex-col h-full bg-[#16181c] p-1 gap-1 overflow-y-auto">
         {/* Top Section: 3 Parameter Blocks */}
         <div className="flex gap-1 shrink-0">
            {/* Block 1 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_throttleMin} value={params.throttleMin} unit="V" onChange={(v) => updateParam('throttleMin', v)} />
                  <ParamRow label={t.otherOptions_throttleMax} value={params.throttleMax} unit="V" onChange={(v) => updateParam('throttleMax', v)} />
                  <ParamRow label={t.otherOptions_idleMinInjCold} value={params.idleMinInjCold} unit="ms" onChange={(v) => updateParam('idleMinInjCold', v)} />
                  <ParamRow label={t.otherOptions_idleMinInjHot} value={params.idleMinInjHot} unit="ms" onChange={(v) => updateParam('idleMinInjHot', v)} />
                  <ParamRow label={t.otherOptions_idleAutoAngle} value={params.idleAutoAngle} unit="∠°" onChange={(v) => updateParam('idleAutoAngle', v)} />
                  <ParamRow label={t.otherOptions_idleAutoInj} value={params.idleAutoInj} unit="ms" onChange={(v) => updateParam('idleAutoInj', v)} />
               </div>
            </div>
            {/* Block 2 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_idleSteps} value={params.idleSteps} unit="STEP" onChange={(v) => updateParam('idleSteps', v)} />
                  <ParamRow label={t.otherOptions_fanTemp} value={params.fanTemp} unit="°C" onChange={(v) => updateParam('fanTemp', v)} />
                  <ParamRow label={t.otherOptions_o2Work} value={params.o2Work} unit="V" onChange={(v) => updateParam('o2Work', v)} />
                  <ParamRow label={t.otherOptions_o2Delay} value={params.o2Delay} unit="Second" onChange={(v) => updateParam('o2Delay', v)} />
                  <ParamRow label={t.otherOptions_o2Rpm} value={params.o2Rpm} unit="RPM" onChange={(v) => updateParam('o2Rpm', v)} />
                  <ParamRow label={t.otherOptions_o2Inj} value={params.o2Inj} unit="%" onChange={(v) => updateParam('o2Inj', v)} />
               </div>
            </div>
            {/* Block 3 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_startEnrichRpm} value={params.startEnrichRpm} unit="RPM" onChange={(v) => updateParam('startEnrichRpm', v)} />
                  <ParamRow label={t.otherOptions_idleHoleMax} value={params.idleHoleMax} unit="STEP" onChange={(v) => updateParam('idleHoleMax', v)} />
                  <ParamRow label={t.otherOptions_idleHoleMin} value={params.idleHoleMin} unit="STEP" onChange={(v) => updateParam('idleHoleMin', v)} />
                  <ParamRow label={t.otherOptions_idleHoleMaxAdj} value={params.idleHoleMaxAdj} unit="STEP" onChange={(v) => updateParam('idleHoleMaxAdj', v)} />
                  <ParamRow label="0" value="0" unit="0" highlighted={false} />
                  <ParamRow label="0" value="0" unit="0" highlighted={false} />
               </div>
            </div>
         </div>

         {/* Middle Section: Sub Tabs */}
         <div className="flex gap-1 py-1 shrink-0 overflow-x-auto bg-[#16181c] mt-1">
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

         {/* Bottom Section: Data Grid */}
         <div className="flex-1 border border-gray-700 overflow-auto bg-[#1e2126]">
            <div className="min-w-max">
               <div className="flex h-8 text-xs border-b border-gray-700">
                  <div className="w-28 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10">
                     {activeSubTab === t.otherOptions_tab_iatComp ? t.otherOptions_row_iat : t.otherOptions_row_ect}
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