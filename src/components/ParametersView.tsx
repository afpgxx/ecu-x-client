import React from 'react';
import { useI18n } from '../i18n/I18nContext';

export const ParametersView: React.FC = () => {
  const { t } = useI18n();
  
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
                        {t.params_basicEngine}
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         {[
                            { label: t.params_displacement, value: '155', unit: t.params_unit_cc },
                            { label: t.params_cylinders, value: '1', unit: '' },
                            { label: t.params_stroke, value: '4', unit: t.params_unit_stroke },
                            { label: t.params_revLimit, value: '12500', unit: t.params_unit_rpm },
                            { label: t.params_targetIdle, value: '1600', unit: t.params_unit_rpm },
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
                        {t.params_trigger}
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         <div className="flex items-center justify-between group border-b border-gray-700/50 pb-2">
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{t.params_triggerMode}</label>
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
                            { label: t.params_offset, value: '15.0', unit: t.params_unit_degree },
                            { label: t.params_noiseFilter, value: '2', unit: t.params_unit_level },
                            { label: t.params_syncCycle, value: '1', unit: t.params_unit_cycle },
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
                        {t.params_injection}
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         {[
                            { label: t.params_flowRate, value: '180', unit: t.params_unit_ccmin },
                            { label: t.params_deadTime, value: '0.820', unit: t.params_unit_ms },
                            { label: t.params_fuelPres, value: '300', unit: t.params_unit_kpa },
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
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{t.params_loadSource}</label>
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
                        {t.params_calibration}
                    </h3>
                    <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-lg flex flex-col gap-4 transition-all hover:border-gray-600">
                         <div className="flex items-center justify-between group border-b border-gray-700/50 pb-2">
                             <label className="text-gray-300 group-hover:text-white transition-colors font-medium">{t.params_mapSensor}</label>
                             <div className="flex items-center gap-2">
                                <select className="w-36 bg-white text-gray-900 px-2 py-1 rounded border border-gray-400 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm">
                                    <option>Internal 2.5 Bar</option>
                                    <option>External 3.0 Bar</option>
                                    <option>OEM Yamaha</option>
                                </select>
                             </div>
                         </div>
                         {[
                            { label: t.params_tpsMinAdc, value: '0.65', unit: t.params_unit_v },
                            { label: t.params_tpsMaxAdc, value: '4.25', unit: t.params_unit_v },
                            { label: t.params_iatBiasRes, value: '2490', unit: t.params_unit_ohm },
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
                                {t.params_autoCalibTps}
                            </button>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};