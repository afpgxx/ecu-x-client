import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { IdleLimitState } from '../types';
import { MapTable1D } from './MapTable1D';

interface IdleLimitViewProps {
  data: IdleLimitState;
  onChange: (newData: IdleLimitState) => void;
  onEditingChange?: (cell: {row:number;col:number;value:number} | null) => void;
  forceEditing?: { row: number; col: number } | null;
  suppressBlur?: boolean;
}

interface TopGridRowProps {
  label1: string; unit1: string; field1: keyof IdleLimitState; col1: number;
  label2: string; unit2: string; field2: keyof IdleLimitState; col2: number;
  data: IdleLimitState;
  onUpdate: <K extends keyof IdleLimitState>(key: K, value: IdleLimitState[K]) => void;
  onEditingChange?: (cell: {row:number;col:number;value:number} | null) => void;
  forceEditing?: { row: number; col: number } | null;
}

const TopGridRow: React.FC<TopGridRowProps> = ({ 
  label1, unit1, field1, col1,
  label2, unit2, field2, col2,
  data, onUpdate, onEditingChange, forceEditing
}) => {
  const input1Ref = React.useRef<HTMLInputElement>(null);
  const input2Ref = React.useRef<HTMLInputElement>(null);
  const [val1, setVal1] = React.useState(data[field1]?.toString() || '0');
  const [val2, setVal2] = React.useState(data[field2]?.toString() || '0');

  React.useEffect(() => {
    setVal1(data[field1]?.toString() || '0');
  }, [data[field1]]);

  React.useEffect(() => {
    setVal2(data[field2]?.toString() || '0');
  }, [data[field2]]);

  React.useEffect(() => {
    if (forceEditing?.row === 0) {
      if (forceEditing.col === col1) input1Ref.current?.focus();
      if (forceEditing.col === col2) input2Ref.current?.focus();
    }
  }, [forceEditing, col1, col2]);

  const handleBlur = (field: keyof IdleLimitState, val: string, setVal: (v: string) => void) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onUpdate(field, num);
      setVal(num.toString());
    } else {
      setVal(data[field]?.toString() || '0');
    }
  };

  return (
  <tr className="bg-[#2d323a]">
    <td className="border border-gray-600 px-2 py-0 text-gray-300 text-center text-xs whitespace-nowrap w-[6%]">{label1}</td>
    <td className="border border-gray-600 p-0 w-[5%]">
      <input 
        ref={input1Ref}
        type="text" 
        maxLength={5}
        className="w-full h-full bg-white text-gray-600 text-center font-bold outline-none text-xs py-1 cursor-pointer"
        value={val1}
        onChange={(e) => setVal1(e.target.value)}
        onBlur={() => handleBlur(field1, val1, setVal1)}
        onKeyDown={(e) => { if(e.key === 'Enter') input1Ref.current?.blur(); }}
        onFocus={(e) => {
          e.target.select();
          onEditingChange?.({ row: 0, col: col1, value: data[field1] as number });
        }}
      />
    </td>
    <td className="border border-gray-600 px-2 py-0 text-gray-300 text-center text-xs w-[3%]">{unit1}</td>
    
    <td className="border border-gray-600 px-2 py-0 text-gray-300 text-center text-xs whitespace-nowrap w-[6%]">{label2}</td>
    <td className="border border-gray-600 p-0 w-[5%]">
      <input 
        ref={input2Ref}
        type="text" 
        maxLength={5}
        className="w-full h-full bg-white text-gray-600 text-center font-bold outline-none text-xs py-1 cursor-pointer"
        value={val2}
        onChange={(e) => setVal2(e.target.value)}
        onBlur={() => handleBlur(field2, val2, setVal2)}
        onKeyDown={(e) => { if(e.key === 'Enter') input2Ref.current?.blur(); }}
        onFocus={(e) => {
          e.target.select();
          onEditingChange?.({ row: 0, col: col2, value: data[field2] as number });
        }}
      />
    </td>
    <td className="border border-gray-600 px-2 py-0 text-gray-300 text-center text-xs w-[3%]">{unit2}</td>
    
    <td className="border border-gray-600 px-2 py-0 text-center text-xs w-[6%]">0</td>
    <td className="border border-gray-600 px-2 py-0 text-center text-xs w-[5%]">0</td>
    <td className="border border-gray-600 px-2 py-0 text-center text-xs w-[3%]">0</td>
  </tr>
  );
};

