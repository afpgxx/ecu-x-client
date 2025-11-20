import React from 'react';

export const ParametersView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#1f2329] p-6 overflow-y-auto text-xs select-none">
        {/* Grid Layout for Parameters */}
        <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto w-full animate-in fade-in zoom-in duration-300">
            
            {/* Left Column */}
            <div className="flex flex-col gap-6">
                
                {/* Basic Engine Params */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-gray-400 font-bold pl-1 flex items-center gap-2">
                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                        基础参数 (Basic Engine)
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         {[
                            { label: '发动机排量 (Displacement)', value: '155', unit: 'cc' },
                            { label: '气缸数量 (Cylinders)', value: '1', unit: '' },
                            { label: '冲程类型 (Stroke)', value: '4', unit: 'Stroke' },
                            { label: '最高转速限制 (Rev Limit)', value: '12500', unit: 'RPM' },
                            { label: '怠速目标 (Target Idle)', value: '1600', unit: 'RPM' },
                         ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between group border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                 <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{item.label}</label>
                                 <div className="flex items-center gap-2">
                                     <input 
                                        className="w-24 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" 
                                        defaultValue={item.value} 
                                     />
                                     {item.unit && <span className="text-gray-500 w-10 text-xs font-medium">{item.unit}</span>}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>

                 {/* Trigger / Pickup */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-gray-400 font-bold pl-1 flex items-center gap-2">
                        <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                        触发信号 (Trigger)
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         <div className="flex items-center justify-between group border-b border-gray-700/50 pb-2">
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">触发模式 (Trigger Mode)</label>
                             <div className="flex items-center gap-2">
                                <select className="w-24 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
                                    <option>12-1</option>
                                    <option>24-2</option>
                                    <option>36-1</option>
                                    <option>M-Tooth</option>
                                </select>
                                <span className="w-10"></span>
                             </div>
                         </div>
                         {[
                            { label: '触发角度偏置 (Offset)', value: '15.0', unit: '°' },
                            { label: '信号滤波 (Noise Filter)', value: '2', unit: 'Level' },
                            { label: '启动同步圈数 (Sync Cycle)', value: '1', unit: 'Cycle' },
                         ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between group border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                 <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{item.label}</label>
                                 <div className="flex items-center gap-2">
                                     <input 
                                        className="w-24 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold text-right focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner" 
                                        defaultValue={item.value} 
                                     />
                                     {item.unit && <span className="text-gray-500 w-10 text-xs font-medium">{item.unit}</span>}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
                
                {/* Injection Params */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-gray-400 font-bold pl-1 flex items-center gap-2">
                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                        喷油系统 (Injection)
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         {[
                            { label: '喷油嘴流量 (Flow Rate)', value: '180', unit: 'cc/min' },
                            { label: '死区时间 (Dead Time)', value: '0.820', unit: 'ms' },
                            { label: '燃油压力 (Fuel Pres)', value: '300', unit: 'kPa' },
                         ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between group border-b border-gray-700/50 pb-2">
                                 <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{item.label}</label>
                                 <div className="flex items-center gap-2">
                                     <input 
                                        className="w-24 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold text-right focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner" 
                                        defaultValue={item.value} 
                                     />
                                     {item.unit && <span className="text-gray-500 w-10 text-xs font-medium">{item.unit}</span>}
                                 </div>
                             </div>
                         ))}
                         
                         <div className="flex items-center justify-between group pt-2">
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">主负载信号 (Load Source)</label>
                             <div className="flex items-center gap-2">
                                <select className="w-36 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm">
                                    <option>MAP (Speed Density)</option>
                                    <option>TPS (Alpha-N)</option>
                                    <option>Hybrid</option>
                                </select>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Sensor Calibration */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-gray-400 font-bold pl-1 flex items-center gap-2">
                        <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                        传感器校准 (Calibration)
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         <div className="flex items-center justify-between group border-b border-gray-700/50 pb-2">
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">MAP 传感器 (MAP Sensor)</label>
                             <div className="flex items-center gap-2">
                                <select className="w-36 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm">
                                    <option>Internal 2.5 Bar</option>
                                    <option>External 3.0 Bar</option>
                                    <option>OEM Yamaha</option>
                                </select>
                             </div>
                         </div>
                         {[
                            { label: 'TPS 关闭电压 (Min ADC)', value: '0.65', unit: 'V' },
                            { label: 'TPS 全开电压 (Max ADC)', value: '4.25', unit: 'V' },
                            { label: 'IAT 偏置电阻 (Bias Res)', value: '2490', unit: 'Ω' },
                         ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between group border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                 <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{item.label}</label>
                                 <div className="flex items-center gap-2">
                                    <input 
                                        className="w-24 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold text-right focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner" 
                                        defaultValue={item.value} 
                                     />
                                     {item.unit && <span className="text-gray-500 w-10 text-xs font-medium">{item.unit}</span>}
                                 </div>
                             </div>
                         ))}
                         <div className="flex justify-end mt-2 pt-2 border-t border-gray-700/50">
                            <button className="px-4 py-1.5 bg-[#383c44] border border-gray-500 text-gray-300 rounded text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-sm">
                                自动校准 TPS
                            </button>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};