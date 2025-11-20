import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#1f2329] p-6 overflow-y-auto text-xs select-none">
      <div className="flex gap-6 h-full max-w-7xl mx-auto w-full">
        
        {/* --- Left Column --- */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* 1. ECU Settings Panel */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-400 font-bold pl-1">ECU设置</h3>
                <div className="bg-[#262a30] p-5 rounded border border-gray-700 shadow-inner grid grid-cols-2 gap-y-4 gap-x-8">
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" defaultChecked /> 
                        启用密码
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" /> 
                        节气门100%功率最大化
                    </label>
                     <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" /> 
                        点火角度不管节气门电压
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" /> 
                        备用
                    </label>
                     <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#1a1d21] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-500 transition-colors" /> 
                        不处理气压力
                    </label>
                </div>
            </div>

            {/* 2. AFR Control Panel */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-400 font-bold pl-1">空燃比</h3>
                <div className="bg-[#383c44] p-4 rounded border border-gray-600 flex items-center justify-between h-20 shadow-lg">
                     <div className="flex items-center gap-4 bg-[#262a30] px-4 py-2 rounded border border-gray-700">
                        <span className="text-gray-300 font-medium">空燃比控制</span>
                        {/* Custom Toggle Switch */}
                        <div className="relative inline-flex items-center cursor-pointer group">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-12 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-[10px] font-bold text-white absolute left-[1.6rem] peer-checked:opacity-100 opacity-0 transition-opacity pointer-events-none">ON</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-6 pr-4">
                        <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            原厂氧传感器
                        </label>
                         <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                             <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center group-hover:border-gray-400"></div>
                            外接氧传感器
                        </label>
                     </div>
                </div>
            </div>
        </div>

        {/* --- Right Column --- */}
        <div className="flex-1 flex flex-col gap-6">
             
            {/* 3. Software Settings Panel */}
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-400 font-bold pl-1">软件设置</h3>
                <div className="bg-[#383c44] p-5 rounded border border-gray-600 shadow-lg grid grid-cols-2 gap-y-4 gap-x-8">
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" defaultChecked /> 
                        文案文案
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" /> 
                        文案文案文案文案
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" /> 
                        文案文案文案文案
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" /> 
                        文案文案
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" /> 
                        文案文案文案文案
                    </label>
                    <label className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-500 bg-[#262a30] text-blue-600 focus:ring-0 focus:ring-offset-0 group-hover:border-blue-400 transition-colors" /> 
                        文案文案
                    </label>
                </div>
            </div>

             {/* 4. ECU Info Panel */}
            <div className="flex-1 flex flex-col gap-2">
                 <div className="flex justify-between items-end pl-1 pr-2">
                    <h3 className="text-gray-400 font-bold">ECU信息</h3>
                    <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer hover:text-white transition-colors">
                        <input 
                            type="checkbox" 
                            className="w-3.5 h-3.5 rounded border-gray-500 bg-transparent text-gray-200 focus:ring-0"
                            checked={isPasswordEnabled}
                            onChange={(e) => setIsPasswordEnabled(e.target.checked)}
                        /> 
                        启用密码
                    </label>
                 </div>
                <div className="bg-[#383c44] p-8 rounded border border-gray-600 flex-1 flex flex-col justify-center gap-5 shadow-lg">
                    {[
                        {label: '电喷系列', val: 'YAMAHA'},
                        {label: '电喷型号', val: 'LC50 NEW (2018)'},
                        {label: '原装或改装', val: 'PC exFour'},
                        {label: '固件版本', val: 'Ver 10.3'},
                        {label: '数据日期', val: '2023-07-08'},
                    ].map((field) => (
                        <div key={field.label} className="flex items-center justify-center group">
                            <label className="w-24 text-right text-gray-300 mr-4 text-sm font-medium group-hover:text-white transition-colors">{field.label}</label>
                            <input 
                                className="w-64 bg-white text-gray-800 px-3 py-1.5 rounded border border-gray-400 outline-none font-bold text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                defaultValue={field.val} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};