export const IdleLimitView: React.FC<IdleLimitViewProps> = ({ 
  data, 
  onChange,
  onEditingChange,
  forceEditing,
  suppressBlur
}) => {
  const { t } = useI18n();
  
  const updateField = <K extends keyof IdleLimitState>(key: K, value: IdleLimitState[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateArray = (key: 'autoClutchData' | 'spareData', index: number, value: number) => {
    const currentArray = data[key] || (key === 'autoClutchData' ? Array(8).fill(0) : Array(9).fill(0));
    const newArray = [...currentArray];
    newArray[index] = value;
    onChange({ ...data, [key]: newArray });
  };

  return (
    <div className="flex flex-col bg-[#1a1d21] p-2 gap-1">
      {/* Top Grid Section - Table Layout */}
      <div className="border border-gray-700 rounded overflow-x-auto mb-1">
        <table className="w-full border-collapse">
          <tbody>
            <TopGridRow 
              label1={t.idleLimit_idleRpmCold} unit1="RPM" field1="idleRpmCold" col1={0}
              label2={t.idleLimit_idleReturnCold} unit2="RPM" field2="idleReturnCold" col2={1}
              data={data} onUpdate={updateField} onEditingChange={onEditingChange} forceEditing={forceEditing}
            />
            <TopGridRow 
              label1={t.idleLimit_idleRpmHot} unit1="RPM" field1="idleRpmHot" col1={2}
              label2={t.idleLimit_idleReturnHot} unit2="RPM" field2="idleReturnHot" col2={3}
              data={data} onUpdate={updateField} onEditingChange={onEditingChange} forceEditing={forceEditing}
            />
            <TopGridRow 
              label1={t.idleLimit_enterExitSensitivity} unit1="Level" field1="enterExitSensitivity" col1={4}
              label2={t.idleLimit_accelEnrichPercent} unit2="%" field2="accelEnrichPercent" col2={5}
              data={data} onUpdate={updateField} onEditingChange={onEditingChange} forceEditing={forceEditing}
            />
            <TopGridRow 
              label1={t.idleLimit_maxRpm} unit1="RPM" field1="maxRpm" col1={6}
              label2={t.idleLimit_vvtOpenRpm} unit2="RPM" field2="vvtOpenRpm" col2={7}
              data={data} onUpdate={updateField} onEditingChange={onEditingChange} forceEditing={forceEditing}
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
        <div className="min-h-14 max-h-14 overflow-auto">
          <MapTable1D
            headers={['Strt RPM', 'Inj Ve Adj(PCT)', 'Ign Ingle Adj(°)', 'RPM 4000(Some)', 'RPM 6000(Some)', 'RPM 8000(Some)', 'RPM 10000(Some)', 'RPM 12000(Some)']}
            data={data.autoClutchData || Array(8).fill(0)}
            xLabel="Name"
            yLabel="Data"
            colorMode="dark"
            maxInputLength={5}
            onCellChange={(_, col, val) => updateArray('autoClutchData', col, val)}
            onEditingChange={(cell) => onEditingChange?.(cell ? { ...cell, row: 1 } : null)}
            forceEditing={forceEditing && forceEditing.row === 1 ? forceEditing : null}
            suppressBlur={suppressBlur}
          />
        </div>
      </div>

      {/* Spare Section */}
      <div className="flex flex-col border border-gray-700 rounded overflow-hidden mb-1">
        <div className="bg-[#2d323a] px-2 py-0.5 border-b border-gray-700 h-7 flex items-center">
          <span className="text-xs font-bold text-gray-300">{t.idleLimit_spare}</span>
        </div>
        <div className="min-h-14 max-h-14 overflow-auto">
          <MapTable1D
            headers={[1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]}
            data={data.spareData || Array(9).fill(0)}
            xLabel="Name"
            yLabel="Dat"
            colorMode="dark"
            maxInputLength={5}
            onCellChange={(_, col, val) => updateArray('spareData', col, val)}
            onEditingChange={(cell) => onEditingChange?.(cell ? { ...cell, row: 2 } : null)}
            forceEditing={forceEditing && forceEditing.row === 2 ? forceEditing : null}
            suppressBlur={suppressBlur}
          />
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
  );
};
