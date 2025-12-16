import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { IdleLimitState } from '../types';

interface IdleLimitViewProps {
  data: IdleLimitState;
  onChange: (newData: IdleLimitState) => void;
  onEditingChange?: (cell: {row:number;col:number;value:number} | null) => void;
  forceEditing?: { row: number; col: number } | null;
  suppressBlur?: boolean;
}

export const IdleLimitView: React.FC<IdleLimitViewProps> = ({ 
  data, 
  onChange,
  onEditingChange
}) => {
  const { t } = useI18n();
  
  const updateField = <K extends keyof IdleLimitState>(key: K, value: IdleLimitState[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateArray = (key: 'autoClutchData' | 'spareData', index: number, value: number) => {
    const newArray = [...data[key]];
    newArray[index] = value;
    onChange({ ...data, [key]: newArray });
  };

  // Helper for Top Grid Cells
  const TopGridRow = ({ 
    label1, unit1, field1, col1,
    label2, unit2, field2, col2
  }: { 
    label1: string, unit1: string, field1: keyof IdleLimitState, col1: number,
    label2: string, unit2: string, field2: keyof IdleLimitState, col2: number
  }) => (
    <tr className="bg-[#2d323a]">
      <td className="border border-gray-600 px-2 py-1 text-gray-300 text-center text-xs whitespace-nowrap w-[6%]">{label1}</td>
      <td className="border border-gray-600 p-0 w-[5%]">
        <input 
          type="number" 
          className="w-full h-full bg-white text-gray-600 text-center outline-none text-xs py-1"
          value={data[field1] as number}
          onChange={(e) => updateField(field1, Number(e.target.value))}
          onFocus={() => onEditingChange?.({ row: 0, col: col1, value: data[field1] as number })}
        />
      </td>
      <td className="border border-gray-600 px-2 py-1 text-gray-300 text-center text-xs w-[3%]">{unit1}</td>
      
      <td className="border border-gray-600 px-2 py-1 text-gray-300 text-center text-xs whitespace-nowrap w-[6%]">{label2}</td>
      <td className="border border-gray-600 p-0 w-[5%]">
        <input 
          type="number" 
          className="w-full h-full bg-white text-gray-600 text-center outline-none text-xs py-1"
          value={data[field2] as number}
          onChange={(e) => updateField(field2, Number(e.target.value))}
          onFocus={() => onEditingChange?.({ row: 0, col: col2, value: data[field2] as number })}
        />
      </td>
      <td className="border border-gray-600 px-2 py-1 text-gray-300 text-center text-xs w-[3%]">{unit2}</td>
      
      <td className="border border-gray-600 px-2 py-1 text-center text-xs w-[6%]">0</td>
      <td className="border border-gray-600 px-2 py-1 text-center text-xs w-[5%]">0</td>
      <td className="border border-gray-600 px-2 py-1 text-center text-xs w-[3%]">0</td>
    </tr>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1a1d21]">
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
      
      {/* Top Grid Section - Table Layout */}
      <div className="border border-gray-700 rounded overflow-hidden mb-1">
        <table className="w-full border-collapse">
          <tbody>
            <TopGridRow 
              label1={t.idleLimit_idleRpmCold} unit1="RPM" field1="idleRpmCold" col1={0}
              label2={t.idleLimit_idleReturnCold} unit2="RPM" field2="idleReturnCold" col2={1}
            />
            <TopGridRow 
              label1={t.idleLimit_idleRpmHot} unit1="RPM" field1="idleRpmHot" col1={2}
              label2={t.idleLimit_idleReturnHot} unit2="RPM" field2="idleReturnHot" col2={3}
            />
            <TopGridRow 
              label1={t.idleLimit_enterExitSensitivity} unit1="Level" field1="enterExitSensitivity" col1={4}
              label2={t.idleLimit_accelEnrichPercent} unit2="%" field2="accelEnrichPercent" col2={5}
            />
            <TopGridRow 
              label1={t.idleLimit_maxRpm} unit1="RPM" field1="maxRpm" col1={6}
              label2={t.idleLimit_vvtOpenRpm} unit2="RPM" field2="vvtOpenRpm" col2={7}
            />
          </tbody>
        </table>
      </div>

      {/* Auto Clutch Section */}
      <div className="flex flex-col border border-gray-700 rounded overflow-hidden mb-1">
        <div className="bg-[#2d323a] px-2 py-0.5 flex justify-between items-center border-b border-gray-700 h-7">
          <span className="text-xs font-bold text-gray-300">{t.idleLimit_autoClutch}</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer select-none">
              <input type="checkbox" checked={data.autoClutchInjVe} onChange={e => updateField('autoClutchInjVe', e.target.checked)} />
              INJ VE
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer select-none">
              <input type="checkbox" checked={data.autoClutchIgnDegree} onChange={e => updateField('autoClutchIgnDegree', e.target.checked)} />
              IGN degree
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-[#2d323a] text-gray-400">
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">Name</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">Strt RPM</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">Inj Ve Adj(PCT)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">Ign Ingle Adj(°)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">RPM 4000(Some)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">RPM 6000(Some)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">RPM 8000(Some)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">RPM 10000(Some)</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">RPM 12000(Some)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#1a1d21]">
                <td className="p-1 border border-gray-600 text-gray-400">Data</td>
                {data.autoClutchData.map((val, idx) => (
                  <td key={idx} className="p-0 border border-gray-600">
                    <input 
                      type="number" 
                      className="w-full h-full bg-white text-gray-600 text-center outline-none py-1"
                      value={val}
                      onChange={e => updateArray('autoClutchData', idx, Number(e.target.value))}
                      onFocus={() => onEditingChange?.({ row: 1, col: idx, value: val })}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Spare Section */}
      <div className="flex flex-col border border-gray-700 rounded overflow-hidden mb-1">
        <div className="bg-[#2d323a] px-2 py-0.5 border-b border-gray-700 h-7 flex items-center">
          <span className="text-xs font-bold text-gray-300">{t.idleLimit_spare}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-[#2d323a] text-gray-400">
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">Name</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">1000</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">1500</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">2000</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">2500</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">3000</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">3500</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">4000</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">4500</th>
                <th className="p-1 border border-gray-600 font-normal whitespace-nowrap">5000</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#1a1d21]">
                <td className="p-1 border border-gray-600 text-gray-400">Dat</td>
                {data.spareData.map((val, idx) => (
                  <td key={idx} className="p-0 border border-gray-600">
                    <input 
                      type="number" 
                      className="w-full h-full bg-white text-gray-600 text-center outline-none py-1"
                      value={val}
                      onChange={e => updateArray('spareData', idx, Number(e.target.value))}
                      onFocus={() => onEditingChange?.({ row: 2, col: idx, value: val })}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Bits Section */}
      <div className="flex flex-col border border-gray-700 rounded overflow-hidden">
        <div className="bg-[#2d323a] px-2 py-0.5 border-b border-gray-700 h-7 flex items-center">
          <span className="text-xs font-bold text-gray-300">{t.idleLimit_configBits}</span>
        </div>
        <div className="bg-[#2d323a] p-4 flex items-center gap-12">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input 
                type="radio" 
                name="limitType" 
                checked={data.limitNoInj} 
                onChange={() => { updateField('limitNoInj', true); updateField('limitNoIgn', false); }} 
              />
              Limit No Inj
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input 
                type="radio" 
                name="limitType" 
                checked={data.limitNoIgn} 
                onChange={() => { updateField('limitNoInj', false); updateField('limitNoIgn', true); }} 
              />
              Limit No Ign
            </label>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={data.spare1} onChange={e => updateField('spare1', e.target.checked)} />
              {t.idleLimit_spare1}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={data.spare2} onChange={e => updateField('spare2', e.target.checked)} />
              {t.idleLimit_spare2}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={data.spare3} onChange={e => updateField('spare3', e.target.checked)} />
              {t.idleLimit_spare3}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={data.spare4} onChange={e => updateField('spare4', e.target.checked)} />
              {t.idleLimit_spare4}
            </label>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};
