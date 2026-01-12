import React, { useState } from 'react';
import { ToggleSwitch } from './common/ToggleSwitch';

interface SettingsViewProps {
  data: {
    ecuSettings: {
      passwordEnabled: boolean;
      maxPowerAt100: boolean;
      ignoreThrottleVoltage: boolean;
      noMapProcessing: boolean;
      spare: boolean;
    };
    afrControl: {
      enabled: boolean;
      useOemSensor: boolean;
    };
    spareTable1: number[];
    spareTable2: number[];
  };
  onDataChange: (data: any) => void;
}

// 注释：设置与信息页面实现（修复版），与截图一致的布局与风格
export const SettingsView: React.FC<SettingsViewProps> = ({ data, onDataChange }) => {
  const [editingCell, setEditingCell] = useState<{table: number, index: number} | null>(null);
  const [inputValue, setInputValue] = useState('');

  // 注释：备用表格列头（示例）
  const spareHeaders1: number[] = [1000, 1500, 2000, 2500, 3000, 3500];
  const spareHeaders2: number[] = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

  return (
    <div className="flex flex-col h-full bg-[#1f2329] p-6 overflow-y-auto text-sm select-none">
      <div className="flex gap-6 h-full max-w-7xl mx-auto w-full">
        {/* 左列 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* ECU设置 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-400 font-bold pl-1">ECU设置</h3>
            <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-inner grid grid-cols-2 gap-y-4 gap-x-8">
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" 
                  checked={data.ecuSettings.passwordEnabled} 
                  onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, passwordEnabled: e.target.checked}})} />
                启用密码
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" 
                  checked={data.ecuSettings.maxPowerAt100}
                  onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, maxPowerAt100: e.target.checked}})} />
                节气门100%功率最大化
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" 
                  checked={data.ecuSettings.ignoreThrottleVoltage}
                  onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, ignoreThrottleVoltage: e.target.checked}})} />
                点火角度不管节气门电压
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" 
                  checked={data.ecuSettings.noMapProcessing}
                  onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, noMapProcessing: e.target.checked}})} />
                不处理气压力
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" 
                  checked={data.ecuSettings.spare}
                  onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, spare: e.target.checked}})} />
                备用
              </label>
            </div>
          </div>

          {/* 空燃比控制 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-400 font-bold pl-1">空燃比</h3>
            <div className="bg-[#383c44] p-4 rounded border border-gray-600 flex items-center justify-between h-20 shadow-lg">
              <div className="flex items-center gap-3 bg-[#262a30] px-4 py-2 rounded border border-gray-700">
                <span className="text-gray-300 font-medium text-sm">空燃比控制</span>
                <ToggleSwitch
                  checked={data.afrControl.enabled}
                  onChange={(checked) => onDataChange({...data, afrControl: {...data.afrControl, enabled: checked}})}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-6 pr-4">
                <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer" onClick={() => onDataChange({...data, afrControl: {...data.afrControl, useOemSensor: true}})}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.afrControl.useOemSensor ? 'border-blue-500' : 'border-gray-500'}`}>
                    {data.afrControl.useOemSensor && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  OEM 传感器
                </label>
                <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer" onClick={() => onDataChange({...data, afrControl: {...data.afrControl, useOemSensor: false}})}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!data.afrControl.useOemSensor ? 'border-blue-500' : 'border-gray-500'}`}>
                    {!data.afrControl.useOemSensor && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  外接氧传感器
                </label>
              </div>
            </div>
          </div>

          {/* 备用表格 */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#262a30] rounded border border-gray-700">
              <div className="h-8 flex items-center px-3 text-gray-300 font-bold border-b border-gray-700">备用</div>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div className="flex h-8 text-xs border-b border-gray-700">
                    <div className="w-24 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold">Name</div>
                    {spareHeaders1.map((col: number) => (
                      <div key={col} className="flex-1 min-w-[60px] bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center">{col}</div>
                    ))}
                    <div className="w-24 bg-[#2d323a] border-l border-gray-700 text-gray-400 flex items-center justify-center font-bold">Oem Datum</div>
                  </div>
                  <div className="flex h-8 text-xs border-b border-gray-700 last:border-0">
                    <div className="w-24 bg-[#2d323a] border-r border-gray-700 text-gray-300 flex items-center justify-center font-bold">Dat</div>
                    {spareHeaders1.map((col: number, i: number) => (
                      <div 
                        key={col} 
                        className="flex-1 min-w-[60px] bg-[#111316] text-white font-bold flex items-center justify-center border-r border-gray-700 cursor-pointer hover:bg-gray-800"
                        onClick={() => {
                          setEditingCell({ table: 1, index: i });
                          setInputValue(data.spareTable1[i].toString());
                        }}
                      >
                        {editingCell && editingCell.table === 1 && editingCell.index === i ? (
                          <input
                            autoFocus
                            type="text"
                            className="w-full h-full bg-blue-600 text-white text-center outline-none font-bold"
                            value={inputValue}
                            onChange={(e) => {
                                if (e.target.value.length <= 5) setInputValue(e.target.value);
                            }}
                            onBlur={() => {
                              const parsed = parseFloat(inputValue);
                              if (!isNaN(parsed)) {
                                const newTable = [...data.spareTable1];
                                newTable[i] = parsed;
                                onDataChange({...data, spareTable1: newTable});
                              }
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const parsed = parseFloat(inputValue);
                                if (!isNaN(parsed)) {
                                  const newTable = [...data.spareTable1];
                                  newTable[i] = parsed;
                                  onDataChange({...data, spareTable1: newTable});
                                }
                                setEditingCell(null);
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          data.spareTable1[i]
                        )}
                      </div>
                    ))}
                    <div className="w-24 bg-[#111316] border-l border-gray-700 text-gray-500 flex items-center justify-center font-bold">0</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#262a30] rounded border border-gray-700">
              <div className="h-8 flex items-center px-3 text-gray-300 font-bold border-b border-gray-700">备用</div>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div className="flex h-8 text-xs border-b border-gray-700">
                    <div className="w-24 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold">Name</div>
                    {spareHeaders2.map((col: number) => (
                      <div key={col} className="flex-1 min-w-[60px] bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center">{col}</div>
                    ))}
                    <div className="w-24 bg-[#2d323a] border-l border-gray-700 text-gray-400 flex items-center justify-center font-bold">Oem Datum</div>
                  </div>
                  <div className="flex h-8 text-xs border-b border-gray-700 last:border-0">
                    <div className="w-24 bg-[#2d323a] border-r border-gray-700 text-gray-300 flex items-center justify-center font-bold">Dat</div>
                    {spareHeaders2.map((col: number, i: number) => (
                      <div 
                        key={col} 
                        className="flex-1 min-w-[60px] bg-[#111316] text-white font-bold flex items-center justify-center border-r border-gray-700 cursor-pointer hover:bg-gray-800"
                        onClick={() => {
                          setEditingCell({ table: 2, index: i });
                          setInputValue(data.spareTable2[i].toString());
                        }}
                      >
                        {editingCell && editingCell.table === 2 && editingCell.index === i ? (
                          <input
                            autoFocus
                            type="text"
                            className="w-full h-full bg-blue-600 text-white text-center outline-none font-bold"
                            value={inputValue}
                            onChange={(e) => {
                                if (e.target.value.length <= 5) setInputValue(e.target.value);
                            }}
                            onBlur={() => {
                              const parsed = parseFloat(inputValue);
                              if (!isNaN(parsed)) {
                                const newTable = [...data.spareTable2];
                                newTable[i] = parsed;
                                onDataChange({...data, spareTable2: newTable});
                              }
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const parsed = parseFloat(inputValue);
                                if (!isNaN(parsed)) {
                                  const newTable = [...data.spareTable2];
                                  newTable[i] = parsed;
                                  onDataChange({...data, spareTable2: newTable});
                                }
                                setEditingCell(null);
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          data.spareTable2[i]
                        )}
                      </div>
                    ))}
                    <div className="w-24 bg-[#111316] border-l border-gray-700 text-gray-500 flex items-center justify-center font-bold">0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右列 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 软件设置 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-400 font-bold pl-1">软件设置</h3>
            <div className="bg-[#383c44] p-5 rounded border border-gray-600 shadow-lg grid grid-cols-2 gap-y-4 gap-x-8">
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" />
                节气门(电压显示)
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" />
                进气压力(电压显示)
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" />
                温度(电压显示)
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" defaultChecked />
                空燃比(电压显示)
              </label>
              <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" defaultChecked />
                喷油量(显示色条)
              </label>
            </div>
          </div>

          {/* ECU信息 */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-end pl-1 pr-2">
              <h3 className="text-gray-400 font-bold">ECU信息</h3>
              <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-500 bg-transparent text-gray-200 focus:ring-0" checked={data.ecuSettings.passwordEnabled} onChange={(e) => onDataChange({...data, ecuSettings: {...data.ecuSettings, passwordEnabled: e.target.checked}})} />
                启用密码
              </label>
            </div>
            <div className="bg-[#383c44] p-8 rounded border border-gray-600 flex-1 flex flex-col justify-center gap-5 shadow-lg">
              {[
                { label: '电喷系列', val: '' },
                { label: '电喷型号', val: '' },
                { label: '原装或改装', val: 'OEM' },
                { label: '固件版本', val: 'Ver 10.3' },
                { label: '数据日期', val: '2023-07-08' },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-center group">
                  <label className="w-24 text-right text-gray-300 mr-4 text-sm font-medium group-hover:text-white transition-colors">{field.label}</label>
                  <input className="w-64 bg-white text-gray-800 px-3 py-1.5 rounded border border-gray-400 outline-none font-bold text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" defaultValue={field.val} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
